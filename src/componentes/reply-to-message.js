import { Box } from '@material-ui/core';
import ReplyIcon from '@material-ui/icons/Reply';
import { useContext, useState } from 'react'; 
import { useGetSession } from '../session/session-handler';
import { ActionChipButton } from './action-chip-button';
import CommentBox from './comment-box';
import ConfirmationPrompt from './confirmation-prompt';
import { JDayContext } from './journal/jday-context';
import UnameTag from './uname';
import { userTextToParsedUI } from './user-text-to-parsed-tags';
 

export const ReplyToMessage = ({ msg }) => {
    
    const {session}                           = useGetSession();
    const jdayContext                       = useContext(JDayContext); 
    const [action, setAction]   = useState();

    if( !session || msg.by.id==session.user.id || !msg.text || msg.text.trim()=="" )
    {
        return "";
    } 


    const awaitUserInputAction = () => new Promise( resolve=>{ 
                                    setAction({ executioner: confirm=>{
                                        //resolve();
                                        //setAction(null);
                                        //wantsToDelete && executeDelete(); 
                                        resolve();
                                        setAction(null);
                                    }}); 
                                });   
 

    return <> 
                <ActionChipButton IconClass={ReplyIcon} label="Reply" labelWhenSending="Replying..." executeAction={awaitUserInputAction}/>

                <ConfirmationPrompt nomenu title={<>Reply to <UnameTag inline {...msg.by}/></>} confirmActionVerb="Post reply" actionExecutioner={action?.executioner}>

                    <Box margin={2} padding={1} borderLeft="3px solid #ccc">
                        { userTextToParsedUI(msg.text) }
                    </Box>
                    
                    <CommentBox actionsAlwaysVisible 
                                replyingToThisMsg={ msg }
                                onCancel={()=>action?.executioner(false)} 
                                onPosted={()=>action?.executioner(true)}
                                verb="Reply" placeholder="Type your reply here"
                                focusOnMount
                                />

                </ConfirmationPrompt>    
        </>
}
 