import { Box, Button, ButtonGroup, makeStyles, Paper, Typography } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from "react-dom";
import { SizeMe } from 'react-sizeme';
import FetchMoreButton from '../componentes/FetchMoreButton';
import UCard, { UcardErow } from "../componentes/ucard";
import { parseError } from '../data/db';
import { useGetActiveSupportersQuery, useGetFeedQuery } from "../data/generated---db-types-and-hooks";
import PageLoadError from './PageLoadError';
import { useHistory } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SignalWifi1BarIcon from '@material-ui/icons/SignalWifi1Bar';
import UnameTag from "../componentes/uname"; 
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { useGetSession } from '../session/session-handler';
import { SupportersDisplay } from '../componentes/supporters-display';
import { RestoreScroll } from '../componentes/scroll-restoration';
import { BlankLogText } from '../utils/blankLogText';
//import OlympicsVisor from '../olympics/olympics';


const $holder = document.createElement('div');
var $homeScrollPos;

export default function Home({ activator }) { 
    const ref = useRef();

    useLayoutEffect(()=>{

        if( activator )
        {
            ref.current?.appendChild($holder);

            if( $homeScrollPos )
            {
                //setTimeout( ()=>{
      
                    window.scrollTo(0, $homeScrollPos); 
                    
                //},100);
            }
        } 

        return ()=>{
            if( activator )
            {
                $homeScrollPos      = window.scrollY; 
                ref.current?.removeChild($holder);
                
            }  
        }

    },[]);

    if( activator )
    { 
        return <div ref={ref}></div>;
    }

    return createPortal(
        <ActivityFeed type="global"/> ,
        $holder
      );
}
  


/**
 * Muestra UCards organizados en columnas dependientes del screen width
 */
export const ActivityFeed = function({ type }) {
     
    const { data, loading, error, refetch, networkStatus, fetchMore } = useGetFeedQuery({variables:{ type }});
    const history = useHistory(); 

     
    /**
     * Cargar items más antiguos
     * @returns {Promise}
     */
    const loadMoreItems = ()=>{    
        
        let olderThan = data.getActivityFeed.slice(-1)[0].when ;  
         
        return fetchMore({ 
            variables   : { type, olderThan }  
        }) 
        .then( res=>{

            return res.data.getActivityFeed.slice(-1)[0]?.itemsLeftAfterThis>0  ;
        })
        ;   
    };

    /**
     * Cargar items más nuevos
     * @returns {Promise}
     */
    const fetchNewData = ()=> {
        let newerThan = data?.getActivityFeed[0]?.when ;   

        if( !newerThan ) { 
            return new Promise( (resolve)=>resolve([]) );
        }
         
        return fetchMore({ 
            variables   : { type, newerThan }  
        }) ;  
    }
 
  
    if( error ){
        return <PageLoadError errorMessage={parseError(error)} retry={refetch}/>
    } 

    var W = 206; 
    // crear un div por cada item....


 
    return <div>   
                {/* <OlympicsVisor/> */}
                <SupportersDisplay/>
                { loading && <LinearProgress /> }
                { data?.getActivityFeed && <KeepFeedUpdated loadMoreTrigger={ ()=>fetchNewData() } intervalInSeconds={60} />}
                { data?.getActivityFeed.length>0 
                    && <div>
  
                            {/* <ActivityFeedTabs current={type}/> */}
                            
                            <SizeMe>{({ size }) => { 

                                var totalCols   = Math.min( data.getActivityFeed.length, Math.floor( size.width / W ) );
                                var cols        = new Array( totalCols || 1 ); //array de nulls...

                                //
                                // repartir los items por las columnas disponibles...
                                //
                                data.getActivityFeed.forEach( (itm,i) => {

                                    var col = cols[ i%totalCols ] || [];

                                    col.push(itm);

                                    cols[ i%totalCols ] = col;
                                });



                                return <div><div style={{ paddingLeft:(size.width-totalCols*W)/2, overflow:"hidden"  }}>

                                            
                                            {   //
                                                // por cada column holder...
                                                //
                                                cols.map( (col, col_i) => (<div key={col_i} style={{width:W, float:"left"}}> {
                                            
                                                                        //
                                                                        // agregar cada item de esa columna
                                                                        //
                                                                        col.map( itm=>( <div key={itm.user.id} style={{ width:"100%" }}> 
                                                                        
                                                                                {/*
                                                                                <UCard url={`/journal/${itm.user.uname}/${itm.posted}`} data={itm}>
                                                                                  
                                                                                    { itm.workoutPreview && itm.workoutPreview.map( w=>(<UcardErow key={w.e.id} type={w.e.type} ename={w.e.name} weight={w.w} reps={w.r} />) )  }
                                                                                    { itm.andXmore && <Box marginBottom={-2} textAlign="right"><Typography variant="subtitle2">... and <b>{itm.andXmore}</b> more.</Typography></Box>}
                                                                                     
                                                                                </UCard>  */}
                                                                                <UCardMemo {...itm}/>
                                                                                
                                                                                </div> ))
                                                
                                                                } </div>) ) }

                                                                
                                            </div>

                                        </div>
                                        ;

                            } }</SizeMe> 

                            <Box textAlign="center" margin={1}>  
                                <FetchMoreButton fetchMore={loadMoreItems}/> 
                            </Box>

                            <RestoreScroll/>
                        </div>
                }

                { data?.getActivityFeed.length==0 && type=="following" && <Box padding={8} textAlign="center">

                        <SignalWifi1BarIcon fontSize="large"/>
                        <Typography variant="h6" gutterBottom>You are not following anyone yet...</Typography>
                        <Typography variant="subtitle2">When you do, here you will see only the people you follow.</Typography>
                        <br/>
                        <br/>
                        <Button variant="outlined" onClick={ ()=>history.push("/explore") } startIcon={<ArrowBackIcon/>}>Explore the journals</Button>
                        </Box> }
                     
                     
            </div>;
};

const UCardMemo = React.memo( (itm)=>{

    const extras = itm.user.private? [] : [["Posted",itm.posted]];
    return <UCard noClickable={itm.user.private} ymd={itm.posted} extraRows={extras} data={itm}>
                                                                          
                { itm.workoutPreview && itm.workoutPreview.map( w=>(<UcardErow key={w.e.id} type={w.e.type} ename={w.e.name} weight={w.w} reps={w.r} />) )  }
                { !itm.user.private && !itm.workoutPreview?.length>0 && !itm.text?.length>0 && <Paper elevation={2}><Box padding={1}><Typography variant='caption'><BlankLogText/></Typography></Box></Paper> }
                { itm.andXmore && <Box marginBottom={-2} textAlign="right"><Typography variant="subtitle2">... and <b>{itm.andXmore}</b> more.</Typography></Box>}
                
            </UCard>
} );
   


/**
 * @typedef {Object} KeepFeedUpdatedParams 
 * @property {()=>Promise} loadMoreTrigger
 * @property { Number} intervalInSeconds
*/

/** 
 * @param {...KeepFeedUpdatedParams} props 
 * @returns 
 */
const KeepFeedUpdated = ({ dummy, loadMoreTrigger, intervalInSeconds })=> {

    useEffect( ()=>{

        var interval;

        const startTimeout = ()=>{
            interval = setTimeout( ()=>{

                //cargar....
                loadMoreTrigger()
                    .catch( e=>console.log ) // ignore errors....
                    .finally( startTimeout ); //LOOP...

            }, intervalInSeconds*1000);
        }

        //iniciar el timeout...
        startTimeout();

        return ()=>clearInterval(interval);

    } );

    //useEffect( ()=>console.log("MOUNTED!!"),[]);

    return "";
}
 
 

const ActivityFeedTabs = ({ current }) => {
    // global o following
    const { session } = useGetSession();
    let history = useHistory();

    const isA = current=="global";
    const variant = isA? "contained" : "outlined";
    const color = isA? "primary" : "default";
    const icon = isA? <ArrowDownwardIcon/> : null;


    //session.user.id
    if( !session?.user?.id) {
        return "..."
    }

    return  <div style={{margin:10, marginBottom:50, textAlign:"center"}}><ButtonGroup size="large">
                     <Button onClick={()=>!isA && history.push("/")} variant={isA? "contained" : "outlined"} color={ isA? "primary" : "default"} startIcon={isA? <ArrowDownwardIcon/> : null}>Everyone</Button>
                     <Button onClick={()=>isA && history.push("/following")} variant={!isA? "contained" : "outlined"} color={ !isA? "primary" : "default"} startIcon={!isA? <ArrowDownwardIcon/> : null}>Following</Button>
                     
                    </ButtonGroup></div>; 
}
 