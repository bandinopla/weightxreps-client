import { useReactiveVar } from "@apollo/client"
import { SoftBox } from "./SoftBox"
import { $SBDStatsData, LiftScore, LinearQualificationBar, SBDCOLORS } from "../pages/SBDStatsPage"
import { useGetSession } from "../session/session-handler"
import { useGetJRangeLazyQuery } from "../data/generated---db-types-and-hooks"
import { useEffect, useState } from "react"
import { dateToYMD } from "../utils/utils"
import { Box, Grid, LinearProgress, Typography } from "@material-ui/core"
import Chip from '@material-ui/core/Chip';
import Barra from "./barras"
import WeightValue from "./weight-value"
import { Alert } from "@material-ui/lab"

export default function SBDRankSidebar(){
    return <>
        <SBDUserPlacing/>
    </>
}

const SBD = ["SQ","BP","DL"];

const SBDUserPlacing = ()=>{

    /**
     * @type {import("../data/generated---db-types-and-hooks").GetSbdStatsQuery}
     */
    const sbdData = useReactiveVar($SBDStatsData);
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
        }

    },[ user.session ]); 

    //calculation trigger
    useEffect(()=>{

        if( data?.jrange && sbdData?.sbdStats )
        { 
            let bw = data?.jrange.utags?.values?.findLast(utag=>utag.tagid=="bw")?.value; // most recent bodyweight

            if( bw )
            {
                bw = parseInt(bw) / 1000; // it is in KG by default
            }

            const erows = data.jrange.days.flatMap( d=>d.did.map(e=>({...e,ymd:d.on})) );

            //
            // relevant weight classes only. Same gender and, if available, same bodyweight class.
            //
            const wclasses = sbdData.sbdStats.perclass.filter( wclass=> ( Number(!wclass.wclass.male) == Math.max(0,user.session.user.isf)) 
                                                                                && 
                                                                                (!bw || (bw>wclass.wclass.min && bw<=wclass.wclass.max)) );

            
            setLifts( SBD.flatMap( (type, typeIndex) => {

                const totalLiftsOfType = wclasses.flatMap(w=>w.graph).reduce( (t,sbd)=>t+sbd[typeIndex], 0); 
           
                return data?.jrange.exercises.filter(e=>e.type==type) // for each exercise of this type
                                      .map( e=>({ // find the BEST set done (heaviest weight used OR heavyest 1RM generated from it)
                                        ...e,
                                        bestLift: erows .filter(r=>r.eid==e.id)
                                                        .flatMap(r=>r.sets.map(s=>({...s, ymd:r.ymd, maxWeight:Math.max(s.est1rm, s.w)})))
                                                        
                                                        .reduce((setA, setB)=>setA.maxWeight > setB.maxWeight ? setA : setB)
                                      }))
                                      .map( e=>({
                                        ...e, 
                                        score: wclasses.reduce((t, wclass)=>t + wclass.graph.reduce((t2, iLifts, i)=>t2+( e.bestLift.maxWeight>i*5? iLifts[typeIndex] : 0 ) ,0)
                                                                ,0) / totalLiftsOfType
                                      }))
                                    }
                            
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
            : <Alert severity="info">You haven't done any "official" exercise in the past <strong>{WEEKS} weeks</strong></Alert>}

        { lifts?.map( lift=>(<div key={lift.id}>
                <div className="oneline">
                    <Chip label={lift.type}/> <a href={`/journal/${user.session.user.uname}/${lift.bestLift.ymd}`}>{lift.name}</a>
                </div>
                <LinearQualificationBar value={lift.score} color={SBDCOLORS[ SBD.indexOf(lift.type) ]}/> 
                <Box padding={1} >
                    <Typography variant="subtitle2" style={{float:"right"}}><LiftScore value={lift.score} justVerb/></Typography> 
                    <WeightValue value={lift.bestLift.w} inkg={lift.bestLift.lb==0}/>{lift.bestLift.r>1? " x "+ lift.bestLift.r : ""}
                </Box> 
                </div>))}

    </SoftBox>
}