import './App.css';
import { Box, LinearProgress, Typography } from '@material-ui/core';
import NavBar from "./componentes/NavBar";
import CssBaseline from '@material-ui/core/CssBaseline';

import { DBProvider } from "./data/db";

//pages
import Home, { ActivityFeed } from "./pages/Home";


import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { Suspense, lazy } from 'react';
import CommunityStats from './pages/CommunityStats';
//import { SettingsPage } from './pages/settings'; 
import { AboutPage } from './pages/AboutPage';
import { DonatePage } from './pages/DonatePage';
import { TrackPageView } from './componentes/google-tracker';
import { ThemeSwitcher } from './MainTheme';
import { GuestLandingPage } from './pages/guest/GuestLandingPage';
import { HelpPage } from './pages/HelpPage';
import metadata from "./version.json";
import TimeAgoDisplay from './componentes/TimeAgoDisplay';
import { DialogModalListener } from './componentes/Dialog';
import ChangelogPage from './pages/ChangelogPage';
import { GLobalNotificationSpace } from './componentes/GLobalNotification';
import { MainBanner } from './banners/SideBanners';
import VideosPage from './pages/Videos';
//import { SBDStatsPage } from './pages/SBDStatsPage';
 
//import JournalBase from "./pages/journal-base";



const JournalBase = lazy(() => import(/* webpackChunkName: "jbase" */'./pages/journal-base'));

const LoginPage =  lazy(() => import(/* webpackChunkName: "login-page" */'./pages/LoginPage'));
const SignupPage = lazy(() => import(/* webpackChunkName: "signup-page" */'./pages/SignupPage'));

const SBDStatsPage = lazy(() => import(/* webpackChunkName: "sbd-stats" */'./pages/SBDStatsPage'));
const SettingsPage = lazy(() => import(/* webpackChunkName: "settings" */'./pages/settings'));
//const FirebaseLoginPage = lazy(() => import(/* webpackChunkName: "login" */'./pages/FirebaseLoginPage'));



const TermsOfServicePage = lazy(() => import(/* webpackChunkName: "terms-of-service" */'./pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import(/* webpackChunkName: "terms-of-service" */'./pages/PrivacyPolicyPage'));


function App() {

   

  return (<>

    
    <ThemeSwitcher>
      <CssBaseline />
      <DBProvider>  
              <Router> 
                <NavBar /> 
                {/* <Toolbar />   */}
                {/* <div style={{height:100}}></div> */}
                <GLobalNotificationSpace />
                <Home/>
                <DialogModalListener/>
                <Route path="/" component={TrackPageView}/>
 
                <Suspense fallback={<LinearProgress />}>
                    <Switch>
                        {/* <Route path="/settings" children={()=><SettingsPage/>} /> */}
                        <Route path="/settings" component={SettingsPage} />

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
                        {/* <Route path="/sbd-stats" children={()=><SBDStatsPage/>} />   */}
                        <Route path="/sbd-stats" component={SBDStatsPage} />

                        <Route path="/following">
                            <MainBanner/>
                            <ActivityFeed type="following" />
                        </Route>
                        
                        <Route path="/">
                            <MainBanner/>
                            <GuestLandingPage/>
                            <Home activator/> 
                            {/* <Test/>  */}
                        </Route>
                    </Switch>
                </Suspense> 

               
            </Router>  

            <Box padding={1} paddingTop={5} textAlign="center" >
                    <Typography variant="caption">
                        <a href="/changelog"><strong>{ `v${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ` }</strong> (<TimeAgoDisplay time={metadata.when}/>)</a>
                        &nbsp;&nbsp;| <a href="/terms-of-service">Terms of Service</a> | <a href="/privacy-policy">Privacy Policy</a>
                    </Typography>
                </Box> 

           
        </DBProvider>
    </ThemeSwitcher>

 
    
  </>);
} 

export default App;
