import { Button, CircularProgress } from "@material-ui/core";
import { useContext, useState } from "react";
import { useGetLogInboxQuery, useLikeJournalLogMutation, useLikeMessageMutation } from "../data/generated---db-types-and-hooks";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { updateCachedNotificationsArray } from "../session/inbox-manager";
import { ActionChipButton } from "./action-chip-button"; 
import { JDayContext } from "./journal/jday-context";
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbUpSharpIcon from '@material-ui/icons/ThumbUpSharp';
import { JOwnerContext } from "../pages/journal-context";
import { useGetSession } from "../session/session-handler";

/**
 * en "msg" pasarle la referencia a un comentario devuelto por Inbox.notifications
 * unlike: Boolean. Si está presente hace la operación opuesta "unlike"
 */
export const LikeThisButton = ({ msg, unlike }) => {
    
    const { session }              = useGetSession();
    const jdayContext           = useContext(JDayContext);
    const _type                 = msg.__typename;
    const myId                  = session?.user.id;

    //
    // <ActionChipButton> se encarga de mostrar errores si los hay...
    //
    const [sendLikeMessage ]    = useLikeMessageMutation();

    //
    // por default, asumo like on DM
    //
    var cacheID                 = "getInbox";  
    var notificationType        = {
        __typename  :"LikeOnDM"
    };

    //
    // hide si no estamos logueados
    //
    if( !myId ) return "";


    //
    // unlike mode?
    //
    if( unlike )
    {
        //
        // remove this like...
        //
        if( _type.indexOf("Like")==0 )
        {
            //
            // no es nuestro...
            //
            if( msg.by.id!=myId )
            {
                return ""; 
            } 

            //
            // copiamos todos los datos del item
            //
            notificationType = {
                ...msg
            };  
        }  

        //msg = un mensaje
        //msg = un like que ya dimos
    }
    else 
    {
        //
        // no se puede liekar un like...
        //
        if( _type.indexOf("Like")==0 )
        {
            return ""; 
        } 
    }
  
    //
    // si es un JComment, estamos viendo un comentario en un journal log.
    //
    if( msg.__typename=='JComment' )
    {
        notificationType = { 
            jowner      : msg.jowner.id,
            ymd         : msg.ymd,
            __typename  : "LikeOnJComment"
        }; 
    }

    //
    // si tiene jowner, estamos dentro de un Log...
    //
    if( msg.jowner != null )
    {
        //
        // esto es así porque el inbox de los logs se guarda separadamente por unique logid
        //
        cacheID = "getLogInbox:"+JSON.stringify({ logid:jdayContext.id });
    }
 

    const sendLike = ()=> sendLikeMessage({
                                variables: {

                                    //
                                    // UNLIKE es idéntico a like, pero si detecta una "x" al inicio se activa el unlike mode.
                                    //
                                    target: (unlike?"x":"")+msg.msgid 
                                }, 

                                //
                                // "likeMessage" es el nombre de la mutation que ejecuta el "like" action en ambos casos.
                                //
                                update: updateCachedNotificationsArray( ({ likeMessage })=>({
                                    [cacheID]: unlike? 
                                    //
                                    // delete this item 
                                    //
                                    {

                                       remove: itmFieldReader =>{
                                           return itmFieldReader("__typename")==notificationType.__typename && itmFieldReader("msgid")==msg.msgid && itmFieldReader("by").id==myId;
                                       }

                                    } : 
                                    //
                                    // add new item
                                    //
                                    {
                                        ...notificationType, 
                                        id          : likeMessage, //devuelve el ID 
                                        when        : new Date(),
                                        msgid       : msg.msgid,
                                        by          : myId,
                                        to          : msg.by.id,
                                        text        : msg.text //el message preview...
                                    }
                                })) 
                            });


    return <ActionChipButton IconClass={ unlike? ThumbDownAltIcon : ThumbUpIcon} label={unlike?"Unlike":"Like"} labelWhenSending="Sending like..." executeAction={sendLike}/>
}

export const LikeJournalButton = ({...rest})=>{
    const jowner                    = useContext(JOwnerContext);
    const log                       = useContext(JDayContext);

    return <LikeJournalButtonManual jownerID={jowner.id} logYMD={log.ymd} logid={log.id} {...rest}/>
};


export const LikeJournalButtonOLD = ({ ...rest })=>{

    const {session}                   = useGetSession();
    const jowner                    = useContext(JOwnerContext);
    const log                       = useContext(JDayContext);
    const logid                     = log?.id;
    const myId                      = session?.user.id;
    const {data, error, loading, refetch}    = useGetLogInboxQuery({ variables: { logid } });
    const [busy, setBusy]           = useState(false);
    const [sendLike ]               = useLikeJournalLogMutation();
    const cacheFieldId              = "getLogInbox:"+JSON.stringify({ logid });

    var leDiLike    = false;

    if( session )
    {
        leDiLike = data?.getLogInbox.notifications.find(itm=>itm.__typename=='LikeOnLog' && itm.by.id==myId ) != null;
    }

    if( !logid ) {
        return "";
    }


    const toggleLike = ()=>{
        setBusy(true);
 
        sendLike({
            variables: {
                target: (leDiLike?"x":"")+log.id 
            },

            update: updateCachedNotificationsArray( ({ likeJournalLog }) => ({

                [cacheFieldId]: leDiLike?
                    {
                        remove: itmFieldReader =>{
                            return itmFieldReader("__typename")=='LikeOnLog' && itmFieldReader("by").id==myId;
                        }
                    }:
                    {
                        __typename  :"LikeOnLog",
                        id          : likeJournalLog, //devuelve el ID 
                        when        : new Date(), 
                        by          : session.user.id,
                        jowner      : jowner.id,
                        ymd         : log.ymd
                    }
            })
            )
        })

        .finally(()=>setBusy(false));
    };


    const showSpinner = loading || busy;

  
    return <Button onClick={toggleLike} disabled={showSpinner || !session} startIcon={ leDiLike? <ThumbUpSharpIcon/> : <ThumbUpOutlinedIcon/>} {...rest}>
            { showSpinner && <CircularProgress size={18} /> }
            { !showSpinner && data?.getLogInbox.notifications.filter(itm=>itm.__typename=='LikeOnLog').length || 0 }
        </Button> 
}

export const LikeJournalButtonManual = ({ jownerID, logid, logYMD, ...rest })=>{
 


    const {session}                   = useGetSession(); 
  
    const myId                      = session?.user.id;
    const {data, error, loading, refetch}    = useGetLogInboxQuery({ variables: { logid } });
    const [busy, setBusy]           = useState(false);
    const [sendLike ]               = useLikeJournalLogMutation();
    const cacheFieldId              = "getLogInbox:"+JSON.stringify({ logid });

    var leDiLike    = false;

    if( session )
    {
        leDiLike = data?.getLogInbox.notifications.find(itm=>itm.__typename=='LikeOnLog' && itm.by.id==myId ) != null;
    }

    if( !logid ) {
        return "";
    }


    const toggleLike = ()=>{
        setBusy(true);
 
        sendLike({
            variables: {
                target: (leDiLike?"x":"")+logid 
            },

            update: updateCachedNotificationsArray( ({ likeJournalLog }) => ({

                [cacheFieldId]: leDiLike?
                    {
                        remove: itmFieldReader =>{
                            return itmFieldReader("__typename")=='LikeOnLog' && itmFieldReader("by").id==myId;
                        }
                    }:
                    {
                        __typename  :"LikeOnLog",
                        id          : likeJournalLog, //devuelve el ID 
                        when        : new Date(), 
                        by          : session.user.id,
                        jowner      : jownerID,
                        ymd         : logYMD
                    }
            })
            )
        })

        .finally(()=>setBusy(false));
    };


    const showSpinner = loading || busy;

  
    return <Button onClick={toggleLike} disabled={showSpinner || !session} startIcon={ leDiLike? <ThumbUpSharpIcon/> : <ThumbUpOutlinedIcon/>} {...rest}>
            { showSpinner && <CircularProgress size={18} /> }
            { !showSpinner && data?.getLogInbox.notifications.filter(itm=>itm.__typename=='LikeOnLog').length || 0 }
        </Button> 
}
 