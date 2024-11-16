 
import { useEffect, useMemo, useState } from "react";
import { useGetJRangeLazyQuery } from "../data/generated---db-types-and-hooks";
import { SoftBox, SoftBoxTabs, SoftSpace } from "./SoftBox" 
import { useGetSession } from "../session/session-handler";
import { dateToYMD } from "../utils/utils";
import { Box, Button, Grid, LinearProgress, Typography, makeStyles } from "@material-ui/core";
import WeightValue from "./weight-value";
import DateRangeIcon from '@material-ui/icons/DateRange';
import { Alert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";

const ranges = [
    { range:1 },
    { range:3 },
    { range:6 },
    { range:8 },
    { range:12 },
]

const $saturday = new Date(); $saturday.setDate( $saturday.getDate() + (6 - $saturday.getDay()) );  
const YMD = dateToYMD($saturday);

const useStyles = makeStyles( theme=>({
    from: { 
    },
    ename: {
        backgroundColor: theme.dataCell.background,
        color:theme.dataCell.color,
        borderRadius:3,
        padding:3,
        textOverflow:"ellipsis",
        whiteSpace:"nowrap",
        overflow:"hidden", 
    },
    etype: { 
        color: theme.palette.primary.main,
        position:"absolute",
        left:-20,
        padding:3,
        borderRadius:5
    }
}));

export const QuickRangeOverview = ()=>{

    const [ getData, { loading, data, error }] = useGetJRangeLazyQuery();
    const [ range, setRange] = useState(1);
    const user              = useGetSession();
    const classes           = useStyles();
    const history           = useHistory(); 

    const overview = useMemo(()=>
    {
        if(!data?.jrange) return;

        const officials = data.jrange.exercises.filter(e=>e.type);
        // max days volume reps

        return officials.map( ex=>{

            let days = 0;
            const erows = data.jrange.days.reduce( 
                            (erows, day)=> { Array.prototype.push.apply(erows, 
 
                                    day.did.filter(d=>{
                                        if( d.eid==ex.id )
                                        {
                                            days++;
                                            return true;
                                        }
                                    }) 
                                            .flatMap(d=>d.sets));
                                            return erows;
                                }
                            ,[] );

            return {
                exercise:ex,
                max: erows.reduce((row1, row2)=>row1.w>row2.w?row1:row2),
                days, 
                reps: erows.reduce((t, row)=>t+row.r*row.s,0),
                volume: erows.reduce((t, row)=>t+row.w*row.r*row.s,0), //number
            }

        });

    },[data?.jrange]);

    useEffect(()=>{

        if( user.session )
        {
            getData({
                variables: {
                    ymd: YMD,
                    range: ranges[range].range,
                    uid:user.session.user.id
                }
            })
        }

    },[range, user.session ]);

    
    return <SoftBox title="You did this" Icon={<DateRangeIcon/>}>
        
        { error && <Alert severity="error">Oops! Something happened :(</Alert>}

        { loading && <LinearProgress/>}

        { overview && <> 
            Overview of <strong>your</strong> last X week/s...
            <SoftBoxTabs labels={ranges.map(itm=>itm.range)} selected={range} onSelected={setRange} disabled={loading}/> <br/><br/>
            <Typography variant="h4">{ranges[range].range} Week/s</Typography>
            <div className={classes.from}>
                <strong>From</strong> {data.jrange.from}<br/>
                <strong>To</strong> {data.jrange.to}<br/>
                { data.jrange.exercises.length>0 && <><strong>Exercises</strong> {data.jrange.exercises.length}</> }
            </div></> }

        

        { overview?.map( eoverview=>(<Box key={eoverview.exercise.id} padding={1} position="relative">

            <div className={classes.etype}>{eoverview.exercise.type}</div>
            <div className={classes.ename}>
                # {eoverview.exercise.name}</div> 
            <div>
                <div>
                    <strong>Max</strong> <WeightValue value={eoverview.max.w} inkg={user.session.user.usekg}/> / <strong>Avg</strong> ~<WeightValue round value={eoverview.volume/eoverview.reps} inkg={user.session.user.usekg}/>
                </div>
                
                <div><strong>Volume</strong> <WeightValue value={eoverview.volume} inkg={user.session.user.usekg}/> <strong>in</strong> {eoverview.reps} <strong>reps</strong></div>
                <div>{eoverview.days} <strong>days</strong></div> 
            </div>
        </Box>))}

        {data && data.jrange.exercises.length>0 && overview?.length==0 && <Alert severity="info">No "official" exercises were done.</Alert>}
        {data && data.jrange.exercises.length==0 && <Alert severity="info">No workouts found in this period.</Alert>}
        {overview?.length>0 && <Button fullWidth variant="outlined" onClick={()=>history.push(`/journal/${user.session.user.uname}/${YMD}:${ranges[range].range}`)}>See details</Button>}
    </SoftBox>
}