import { useMemo, useRef, useState } from "react" 
import { useGetExercisesQuery, useSetGoalMutation } from "../../data/generated---db-types-and-hooks";
import { AsciiSpinner } from "../ascii-spinner";
import { Box, Button, ButtonGroup, TextField, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { useDebounce } from "../../utils/useDebounce";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GoalPlannerCanvas from "../GoalPlannerCanvas";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Ename from "../ename";
import { useGetSession } from "../../session/session-handler";
import WeightValue, { kg2lb } from "../weight-value";
import { Alert } from "@material-ui/lab";
import { parseError } from "../../data/db";
import { todayAsYMD } from "../../utils/utils";
import OperationBackdrop from "../backdrop";


function getSteps() {
    return ['Exercise', 'Goal', 'Time', 'Progression'];
}

const WEEKS = [6,8,12,16,18]

export const GoalCreationUI = ({ uid, startDate })=>{ 
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const user = useGetSession();
    const usekg = user.session?.user.usekg;
    const { data, loading, error } = useGetExercisesQuery({ variables: { uid:user.session.user.id }});
    const[ save, { data:saveData, loading:saveLoading, error:saveError } ] = useSetGoalMutation();

    const [e, setE] = useState();
    const [activeStep, setActiveStep] = useState(0);
    const [setGoal, setSetGoal] = useState();
    const [myPlannedPoints, setPlannedPoints] = useState([]);
    const [inWeeks, setInWeeks] = useState(1);
    const [goalError, setGoalError] = useState();
    const [ ename, setTypedEname ] = useDebounce("",300);
    const steps = getSteps();
    const setGoalRef = useRef();
    const pointsRef = useRef(); 
    const endDate = useMemo(()=>{
        const d = new Date(startDate);
        d.setDate(startDate.getDate()+inWeeks*7 );
        return d;
    }, [inWeeks])

    const options = useMemo(()=>{

        const rtrn = [];
        let exactMatch = false;
        const query = ename.trim().toLowerCase();

        if( ename.length>0 )
            data?.getExercises?.forEach( $ex=>{
                const name = $ex.e.name.toLowerCase(); 

                if( name.includes(query) ) {
                    rtrn.push($ex.e);
                    if( name==query ) {
                        exactMatch = true;
                    }
                }
            });

        if( rtrn.length>5 ) rtrn.length = 5;
 
        if( !exactMatch && ename.length) {
            rtrn.unshift({
                id:0, name:query
            })
        }

        return rtrn;

    }, [ename])

    const onExerciseSelected = ex=>{
        setE(ex);
        setActiveStep(1);
    }

    const setGoalSet = ()=>{
        const val = setGoalRef.current.value;
        const match = val.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+)\s*x\s*(\d+)/i);

        if (!match) return setGoalError("Expecting WEIGHT x REPS x SETS");

        let w = parseFloat(match[1]); 

        if(!usekg) w *= 0.4535924;

        setSetGoal({
            weight: w, 
            reps: parseInt(match[2]),
            sets: parseInt(match[3])
        });
        setActiveStep(2);

    }

    const onWeeksSet = weeks => {
        setInWeeks(weeks); 
        setActiveStep(3);
    }

    const onProgressionSet = ()=>{
        setActiveStep(4);
        setPlannedPoints( pointsRef.current );
    }

    const gotoNextStep = ()=>{
        if( activeStep===1 )
        {
            setGoalSet()
        }
        else if( activeStep===3 )
        {
            onProgressionSet();
        }
        else if( activeStep===4 )
        {
            save({
                variables: {
                    eid: e.id,
                    ename: e.name,
                    plannedProgress: myPlannedPoints,
                    startDate: startDate.toISOString().split("T")[0],
                    type:0,
                    weight: setGoal.weight,
                    reps: setGoal.reps,
                    sets: setGoal.sets,
                    comment:""
                }
            })
            .then(res=>{
                window.location.reload();
            })
            .catch( err=>{
                console.log("SOME RROR", err)
            })
            ;
        }
        else 
        {
            setActiveStep( activeStep+1 );
        }
    }

    if( loading ) return <AsciiSpinner label={"Loading..."}/>;
    if( error) return <Alert severity="error">{ parseError(error)}</Alert>

    return <div>
                <Stepper activeStep={activeStep} >
                    {
                        steps.map((label, index) => { 
                            return (
                                <Step key={label} >
                                    <StepLabel>{isMobile?"":label}</StepLabel>
                                </Step>
                            );
                        })
                    }
                </Stepper>

      { // STEP 1: SELECT EXERCISE...
        activeStep===0 && <>
        <Typography>Pick the exercise in which you want to set this goal...</Typography>
        <TextField fullWidth onChange={event=>setTypedEname(event.target.value)} placeholder="Type the exercise's name (can be new)"/>

            <List dense={true}> 
            {
                options.map( ex=><ListItem key={ex.id} button onClick={v=>onExerciseSelected(ex)}>
                    <ListItemText>{ex.id===0?"Create exercise: ":""} #{ex.name}</ListItemText>
                </ListItem>)
            }
            </List>
        </>
      }

      { // SETP 2: DEFINE THE GOAL...
        activeStep===1 && <>
            <Typography>Type the weight ({usekg?"KG":"LBS"}), reps and sets you want to achieve...</Typography>
            <TextField inputRef={setGoalRef} 
                        fullWidth 
                        error={!!goalError} 
                        label={goalError?"Invalid set format!":""} 
                        onChange={event=>setTypedEname(event.target.value)} 
                        placeholder="100 x 3 x 5" 
                        helperText= {goalError?goalError:"Goal set you want to achieve: 100 x 4 x 5"} 
                        /> 
        </>
      }

      {
        activeStep===2 && <>
            <Typography>In how many weeks you plan to achieve this?</Typography>
            <ButtonGroup fullWidth variant="outlined">

                {
                    WEEKS.map( weeks=><Button key={weeks} onClick={()=>onWeeksSet(weeks)}>{weeks}</Button> )
                }
                
            </ButtonGroup>
        </>
      }

      { // STEP 4: Define the progression...
        activeStep===3 && <>
            <Typography>Click and drag to define the progression...</Typography>
            <GoalPlannerCanvas width={200} height={50} ref={pointsRef} resolution={inWeeks*7} canvasStyles={{ width:"100%"}}/>
 
        </>

      }
 
      { // CONFIRM...
        activeStep===4 && <>
        <Typography variant="subtitle2">Review & confirm your goal!</Typography>

        <OperationBackdrop open={saveLoading}/>
        <TableContainer>
        <Table size="small" >
            <TableBody>
                <TableRow>
                    <TableCell>Exercise</TableCell>
                    <TableCell>
                        <Ename {...e}/>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Goal</TableCell>
                    <TableCell>
                        <WeightValue value={  setGoal.weight } inkg={usekg}/> x <strong>{setGoal.reps}</strong> x <strong>{setGoal.sets}</strong>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Start date</TableCell>
                    <TableCell>
                        { startDate.toISOString().split('T')[0] }
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>End date</TableCell>
                    <TableCell>
                        { endDate.toISOString().split('T')[0] }
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Weeks</TableCell>
                    <TableCell>
                        { inWeeks }
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Progression</TableCell>
                    <TableCell>
                        <GoalPlannerCanvas width={200} height={50} plannedPoints={myPlannedPoints}/> 
                    </TableCell>
                </TableRow>

            </TableBody>
        </Table>
        </TableContainer>
        </>
      }
        
      {saveError && <Box><Alert severity="error">{parseError(saveError)}</Alert></Box>}
      <Box display="flex" gridGap={5} flexDirection={"row-reverse"} marginTop={3}>
       
        { !!e && <Button variant="contained" color="primary" onClick={gotoNextStep}>{ activeStep===4?"Set goal. Good luck!":"Next" }</Button> }
        { activeStep>0 && <Button variant="outlined" onClick={()=>setActiveStep(activeStep-1)}>Back</Button> }
      </Box>
 
    </div>
}