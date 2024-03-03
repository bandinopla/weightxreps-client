import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useGetInboxQuery } from '../../../data/generated---db-types-and-hooks';
 
import UnameTag from '../../../componentes/uname';
import { Typography, makeStyles, Box } from '@material-ui/core';
import { DirectMessageItem } from '../notifications-popmenu-items/NotificationItemTemplate';
import Chip from '@material-ui/core/Chip';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import FetchMoreButton from '../../../componentes/FetchMoreButton';
import CommentBox from '../../../componentes/comment-box';
import { LikeThisButton } from '../../../componentes/like-button';
import { DeleteMyMessage } from '../../../componentes/delete-message-button';
import { userTextToParsedUI } from '../../../componentes/user-text-to-parsed-tags'; 
import { DialogTitleWithCloseBtn } from '../../../componentes/DialogTitleWithCloseBtn';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import SystemNotificationItem from '../notifications-popmenu-items/SystemNotificationItem';
import { Alert } from '@material-ui/lab';
import { useGetSession } from '../../session-handler';
const useStyles = makeStyles((theme) => ({
    
    msgBox: { 
    },

    byMe: {
        marginLeft:"10%",
        borderRight:"2px solid #ccc"
    },

    byOther: {
        marginRight:"10%",
        borderLeft:"2px solid "+theme.uname.male,

        "& .usr-text": {
            color: theme.uname.male, 
            wordBreak:"break-word",
            whiteSpace: "pre-wrap"
        },

        "&.isf": {
            borderLeft:"2px solid "+theme.uname.female,
            "& .usr-text": { color: theme.uname.female }
        }

    },

    brandnew: {
        "& .MuiListItem-root": {
            background:"#FEFAE0 !important"
        }
    }
 
}));


/**
 * `other` es un User graphQL object
 */
export function openDMWindow( other ) {
    document.dispatchEvent(new CustomEvent("openDM", { detail: { other } }));
}

export function OpenDMButton( { otherUser, label, Icon, ...rest } ) {
    const { session }                  = useGetSession(); 
 
    if( !session )
    {
        return null;
    }

    if( session.user.id==1 )
    {

    }

    return session && ( (otherUser.id==0 && session?.user.id==1) || otherUser.admin || 
                        ( otherUser?.id>0 && otherUser?.id!=session?.user.id )) && <Button startIcon={Icon || <MailOutlineRoundedIcon/>} {...rest} variant="outlined" onClick={ ()=>openDMWindow(otherUser) }>{ label || "Send message"}</Button> ;
}


export function DMsWindow() 
{
    const classes  = useStyles();
    const { session:sessionContext }                = useGetSession();
    const [open, setOpen]                           = React.useState(false);
    const [other, setOther]                         = React.useState();
    const [yaViTodo]                                = React.useState(new Map());
    const [yaLoCargue]                              = React.useState(new Map());
    const myId                                      = sessionContext? sessionContext.user.id+"" : "";
    const [isFetching, setIsFetching]               = useState(false);
    const currentChatID                             = [myId,other?.id].join("|"); 
    const { data, loading, error, fetchMore }       = useGetInboxQuery({ notifyOnNetworkStatusChange:true });
 

    const handleClose       = () => {
        setOpen(false);
    };  

    //#region event listener to open...
    useEffect( ()=>{
        
        const onOpenDM = ev => {  
            setOpen( true );
            setOther( ev.detail.other );  
        };

        document.addEventListener("openDM", onOpenDM);

        return ()=>document.removeEventListener("openDM", onOpenDM);

    },[data] );
    //#endregion

    //
    // cada vez que cambie el "other" chequear si ya cargamos el inbox de esta conversacion... else, cargar.
    //
    useEffect( ()=>{
 
        if( other && !yaLoCargue.has(currentChatID) )
        {
            //
            // cargar chat
            // 
            fetchMore({
                variables: {
                    dmsWithUID: String(other.id)
                },
            })

            .then( result => {

                //console.log("FETCH RESULT", result.data.getInbox.notifications )
                yaLoCargue.set(currentChatID, true); 
                
                
            })
            
            .catch(e=>{
                // ignore...
                console.error(e)
            })
            ;
        }

    }, [other] );

     
    if( myId=="")
    {
        return ""; //<--- not loggued.
    }
    
    const liked = new Map();
    var oldestDate;
   
    //#region filtrar notificaciones, solo DMs y likes a DMs...

    //
    // como el "getInbox" se "comparte", tenemos que filtrar la data que queremos de ahi.
    //
    const items = other && data?.getInbox.notifications.filter( itm=>{
  
        let otherID     = other?.id+"";   

        //
        // ADMIN viendo los global messages
        // 
        if( myId=="1" && otherID=="0" && itm.__typename=="SystemNotification")
        { 
            oldestDate = itm.when;
            return true;
        }


        if( itm.__typename=="DM" ||  itm.__typename=="LikeOnDM") 
        { 
            let by          = itm.by.id;
            let to          = itm.to.id;

            //
            // si es relevante a esta ventana de DM...
            //
            if( (by==myId && to==otherID) || (to==myId && by==otherID) )
            { 
                oldestDate = itm.when;

                //
                // si es un like, solo queremos saber si gustó o no el mensaje...
                //
                if( itm.__typename=="LikeOnDM" )
                {
                    if( !liked.has(itm.msgid) ) 
                    {
                        liked.set( itm.msgid, [] );
                    }

                    liked.get( itm.msgid ).push( itm.by );

                    return false; //no incluirlo, solo DMs
                } 

                //
                // agregamos el DM
                //
                return true;
            } 
        } 

        return false;
    })
        //.sort( (a,b)=>b.when-a.when )
    
    || [];
    //#endregion

    //
    // Hice un boton de acceso directo a un chat con un usuario hardcodeado. Al primer run el "other" solo tiene "id", hay que completar.
    //
    if( other?.id>0 && !other.uname && data )
    {
        let foundOther = data.getInbox.referencedUsers.find(u=>u.id==other.id);
        foundOther && setOther( foundOther );
    }

    //
    // fetch OLD data
    //
    const loadOlderNotifications = ()=>{

        let olderThan = oldestDate;
 
        if( !olderThan ) {
            return Promise.resolve([]);
        }

        return fetchMore({
            variables: {
                olderThan,
                dmsWithUID: other.id
            }
        })

        .then( res => {
            
            let hayItems = res.data.getInbox?.notifications.length>0;

            if(!hayItems) {
                yaViTodo.set(currentChatID,true);
            }

            return hayItems; 
        
        });
    } 
   
     
    if( !other )
    {
        return null;
    }

    return <Dialog
                    open={open}
                    onClose={handleClose}
                    scroll="body"  
                    maxWidth="sm"
                    fullWidth
                > 

                    <DialogTitleWithCloseBtn onClose={handleClose}>
                        { other?.id>0 && <>Direct Messages with <UnameTag inline {...other} /></> }
                        { other?.admin && <>Messages with admin</> }
                        { other.id==0 && "Global Message" }
                    </DialogTitleWithCloseBtn>

                    <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description" 
                        tabIndex={-1}
                    >
                        <CommentBox outlined dmWith={other?.id}/>  
                        
                        { 
                            //#region por cada mensaje...
                            items?.map( msg =>{


                            if( msg.__typename=="SystemNotification" )
                            {
                                return <div><SystemNotificationItem data={msg} /></div>;
                            }

                            //#region calculando likes en este mensaje...
                            let whenExtra;
                            let canLikeThisComment = msg.by.id!=myId;

                            if( liked.has(msg.msgid) ) 
                            {
                                whenExtra = <>{ liked.get(msg.msgid).map(
                                    
                                    user=> {

                                        if( user.id==myId ) 
                                        {
                                            canLikeThisComment = false;
                                        }
                                    
                                        return <Chip icon={<ThumbUpIcon fontSize="small"/>}
                                                     label={ ( user.id==myId?"you":user.uname)+" liked this"} 
                                                     color="primary"
                                                     size="small"
                                                />; 
                                    }
                                  
                                ) }</>;
                            }

                            if( canLikeThisComment ) 
                            {
                                whenExtra = <>{whenExtra} <LikeThisButton msg={msg}/></>;
                            }

                            //#endregion

                            let timeSince   = new Date().getTime() - new Date(msg.when).getTime();
                            let resaltar    = timeSince < 60000;
                            let isMine      = msg.by.id==myId;

                            //
                            // agregar boton de borrar
                            //
                            if( isMine && msg.text!="") {
                                whenExtra = <>{whenExtra} <DeleteMyMessage msg={msg}/></>;
                            }

                            

                            return <div key={msg.id} className={ (isMine? classes.byMe : classes.byOther) + (msg.by.isf?" isf":"") + (resaltar? " "+classes.brandnew : "") }>
                                
                                        <DirectMessageItem when={msg.when} whenExtra={whenExtra}>
                                            <div className="usr-text">
                                                <UnameTag {...msg.by} inline/>:&nbsp; &nbsp;

                                                    { msg.isGlobal?<Alert severity="info" className="sha">
                                                                        <Typography variant="body2">
                                                                            <strong>(Sent to everyone)</strong> {userTextToParsedUI(msg.text, true)}
                                                                        </Typography> 
                                                                    </Alert>
                                                                
                                                                : userTextToParsedUI(msg.text) } 

                                            </div>
                                        </DirectMessageItem>
                                    </div>;

                        } ) 
                            //#endregion
                        }


                        { items.length>0 && <Box textAlign="center" padding={1} width="100%"> 
                            <FetchMoreButton forceLoading={loading} fetchMore={ loadOlderNotifications } forceHide={yaViTodo.has(currentChatID)} />
                        </Box> }

                        { !items.length &&  <Typography variant="caption">No messages yet...</Typography> }

                    </DialogContentText>
                    </DialogContent>
                    {/*<DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Subscribe
                        </Button>
                    </DialogActions>*/}
                </Dialog>;
}


 