import CloseIcon from '@material-ui/icons/Close';
import { useDeleteMessageMutation } from '../data/generated---db-types-and-hooks';
import { updateCachedNotificationsArray } from '../session/inbox-manager';
import { useContext, useState } from 'react';
import { ActionChipButton } from './action-chip-button';
import { UserTypedText } from './user-typed-text';
import ConfirmationPrompt from './confirmation-prompt';
import {  useGetSession } from '../session/session-handler';
import { JDayContext } from './journal/jday-context';

 

export const DeleteMyMessage = ({ msg }) => {
    
    const {session}                           = useGetSession();
    const jdayContext                       = useContext(JDayContext);

    const [deleteMessage]                   = useDeleteMessageMutation();
    const [deleteAction, setDeleteAction]   = useState();
    const cacheFieldName                    = msg.__typename=="JComment"? 
                                                      "getLogInbox:"+JSON.stringify({ logid:jdayContext.id })
                                                    : "getInbox";

    if( !session || msg.by.id!=session.user.id || !msg.text || msg.text.trim()=="" )
    {
        return "";
    } 


    const confirmDeletion = () => new Promise( resolve=>{ 
                                    setDeleteAction({ executioner: wantsToDelete=>{ 
                                        setDeleteAction(null);

                                        if( wantsToDelete )
                                             executeDelete().finally( resolve );
                                        else 
                                            resolve();
                                    }}); 
                                });  
 
 

    const executeDelete = ()=> deleteMessage({
                                variables: {
                                    id: msg.msgid
                                }, 
 
                                update: updateCachedNotificationsArray( ({ deleteMessage })=>{ 
                                    
                                    if( !deleteMessage ) 
                                        throw new Error("Deletion failed...");
                                    
                                    return {
                                        [cacheFieldName]: {
                                            __modifyThis: {
                                                item            : msg,
                                                fieldsModifiers : {
                                                    text() {
                                                        return ""; //deleted...
                                                    }
                                                }
                                            } 
                                        }
                                    }
                                }) 
                            });

    return <> 
                <ActionChipButton IconClass={CloseIcon} label="Delete message" labelWhenSending="Deleting..." executeAction={confirmDeletion}/>
                <ConfirmationPrompt title="Delete this message?" confirmActionVerb="Yes, delete permanently" actionExecutioner={deleteAction?.executioner}>
                    <UserTypedText text={msg.text} short/>
                </ConfirmationPrompt>    
        </>
}
 