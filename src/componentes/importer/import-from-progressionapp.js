import { createContext, useContext, useMemo, useRef, useState } from "react";
import { dateToYMD } from "../../utils/utils";
import { ImportFromFileToWXR } from "./import-from-wxr";
import { Box, Button, ButtonGroup, Divider, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PowerIcon from '@material-ui/icons/Power';
import TodayIcon from '@material-ui/icons/Today';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import CloseIcon from '@material-ui/icons/Close';
import { openExercisesModal } from "../journal/exercises";
import { useGetSession } from "../../session/session-handler";
import CheckIcon from '@material-ui/icons/Check';
import { CalendarGrid } from "../calendario";
import { SET_TYPES } from "../../data/set-types";
import { TYPES } from "../../user-tags/data-types";
import LinkIcon from '@material-ui/icons/Link';
import AddIcon from '@material-ui/icons/Add'; 
import { ProgressBar } from "../progress-bar"; 
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import BrokenImageRoundedIcon from '@material-ui/icons/BrokenImageRounded';
import UndoRoundedIcon from '@material-ui/icons/UndoRounded';
import RoomRoundedIcon from '@material-ui/icons/RoomRounded';

/**
 * @typedef {Object} Performance
 * @property {string} id
 * @property {string} exerciseId
 * @property {number?} weight
 * @property {number?} repetitions
 * @property {string?} weightUnit
 * 
 * @property {number?} distance
 * @property {string?} distanceUnit
 * @property {number?} duration
 * 
 * @property {number} completedAt
 * @property {string?} comment
 * @property {string?} mark
 */

/**
 * @typedef {Object} Session
 * @property {number} startTime
 * @property {number} endTime
 * @property {string?} comment
 * @property {Array<Performance>} performances 
 */

/**
 * @typedef {Object} Log
 * @property {string} on YYYY-MM-DD
 * @property {Date} onAsDate 
 * @property {number?} bw 
 * @property {string} comment
 * @property {Array<Eblock|string>} did 
 */

/**
 * @typedef {Object} Eblock
 * @property {string} eid
 * @property {number} type
 * @property {{name:string, ubw:number?}?} ref
 * @property {Array<Set>} sets
 */

/**
 * @typedef {Object} Set
 * @property {number} w 
 * @property {number?} r
 * @property {boolean?} inkg
 * @property {string?} c
 * @property {number?} a2bw
 * @property {number?} d 
 * @property {number?} t 
 * @property {string?} dunit  
 * 
 */

const eid2name = {
    "152":{ name:"Barbell Front Squat #sq"},
    "153":{ name:"Barbell Squat (ATG) #sq" },
    //"1006":{ name: "Running on Readmill" },
    "108": {name:"Assisted Chinup",ubw:-1}, //takes away from bw...
    "104": {name:"Chinup",ubw:1}
}

const unit = usekg => usekg?"kg":"lb";

/** 
 * @param {Set} set 
 * @returns {string}
 */
function setW(set) {
    if( set.a2bw )
    {
        return `BW${set.a2bw>0?"+":""}${set.a2bw}${unit(set.inkg)}`;
    }
    return `${set.w}${unit(set.inkg)}` ;
}

function setT(set) {
    return TYPES.TAG_TIME_hm.value2editor( TYPES.TAG_TIME_hm.components2value(set.t) );
}

/**
 * @this {Set}
 */
function weght_x_reps_set_toText() { 
    return `${setW(this)} x ${this.r} ${this.c}` ;
}

/**
 * @this {Set}
 */
function distance_x_duration_set_toText() {

    let out = "";
    if( this.w )
    {
        out += setW(this)+" x ";
    }

    return `${this.d}${this.dunit} in ${ setT(this) } ${this.c}`;
}

/**
 * @this {Set}
 */
function duration_with_weight_toText(){ 

    var out = "";

    if( this.w )
    {
        out += setW(this)+" x ";
    }

        return `${out}${setT(this)} ${this.c}`;
}


 
/**
 * Tested on backup data from Progression `v5.2.1 (2782) on Android`
 */
export const ImportFromProgressionApp = ()=>{

    const continueProcessing = useRef();
    const [userNeedsToFillTheBlanks, setUserNeedsToFillTheBlanks] = useState(null);
    const user = useGetSession();

    const promptUserForBodyweight = usekg =>{
        let bw = window.prompt( "Some exercises make use of your bodyweight, what bodyweight should be assume? Type it in "+(usekg?"Kilograms":"Pounds"));
        if( !bw )
        {
            if( window.confirm("We need your bodyweight because there are exercises that used your bodyweight!") )
            {
                return promptUserForBodyweight(usekg);
            }
            else 
            {
                throw new Error("We can't keep processing the file without your bodyweight!");
            }
        }

        bw = parseFloat(bw);

        if( isNaN(bw) || bw<0 || bw>600 )
        {
            alert("Invalid bodyweight, try again!");
            return promptUserForBodyweight(usekg);
        }

        return bw;
    }

    /**
     * @param {File} file
     * @param {(status:string)=>void} informStatus
     */
    const onFile = async (file, informStatus) => {

        informStatus("Parsing file...");

        const txt = await file.text();

        try 
        {
            var json = JSON.parse(txt);
        }
        catch(err){
            throw new Error("Not a valid .pgnbkp file");
        }

        console.log(json); 
         

        const usekg = json.profile.preferences.weightUnit=="KILOGRAMS";
        const usekm = json.profile.preferences.distanceUnit=="KILOMETERS"; 

        const eid2ref = new Map();

        json.exercises?.forEach(exercise=>{
            eid2ref.set(exercise.id, exercise );
        });

        /**
         * @type {Array<Session>}
         */
        const workouts = json.sessions;

        let ymd;

        /**
         * @type {Array<Log>}
         */
        const log = [];
        let day;
        let eblock;
        let bw = 0;
        let hasUnknownExercise = false; 

        if( !workouts )
            throw new Error("The file has no workouts in it...");

        //
        // a day can have many workouts!
        //
        workouts.forEach(workout=>{

            const d = new Date(workout.startTime);
            const workoutYMD = dateToYMD(d);
            

            if(!ymd || ymd!=workoutYMD)
            {
                // TODO: que pasaría si viene un workout con los días desordenados y hay varios session en un mismo dia?
                ymd = workoutYMD;
                eblock = null;

                //
                // progressionapp doesn't send the data in chronological order... 
                //
                day = log.find(d=>d.on==workoutYMD);

                if( day )
                { 
                    day.did.push(`Workout #${++day.workouts}`);
                }
 
                else 
                {
                    day = {
                        on:ymd, 
                        onAsDate: d,
                        comment:"",
                        did:[],
                        workouts: 1
                    }
                    
                    log.push(day);
                } 
                
            }  

            if( workout.comment ) 
            {
                day.did.push( workout.comment );
            }

            //
            // analize each set done for a particular exercise
            //
            workout.performances.forEach(performance=>{

                let usebw   = false;
                let w       = performance.weight ?? 0;
                let kg      = performance.weightUnit == 'KILOGRAMS';// else pounds
                let r       = performance.repetitions ?? 0;
                let t       = performance.duration ?? 0;
                let d       = performance.distance ?? 0;
                let km      = performance.distanceUnit == 'KILOMETERS'; //else miles

                let type = performance.repetitions? SET_TYPES.WxR.type : 
                            performance.duration && !performance.distance? SET_TYPES.WxT.type : 
                            SET_TYPES.WxD.type;


                //
                // EBLOCK
                //
                if(!eblock || eblock.eid!=performance.exerciseId || eblock.type!=type )  
                {
                    let eid = performance.exerciseId;

                    eblock = {
                        eid,
                        type,
                        ref: eid2ref.has(eid)? eid2ref.get(eid) : eid2name[eid], //<-- can be null
                        sets: []  
                    }

                    day.did.push( eblock );

                    if( !eblock.ref )
                    {
                        hasUnknownExercise = true;
                    }
                    else 
                    {
                        if( eblock.ref.ubw )
                        {
                            if(!bw)
                            {
                                informStatus("Waiting for user bodyweight...");
                                bw = promptUserForBodyweight(usekg); 
                            }

                            usebw = true;
                            w *= eblock.ref.ubw;  // >0 adds to bw, <0 takes off bw...
                            day.bw = bw; 
                        }
                    }
                }


                //
                // SET
                //
                const set = {
                    c: ((performance.mark? `[${performance.mark}] ` : "") + (performance.comment||"")).trim() 
                }

                // their types:  W x R, W x T, W x D, D x T

                if( w )
                {
                    set.inkg = kg;
                }

                if( usebw )
                {
                    set.a2bw    = w; // in this case w is the weight added to the bw...
                    set.w       = w + day.bw;  // we store total weight
                }

 
                switch(type)
                { 
                    case SET_TYPES.WxT.type:
                        set.w = w;
                        set.t = t;
                        set.toText = duration_with_weight_toText;
                        break;

                    case SET_TYPES.WxD.type:
                        set.w = w;
                        set.d = d;
                        set.dunit = km ? 'km' : 'mi'; 
                        set.t = t; 
                        set.toText = distance_x_duration_set_toText;
                        break; 

                    default:
                        set.w = w;
                        set.r = r;
                        set.toText = weght_x_reps_set_toText;
                        break;
                } 

                eblock.sets.push( set );
            }); 

        });

        //
        // if we have some exercises with unknown names, we need to fill the blanks
        //
        if( hasUnknownExercise)
        { 
            //
            // check if we 
            //
            const map = user.userSettings.progressionappMap();  

            if( map )
            {
                if( window.confirm("You recently mapped some exercises with unknown names. Do you want to re-use that mapping?") )
                {  
                    //
                    // map with the previously mapped names
                    //
                    var mapped = Object.entries(map).map( ([eid, name])=>({ eid, name, manuallyResolved:true }) );

                    //
                    // we map the exercises with the stored info & check if we still have exercises unmapped (it can happen if a new file is imported with new exercises)
                    //
                    hasUnknownExercise = log.flatMap( day=>day.did ).filter( b=>{

                        if( b.eid )
                        { 
                            if( !b.ref )
                            {
                                b.ref = mapped.find(m=>m.eid==b.eid);
                            }

                            return !b.ref;
                        }

                        return false;

                    } ).length > 0 ;

                    if( hasUnknownExercise )
                    {
                        alert("The backup file still contains some unknown exercises, you will need to provide their names manually.");
                    } 
                }
            }

            //
            // we check again because in the step above we might have not solved all the unknowns...
            //
            if( hasUnknownExercise )
            {
                informStatus("Waiting for user to complete the missing names..."); 

                await new Promise( (resolve, reject)=>{
    
                    continueProcessing.current = [resolve, reject];
                    setUserNeedsToFillTheBlanks(log);
    
                });
    
                //
                // make a map object to help the user skip the mapping the next time a backup is imported...
                //
                var eid2nameMap = log.flatMap( day=> day.did.filter( e=> e.ref?.manuallyResolved ) )
                                  .reduce( (acc, block)=>{
                                            acc[block.eid] = block.ref.name;
                                            return acc;
                                        },{});
    
                //
                // save the mapping because it would be super annoying to do this manually every time....
                //
                user.userSettings.progressionappMap(eid2nameMap);
            }

        }

        informStatus("Processing imported data..."); 
        
        //
        // convert to a weight x reps log...
        //
        const txtLog = log.map( day=>{

            return day.on + "\n"+ (day.bw? "@"+day.bw+(usekg?"kg":"lb")+"BW\n" :"") + day.did.map( eblock=>{

                if( typeof eblock=='string' ) return eblock;

                return "#"+eblock.ref.name + "\n" + eblock.sets.map( set=> set.toText(set) ).join("\n");
                
            }).join("\n");
            
        }).join("\n\n");

        //
        // return the WXR log...
        //
        return txtLog;
    }

    // //
    // // if the user decides to cancel the file import...
    // //
    // const cancel = ()=> {
    //     setUserNeedsToFillTheBlanks(null);
    //     continueProcessing.current[1]("You canceled the file import operation.");
    // }

    return <>

        { userNeedsToFillTheBlanks!=null && <Box marginBottom={2}> 
                                                <FillInTheBlanks log={userNeedsToFillTheBlanks} then={()=>setUserNeedsToFillTheBlanks(null) || continueProcessing.current[0]()} fail={continueProcessing.current[1]}  />
                                            </Box>}

        <ImportFromFileToWXR formatFile={onFile} fileInputLabel="Select Progressionapp .pgnbkp file" fileInputFileExtensions=".pgnbkp"/>

        </>
}

/**
 * @typedef {Object} FillInTHeBlanksParams
 * @property {Array<Log>} log
 * @property {()=>void} then callback when all blanks are filled.
 * @property {()=>void} fail callback when we fail.
 */

/**
 * @callback ResolveEname
 * @param {string} eid
 * @param {string?} newName
 * @param {{id:string, name:string}?} link
 * @returns {void}
 */


/**
 * @param {ResolveEname} resolve
 */
const ResolveEnameContext = createContext((eid, newName, link)=>{});


/** 
 * this UI is in charge of letting the user find the missing exercises and pick names for them.
 * @param {FillInTHeBlanksParams} param0 
 */
const FillInTheBlanks = ({ log, then, fail })=>{

    const [rev, setRev]         = useState(0);
    const [offset, setOffset]   = useState(0);
    const [pin, setPin]         = useState();
    const [initialUnknowns, setInitialUnknowns] = useState(0);

    /**
     * Collect unknown exercises...
     */
    const unknowns = useMemo(()=>{ 

        //
        // pick 1 block for each exercise missing (notice, there can be many of the same eid missing)
        //
        let _unknowns = log.reduce( (missing,d) => {

            d.did.filter(e=>e.eid).forEach(e=>{
                //|| e.ref.manuallyResolved
                if( !e.ref && !missing.find(m=>m.eid==e.eid) )
                {
                    missing.push( e )
                }
            }) 
            
            return missing  
        
        }, []);

        if( initialUnknowns==0 )
        {
            setInitialUnknowns(_unknowns.length);
        }

        return _unknowns;

    }, [log, rev]);

    const WEEKS     = 12;
    const DAYS      = 7;  
    const $startDay = 0;
    const TODAY         = new Date();

    /**
     * Builds the calendar data
     */
    const calendarData = useMemo(()=>{

        
        //
        // defaults to first day in which we have an "unknown" exercise
        //
        const pinned = pin || log.findLast(d=>d.did.some( eblock=>eblock.eid==unknowns[0].eid )).on;

        if(!pin) {
            setPin(pinned);
            return;
        } 


        const cursor = log[ log.length-1].onAsDate.getTime() + offset * 24 * 60 * 60 * 1000 ;
        

        let d = new Date(cursor); 
            d.setDate( d.getDate()+ Math.round(-(WEEKS*DAYS*0.5)) );  
            d.setDate( d.getDate()-d.getDay() + $startDay );  

        return new Array(WEEKS*DAYS).fill(0).map((_,i)=>{  

            const ymd = dateToYMD(d);

            const dayData = {
                hasData: log.some( day=>(
                    day.onAsDate.getFullYear() === d.getFullYear() &&
                    day.onAsDate.getMonth() === d.getMonth() &&
                    day.onAsDate.getDate() === d.getDate()
                )),
                num: d.getDate(),
                month: d.getMonth(), 
                showYear: d.getFullYear() != TODAY.getFullYear() ? "'"+d.getFullYear().toString().substr(2) : null,
                pinned: ymd==pinned,
                ymd 
            }

            d.setDate( d.getDate()+1 );
            return dayData;
            
        });

    }, [log, pin, offset]);

    const go = (dir)=>{  

            if( !dir || dir===0 )
            {
                setOffset(0);
                return;
            }

            let step = 4;

            if( Math.abs(dir)>1 )
            {
                step = WEEKS;
                dir = dir>0? 1: -1;
            } 

            setOffset( offset + 7*dir*step ); 
    };

    const onClick = (dayKey, hasData) => { 
        setPin( dayKey ) 
    } 

    const locateMissing = ()=>{
        let block = unknowns[0];
        const day = log.find( d=>
                            d.did.some( e=>e.eid==block.eid )
                        );
                        setPin( day.on );
    }

    /** 
     * @type {ResolveEname}
     */
    const resolveMissing = (eid, newName, link)=>{ 

        let newRef = link ? link : newName ? { name: newName, manuallyResolved:true } : null;

        log.forEach(d=>{
            d.did.forEach(block=>{
                if( block.eid==eid) {
                    block.ref = newRef;
                }
            })
        });

        setRev(r=>r+1); // force re-render
    } 

    return <ResolveEnameContext.Provider value={resolveMissing}>

                   
                
                { unknowns.filter(e=>!e.ref).length==0 ? <Alert severity="success" action={<Button startIcon={<CheckIcon/>} variant="outlined" onClick={then}>Continue</Button>}>All set, we can continue importing the file now...</Alert>
                    : 
                    <>
                    <Alert severity="warning" action={<Button variant="outlined" startIcon={<CloseIcon/>} onClick={()=>fail("You canceled the file import")}>Cancel</Button>}>The file makes references to exercises that we don't know since they don't provide a name for them, so we need your help! Please complete the missing names:</Alert> 
                      <Box padding={4}> 
                        <ProgressBar label="Resolved" value={ (1-(unknowns?.length/initialUnknowns)) * 100} color="green" noHelp/>   
                      </Box>
                      </>
                    } 

                <Paper elevation={2} > 

                    {/* <Box padding={5}>
                        <Typography variant="h3">Resolve the missing exercises</Typography>
                    </Box> */}

                    <Box overflow={"auto"}>
                        <CalendarGrid cantSelectIfNoData hasMoved={offset!=0} data={calendarData} weeks={WEEKS} days={DAYS} onClickMove={go} onClick={onClick} FDOW={ $startDay }  />
 
                    </Box> 
                    
                    <Divider/>

                    
                    
                    <Box padding={5} paddingTop={3}>
                        
                        <Typography variant="h3">
                            {pin}
                             &nbsp;<Button onClick={locateMissing} startIcon={<RoomRoundedIcon/>} variant="outlined" color="secondary">Locate missing exercise</Button> 
                            </Typography>

                        { log.filter(d=>d.on==pin).map((d,i)=> <LogRow key={d.on+"*"+i} log={d}/>) }
                    
                    </Box> 

                    
                </Paper>
            </ResolveEnameContext.Provider>;
}


/** 
 * @param {{ log:Log, resolve:ResolveEname }} param0 
 */
const LogRow = ({ log, resolve })=>{
    return <Box > 
        { log.did.map((e,i)=> <EblockRow key={i} eblock={e}/>)}
    </Box>
}

/** 
 * @param {{eblock:Eblock}} param0 
 */
const EblockRow = ({ eblock })=>{
 
    const resolve = useContext(ResolveEnameContext);

    if( typeof eblock=='string' )
    {
        return <Typography>{eblock}</Typography>;
    }

    const createNew = ()=>{
        var name = window.prompt("Write the name for this new exercise");
        if( name )
        {
            resolve(eblock.eid, name);
        }
    }

    const undo = ()=> {
        if( window.confirm("Are you sure you want to undo this?") )
        {
            resolve(eblock.eid, null);
        }
    }

    const linkExisting = ()=> openExercisesModal({ onSelected: e=>resolve(eblock.eid, null, { ...e,manuallyResolved:true }) }); 
 
    return <Box marginTop={3}> 
        
        {
            eblock.ref && !eblock.ref.manuallyResolved && <Typography variant="h5"># {eblock.ref.name}</Typography>
        }

        {
            eblock.ref && eblock.ref.manuallyResolved && <Typography variant="h5"><strong style={{color:"green"}}><CheckCircleOutlineOutlinedIcon/> {eblock.ref.name}</strong> <Button startIcon={<UndoRoundedIcon/>} color="primary" size="small" variant="outlined" onClick={undo}>Undo</Button></Typography>
        }

        {
            !eblock.ref && <Typography variant="h5">
                <strong style={{color:"red"}}><BrokenImageRoundedIcon/> Missing → </strong> 
                <ButtonGroup color="primary" size="small">
                    <Button startIcon={<AddIcon/>} onClick={createNew}>Create new</Button>
                    <Button startIcon={<LinkIcon/>} variant="contained" onClick={linkExisting}>Link with existing</Button>
                </ButtonGroup>
                </Typography>
        }

        <Typography variant="subtitle1">
        {
            eblock.sets.map(s=>(<div>{ s.toText() }</div>))
        }
        </Typography>
        </Box>
}