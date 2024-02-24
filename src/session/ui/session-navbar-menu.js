import { Button } from "@material-ui/core";
import { useGetSession } from "../session-handler";
import UAvatar from "../../componentes/uavatar";
import { UserSessionSubmenu } from './user-navbar-popmenu';

import NotificationsIcon from '@material-ui/icons/Notifications';
import AddIcon from '@material-ui/icons/Add';
import { InboxManager, NotificationsBadge } from '../inbox-manager';
import NotificationsPopMenu from './notifications-popmenu';
import { BotonConSubmenu } from '../../componentes/boton-con-submenu';
import { DMsWindow, OpenDMButton } from './dms-window/dm-window';
import { JEditorButton } from '../../componentes/journal/editor-button';
import { useHistory } from "react-router-dom";
import { DarkModeActivatorButton } from '../../componentes/DarkModeActivatorButton';
import RssFeedIcon from '@material-ui/icons/RssFeed';

import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ExitToApp from "@material-ui/icons/ExitToApp"; 

export const SessionMenu = ()=> <SessionMenuChilds/>;
 



/**
 * El area en el NavBar que permite hacer login y demás...
 */
export const SessionMenuChilds = ()=> {
 
    const { session, userSettings, logout } = useGetSession(); 
    const history = useHistory();   

    if( session )
    {  
        return <div>

<DarkModeActivatorButton style={{margin:5}} variant="outlined" />

                <InboxManager type={1}/>  
                <InboxManager type={2}/>  


                
                

                <div className="desktop-view inline">
                    <OpenDMButton otherUser={{id:"0"}} Icon={<RssFeedIcon/>} label="Global" style={{margin:5}}/>
                    <JEditorButton redirect variant="contained" color="primary" style={{margin:5}} wouldBeNewLog={true}>
                        Log Workout
                    </JEditorButton>  
                </div>

                <BotonConSubmenu submenu={<NotificationsPopMenu type={2}/>}>
                    
                    <NotificationsBadge type={2}>
                        <NotificationsIcon/>
                    </NotificationsBadge>

                </BotonConSubmenu> 

                <BotonConSubmenu submenu={<NotificationsPopMenu type={1}/>}>
                
                    <NotificationsBadge type={1}>
                        <MailOutlineIcon/>
                    </NotificationsBadge>

                </BotonConSubmenu> 

                <BotonConSubmenu submenu={<UserSessionSubmenu user={session.user} userSettings={userSettings} logout={logout}/>}>
                     
                        <UAvatar variant="circular" uid={session.user.id} hash={session.user.avatarhash}/> 

                </BotonConSubmenu>

                <DMsWindow/>

            </div>;
    }
 

    return <> 

            <DarkModeActivatorButton style={{marginRight:15}} variant="outlined"  />


            <div className="desktop-view">
                <Button color="inherit" onClick={ ()=>history.push("/login")  } style={{marginRight:10}}>
                     Sign In 
                </Button>  
                <Button onClick={ ()=>history.push("/signup") } variant="contained" color="primary" className="fancy">
                     Create Account  
                </Button> 
            </div>

            <div className="mobile-view">
                <Button onClick={ ()=>history.push("/login")  } variant="contained" color="primary">
                     <ExitToApp/>
                </Button> 
            </div>
            
             
            
        </>;
}


