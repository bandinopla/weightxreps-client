//import { fetch as fetchPolyfill } from 'whatwg-fetch';

import './App.css';
import { Box, Drawer, LinearProgress, Typography, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import { DBProvider } from "./data/db";

//pages
import { ActivityFeed } from "./pages/Home";


import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation
} from "react-router-dom";
import { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react';

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
import { MainMenuDrawer } from './componentes/main-menu';
//import { SupportersDisplay } from './componentes/supporters-display';
import { HomeSidebar } from './componentes/HomeSidebar';
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
import { VisualPreferencesSwitcher } from './componentes/VisualPreferencesSwitcher';
import { SwipeableDrawer } from './componentes/SwipableDrawer';
import { ServiceWorkerStatusDisplay } from './componentes/service-worker-status-ui';
import GitHubButton from 'react-github-btn'
import OAuthAuthorizationPage from './oauh/OAuthAuthorizationPage';
import { Snowfall } from './componentes/snow';
import { SearchBox } from './componentes/SearchBox';
import { SideVideoBanner } from './componentes/SideVideoBanner';

// window.fetch = (url, config)=>{
//     return fetchPolyfill(url, config)
// }

const JournalBase = lazy(() => import(/* webpackChunkName: "jbase" */'./pages/journal-base'));
//const ColorThemePage = lazy(() => import(/* webpackChunkName: "color" */'./pages/ColorThemePage'));

//const LoginPage = lazy(() => import(/* webpackChunkName: "login-page" */'./pages/LoginPage'));
//const SignupPage = lazy(() => import(/* webpackChunkName: "signup-page" */'./pages/SignupPage'));

const LogWorkoutPage = lazy(() => import(/* webpackChunkName: "log-workout" */'./pages/LogWorkoutPage'));
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
const PersonalRecordsPage = lazy(() => import(/* webpackChunkName: "personal-records" */'./pages/PersonalRecords'));
const ForumPage = lazy(() => import(/* webpackChunkName: "forum" */'./forum/index'));

/**
 * Utility... creates a basic layout.
 */
const RoutePage = props =>  <Route path={props.path} render={ (routeProps)=><ContentPage Child={props.component} {...props} {...routeProps}/> } />;


const useStyles = makeStyles( theme=>({
    root: { 
            display:"block", 
     
    },   


    [ theme.breakpoints.up("lg") ]: {
        root: {
            display:"grid",
            gridTemplateColumns:"1fr 3fr 1fr"
        }, 
        content: {
            borderRight:"1px solid rgba(0,0,0,0.1)",
            borderLeft:"1px solid rgba(0,0,0,0.1)",
            minHeight:"100vh"
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
                <Snowfall/>
 
                <Switch>
                    <Route path="/oauth" component={OAuthAuthorizationPage}/> 
                    <Route>

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
                                                    <SearchBox>
                                                        <ActivityFeed type="global" />
                                                    </SearchBox>
                                                </Route>
                                                <Route path="/unsub" component={UnsubFromEmails}/> 
                                                <RoutePage path="/videos" component={VideosPage}/> 
                                                <RoutePage path="/sbd-stats" component={SBDStatsPage} />
                                                <Route path="/log-workout" component={LogWorkoutPage} />
                                                <RoutePage path="/forum" component={ForumPage} />
                                                <Route path="/donate" component={DonatePage}/> 
                                                <Route path="/faq" component={HelpPage}/> 
                                                <Route path="/about" component={AboutPage}/> 
                                                <RoutePage path="/settings" sessionOnly  component={SettingsPage} Icon={SettingsIcon} title="Settings"/>
                                                <RoutePage path="/messages" sessionOnly component={PageMessages} />
                                                <RoutePage path="/notifications" sessionOnly component={PageNotifications} /> 
                                                <RoutePage path="/changelog" component={ChangelogPage} title="Changelog" Icon={ScheduleRoundedIcon}/>
                                                <Route path="/journal/:uname/personal-records--:eid(\d+)" component={PersonalRecordsPage}/>
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
                    </Route>
                </Switch>


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

                                <ServiceWorkerStatusDisplay/>
                                <Route path="/" component={VisualPreferencesSwitcher}/>
                                <Route path="/" component={DonationSoftbox}/>
                                <SideVideoBanner/>

                                <Suspense fallback={<LinearProgress />}>
                                <Switch>
                                    
                                    <Route path="/explore" component={HomeSidebar}/> 
                                    <Route path="/" exact component={SessionHomeSidebar}/> 
                                    <Route path="/community-stats/:filtermask([\w-]+)?" component={CommunityStatsSoftBox} />   
                                    <Route path="/sbd-stats" component={SBDRankSidebar} />
                                    <Route path="/journal/:uname" component={JournalSideBar} />

                                </Switch>
                                </Suspense>
                            </Box>

                            <Box padding={1} paddingTop={5} textAlign="center" maxWidth={250}>

                                <div style={{ display:"flex", justifyContent:"center"}}>
                                    <FollowOnX/> &nbsp;
                                    <GitHubButton href="https://github.com/bandinopla/weightxreps-client" data-color-scheme="no-preference: light; light: light; dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star bandinopla/weightxreps-client on GitHub">Star</GitHubButton>
                                </div>
                                <Typography variant="caption">
                                    <a href="/changelog"><strong>{`v${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} `}</strong> (<TimeAgoDisplay time={metadata.when} />)</a>
                                    &nbsp;&nbsp;| <a href="/terms-of-service">Terms</a> | <a href="/privacy-policy">Privacy</a>
                                </Typography>
                            </Box>
    </>

    if( isSmallScreen )
    {
        return <> 
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



