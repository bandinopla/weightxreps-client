import { useContext, useEffect, useRef, useState } from "react";
import { JOwnerContext } from "../../pages/journal-context"; 
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { Button, ButtonGroup, Dialog, Typography } from "@material-ui/core";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { OpenDMButton } from "../../session/ui/dms-window/dm-window";
import { todayAsYMD } from "../../utils/utils";
import { SectionTitle } from "../../pages/guest/GuestLandingPage";
import { useGetSession } from "../../session/session-handler"; 
import Alert from "@material-ui/lab/Alert"; 


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
    const {session}                   = useGetSession();
    const jowner                    = useContext(JOwnerContext); 
    const [open, setOpen]           = useState(false);
    const [loading, setLoading]     = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
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

    if( Editor!=null ) {
        JEditor = Editor.JEditor;
        TutorialModal = Editor.TutorialModal;
    }


    


    return <><Button startIcon={<BtnIcon/>} {...rest} onClick={()=>openEditor()}>
                {children || ( wouldBeNewLog?"New Log" :"Edit") } 
            </Button>

            <TutorialModal/>
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
                        <Typography style={{float:"right"}} variant="caption">editor v2.0</Typography>


                        <SectionTitle line1={"GOOD JOB! Consistency is key!"} line2="LOG A WORKOUT ↴"/>

                        <div style={{textAlign:"center"}}>
                        <ButtonGroup variant="outlined" >
                        <Button onClick={ ()=>Editor.OpenTutorial() } startIcon={<HelpOutlineIcon/>}>Tutorial / Example</Button>
                        <OpenDMButton  otherUser={{id:"1" }} label="DM Admin" /> 
                        </ButtonGroup>
                        </div>

                    </DialogTitle> 

                        <DialogContentText>
                            <Alert severity="info">
                            To trigger the auto-complete hit <strong>CTRL+SPACE</strong> or <strong>CMD+SPACE</strong>  on a new line. 
                            </Alert> 
                        </DialogContentText>

                        <JEditor redirect ymd={ymd || $defaultYMD} range={range} onClose={handleClose} saveTrigger={saveTriggerRef} onLoaded={ ()=>setHasLoaded(true) }/>  
                         

                        <DialogActions>
                            <Button size="large" onClick={handleClose} color="primary" variant="outlined">
                                Cancel
                            </Button>
                            <Button size="large"  disabled={!hasLoaded} onClick={()=>saveTriggerRef.current()} color="primary" variant="contained">
                                Save
                            </Button>
                        </DialogActions>
                </Dialog>
      
      </>;

}