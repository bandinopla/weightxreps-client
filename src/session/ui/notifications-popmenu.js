import { Box } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from "react";
import { useSubmenuListener } from "../../componentes/boton-con-submenu";
import FetchMoreButton from "../../componentes/FetchMoreButton";
import { Notification } from "../../data/generated---db-types-and-hooks";
import { useInbox } from "../inbox-manager";
import DirectMessageNotificationItem from "./notifications-popmenu-items/DirectMessageNotificationItem";
import EventNotificationItem from "./notifications-popmenu-items/EventNotificationItem";
import JournalPostNotificationItem from "./notifications-popmenu-items/JournalPostNotificationItem";
import SystemNotificationItem from "./notifications-popmenu-items/SystemNotificationItem";
import LinearProgress from '@material-ui/core/LinearProgress';
import { parseError } from "../../data/db";
import Alert from '@material-ui/lab/Alert';
import { useCurrentSession, useReactiveSetting } from "../session-handler";

 
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%', 
      backgroundColor: theme.palette.background.paper,

      "& .what": {
          fontSize:"0.9em",
          color:"#222", 
      },

      "& .userText": {

          color: theme.userTextColor 

          ,"&.sent": {
              fontStyle:"italic"
          }
      }
    },  
}));





//
// type: 1 DMs   type 2: Everything else...
//
export default function NotificationsPopMenu({ type }) {

    const context       = useCurrentSession();
    const classes       = useStyles();
    const divRef        = React.createRef();


    const { inbox, loading, error, loadOlderNotifications, setUnseenNotificationsCount } = useInbox(type);  
    
    //
    // i hold in a "setting" the value of the last time this PopMenu was opened.
    //
    const setting       = context?.userSettings[ type==1? "inboxLastSeenDate": "notificationsLastSeenDate" ];
    const lastSeen      = useReactiveSetting( setting );

    const myID          = context?.user.id;
    let filteredInbox   = inbox? filtrarInbox(inbox, myID) : null;   

    let lastSeenDate = lastSeen ? new Date(lastSeen) : null ; 

    //#region Calculat enumber of "unseen" notifications

    //
    // i handle this client side %100 i just check if the last time this UI was opened was older than the message from the newest notification...
    //
    useEffect( ()=>{


        let unseen = filteredInbox?.reduce( (val, itm)=>{
 
            const item = itm._combined? itm.notification : itm;

            let itmDate = new Date( item.when ); 
    
            if( !lastSeenDate || lastSeenDate<itmDate ) {
 
                if( item.by!=null && (item.by.id!=myID) )
                { 
                    val++;
                }
                
            }
    
            return val;
    
        } , 0) || 0;
 
    
        let interval = setUnseenNotificationsCount(unseen);
        return ()=>clearTimeout(interval);

    },[filteredInbox]);


    //#endregion

 
    useSubmenuListener({ 
        onOpened(){
 
            //
            // we opened the notifications UI... that means the user "has" or "will" read them.... anyway....
            //
            setting( new Date().toUTCString() ); 

            setUnseenNotificationsCount(0);
        },

        onClosed() { 
            //...
        }
    }, [context]);


    //
    // en este caso, nos interesa respetar la cronología visual del widget. Por lo que ignoramos los mensajes que esten "adentro"
    // de cada item (caso DMs) 
    //
    const loadOlder = async ()=> {
        //el ultimo item de nuestra lista.

        if( !filteredInbox?.length ) {
            return true;
        }

        const last = filteredInbox[filteredInbox.length-1][0];

        return loadOlderNotifications( last._combined? last.notification.when : last.when );

    }
 

    return <div ref={divRef} style={{width:500, maxWidth:"100%", padding:"0px 8px"}}>

                {/* error && <Alert severity="error">{error}</Alert>*/}

                { loading && <LinearProgress/> }
                <List className={classes.root} >

                    { 
                        
                        filteredInbox?.map( msg=>{  

                                let count = 0;  

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
 
                                    default:  
                                        element = "---?? "+msg.__typename +" ??---";
                                        break;
                                } 

                                return <div key={msg.id}>{element}</div>
                    
                        } ) }

                    {!inbox?.length>0 && <ListItem>You have no notifications yet...</ListItem>  }
                    { error && <Alert severity="error">{parseError(error)}</Alert> }

                    { inbox?.length>0 &&
                    <ListItem> 
                        <Box textAlign="center" padding={1} width="100%"> 
                            <FetchMoreButton fetchMore={ loadOlder } />
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


/**
 * @typedef {object} CombinedNotification
 * @property {Number} count If > 1 significa que hay otros items (mas viejos) "dentro" de este item
 * @property {Notification} notification 
 * @property {Boolean} _combined
 *
 * Quitamos duplicados y dejamos el más reciente, pero llevamos un conteo del numero de items "comprimidos" 
 * para despues mostrarlo con un <CombinedItem/>
 * 
 * @param {[Notification]} inbox 
 * @param {Number} myID 
 * @returns {[(Notification|CombinedNotification)]}
 */
const filtrarInbox = (inbox, myID) => {

    //se supone vienen ordenados por fecha...
    //agruparlos. Mostrar solo 1 por username....  
 
        //
        // quitar todos los items (salvo el más reciente) relacionados con un DM de un usuario.
        //
        let uidDM = new Map();

        return inbox.map( msg => {

            let uid; //user DM

            // DM | DMSent | LikeOnMyDM

            switch( msg.__typename ) 
            {
                case "DM":
                case "LikeOnDM": 

                if( msg.text.length>80 ) { 
                    msg = {
                        ...msg,
                        text: msg.text+"[...]"
                    } 
                }

                //
                // if "to" el item es un "sent message" de nosotros hacia ese usuario...
                // if "by" es un DM enviado a nosotros
                //
                uid = msg.by.id==myID? msg.to.id : msg.by.id; //el context del mensaje
                break; 
            } 
 
            //
            // si estamos en el contexto de un "DM"...
            //
            if( uid )
            {
                //
                // si no hay nada ya procesado... es un item reciente:
                //
                if( !uidDM.has(uid) )
                {
                    let combined = { _combined:true, count:0, notification:msg };
                    uidDM.set(uid, combined);
                    return combined;
                }

                //
                // else, es un evento viejo. 
                //
                uidDM.get(uid).count++;  
                return null;
            }

            //
            // todo lo demas se agrega así como viene
            //
            return msg; 
        })
        
        .filter( itm=>itm!=null ); 
}



