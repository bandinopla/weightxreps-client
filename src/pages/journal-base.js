import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
//import JRange from '../componentes/journal/jrange';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';
import { lazy, Suspense, useRef } from 'react';
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Calendario from "../componentes/calendario";
import CalendarioZoomSlider from '../componentes/calendario-zoom-slider';
import { FollowButton } from '../componentes/follow-button';

import JRange from '../componentes/journal/jrange';
import { PRsHistoryHeader, PRsHistoryTable } from '../componentes/journal/prs-history';
import UCard from "../componentes/ucard";
import WeightValue from '../componentes/weight-value';
import { parseError } from '../data/db';
import { useGetUserInfoQuery } from '../data/generated---db-types-and-hooks';
import { OpenDMButton } from '../session/ui/dms-window/dm-window';
import { todayAsYMD } from '../utils/utils'; 
import { JOwnerContext } from './journal-context';
import { YearOVerview } from '../componentes/year-overview';
import { MainBannerWrapper } from '../banners/MainBannerWrapper';
import AchievementsBadges from '../achievements/AchievementsBadges';

//import { PRsHistoryTable } from '../componentes/journal/prs-history'; 
//const JRange        = lazy(()=>import("../componentes/journal/jrange"));
//const PRsHistory    = lazy(()=>import("../componentes/journal/prs-history"));
//const StatsModule = lazy(()=>import("../componentes/journal/stats-modules"));  

const JDay        = lazy(()=>import(/* webpackChunkName: "jday" */"../componentes/journal/jday-lazy"));
 
 
 
 
const TODAY_AS_YMD              = todayAsYMD();
export const YMD_PATH_MATCHER   = "/:ymd(\\d{4}-\\d{2}-\\d{2})";
export const RANGE_MATCHER      = ":range(:\\d{1,2})";

export default function JournalBase({ match:{  path, url, params:{ uname } } }) {
 
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

    const extraRows     = [
        ["Days Logged", uinfo.daysLogged],
        //[ <Link to={`/forum/by--${uinfo.user.uname}`}>Forum posts</Link> , uinfo.forum?.posts ?? 0]
    ];

    // if( uinfo.forum?.role )
    // {
    //     extraRows.push([
    //         "Forum Role", <ForumRoleChip role={uinfo.forum.role.title}/>
    //     ]);
    // }

    if( uinfo.user.private ) {
        extraRows.push(["Visibility","Private"])
    }
  
     
    return (
            <JOwnerContext.Provider value={{ ...uinfo.user, gotoYMD, estimate1RM }}>
                <MainBannerWrapper></MainBannerWrapper> 
                <Container maxWidth="lg" ref={containerDivRef} style={{marginTop:20}}>  
                    

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            
                        

                            {/*=== HEADER ===*/}
                            <Grid container spacing={2} alignItems="stretch" style={{marginBottom:20}}>
                                
                                <Grid item xs={12} sm={4}>
                                    <Box marginBottom={3} > 
                             
                                        <UCard data={{user:uinfo.user}} injournal extraRows={ extraRows } noClickable>
                                            <Best3Lifts data={uinfo.best3} usekg={uinfo.user.usekg}/>
                                            
                                            <Switch>  
                                                <div style={{marginTop:10}}>
                                                    <Route path={path+YMD_PATH_MATCHER+RANGE_MATCHER+"?"} component={AchievementsBadges}/>  
                                                    <OpenDMButton otherUser={uinfo.user} style={{marginRight:22, marginTop:5}} fullWidth/>
                                                    <br/><br/><FollowButton/> 
                                                </div>  
                                            </Switch>
                                            
                                        </UCard>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={8}>  

                                    <Suspense fallback={<div>Loading stats...</div>}>
                                    <Switch> 
                                        <Route path={path+YMD_PATH_MATCHER+RANGE_MATCHER+"?"} render={ ({match:{params}, location})=>(<>
                                                <YearOVerview ymd={params.ymd} range={params.range?.substr(1)}/>
                                                <Calendario ymd={params.ymd} rangeHighlight={ params.range?.substr(1) } />
                                                <Box paddingLeft="10%"> 
                                                    <CalendarioZoomSlider currentSelection={Number(params.range?.substr(1) || 0)} onSelect={ v=>onClickOnRange( params.ymd, v) } />
                                                </Box>
                                            </>)}/> 

                                        <Route path={`${path}/personal-records--:eid(\\d+)`} component={PRsHistoryHeader}/>
                                         
                                    </Switch>
                                    </Suspense>

                                    {/*<Calendario date={currentDate} onClick={ onClickOnDay } />*/}
                                </Grid>
                            </Grid> 

                            {/*=== CONTENTS START... ===*/} 
 
                                <Suspense fallback={<div>Loading stats...</div>}>
                                <Switch> 
                                        <Route path={`${path}/personal-records--:eid(\\d+)`} component={PRsHistoryTable} />  
                                
                                        <Route path={path+YMD_PATH_MATCHER+RANGE_MATCHER} component={JRange}/> 

                                        {/* <Route path={path+YMD_PATH_MATCHER} render={ props=> <JDay uname={uname} ymd={props.match.params.ymd} /> }  />   */}
                                        <Route path={path+YMD_PATH_MATCHER} component={JDay}/> 

                                        <Route> 
                                            <Redirect to={ url+"/"+TODAY_AS_YMD } />
                                        </Route> 
                                
                                </Switch>  
                                </Suspense>
                            
                        </Grid>

                        
                    </Grid>

                </Container>
            </JOwnerContext.Provider>
        );
};

/* 
<Grid item xs={12} md={4}  >
<SideBanners/>
<Hidden smDown>
    
    <Switch>

        <Route path={path+YMD_PATH_MATCHER+RANGE_MATCHER+"?"} render={ props=>(
            <AlsoPosted ymd={props.match.params.ymd} />) }  />  
    
    </Switch>

</Hidden>
</Grid>
*/

export const Best3Lifts = ({ data, usekg }) =>{ 

    if( data.length==0 ) {
        return "";
    }

    let colsSpan = [12,6,4][ data.length-1 ];

    return <Grid container style={{marginTop:10}} alignItems="flex-end">
                {data.map( (itm,i)=>(<Grid key={i} item xs={colsSpan} style={{textAlign:"center"}}>
                        <Typography variant="subtitle1" noWrap>
                          <a href={`${itm.ymd}`} title={itm.e.name + " on "+ itm.ymd}><strong><WeightValue value={itm.w} inkg={usekg}/></strong></a>
                        </Typography>
                        <Tooltip title={itm.e.name}>
                            <Typography variant="body1">{ itm.e.type.toUpperCase() }</Typography>
                        </Tooltip>
                    </Grid>))} 
            </Grid>
};