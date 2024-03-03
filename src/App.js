import {fetch as fetchPolyfill} from 'whatwg-fetch' 

import './App.css'; 
import { Box, Drawer, LinearProgress, Typography, makeStyles, useMediaQuery, useTheme } from '@material-ui/core'; 
import CssBaseline from '@material-ui/core/CssBaseline';

import { DBProvider } from "./data/db";

//pages
import Home, { ActivityFeed } from "./pages/Home";


import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation
} from "react-router-dom";
import { Suspense, createContext, lazy, useLayoutEffect, useRef, useState } from 'react';

//import { SettingsPage } from './pages/settings'; 

import SettingsIcon from '@material-ui/icons/Settings';
import { TrackPageView } from './componentes/google-tracker';
import { ThemeSwitcher } from './MainTheme';
//import { GuestLandingPage } from './pages/guest/GuestLandingPage';
//import { HelpPage } from './pages/HelpPage';
import metadata from "./version.json";
import TimeAgoDisplay from './componentes/TimeAgoDisplay';
import { DialogModalListener } from './componentes/Dialog';
import ChangelogPage from './pages/ChangelogPage'; 
import { MainBanner } from './banners/SideBanners';
//import VideosPage from './pages/Videos';
import { JeditorSaveBackdrop } from './componentes/journal/editor-save-backdrop';
import UnsubFromEmails from './pages/Unsub-from-emails';
import { MainMenu, MainMenuDrawer } from './componentes/main-menu';
//import { SupportersDisplay } from './componentes/supporters-display';
import { HomeSidebar } from './componentes/HomeSidebar';
import { Sticky } from './componentes/sticky';
//import { SBDStatsPage } from './pages/SBDStatsPage';

//import JournalBase from "./pages/journal-base";

import { UserHome } from './pages/UserHome';
import { SessionHomeSidebar } from './componentes/SessionHomeSidebar';
import { DonationSoftbox } from './componentes/DonationSoftbox'; 
import { DMsWindow } from './session/ui/dms-window/dm-window';
import { ContentPage } from './componentes/ContentPageWrapper';
import ScheduleRoundedIcon from '@material-ui/icons/ScheduleRounded';
import { ExercisesModal } from './componentes/journal/exercises';
import { FollowOnX } from './componentes/twitter';
import { ToogleSidebarMenu } from './componentes/toggle-side-menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Hidden from '@material-ui/core/Hidden'; 
import { VisualPreferencesSwitcher } from './componentes/VisualPreferencesSwitcher'; 

window.fetch = (url, config)=>{
    return fetchPolyfill(url, config)
}

const JournalBase = lazy(() => import(/* webpackChunkName: "jbase" */'./pages/journal-base'));
//const ColorThemePage = lazy(() => import(/* webpackChunkName: "color" */'./pages/ColorThemePage'));

//const LoginPage = lazy(() => import(/* webpackChunkName: "login-page" */'./pages/LoginPage'));
//const SignupPage = lazy(() => import(/* webpackChunkName: "signup-page" */'./pages/SignupPage'));

const SBDStatsPage = lazy(() => import(/* webpackChunkName: "sbd-stats" */'./pages/SBDStatsPage'));
const SettingsPage = lazy(() => import(/* webpackChunkName: "settings" */'./pages/settings'));
//const FirebaseLoginPage = lazy(() => import(/* webpackChunkName: "login" */'./pages/FirebaseLoginPage'));
const CommunityStats = lazy(()=>import(/* webpackChunkName: "community-stats" */"./pages/CommunityStats")) //import CommunityStats from './pages/CommunityStats';
const CommunityStatsSoftBox = lazy(()=>import(/* webpackChunkName: "community-stats" */"./componentes/CommunityStatsSoftBox")) //import CommunityStats from './pages/CommunityStats';


const TermsOfServicePage = lazy(() => import(/* webpackChunkName: "terms-of-service" */'./pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import(/* webpackChunkName: "terms-of-service" */'./pages/PrivacyPolicyPage'));
const SBDRankSidebar = lazy(()=>import(/*webpackChunkName: "sbd-stats" */"./componentes/SBDRankSidebar"))
const PageMessages = lazy(()=>import(/*webpackChunkName: "inbox" */"./session/ui/page-messages"))
const PageNotifications = lazy(()=>import(/*webpackChunkName: "inbox" */"./session/ui/page-notifications"))
 
const HelpPage = lazy(()=>import(/*webpackChunkName: "help" */"./pages/HelpPage"))
const DonatePage = lazy(()=>import(/*webpackChunkName: "donate" */"./pages/DonatePage")) 
const AboutPage = lazy(()=>import(/*webpackChunkName: "about" */"./pages/AboutPage"))  
const JournalSideBar = lazy(() => import(/* webpackChunkName: "jbase" */'./componentes/journal/side-bar.js'));
const VideosPage = lazy(() => import(/* webpackChunkName: "videos" */'./pages/Videos')); 

/**
 * Utility... creates a basic layout.
 */
const RoutePage = props =>  <Route path={props.path} render={ (routeProps)=><ContentPage Child={props.component} {...props} {...routeProps}/> } />;


const useStyles = makeStyles( theme=>({
    root: { 
            display:"block", 
     
    }, 

    // menubar: {
    //     width:80,
    //     position:"fixed",
    //     zIndex:1, 
    //     minHeight:"100vh",
    //     marginLeft:-80,
    //     transition:"margin-left .1s ease-out",
    //     display:"flex",
    //     justifyContent:"center",
    //     background:theme.palette.background.default,
    //     borderRight:"2px solid #333",

    //     "&.opened": {
    //         marginLeft:0
    //     },
    // },  

    // sidebar: {
    //     width:300, 
    //     position:"fixed",
    //     zIndex:1,
    //     top:0,
    //     right:0,
    //     marginRight:-300,
    //     minHeight:"100vh", 
    //     background:theme.palette.background.default,
    //     transition:"margin-right .1s ease-out",
    //     borderLeft:"2px solid #333",
    //     "&.opened": {
    //         marginRight:0
    //     },
    // },

    


    [ theme.breakpoints.up("lg") ]: {
        root: {
            display:"grid",
            gridTemplateColumns:"1fr 3fr 1fr"
        },
        // menubar: { 
        //     position:"relative", 
        //     width:"100%",
        //     marginLeft:0, 
        //     justifyContent:"end",
        //     borderRight:"none"
        // },
        // sidebar: {
        //     position:"relative",
        //     width:"100%",
        //     borderLeft:"none"
        // },
        content: {
            borderRight:"1px solid rgba(0,0,0,0.1)",
            borderLeft:"1px solid rgba(0,0,0,0.1)"
        },
        sidebarDrawer: {
            "& .MuiDrawer-paperAnchorRight": {
                right:"auto !important"
            },
            "& .MuiDrawer-paper": {
                border:"none !important",
                backgroundColor: theme.palette.background.default
            },
        },

    },
}));
 

function App() {

    const sidebarRef = useRef();
    const cls = useStyles();


    return (<> 

        <DBProvider>
            <ThemeSwitcher>
                <CssBaseline />
                <Router>
                <DialogModalListener/>
                <JeditorSaveBackdrop/>
                <DMsWindow/>
                <ExercisesModal/> 
                <TrackPageView/>

                {/* <Router> 
                <NavBar />  
                <GLobalNotificationSpace />
                <Home/>
                 
                
                <Route path="/" component={TrackPageView}/>
 
                <Suspense fallback={<LinearProgress />}>
                    <Switch> 
                        <Route path="/settings" component={SettingsPage} />
                        <Route path="/color" component={ColorThemePage} /> 
                        <Route path="/about" component={AboutPage}/> 
                         
                        <Route path="/videos" component={VideosPage}/> 
                        <Route path="/faq" component={HelpPage}/> 
                        <Route path="/terms-of-service" component={TermsOfServicePage}/> 
                        <Route path="/privacy-policy" component={PrivacyPolicyPage}/> 
                        <Route path="/donate" component={DonatePage}/> 
                        <Route path="/signup" component={SignupPage}/>
                        <Route path="/login" component={LoginPage}/>
                        <Route path="/community-stats/:filtermask([\w-]+)?" component={CommunityStats} />   
                        <Route path="/journal/:uname" component={JournalBase} />  
                        <Route path="/changelog" component={ChangelogPage} />   
                        <Route path="/sbd-stats" component={SBDStatsPage} />

                        <Route path="/following">
                            <MainBanner/>
                            <ActivityFeed type="following" />
                        </Route>
                        
                        <Route path="/">
                            <MainBanner/>
                            <GuestLandingPage/>
                            <Home activator/>  
                        </Route>
                    </Switch>
                </Suspense> 

               
            </Router>   

            */}
                <div className={ cls.root }>
                    <div className={ cls.menubar }>  
                            <MainMenuDrawer/>
                    </div>

                    <div className={ cls.content }> 
                        
                            {/* <Home /> */}
                            <Suspense fallback={<LinearProgress />}>
                                <Switch>
                                    <Route path="/" exact component={UserHome} />  
                                    <Route path="/community-stats/:filtermask([\w-]+)?" component={CommunityStats} />    
                                    <Route path="/explore">
                                        <MainBanner /> 
                                        {/* <Home activator /> */}
                                        <ActivityFeed type="global" />
                                    </Route>
                                    <Route path="/unsub" component={UnsubFromEmails}/> 
                                    <RoutePage path="/videos" component={VideosPage}/> 
                                    <RoutePage path="/sbd-stats" component={SBDStatsPage} />
                                    <Route path="/donate" component={DonatePage}/> 
                                    <Route path="/faq" component={HelpPage}/> 
                                    <Route path="/about" component={AboutPage}/> 
                                    <RoutePage path="/settings" sessionOnly  component={SettingsPage} Icon={SettingsIcon} title="Settings"/>
                                    <RoutePage path="/messages" sessionOnly component={PageMessages} />
                                    <RoutePage path="/notifications" sessionOnly component={PageNotifications} /> 
                                    <RoutePage path="/changelog" component={ChangelogPage} title="Changelog" Icon={ScheduleRoundedIcon}/>  
                                    <Route path="/journal/:uname" component={JournalBase} /> 
                                    {/* <RoutePage path="/color" sessionOnly component={ColorThemePage} title={false}/>  */}
                                    <Route path="/terms-of-service" component={TermsOfServicePage}/> 
                                    <Route path="/privacy-policy" component={PrivacyPolicyPage}/> 
                                </Switch>
                            </Suspense>
                        
                    </div>

                    <div className={ cls.sidebar } ref={sidebarRef}>  

                            <AppSideBar/>
  
                    </div>
                </div>

                </Router>
            </ThemeSwitcher>
        </DBProvider>




    </>);
}
 

const AppSideBar = ()=>{
    const cls               = useStyles();
    const [show, setShow]   = useState(false);
    const theme             = useTheme();
    const isSmallScreen     = useMediaQuery(theme.breakpoints.down('md'));
    const location          = useLocation();

    useLayoutEffect(()=>{
        setShow(false)
    },[location])

    const contents = <>
                            <Box margin={2} maxWidth={250}>

                                <Route path="/" component={VisualPreferencesSwitcher}/>
                                <Route path="/" component={DonationSoftbox}/>

                                <Suspense fallback={<LinearProgress />}>
                                <Switch>
                                    
                                    <Route path="/explore" component={HomeSidebar}/> 
                                    <Route path="/" exact component={SessionHomeSidebar}/> 
                                    <Route path="/community-stats/:filtermask([\w-]+)?" component={CommunityStatsSoftBox} />   
                                    <Route path="/sbd-stats" component={SBDRankSidebar} />
                                    <Route path="/sbd-stats" component={SBDRankSidebar} />
                                    <Route path="/journal/:uname" component={JournalSideBar} />

                                </Switch>
                                </Suspense>
                            </Box>

                            <Box padding={1} paddingTop={5} textAlign="center" maxWidth={250}>
                                <FollowOnX/>
                                <Typography variant="caption">
                                    <a href="/changelog"><strong>{`v${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} `}</strong> (<TimeAgoDisplay time={metadata.when} />)</a>
                                    &nbsp;&nbsp;| <a href="/terms-of-service">Terms</a> | <a href="/privacy-policy">Privacy</a>
                                </Typography>
                            </Box>
    </>

    if( isSmallScreen )
    {
        return <>
            <div className="sidebar-handle right">
                &lt;
            </div>
            <SwipeableDrawer
                anchor="right"
                open={show}
                onClose={()=>setShow(false)}
                onOpen={()=>setShow( true)}
                className={cls.sidebarDrawer}
            >
                {contents}
            </SwipeableDrawer></>
    }

    return <Drawer 
                variant="persistent"
                anchor="right"
                open={true} 
                className={cls.sidebarDrawer}
            >{contents}
            </Drawer> 
}

export default App;



