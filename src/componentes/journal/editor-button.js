import { useContext, useEffect, useRef, useState } from "react";
import { JOwnerContext } from "../../pages/journal-context";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { Button, ButtonGroup, Dialog, DialogContent, Grid, Typography } from "@material-ui/core";
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
import { ActionButton } from "../action-button";
import { BrowserView, MobileOnlyView } from "react-device-detect";
import { EditorMobileOnly } from "./editor-mobile-only";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));


var Editor              = null;
const $defaultYMD       = todayAsYMD();
var isActive            = false;

export const JEditorButton = ({ ymd, range, redirect, wouldBeNewLog, children, ...rest })=>{
    const BtnIcon = wouldBeNewLog? AddIcon : EditIcon;
    const  history = useHistory();
    
    return <Button startIcon={<BtnIcon/>} {...rest} className="fancy" onClick={()=>history.push("/log-workout?key="+ymd+(range?":"+range:""))}>
                {children || ( wouldBeNewLog?"New Log" :"Edit") } 
            </Button> 
};

 