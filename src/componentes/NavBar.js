import { LinearProgress, useTheme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import {
    Link,
    useHistory
} from "react-router-dom";
import { MainMenu } from "../data/Menu";
import { ifDark } from '../MainTheme';
import { useGetSession } from '../session/session-handler';
import { SessionMenu } from '../session/ui/session-navbar-menu';
import {GLobalNotification} from './GLobalNotification';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding:5
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  menuBtn: { 
      paddingRight:25,
      //color: ifDark(theme, "#ccc" , "#666"),
      textDecoration:"none"
  },
  menuBtnAnchor: {
    textDecoration:"none"
  },
  statsBtn: {
    color: theme.palette.primary.main
  },
  logo: {
      maxWidth:200,
      paddingRight:10,
      //backgroundColor: theme.logoBgColor
  }
}));

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }



const MENU = MainMenu;

const SideMenu = ({ onClose })=>{

    const classes = useStyles();
    const history = useHistory();
    
    return <div>

    <List>
        { MENU.map( itm=>(<ListItem onClick={ ()=>onClose() || history.push(itm.linkto) } button key={itm.lbl}>
             
            <ListItemText primary={itm.lbl} />
        </ListItem>) ) }
 

    </List> 

</div>;}


export default function NavBar() {
  const classes = useStyles();
  const theme = useTheme()
  const [state,setState] = React.useState({
      showSideMenu:false
  });

  const showSideMenu = bool => {
    setState({ ...state, showSideMenu:bool });
  };

  const logo = (<img src={process.env.PUBLIC_URL +  ifDark(theme, '/logo-invertido.png','/logo.png') } className={classes.logo}/>);
 

  return (
    <div className={classes.root}>  
    
     <LoadingSessionIndicator><div style={{zIndex:9999, position:"fixed", top:0, width:"100%"}}><LinearProgress/></div></LoadingSessionIndicator>

       

      <HideOnScroll>
 
        <AppBar position="fixed" color="default" elevation={0}>
            <GLobalNotification/>
            <Toolbar  >
            
                <Box display={{ xs: 'block', md: 'none' }}>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" onClick={ ()=> showSideMenu(true) }>
                        <MenuIcon />
                    </IconButton> 
                    
                    <Drawer anchor="left" open={state.showSideMenu} onClose={ ()=>showSideMenu(false)}>
                        <SideMenu onClose={ ()=>showSideMenu(false)}/>
                    </Drawer>
                    
                </Box> 
                
                <Box display={{ xs: 'none', md: 'block'  }}> 
                  <a href="/">{logo}</a>
                </Box>
                
                <div className={classes.title} >  

                    <Box display={{ xs: 'none', md: 'block' }} m={1}>
                          
                        {MENU.map( itm=>(<Link to={itm.linkto} key={itm.linkto} className={classes.menuBtnAnchor}>
                                                <Button startIcon={ itm.Icon? <itm.Icon/> : <></>} 
                                                        className={classes.menuBtn + (itm.ename?" "+classes.statsBtn:"")} 
                                                         
                                                        >{itm.lbl}</Button>
                                        </Link>)  )}
                        
                    </Box> 
                </div>

                <SessionMenu/>
            </Toolbar>
        </AppBar>
      </HideOnScroll>
    </div>
  );
}


const LoadingSessionIndicator = ({ children }) => {
    const session = useGetSession();

    return session.loadingSession? children : "";
}