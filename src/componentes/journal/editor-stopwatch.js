import {
    Box,
    Button, LinearProgress,
    Typography
} from "@material-ui/core";
import { useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Draggable } from "../dragable";
import { useState } from "react";
import ReactDOM from "react-dom";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import CachedIcon from '@material-ui/icons/Cached';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import PauseIcon from '@material-ui/icons/Pause';
import { ms2HHMMSS } from "../../utils/ms2HHMMSS";
import TimerIcon from '@material-ui/icons/Timer';
import RestoreIcon from '@material-ui/icons/Restore';


export const JEditorStopwatch = ({ openState }) => {
	const open = openState[0];
	const [fulls, setFullS] = useState(false);
	const Icon = fulls ? FullscreenExitIcon : FullscreenIcon;

	return ReactDOM.createPortal(
		<Draggable disabled={fulls}>
            <div style={ fulls? { top:0, left:0, position:"fixed"} : { position:"block"}}>
                <Box
                    display={open ? "flex" : "none"}
                    justifyContent="center"
                    alignItems={"center"}
                    bgcolor={"black"}
                    width={fulls ? "100vw" : 500}
                    height={fulls ? "100vh" : 400}
                    color={"white"}  
                >
                    { !fulls && <Typography variant="caption" style={{ position: "absolute", top:10, left: 10 }}><OpenWithIcon/> DRAG TO MOVE</Typography> }

                    { open && <Stopwatch fulls={fulls} onClose={ ()=>openState[1](false) }/> }

                    <Icon
                        onClick={() => setFullS(!fulls)}
                        style={{
                            fontSize: 80,
                            color: "white",
                            cursor: "pointer",
                            position: "absolute",
                            right: 0,
                            bottom: 10,
                        }}
                    />

                    <CloseIcon
                        onClick={() =>{ setFullS(false) ; openState[1](false);  } }
                        style={{
                            fontSize: 80,
                            color: "white",
                            cursor: "pointer",
                            position: "absolute",
                            right: 0,
                            top: 0,
                        }}
                    />
                </Box>
			</div>
		</Draggable>,
		document.body
	);
};



const PlayIcon                  = PlayCircleFilledWhiteIcon;
//const PauseIcon                 = PauseIcon;
const LapIcon                   = TimerIcon;
const StopIcon                  = CachedIcon; 
const getTime                   = ()=>new Date().getTime();

const StopwatchStates = {
    "default": {
        mainAction: {
            Icon: PlayIcon,
            Action: state =>({
                    ...state,
                    startTime   : getTime(),
                    time        : 0,  
                    lapTime     : getTime(),
                    lapTimeMS   : 0,
                    laps        : 0, 
                    isPlaying   : true,    
                    ...StopwatchStates.playing
                }) 
        },
        secondaryAction: null
    },

    "playing": {
        mainAction: {
            Icon: PauseIcon,
            Action: state => ({
                ...state,
                isPlaying   : false,
                time        : state.time + getTime() - state.startTime , 
                lapTimeMS   : state.lapTimeMS + getTime() - state.lapTime , 
                ...StopwatchStates.paused
            })
        },
        secondaryAction: {
            Icon: LapIcon,
            Action: state => ({
                ...state,
                lapTime     : getTime(),
                lapTimeMS   : 0,
                laps        : state.laps+1,
                restartLaps() {

                    console.log("LAP", this)
                    return {
                        ...this,
                        laps: 0,
                        lapTime     : this.startTime,
                        lapTimeMS   : this.time,
                    }
                }
            })
        }
    },

    "paused": {
        mainAction: {
            Icon: PlayIcon,
            Action: state=>({
                ...state,
                startTime   : getTime(),
                lapTime     : getTime(),
                isPlaying   : true,
                ...StopwatchStates.playing
            })
        },

        secondaryAction: {
            Icon: StopIcon,
            Action: state => ({
                ...state,
                startTime   : 0,
                isPlaying   : false, 
                laps        : 0,
                ...StopwatchStates.default
                })
        }
    }
}


const Stopwatch = ({ fulls, onClose }) => {

    const fontSize                  = fulls? "10vw":80;  
    const [state, setState]         = useState( { ...StopwatchStates.default, close:onClose } );
     
    const execute = action => {

        const newState = action(state); 
        newState && setState(newState); 
    } 


    return <div style={{ textAlign:"center"}}>

                <StopwatchDisplay state={state} fontSize={fontSize} /> 

                {state.secondaryAction && <Button  onClick={state.secondaryAction.onClick}>
                    <state.secondaryAction.Icon style={{color:"#ddd", fontSize }} onClick={()=>execute( state.secondaryAction.Action )}/>
                </Button>}

                { state.isPlaying && state.laps>0 && <Button>
                        <CloseIcon style={{color:"yellow", fontSize }} onClick={ ()=>setState( state.restartLaps() ) }/>
                    </Button>} 

                <Button  onClick={state.mainAction.onClick}>
                    <state.mainAction.Icon style={{color:"#ddd", fontSize }} onClick={()=>execute( state.mainAction.Action )}/>
                </Button>
            </div>
}

const StopwatchDisplay = ( { state, fontSize } ) => {

    const [percent, setPercent]     = useState(0);
    const defaultLabel              = "00:00:00";
    const [lapLabel, setLapLabel]   = useState(defaultLabel); 
    const [label, setLabel]         = useState(defaultLabel); 

    useEffect(()=>{

        let timer = setInterval(()=>{

            if( state.isPlaying )
            {
                //
                // lap time
                // 
                let diff = state.lapTimeMS + getTime() - state.lapTime; 
                setLapLabel( ms2HHMMSS(diff) );
                setPercent( ((diff%60000)/60000)*100 );

                //
                // total time
                //
                if( state.laps>0 )
                {
                    diff = state.time + getTime() - state.startTime;
                    setLabel( ms2HHMMSS(diff) );
                }

            } 
            else if( state.startTime==0 )
            {
                setLapLabel(defaultLabel);
            } 

        },100);

         

        return ()=>{
            if( timer ) clearInterval(timer);
        }

    }, [state ]);

    return  <div >

{ state.laps>0 && <Typography variant="h3" style={{ fontSize, color:"#333"}} >{label}</Typography> }


            { state.startTime>0 && <LinearProgress variant="determinate" value={percent} style={{ height:20 }}/> }
            { state.isPlaying && <LinearProgress style={{ height:3 }}/>}
            
            <Typography variant="h2" style={{ fontSize, color:"white" }}>
                { state.laps>0 && <span style={{ color:"yellow"}}>L{state.laps}</span> }
                {lapLabel}</Typography>
            </div>
}