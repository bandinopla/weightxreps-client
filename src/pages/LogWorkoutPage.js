import { useMemo, useRef, useState } from "react"
import { BrowserView } from "react-device-detect";
import { JEditor, LoadCopyOfWorkoutModal, TutorialModal } from "../componentes/journal/editor";
import { todayAsYMD } from "../utils/utils";
import { Box, Button, IconButton, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { JEditorStopwatch } from "../componentes/journal/editor-stopwatch";
import TimerIcon from '@material-ui/icons/Timer';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SaveIcon from '@material-ui/icons/Save';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Hidden from '@material-ui/core/Hidden';
import { useHistory, useLocation } from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';

export default function LogWorkoutPage ({ location }) { 
    const history = useHistory();
    const saveTriggerRef = useRef();
    const hintTriggerRef = useRef(); 
    const [loading, setLoading] = useState(true);
    const copyModalState            = useState(false);
    const stopwatchState            = useState(false);
    const helpModalState            = useState(false);
    const disabled = loading;

    const params = useMemo(()=>{
        const $defaultYMD       = todayAsYMD();
        const query = new URLSearchParams(location.search); //params.get("key")
        const parts = query.get("key") ?? $defaultYMD+":0";

        history.replace( window.location.pathname  )
        return parts.split(":")
        
    },[]);

    // onClose={handleClose} hintTriggerRef={hintTriggerRef} saveTrigger={saveTriggerRef} onLoaded={ ()=>setHasLoaded(true) }
    return <div >

        <LoadCopyOfWorkoutModal openState={copyModalState}/>
        <JEditorStopwatch openState={stopwatchState}/>
        <TutorialModal openState={helpModalState}/>
 

            <Box padding={2}>
                <Paper elevation={6} style={{ border:"1px dotted #333"}}>
                    {/* <Alert severity="error" action={<Button>Close</Button>}>Some crazy error</Alert> */}
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:10, borderBottom:"1px solid #ccc"}}>
                    
                        <Hidden mdDown>
                            <Typography variant="h4">Log Editor</Typography> 
                        </Hidden>

                        

                        <Hidden mdDown>
                            <div style={{ flexGrow:1}}>&nbsp;</div>
                            <Button startIcon={<HelpOutlineIcon/>} variant="outlined" disabled={disabled} onClick={()=>helpModalState[1](true) }>HELP</Button>
                            <Button variant="outlined" color="primary" disabled={disabled} onClick={()=>hintTriggerRef.current()}>Trigger Autocomplete</Button>
                        
                        </Hidden>
                        <Hidden only={["lg","xl"]}>
                            <IconButton  disabled={disabled} onClick={()=>helpModalState[1](true) }><HelpOutlineIcon/></IconButton> 
                            <IconButton variant="outlined" color="primary" disabled={disabled} onClick={()=>hintTriggerRef.current()}><FitnessCenterIcon/></IconButton>
                        </Hidden>

                        

                        <div style={{ flexGrow:1}}>&nbsp;</div>
                        <IconButton variant="outlined" onClick={()=>stopwatchState[1](true)} ><TimerIcon/></IconButton>
                        <IconButton variant="outlined" disabled={disabled} onClick={()=>copyModalState[1](true)}><FileCopyIcon/></IconButton>

                        <Hidden mdDown>
                            <Button size="large" endIcon={<SaveIcon/>} variant="contained" color="primary" disabled={disabled} onClick={()=>saveTriggerRef.current()}>Save</Button>
                        </Hidden>
                        <Hidden only={["lg","xl"]}>
                            <IconButton size="large" variant="contained" color="primary" disabled={disabled} onClick={()=>saveTriggerRef.current()}><SaveIcon/></IconButton>
                        </Hidden>
                        
                        <IconButton onClick={()=>history.goBack()}><CloseIcon/></IconButton>

                    </div>

                    <Hidden mdDown>
                        <Alert severity="info">
                        Trigger exercise name auto-complete: <strong>CTRL+SPACE</strong> or <strong>SHIFT+SPACE</strong> or <strong>⌘+SPACE</strong>  on a new line. 
                        </Alert> 
                    </Hidden>

                    <JEditor redirect ymd={params[0]} range={ parseInt(params[1])} hintTriggerRef={hintTriggerRef} saveTrigger={saveTriggerRef} onLoaded={()=>setLoading(false)}/> 
                </Paper>
            </Box>  
    </div>
}