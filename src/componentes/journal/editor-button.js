import { useContext, useEffect, useRef, useState } from "react";
import { JOwnerContext } from "../../pages/journal-context";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { Button, ButtonGroup, Dialog, Grid, Typography } from "@material-ui/core";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { todayAsYMD } from "../../utils/utils";
import { SectionTitle } from "../../pages/guest/GuestLandingPage";
import { useGetSession } from "../../session/session-handler";
import Alert from "@material-ui/lab/Alert";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import TimerIcon from '@material-ui/icons/Timer';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import CloseIcon from '@material-ui/icons/Close';

import { JEditorStopwatch } from "./editor-stopwatch";
import FileCopyIcon from '@material-ui/icons/FileCopy';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));


var Editor              = null;
const $defaultYMD       = todayAsYMD();

export const JEditorButton = ({ ymd, range, redirect, wouldBeNewLog, children, ...rest })=>{

    //cargar on click....
    const classes = useStyles();
    const saveTriggerRef            = useRef();
    const hintTriggerRef            = useRef();
    const {session}                 = useGetSession();
    const jowner                    = useContext(JOwnerContext); 
    const [open, setOpen]           = useState(false);
    const [loading, setLoading]     = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const copyModalState            = useState(false);
    const helpModalState            = useState(false);
    const stopwatchState            = useState(false);
    const theme = useTheme()

    useEffect(()=>{

        const callOpen = ()=>openEditor();
        window.addEventListener("openEditor", callOpen);

        return ()=>window.removeEventListener("openEditor", callOpen)

    },[]);


    if( jowner!=null && session?.user?.id!=jowner?.id )
    {
        return "";
    }

    const handleClose = ()=>{
        setOpen(false)
    };

    const onClickAddExercise = ev => {
 
        ev.stopPropagation();
        ev.preventDefault();
        hintTriggerRef.current && hintTriggerRef.current();
    }

    const loadEditor = async ()=>{ 
 
        setLoading(true);
        Editor = await import(/* webpackChunkName: "jeditor" */'./editor'); 
        setLoading(false); 
    }

    const openEditor = async ()=>{
         await loadEditor();
         setOpen(true)
    }

    const BtnIcon = wouldBeNewLog? AddIcon : EditIcon;
    var JEditor = ()=>"";
    var TutorialModal = JEditor;
    var LoadCopyOfWorkoutModal = JEditor;

    if( Editor!=null ) 
    {
        JEditor = Editor.JEditor;
        TutorialModal = Editor.TutorialModal;
        LoadCopyOfWorkoutModal = Editor.LoadCopyOfWorkoutModal;
    }


    


    return <><Button startIcon={<BtnIcon/>} {...rest} onClick={()=>openEditor()}>
                {children || ( wouldBeNewLog?"New Log" :"Edit") } 
            </Button>

            <TutorialModal openState={helpModalState}/>
            <LoadCopyOfWorkoutModal openState={copyModalState}/>
            
            <Backdrop className={classes.backdrop} open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>


            <Dialog
                    open={open}
                    // onClose={handleClose}
                    scroll="paper" 
                    fullWidth
                    maxWidth="sm"
                    style={{
                        backgroundImage:`repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)`, backgroundSize:"5px 5px"
                         
                    }}
                >
                    <DialogTitle>

                        <div className="desktop-view">
                            <Typography style={{float:"right"}} variant="caption">editor v2.0</Typography> 
                            <SectionTitle line1={"GOOD JOB! Consistency is key!"} line2="LOG A WORKOUT ↴"/>
                        </div>

                        <div className="mobile-view" style={{textAlign:"right"}}>
                            <Button onClick={onClickAddExercise} variant="outlined" style={{marginRight:20}}>+ Exercise</Button>
                            <Button  onClick={handleClose} color="primary" startIcon={<CloseIcon/>}>
                                         Close
                                        </Button>
                        </div>

                    </DialogTitle> 


                        <div className="desktop-view">
                            <DialogContentText>
                                <Alert severity="info">
                                To trigger the auto-complete hit <strong>CTRL+SPACE</strong> or <strong>CMD+SPACE</strong>  on a new line. 
                                </Alert> 
                            </DialogContentText>
                        </div>


                        <JEditorStopwatch openState={stopwatchState}/>
                        

                        <JEditor redirect ymd={ymd || $defaultYMD} range={range} onClose={handleClose} hintTriggerRef={hintTriggerRef} saveTrigger={saveTriggerRef} onLoaded={ ()=>setHasLoaded(true) }/>  
                         

                        <DialogActions>
                            
                            <div className="mobile-view">
                                <ButtonGroup variant="outlined" >
                                    <Button onClick={ ()=>helpModalState[1](true) } ><MenuBookIcon/></Button>
                                    <Button color="primary"  onClick={ ()=>copyModalState[1](true) }> <FileCopyIcon/> </Button>
                                    {/* <Button color="primary" onClick={()=>stopwatchState[1](!stopwatchState[0])}>
                                        { stopwatchState[0]? <CloseIcon/> : <TimerIcon/> } 
                                        </Button>  */}
                                 </ButtonGroup>
                                &nbsp;&nbsp;
                                 <ButtonGroup variant="outlined" >
                                    <Button disabled={!hasLoaded} onClick={()=>saveTriggerRef.current()} color="primary" variant="contained" >
                                        <SaveAltIcon/>
                                        </Button> </ButtonGroup>
                            </div>

                            <div className="desktop-view">
                            <Grid container>
                                <Grid item xs={6}>
                                    <ButtonGroup variant="outlined" >
                                        <Button onClick={ ()=>helpModalState[1](true) } startIcon={<MenuBookIcon/>}>HELP</Button>
                                        {/* <OpenDMButton  otherUser={{id:"1" }} label="DM Admin" /> */}
                                        <Button color="primary" variant="contained" startIcon={<FileCopyIcon/>} onClick={ ()=>copyModalState[1](true) }>
                                            copy
                                        </Button>
                                        <Button color="primary" startIcon={ stopwatchState[0]? <CloseIcon/> : <TimerIcon/> }  onClick={()=>stopwatchState[1](!stopwatchState[0])}>
                                            stopwatch
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={6} style={{ textAlign:"right"}}>

                                    <ButtonGroup >
                                        <Button  onClick={handleClose} color="primary" variant="outlined">
                                            Cancel
                                        </Button>
                                        <Button disabled={!hasLoaded} onClick={()=>saveTriggerRef.current()} color="primary" variant="contained" startIcon={<SaveAltIcon/>}>
                                            Save
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid> 
                            </div>


                        </DialogActions>
                </Dialog>
      
      </>;

}