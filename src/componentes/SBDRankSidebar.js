import { SoftBox } from "./SoftBox"
import { LiftScore, LinearQualificationBar, SBDCOLORS } from "../pages/SBDStatsPage"
import { useGetSession } from "../session/session-handler"
import { useGetJRangeLazyQuery } from "../data/generated---db-types-and-hooks"
import { useEffect, useState } from "react"
import { dateToYMD, ymd2date } from "../utils/utils"
import { Box, LinearProgress, Typography } from "@material-ui/core"
import Chip from '@material-ui/core/Chip';
import WeightValue from "./weight-value"
import { Alert } from "@material-ui/lab"
import { useSBDStatsLazyHook } from "../data/sbd-stats-hooks"

export default function SBDRankSidebar(){
    return <>
        <SBDUserPlacing/>
    </>
}

const SBD = ["SQ","BP","DL"];

const SBDUserPlacing = ()=>{ 

    const [loadSDB, { data:sbdData, loading:loadingSBD, error:sbdError, calculate1RM }] = useSBDStatsLazyHook();

    const user = useGetSession();
    const [ getData, { loading, data, error }] = useGetJRangeLazyQuery();
    const [lifts, setLifts] = useState();
    const WEEKS = 6;


    // data trigger
    useEffect(()=>{

        if( user.session )
        {
            getData({
                variables: {
                    ymd: dateToYMD(new Date()),
                    range:WEEKS, //weeks...
                    uid:user.session.user.id
                }
            });

            loadSDB();
        }

    },[ user.session ]); 

    //calculation trigger
    useEffect(()=>{

        if( data?.jrange && sbdData?.sbdStats )
        { 
            //
            // get all bodyweights (which are automatic custom user tags)
            //
            let bw = data?.jrange.utags?.values .filter( utag=>utag.tagid=="bw" )
                                                .map( tag=>({ ...tag, 
                                                                bw          :parseInt(tag.value)/1000, 
                                                                ymdAsDate   :ymd2date(tag.ymd) 
                                                            }) 
                                                    );

            //
            // add the date in which that set was done to each set. 
            //
            const erows = data.jrange.days.flatMap( d=>d.did.map(e=>({
                ...e,
                ymd         : d.on,
                ymdAsDate   : ymd2date(d.on)
            })) );
 

            // first filter by gender
            //const wclasses = sbdData.sbdStats.perclass .filter( wclass=> Number(!wclass.wclass.male) == Math.max(0,user.session.user.isf) );

            setLifts( SBD.flatMap( (type, typeIndex) => 

                                    //
                                    // for each exercise of this type
                                    //
                                    data?.jrange.exercises.filter(e=>e.type==type) 
                                      .map( e=>({ 
                                        ...e,

                                        // find the BEST set done (heaviest weight used OR heavyest 1RM generated from it)
                                        bestLift: erows .filter(r=>r.eid==e.id)
                                                        .flatMap(r=>r.sets.filter(s=>s.r>0 && s.r<11).map(s=>({
                                                            ...s, 
                                                            ymd         : r.ymd, 
                                                            ymdAsDate   : r.ymdAsDate,
                                                            maxWeight   : s.r>1? calculate1RM(s.w, s.r) : s.w //unnecesary since est1rm is always the heavyest but just in case... >_>
                                                        })))
                                                        
                                                        .reduce((setA, setB)=>setA.maxWeight > setB.maxWeight ? setA : setB)
                                      }))

                                      //
                                      // calculat score of each exercise's best lift
                                      //
                                      .map( e=>{
                                        
                                                // calculate bw up to this date...
                                                const knownBW   = bw?.reduce( (v, tag, i)=>i==0 || tag.ymdAsDate<=e.bestLift.ymdAsDate? tag.bw : v , 0 ); 
                                                const classes   = sbdData.filterWeightClasses(knownBW, Math.max(0,user.session.user.isf));
                                                const score     = sbdData.getScoreFor(classes, typeIndex, e.bestLift.maxWeight); 
                                                return {
                                                    ...e 
                                                    , score  
                                                    , bw            : knownBW 
                                                    , weightClass   : knownBW>0? classes[0].wclass : null 
                                                };
                                        }) 
                            
             ) ); 
        }

    }, [data, sbdData]);

    if(!user.session && !user.loadingSession)
    {
        return "";
    } 
 
    return <SoftBox title="Your Score">
        { (user.loadingSession || loading || !sbdData) && <LinearProgress/>}


        { lifts?.length>0? <Typography gutterBottom>Based on your logs from the past <strong>{WEEKS} weeks</strong></Typography>
            : loading? "" : <Alert severity="info">You haven't done any "official" exercise in the past <strong>{WEEKS} weeks</strong> (only sets between 1 and 10 reps are valid)</Alert>}

        { lifts?.map( lift=>{
            
            const scorePercent = lift.score.bestThan / lift.score.total;

            return (<div key={lift.id}>
                <div className="oneline">
                    <Chip label={lift.type}/> <a href={`/journal/${user.session.user.uname}/${lift.bestLift.ymd}`}>{lift.name}</a>
                </div>
                <LinearQualificationBar value={scorePercent} color={SBDCOLORS[ SBD.indexOf(lift.type) ]}/> 
                <Box padding={1}>
                    
                    <WeightValue value={lift.bestLift.w} inkg={lift.bestLift.lb==0}/>{lift.bestLift.r>1? " x "+ lift.bestLift.r : ""} 
                    {lift.bw?<> @ <WeightValue value={lift.bw} inkg={user.session.user.usekg}/> </> : "( any weight class )"}
        

                    <Typography variant="subtitle2" className="oneline">
                        <LiftScore value={scorePercent} justVerb/>
                        <Chip size="small" variant="outlined" label={ (user.session.user.isf==1?"F":"M")+" | "+(lift.weightClass? lift.weightClass.name: " - (any)") }/>
                        </Typography> 
                    
                </Box> 
                </div>)})}

    </SoftBox>
}