import { Box, Button, ButtonGroup, Grid, LinearProgress, Link, Typography, makeStyles } from "@material-ui/core"
import { useGetCommunityStatsLazyQuery, useGetOfficialExercisesQuery } from "../data/generated---db-types-and-hooks";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { _volumeRenderer } from "./community-stats-renderer";
import WeightValue from "./weight-value";
import UnameTag from "./uname"; 
import Barra from "./barras";
import { Alert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import { SoftBoxTabs } from "./SoftBox";

import "../pages/CommunityStats.css";

export const ComunityStatsTopLiftersWidget = ()=>{
 
    const ref = useRef(); 
    const history = useHistory();

    const { data:official, loading:loadingOfficial, error:errorOfficial }       = useGetOfficialExercisesQuery();
    const [getStats, { data, loading, error, refetch, called }]                 = useGetCommunityStatsLazyQuery({
        notifyOnNetworkStatusChange:true
    }); 
    const [selected, setSelected] = useState(0);
    const aspects = [
        {
            title:"Heavyest", arr:data?.communityStats.heavyest, tag:"HEAVYEST"
        },
        {
            title:"Best Estimated 1RM", arr:data?.communityStats.estimated, tag:"BESTESTIMATED1RM"
        },
        {
            title:"Most Volume", arr:data?.communityStats.volume, tag:"MOSTCOLUME"
        }
    ]

    useEffect(()=>{

        if(!official) return;

        getStats({
            variables: {
                etype:official.officialExercises[selected].id
            }
        });

    },[official, selected]);

    // useLayoutEffect(()=>{

    //     setTimeout(()=> stickyContext.update(), 0)
    //     ;

    // },[data]);


    if( loadingOfficial || loading )
        return <LinearProgress/>;

    if( errorOfficial || error )
    {
        return <Alert severity="error">Oops! Something went wrong!</Alert>
    }

    return <div ref={ref}> 
            
            <SoftBoxTabs labels={ official.officialExercises.slice(0,4).map(e=>e.id) } 
                         selected={selected} 
                         onSelected={setSelected}/> 

            { data && <Box marginTop={1}>
                <Typography variant="h4" gutterBottom={true}>{data.communityStats.title}</Typography>
                { aspects.map( (aspect, i)=>(<div key={aspect.title}>
                    <div className={aspect.tag+" sha"} /> 
                    { aspect.arr.slice(0,3).map((itm,i)=>(<AspectEntry key={i} data={itm} pos={i+1}/>)) }
                    <Box marginBottom={4}>
                        <Button onClick={()=>history.push(`/community-stats/both--${ official.officialExercises[selected].id}`)}>[...] See more</Button>
                    </Box>
                    </div>) )} 
            </Box>}
    </div>;
}



const useStyles = makeStyles( theme=>({
    root: {
        margin:"10px 0", 
        padding:"5px 0",
        position:"relative",
        "& + div":{
            borderTop:"1px dashed #444"
        }
    },
    num: {
        fontSize:"1.3em"
    },
    w: {
        textAlign:"center"
    },
    pos : {
        position:"absolute",
        top:0,
        left:-25,
        background: "white",
        color:"#000",
        padding:"2px 5px",
        borderRadius:20
    },
    pos1: {

    }
}));

const AspectEntry = ({ data, pos, ...props })=>{
    const classes = useStyles();
    const history = useHistory();

    const w         = data.w.v; //item.originalw?.v || item.w.v;
    const xBW       = data.bw.v? (w/data.bw.v) : 0;


        return <Grid container className={classes.root} >

            <Grid item xs={12}>
                <div className={classes.pos+" "+( [ "", "", "" ][pos-1] ) }>{pos}</div><UnameTag {...data.by} style={{ marginBottom:5 }}/>
            </Grid>

            {
                data.__typename=="MostVolume" ?
                <><Grid item xs={6} className={classes.num}>
                        <strong><WeightValue round value={data.w.v} inkg={!data.w.lb}/></strong>
                    </Grid>
                    <Grid item xs={6} className={classes.num}>
                        in <strong>{data.totalReps}</strong> reps
                    </Grid>
                     </>
                :
                <>
                <Grid item xs={6}>
                    <Barra weight={w} reps={!data.originalw? data.reps : null }/>   
                </Grid>
                <Grid item xs={6} className={classes.num+" "+classes.w}>
                    <strong>{data.originalw?"~":""}<WeightValue round value={w} inkg={!data.w.lb}/></strong>
                </Grid>
                
                </>
                
            }
            <Grid item xs={12}>
                <Link href={`/journal/${data.by.uname}/${data.ymd ?? ""}`}>#{data.e.name}</Link>
                </Grid>
            
        </Grid> 


 
}