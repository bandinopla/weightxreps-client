import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import LanguageIcon from '@material-ui/icons/Language';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';  
import { useGetSession } from '../session/session-handler';
import FitnessCenterSharpIcon from '@material-ui/icons/FitnessCenterSharp';
import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { NotificationsBadge } from '../session/inbox-manager';
//import { ReactComponent as Logo } from '../logo.svg';
import Logo from "./Logo"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { JEditorButton } from './journal/editor-button';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden'; 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText'; 
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import PowerSettingsNewRoundedIcon from '@material-ui/icons/PowerSettingsNewRounded';
import { SwipeableDrawer } from './SwipableDrawer';
import HelpIcon from '@material-ui/icons/Help';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { openExercisesModal } from './journal/exercises';
import VideocamIcon from '@material-ui/icons/Videocam';
import GroupIcon from '@material-ui/icons/Group';

export const MENU = [
    { Icon:HomeIcon, goto:"/", label:"Home" },
    { Icon:SearchIcon, goto:"/explore", label:"Explore" },
    { Icon:RssFeedIcon, goto:"/community-stats", label:"Community stats" },
    { Icon:LanguageIcon, goto:"/sbd-stats", label:"SBD Rank" },
    { Icon:GroupIcon, goto:"/forum", label:"Forum", addClass: classes => classes.forumBtn },
    { Icon:VideocamIcon, goto:"/videos", label:"Videos" },
    { Icon:FavoriteBorderIcon, goto:"/donate", label:"Donate" },
    { Icon:HelpIcon, goto:"/faq", label:"Help" },
    { Icon:FingerprintIcon, goto:"/about", label:"About" },
//liClass:styles.firstSession,

    { Icon:FitnessCenterSharpIcon, sessionMenuStart:true, fancy:true, goto:"/log-workout", label:"Log Workout", session:true },
 
    { Icon:AccountCircleRoundedIcon, goto: user => `/journal/${user.uname}` , label:session=>session.user.uname, session:true },
    { wrap: lbl=><NotificationsBadge type={2}>{lbl}</NotificationsBadge>,goto:"/notifications", type:2, label:"Notifications", Icon:NotificationsNoneIcon, session:true },
    { wrap: lbl=><NotificationsBadge type={1}>{lbl}</NotificationsBadge>, goto:"/messages", type:1, label:"Messages", Icon:MailOutlineIcon, session:true },

    { Icon:FitnessCenterIcon, session:true, label:"My Exercises", onClick:()=>openExercisesModal(0) },
    {  goto:"/settings", label:"Settings", Icon:SettingsRoundedIcon, session:true },
    //<DarkModeActivatorButton UseButton={Button}/>,
    { Icon:ExitToAppIcon, goto:"/", label:"Sign In", onPreClick:()=>{

        window.skinLoginCover=true;
        window.quickAccessLogin && window.quickAccessLogin();

    }, sessionMenuStart:true, fancy:true, session:false }, //, excludeIf: path => path=="/"
    { Icon:PowerSettingsNewRoundedIcon, onClick:()=>window.dispatchEvent(new Event("logout")), label:"Log out", session:true },
    
] ; 



const useStylesDrawer = makeStyles( theme=>({
    root:{  
        overflow:"hidden", 

        "& .MuiPaper-root": {
            backgroundColor: theme.palette.background.default
        },

        [theme.breakpoints.up("lg")]: {
            display:"flex",
            justifyContent:"end",
            "& .MuiDrawer-paper": {
                border:"none !important"
            },
            "& .MuiDrawer-paperAnchorLeft": {
                left:"auto",
                marginLeft:-210
            }
        }
    }, 

    // logo: {
    //     maxWidth:"100% !important",
    //     width:90,
    //     height:90,
    //     display:"block",
    //     margin:"0 auto",
    //     "& g":{
    //         fill: theme.palette.text.primary
    //     }
    // },

    forumBtn: {
        "& .MuiTypography-root": {
            fontWeight:"bold !important",
            background:"-webkit-linear-gradient(#980F7A, #E68538)",
            "-webkit-background-clip":"text",
            "-webkit-text-fill-color":"transparent"
        },
        "& .MuiSvgIcon-root path": {
            fill: "#B92E59"
        }
        
    },
    
    // handle: {
    //     background:"black",
    //     color:"white",
    //     position:"fixed",
    //     top:"25%",
    //     height:"25%",
    //     padding:5,
    //     borderTopRightRadius:10,
    //     borderBottomRightRadius:10,
    // },

    selected: {

    }
    
}));


export const MainMenuDrawer = ()=>{

    const user          = useGetSession();
    const hasSession    = user.session?.user?.id>0;
    const history       = useHistory();
    const location      = useLocation();
    const cls           = useStylesDrawer();
    const [show, setShow] = useState(false);



    useEffect(()=>{

        if(user.session?.user)
        {
            window.addEventListener("logout", user.logout );
            return ()=>window.removeEventListener("logout", user.logout );
        }
        
    }, [user.session?.user.id]);


    const toggleDrawer = (newopen) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setShow(newopen);
      };


    const onClickButton = (btn,linkUrl) =>{

        btn.onPreClick && btn.onPreClick()
        btn.onClick ? btn.onClick() : history.push( linkUrl )
        setShow(false);
    }

    const menu = (<div>
        <Logo className={cls.logo}/>
        <List>
        {MENU
            .filter(btn=> (btn.excludeIf? !btn.excludeIf(location.pathname) : true) && (btn.session==undefined || btn.session === hasSession) )
            .map( (btn,i)=>{
                
                const linkUrl = typeof btn.goto=='function'? btn.goto(user.session?.user) : btn.goto;
                const isSelected = location.pathname==linkUrl || ( linkUrl?.length>1 && location.pathname.indexOf(linkUrl)===0 );
                const label = typeof btn.label == 'function' ? btn.label(user.session) : btn.label;

                return (<ListItem button key={i} selected={isSelected} 
                                    onClick={ ev=>onClickButton(btn, linkUrl)} 
                                    className={(btn.sessionMenuStart? cls.firstSession: "") +" " + (btn.fancy?" fancy sha spaceBelow": "")+ (btn.addClass?" "+btn.addClass(cls):"")}>
                            <ListItemIcon><btn.Icon/></ListItemIcon>
                            <ListItemText color='primary' primary={  btn.wrap? btn.wrap(label) : label } />
                        </ListItem>)})}
        </List>
    </div>);

    return <nav className={cls.root}> 

        { user.session && <JEditorButton style={{display:"none"}}/>  }
        <Hidden mdDown implementation="css">
             <Drawer 
                variant="persistent"
                anchor="left"
                open={true} 
            >{menu}
            </Drawer>
      </Hidden>
        <Hidden lgUp implementation="css"> 
            <SwipeableDrawer
                anchor="left"
                open={show}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer( true)}
            >
                {menu}
            </SwipeableDrawer>
        </Hidden>
    </nav>
}