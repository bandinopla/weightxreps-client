import { Box } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useRef, useState } from "react"; 
import FetchMoreButton from "../../componentes/FetchMoreButton"; 
import DirectMessageNotificationItem from "./notifications-popmenu-items/DirectMessageNotificationItem";
import EventNotificationItem from "./notifications-popmenu-items/EventNotificationItem";
import JournalPostNotificationItem from "./notifications-popmenu-items/JournalPostNotificationItem";
import SystemNotificationItem from "./notifications-popmenu-items/SystemNotificationItem";
import LinearProgress from '@material-ui/core/LinearProgress';
import { parseError } from "../../data/db";
import Alert from '@material-ui/lab/Alert';
import {  useGetSession, useReactiveSetting } from "../session-handler";
import ForumNotificationItem from "./notifications-popmenu-items/ForumNotificationItem";
import ForumLikeNotificationItem from "./notifications-popmenu-items/ForumLikeNotificationItem";

 
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%', 
      backgroundColor: theme.palette.background.paper,

      "& .what": {
          fontSize:"0.9em",
          //color:"#222", 
      },

      "& .userText": {

          color: theme.userTextColor 

          ,"&.sent": {
              fontStyle:"italic"
          }
      }
    },  
    fresh: {
        borderLeft:"3px solid "+theme.palette.primary.main, 
    }
}));





//
// type: 1 DMs   type 2: Everything else...
//
export default function NotificationsPopMenu({ type }) { 

    const { session: { user: { id:myID }}, userSettings, messages, notifications }     = useGetSession();
    const classes                       = useStyles();
    const divRef                        = React.createRef();
    const lastItemCount                 = useRef();

    const { inbox, filteredInbox, loading, error, loadOlderNotifications, markAllAsRead } = type==1? messages : notifications;  

    const [ fetchMoreFoundAll, setFetchMoreFoundAll ] = useState(false);

    //
    // when we open this component we are reading everything so....
    //
    useEffect(()=>{

        //markAllAsRead(); 
        if( filteredInbox?.some(itm=>itm.isUnseen) )
        { 
            var int = setTimeout(markAllAsRead,2000);
            return ()=>clearInterval(int);
        }


    },[filteredInbox]);
 

    useEffect(()=>{
        //
        // lastItemCount is set before hitting the "fetch more" button. 
        // if the filtered list has no changes, it means there's nothing else to load. 
        // this is due to the way in which the getInbox / getNotifications logic is set in the server...
        // since we are compressing items, it can happen that we load an irrelevant item in the context of wanting to obtian "new" items not already in a compression item.
        //
        if( !fetchMoreFoundAll && lastItemCount.current>0 && filteredInbox?.length == lastItemCount.current )
        {
            setFetchMoreFoundAll(true); /// force redraw
        }
 
    });

 
    // useSubmenuListener({ 
    //     onOpened(){
 
    //         //
    //         // we opened the notifications UI... that means the user "has" or "will" read them.... anyway....
    //         //
    //         setting( new Date().toUTCString() ); 

    //         setUnseenNotificationsCount(0);
    //     },

    //     onClosed() { 
    //         //...
    //     }
    // }, [ session ]);


    //
    // en este caso, nos interesa respetar la cronología visual del widget. Por lo que ignoramos los mensajes que esten "adentro"
    // de cada item (caso DMs) 
    //
    const loadOlder = async ()=> {
        //el ultimo item de nuestra lista.

        if( !filteredInbox?.length ) {
            return true;
        }

        //
        // how many items we have right now...
        //
        lastItemCount.current = filteredInbox.length;
 

        const last = filteredInbox[filteredInbox.length-1];

        
        //
        // this is the action that fetches mose items...
        //
        const res = await loadOlderNotifications( last._combined? last.notification.when : last.when );

        //
        // se set this to CERO intentionally to make it not be equal to FALSE but still have the same effect...
        // the "useEffect" we have above will set a flag to TRUE that will hint the "fetch more" button to assume all was found.
        //
        setFetchMoreFoundAll(0); //<--- force update

        return res;

    }
 

    return <div ref={divRef} style={{ padding:"0px 18px"}}>

                {/* error && <Alert severity="error">{error}</Alert>*/}

                { loading && <LinearProgress/> }
                <List className={ classes.root } >

                    { 
                        
                        filteredInbox?.map( msg=>{  

                                let count = 0;  
                                let unseen = msg.isUnseen;

                                if( msg._combined )
                                { 
                                    count   = msg.count; 
                                    msg     = msg.notification; 
                                }

                                var element;

                                switch( msg.__typename )
                                {
                                    case "SystemNotification": 
                                        element = <SystemNotificationItem data={msg} />;
                                        break;

                                    case "DM":   
                                    case "LikeOnDM":
                                        element = <CombinedItem count={count}><DirectMessageNotificationItem data={msg} myId={myID} /></CombinedItem>;
                                        break;
                                    
                                    case "JComment": 
                                        element = <JournalPostNotificationItem data={msg} myId={myID} />; 
                                        break;
 
                                    case "LikeOnJComment":
                                    case "LikeOnLog":
                                    case "StartedFollowing":
                                        element =  <EventNotificationItem data={msg} myId={myID} />; 
                                        break;

                                    case "ForumLike":
                                        element = <ForumLikeNotificationItem data={msg} myId={myID}/>;
                                        break;
                                        
                                    case "ForumNotification":
                                        element = <ForumNotificationItem data={msg} myId={myID}/>;
                                        break; 
 
                                    default:  
                                        element = "---?? "+msg.__typename +" ??---";
                                        break;
                                } 

                                return <div key={msg.id} className={unseen? classes.fresh : ""}>{element}</div>
                    
                        } ) }

                    {!inbox?.length>0 && <ListItem>You have no notifications yet...</ListItem>  }
                    { error && <Alert severity="error">{parseError(error)}</Alert> }

                    { inbox?.length>0 &&
                    <ListItem> 
                        <Box textAlign="center" padding={1} width="100%"> 
                            <FetchMoreButton fetchMore={ loadOlder } forceHide={ fetchMoreFoundAll }/>
                        </Box>
                    </ListItem> }

                </List>

            </div>
}


/**
 * Un wrapper que agrega un "Chip" con el numero de items "comprimidos" dentro de este.
 */
const CombinedItem = ({ count, children }) => (<div style={{position:"relative"}}>
    { count>0 && <div style={{ position:"absolute", top:5, right:5, zIndex:999}}><Chip size="small"  label={"+"+count}/></div> }
    {children}</div>); 

