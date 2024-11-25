import { useContext } from "react";
import { JOwnerContext } from "../../pages/journal-context";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { todayAsYMD } from "../../utils/utils";
import { useGetSession } from "../../session/session-handler";

import { useHistory } from "react-router-dom";

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
    const jowner = useContext(JOwnerContext);
    const { session } = useGetSession();
  
    if( !session || ( jowner && (session.user?.id!==jowner.id) ) ) return "";
    
    return <Button startIcon={<BtnIcon/>} {...rest} className="fancy" onClick={()=>history.push("/log-workout?key="+ymd+(range?":"+range:""))}>
                {children || ( wouldBeNewLog?"New Log" :"Edit") } 
            </Button> 
};

 