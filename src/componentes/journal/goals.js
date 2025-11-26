/**
 * @typedef {Object} MyProps
 * @property {import("../../data/generated---db-types-and-hooks").JDayQuery["getGoals"]} data
 * @property {string} currentYMD current YYYY-MM-DD
 */

import { Box, Button, Chip, Grid, LinearProgress, makeStyles, Paper, Typography } from "@material-ui/core"
import GoalPlannerCanvas from "../GoalPlannerCanvas";
import { useContext, useRef, useState } from "react";
import { ymd2date } from "../../utils/utils";
import Ename from "../ename";
import WeightValue from "../weight-value";
import { TimeValue } from "../time-value";
import { DistanceValue } from "../distance-value";
import DoneIcon from '@material-ui/icons/Done';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import GolfCourseIcon from '@material-ui/icons/GolfCourse'; 
import { JOwnerContext } from "../../pages/journal-context";
import { useGetSession } from "../../session/session-handler";
import { $openModal, OpenConfirmModal } from "../Dialog";
import { GoalCreationUI } from "./goal-creation";
import { JDayContext } from "./jday-context";
import { useGetSessionQuery } from "../../data/generated---db-types-and-hooks";
import { DeleteGoalButton } from "./goal-deletion";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow'; 

const useStyles = makeStyles(theme=>({
    root: { 
        marginBottom:50,
        "& .user-text": {
            padding:"10px 0",
            fontSize:"1.4em"
        }
    },
    goal: {  
        backgroundColor: "#f9fcff",
        backgroundImage: "linear-gradient(147deg, #f9fcff 0%, #dee4ea 74%)",
        color:"#000", 
    },
    bar: {
         
    },
    barTime: { 
        backgroundColor:"red", 
    },
    title: {
        fontSize:25
    }
}));

export const GoalsTypePolicy = {
    UserGoal: {
        keyFields: false, // Disables normalization
      },
    Query: {
        

        fields: { 
            getGoals: {
                keyArgs:["uid","upToDate"],
                merge(existing, incoming) {
                    return incoming; // Return incoming to prevent merging of existing data
                  }
            }
        }
    }
}

const daysBetween = (d1, d2) => Math.floor( Math.abs((new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24)) );

function timeLeft(currentDate, endDate) {
    const diff = new Date(endDate) - new Date(currentDate);
    if (diff <= 0) return 'Time is up!';
  
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 365;
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} left`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
    return `${seconds} second${seconds > 1 ? 's' : ''} left`;
  }


/** 
 * @param {MyProps} param0 
 * @returns 
 */
export const UserGoals = ({ data, user , currentYMD }) => {
    const classes = useStyles();   

    return <Grid container className={classes.root} spacing={1}>  

        { data.map( (goal, i)=><UserGoal key={i} goal={goal} user={user} currentYMD={currentYMD}/>)}
  
                            
    </Grid>
}


const UserGoal = ({ goal, user, currentYMD }) => {
    const classes = useStyles();
    const pointsRef = useRef();
    const currentDate = ymd2date(currentYMD); 
    const [details, setDetails] = useState(false);
    const { data } = useGetSessionQuery()
	const jowner                        = useContext(JOwnerContext);
 
    const endDate = new Date(goal.maxDate); 
                
    const daysSinceStart = daysBetween(goal.creationDate, currentDate);
    const overallProgress = daysSinceStart>1? 1- (daysSinceStart / goal.plannedProgress.length) : 0;
    const bestResult = goal.progress? Math.max(...goal.progress) : 0 ;
    const hasWorkout = goal.progress?.[daysSinceStart] ;
    
    return <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={2} className={classes.goal}> 
                
                    <LinearProgress classes={{ bar: classes.barTime }}  value={overallProgress*100} valueBuffer={overallProgress*100} variant="buffer" />
                    
                    <div style={{ textAlign:"right", paddingRight:5}}>
                        <strong>{timeLeft(currentDate, endDate) }</strong>
                    </div>
                    <Box padding={3} paddingTop={0}>
                        {/* <Typography variant="h4" className={classes.title}>
                            <strong>{goal.name}</strong></Typography>    */}
                            
                        
                            <div style={{ display:"flex", gap:2, alignItems:"center", marginBottom:10 }}>
                            
                            {
                                bestResult>=1? 
                                    <Chip size="small" label="Completed" icon={<DoneIcon />} variant="default" color="primary"/>
                                    :
                                    overallProgress>=1? <Chip size="small" label="Expired" icon={<TimerOffIcon />} variant="outlined" />
                                    :
                                    <Chip size="small" label="Active" icon={<HourglassEmptyIcon />} variant="outlined" />
                            } 

                            <Ename {...goal.exercise} inline/><br/>
                            </div>


                            { details && <>
                                    
                                    <GoalPlannerCanvas canvasStyles={{width:"100%"}} width={200} height={50} ref={pointsRef} cursor={ daysSinceStart } plannedPoints={goal.plannedProgress} externalPoints={goal.progress}/>
                                    <br/>

                                    <TableContainer component={Paper}>
                                        <Table size="small"> 
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Block size</TableCell>
                                                    <TableCell>{Math.round(goal.plannedProgress.length/7)} weeks</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Start</TableCell>
                                                    <TableCell><a href={goal.creationDate}>{goal.creationDate}</a></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Limit</TableCell>
                                                    <TableCell><a href={goal.maxDate}>{goal.maxDate}</a></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Goal</TableCell>
                                                    <TableCell>{ formatGoal(goal, user.usekg ) }</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <LinearProgress  value={Math.min(1,bestResult)*100} variant="determinate" />
                                    
                                    
                                    <br/>
                                    <Typography>↓ Options for today to stay on track...</Typography>
                                    <br/> 
                                    <Paper>
                                        <Box padding={1} fontFamily={"monospace"} whiteSpace="break-spaces">
                                        {goal.options ?? "..."}
                                        </Box>
                                    </Paper>
                                    <br/>
                            </>  }
                            
                            <Grid container spacing={1} direction="row-reverse">

                                { data?.getSession?.user?.id==jowner.id  &&  <Grid item>
                                                                <DeleteGoalButton goalid={goal.id}/>
                                                            </Grid>}
                                <Grid item>
                                    <Button fullWidth variant="outlined" onClick={()=>setDetails(!details)}>{details?"X":"[+] Details"}</Button>
                                </Grid>
                            </Grid>
                        
                    </Box>
                </Paper>
            </Grid>
}



function formatGoal(goal, usekg) {
    const weight = goal.weight || 1;
    const reps = goal.reps || 1;
    const sets = goal.sets || 1;
    const distance = goal.distance || 1;
    const time = goal.time || 1;
    const elements = [];
  
    switch (goal.type) {

      case "WEIGHT_X_REPS": // Weight x Reps x Sets
        elements.push(<WeightValue value={weight} inkg={usekg}/> ); 
        if( reps>1 || sets>1 ) elements.push(<span>x <strong>{reps}</strong></span> )
        if( sets>1 ) elements.push(<span>x <strong>{sets}</strong> sets</span>)
        break;  

      case "WEIGHT_X_DISTANCE": // Weight x Distance [x Time]

        if( weight>1 ) 
            elements.push(<WeightValue value={weight} inkg={usekg}/> );

        elements.push(<span>{weight>1?"x ":""}<DistanceValue value={distance} unit={goal.dUnit}/></span> );

        if( time )
            elements.push(<span>in <TimeValue milliseconds={time*1000}/></span>)

        break;

      case "WEIGHT_X_TIME": // Weight x Time

        if( weight>1 ) 
            elements.push(<WeightValue value={weight}  inkg={usekg}/> );

        elements.push(<span>{weight>1?"x ":""}<TimeValue milliseconds={time*1000}/></span>)
        
        break;
      default:
        return 'Unknown goal type';
    }

    return <div style={{ display:"flex", gap:5, alignContent:"center" }}>{elements}</div>;
  }


  /** 
   * @param {import("@material-ui/core").ButtonProps} param0 
   * @returns 
   */
export const CreateGoalButton = ({ ...btnProps}) => {
    const jowner = useContext(JOwnerContext);
    const jday = useContext(JDayContext);
    const user = useGetSession();
    const uid = user.session?.user.id;

    if( uid!==jowner.id ) return "";

    const openGoalCreation = ()=>{
        $openModal({
            title: "Set a new goal!",
            open: true, 
            onClose: ()=>$openModal(null),
            info: <GoalCreationUI startDate={ ymd2date(jday.ymd) }/>,
        });
    }

    return <Button startIcon={<GolfCourseIcon/>} {...btnProps} onClick={openGoalCreation}> Set Goal</Button>
}