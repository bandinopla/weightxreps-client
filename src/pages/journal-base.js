import { Button, Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
//import JRange from '../componentes/journal/jrange';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';
import { lazy, Suspense, useRef } from 'react';
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { RedGuyBanner, SideBanners } from '../banners/SideBanners';
import Calendario from "../componentes/calendario";
import CalendarioZoomSlider from '../componentes/calendario-zoom-slider';
import { FollowButton } from '../componentes/follow-button';
import AlsoPosted from '../componentes/journal/AlsoPosted';
import { ExercisesModal, openExercisesModal } from '../componentes/journal/exercises';

import JRange from '../componentes/journal/jrange';
import { PRsHistoryHeader, PRsHistoryTable } from '../componentes/journal/prs-history';
import UCard from "../componentes/ucard";
import WeightValue from '../componentes/weight-value';
import { parseError } from '../data/db';
import { useGetUserInfoQuery } from '../data/generated---db-types-and-hooks';
import { OpenDMButton } from '../session/ui/dms-window/dm-window';
import { todayAsYMD } from '../utils/utils';

import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import { JOwnerContext } from './journal-context';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

//import { PRsHistoryTable } from '../componentes/journal/prs-history'; 
//const JRange        = lazy(()=>import("../componentes/journal/jrange"));
//const PRsHistory    = lazy(()=>import("../componentes/journal/prs-history"));
//const StatsModule = lazy(()=>import("../componentes/journal/stats-modules"));  

const JDay        = lazy(()=>import(/* webpackChunkName: "jday" */"../componentes/journal/jday-lazy"));
const AchievementsPage = lazy(()=>import("../achievements/page"));
 
 
 
const TODAY_AS_YMD      = todayAsYMD();
const YMD_PATH_MATCHER  = "/:ymd(\\d{4}-\\d{2}-\\d{2})";
const RANGE_MATCHER     = ":range(:\\d{1,2})";

export default function({ match:{  path, url, params:{ uname } } }) {
 
    const { data, loading, error }      = useGetUserInfoQuery({ variables: { userInfoUname:uname } }) ;//, { variables:{ uname } }
    let history                         = useHistory();    
    //const onClickOnDay                  = ymd => history.push( url+"/"+ ymd.toString().replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3") );
    const onClickOnRange                = (ymd, range) => history.push(`${url}/${ymd}${range>0?":"+range:""}`);
    const containerDivRef               = useRef();

    const gotoYMD = onClickOnRange;
     


    if( loading ) 
        return <LinearProgress />;

    if( error )
    { 
        return <Container maxWidth="lg">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Alert severity="warning">{ parseError(error) }</Alert>
                        </Grid>
                    </Grid>
                </Container>;
    } 


    const uinfo         = data?.userInfo; 

    const estimate1RM   = (w, r)=>{
        const factor    = uinfo.user.est1RMFactor;
        return eval( uinfo.user.estimate1RMFormula );
    };

    const extraRows     = [["Days Logged", uinfo.daysLogged]];

    if( uinfo.user.private ) {
        extraRows.push(["Visibility","Private"])
    }
  
     
    return (
            <JOwnerContext.Provider value={{ ...uinfo.user, gotoYMD, estimate1RM }}>
 
                <Container maxWidth="lg" ref={containerDivRef}> 

                    
                
                    <ExercisesModal/>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            
                        

                            {/*=== HEADER ===*/}
                            <Grid container spacing={2} alignItems="stretch" style={{marginBottom:20}}>
                                <Grid item xs={12} sm={4}>
                                    <Box marginBottom={3} > 
                             
                                        <UCard data={{user:uinfo.user}} injournal extraRows={ extraRows } noClickable>
                                            <Best3Lifts data={uinfo.best3} usekg={uinfo.user.usekg}/>
                                            
                                            <Switch>

                                                <Route path={`${path}/achievements`} render={()=>{}}/>
                                                <Route>
                                                    <div style={{marginTop:10}}>
                                                        <Button onClick={()=>history.push(`${url}/achievements`)} startIcon={<AccessTimeIcon/>} variant="contained" color="primary" fullWidth>Achievements</Button>
                                                    </div>
                                                </Route>

                                            </Switch>
                                            
                                        </UCard>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={8}> 

                                    <Box textAlign="right" marginBottom={1}>
                                     
                                            <OpenDMButton otherUser={uinfo.user} style={{marginRight:22}}/>
                                            <Button startIcon={<FitnessCenterIcon/>} onClick={()=>openExercisesModal(0)} variant="outlined" style={{marginRight:22}}>Exercises</Button>
                                            <FollowButton/> 
                                    </Box>

                                    <Suspense fallback={<div>Loading stats...</div>}>
                                    <Switch> 
                                        <Route path={path+YMD_PATH_MATCHER+RANGE_MATCHER+"?"} render={ ({match:{params}, location})=>(<>
                                                <Calendario ymd={params.ymd} rangeHighlight={ params.range?.substr(1) } />
                                                <Box paddingLeft="10%"> 
                                                    <CalendarioZoomSlider currentSelection={Number(params.range?.substr(1) || 0)} onSelect={ v=>onClickOnRange( params.ymd, v) } />
                                                </Box>
                                            </>)}/> 

                                        <Route path={`${path}/personal-records--:eid(\\d+)`} component={PRsHistoryHeader}/>
                                        <Route path={`${path}/achievements`} render={()=><Paper elevation={3} style={{padding:20, border:"1px dotted #333"}}>
                                            <Typography variant="h3" style={{textTransform:"capitalize"}} gutterBottom><AccessTimeIcon/> Achievements</Typography>
                                            <Typography variant='subtitle1'>
                                                Based on the training logged, here lays a collection of badges earned after achieving a particular level or goal.
                                                <br/><br/>These achievements are <strong>temporary</strong> and <strong>you must HOLD them to keep them</strong>. Just like real fitness!
                                                <br/><br/>Click on them to see their details and how to get them.
                                            </Typography>
                                        </Paper>}/> 
                                    </Switch>
                                    </Suspense>

                                    {/*<Calendario date={currentDate} onClick={ onClickOnDay } />*/}
                                </Grid>
                            </Grid> 

                            {/*=== CONTENTS START... ===*/} 
 
                                <Suspense fallback={<div>Loading stats...</div>}>
                                <Switch> 
                                        <Route path={`${path}/personal-records--:eid(\\d+)`} component={PRsHistoryTable} /> 
                                        <Route path={`${path}/achievements`} component={AchievementsPage}/> 
                                
                                        <Route path={path+YMD_PATH_MATCHER+RANGE_MATCHER} component={JRange}/> 

                                        {/* <Route path={path+YMD_PATH_MATCHER} render={ props=> <JDay uname={uname} ymd={props.match.params.ymd} /> }  />   */}
                                        <Route path={path+YMD_PATH_MATCHER} component={JDay}/> 

                                        <Route> 
                                            <Redirect to={ url+"/"+TODAY_AS_YMD } />
                                        </Route> 
                                
                                </Switch>  
                                </Suspense>
                            
                        </Grid>

                        {/* === SIDE BAR === */}
                        <Grid item xs={12} md={4}  >

                            <Paper style={{width:300, padding:10, marginBottom:6}}>
                                <RedGuyBanner variant='random'/>
                            </Paper>

                            <SideBanners/>
                            <Hidden smDown>
                                
                                <Switch>

                                    <Route path={path+YMD_PATH_MATCHER+RANGE_MATCHER+"?"} render={ props=>(
                                        <AlsoPosted ymd={props.match.params.ymd} />) }  />  
                                
                                </Switch>

                            </Hidden>
                        </Grid>
                    </Grid>

                </Container>
            </JOwnerContext.Provider>
        );
};

const Best3Lifts = ({ data, usekg }) =>{ 

    if( data.length==0 ) {
        return "";
    }

    let colsSpan = [12,6,4][ data.length-1 ];

    return <Grid container style={{marginTop:10}} alignItems="flex-end">
                {data.map( (itm,i)=>(<Grid key={i} item xs={colsSpan} style={{textAlign:"center"}}>
                        <Typography variant="subtitle1" noWrap>
                            <strong><WeightValue value={itm.w} inkg={usekg}/></strong>
                        </Typography>
                        <Tooltip title={itm.e.name}>
                            <Typography variant="body1">{ itm.e.type.toUpperCase() }</Typography>
                        </Tooltip>
                    </Grid>))} 
            </Grid>
};