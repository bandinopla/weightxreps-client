import { IconButton, Button as MaterialButton, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
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
import { ReactComponent as Logo } from '../logo.svg';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { JEditorButton } from './journal/editor-button';


import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden'; 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText'; 
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import PowerSettingsNewRoundedIcon from '@material-ui/icons/PowerSettingsNewRounded';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo'; 
import { SwipeableDrawer } from './SwipableDrawer';
import HelpIcon from '@material-ui/icons/Help';
import FingerprintIcon from '@material-ui/icons/Fingerprint';

const Button = ({ children, ...props }) => {

    const theme     = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up("lg"));

    if( bigScreen )
    {
        return <MaterialButton {...props} size='large'>{children}</MaterialButton>
    }
 
        return <IconButton {...props} >{props.startIcon}</IconButton>;
    
}  

const InboxButtonBase = ({ type, label, Icon, ...rest })=> {

    const theme     = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down("lg"));
    let ButtonClass = MaterialButton;

    if( smallScreen )
    {
        ButtonClass = IconButton ;
    }

    return <ButtonClass size='large' startIcon={<Icon/>} {...rest}>
                    
                    <NotificationsBadge type={type} small={smallScreen}>
                        {smallScreen?<Icon/>:label}
                    </NotificationsBadge>

                </ButtonClass> 
}

// const UserMenuButton = ()=>{

//     const user          = useGetSession();
//     const theme         = useTheme();
//     const smallScreen   = useMediaQuery(theme.breakpoints.down("lg"));

//     return  <BotonConSubmenu submenu={<UserSessionSubmenu user={user.session.user} userSettings={user.userSettings} logout={user.logout}/>}>
                     
//                 <Grid container alignItems="center" wrap='nowrap' spacing={2}>
//                     <Grid item>
//                         <UAvatar variant="circular" uid={user.session.user.id} hash={user.session.user.avatarhash}/> 
//                     </Grid>
//                     {!smallScreen && <Grid item className='oneline'>
//                         <UnameTag nolink inline {...user.session.user} />
//                     </Grid>}
                    
//                 </Grid>
                

//             </BotonConSubmenu> 
// }


export const MENU = [
    { Icon:HomeIcon, goto:"/", label:"Home" },
    { Icon:SearchIcon, goto:"/explore", label:"Explore" },
    { Icon:RssFeedIcon, goto:"/community-stats", label:"Community stats" },
    { Icon:LanguageIcon, goto:"/sbd-stats", label:"SBD Rank" },
    { Icon:OndemandVideoIcon, goto:"/videos", label:"Videos" },
    { Icon:FavoriteBorderIcon, goto:"/donate", label:"Donate" },
    { Icon:HelpIcon, goto:"/faq", label:"Help" },
    { Icon:FingerprintIcon, goto:"/about", label:"About" },
//liClass:styles.firstSession,

    { Icon:FitnessCenterSharpIcon, sessionMenuStart:true, fancy:true, onClick:()=>window.dispatchEvent(new Event("openEditor")), label:"Log Workout", session:true },
 
    { Icon:AccountCircleRoundedIcon, goto: user => `/journal/${user.uname}` , label:"My Journal", session:true },
    { wrap: lbl=><NotificationsBadge type={2}>{lbl}</NotificationsBadge>,goto:"/notifications", type:2, label:"Notifications", Icon:NotificationsNoneIcon, session:true },
    { wrap: lbl=><NotificationsBadge type={1}>{lbl}</NotificationsBadge>, goto:"/messages", type:1, label:"Messages", Icon:MailOutlineIcon, session:true },
    {  goto:"/settings", label:"Settings", Icon:SettingsRoundedIcon, session:true },
    //<DarkModeActivatorButton UseButton={Button}/>,
    { Icon:ExitToAppIcon, goto:"/", label:"Sign In", onPreClick:()=>window.skinLoginCover=true, sessionMenuStart:true, fancy:true, session:false, excludeIf: path => path=="/" },
    { Icon:PowerSettingsNewRoundedIcon, onClick:()=>window.dispatchEvent(new Event("logout")), label:"Log out", session:true },

    //{ Icon:SettingsIcon, goto:"/settings", label:"Settings", session:true },
    
] ;

// const useStyles = makeStyles( theme=>({
//     root:{ 
//         textAlign:"center",
//         width:"100%", 
//         padding:"0 10px",

//         "& > svg": { 
//             padding:5,
//             boxSizing:"border-box"
//         },
//         "& ul": {
//             listStyle:"none",
//             padding:0,
//             margin:0
//         }
//     },
//     footer: {
//         position:"fixed",
//         bottom:0
//     },
//     firstSession: {
//         marginTop:30,
//     },
//     [theme.breakpoints.up("lg")]: {
//         root: {
//             maxWidth:500,
//             textAlign:"left"
//         }
//     }
    
// }));

// //TODO. Menu
// export const MainMenu = ()=>{
//     const theme         = useTheme();
//     const user          = useGetSession();
//     const smallScreen   = useMediaQuery(theme.breakpoints.down("sm"));
//     const history       = useHistory();
//     const location      = useLocation();
//     const styles        = useStyles(); 
//     const hasSession    = user.session?.user?.id>0;
 
//     let firstSession    = false; 

//     useEffect(()=>{
//         if( !user.loadingSession )
//         {
//             document.body.classList.add("appReady");
//         }
//     },[user.loadingSession]);

//     const onClickBtn = btn =>{

//         console.log( "aler", btn, typeof btn.goto)
//         btn.onPreClick && btn.onPreClick()
//         btn.onClick ? btn.onClick() : history.push( typeof btn.goto=='function'? btn.goto(user.session?.user) : btn.goto )
//     }


//     return <>
//             <Sticky siblingIsSticky> 

//             { user.session && <JEditorButton style={{display:"none"}}/>  }

//             <nav className={ styles.root }>

//                 <Logo width={60} height={60}/>

//                 <ul> 

//                     { MENU  .filter(btn=> (btn.excludeIf? !btn.excludeIf(location.pathname) : true) && (btn.session==undefined || btn.session === hasSession) )
//                             .map( (btn, btnIndex)=>( isValidElement(btn) ? <li key={btnIndex}>{btn}</li> : <li className={(btn.sessionMenuStart? styles.firstSession: "") +" "+ (location.pathname==btn.goto?styles.selected:"")} key={btnIndex}>
//                                 { btn.Button ? <btn.Button onClick={ ()=>onClickBtn(btn) } {...btn}/> : <Button startIcon={<btn.Icon/>} onClick={ ()=>onClickBtn(btn) } fullWidth={btn.fancy} className={ btn.fancy?"fancy sha spaceBelow": "" }>{btn.label}</Button> }
//                     </li>) )}
 

//                 </ul>
//             </nav>  
//             </Sticky> 

//             { user.session &&
//                 <div className={styles.footer} style={{ background:`linear-gradient(to bottom, ${theme.palette.background.default}00 0%, ${theme.palette.background.default}FF 20%)` }}> 
//                     <UserMenuButton/>  
//                 </div>
//             }


//             </>
// }



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

    logo: {
        maxWidth:"100% !important",
        width:90,
        height:90,
        display:"block",
        margin:"0 auto",
        "& g":{
            fill: theme.palette.text.primary
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
        if( !user.loadingSession ) 
            document.body.classList.add("appReady"); 
    },[user.loadingSession]);

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

                return (<ListItem button key={i} selected={isSelected} onClick={ ev=>onClickButton(btn, linkUrl)} className={(btn.sessionMenuStart? cls.firstSession: "") +" " + (btn.fancy?" fancy sha spaceBelow": "")}>
                            <ListItemIcon><btn.Icon/></ListItemIcon>
                            <ListItemText color='primary' primary={  btn.wrap? btn.wrap(btn.label) : btn.label } />
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