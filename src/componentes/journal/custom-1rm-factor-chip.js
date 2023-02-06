import { Chip } from "@material-ui/core";
import { useState } from "react";
import { InfoDialog } from "../Dialog";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

export const Custom1RMFactorChip = ({ factor, style })=>{
    const [ show, setShow ] = useState();
    return <>
        <Chip onClick={()=>setShow(true)} style={{marginLeft:10, ...style}} color="primary"  variant="outlined" icon={<InfoOutlinedIcon/>} label= { <>Custom 1RM Factor = <strong>{factor}</strong></>} />
        <InfoDialog title="Custom 1RM Factor" 
                    onConfirm={ ()=>setShow(false) }
                    open={show}
                    info="This value is used by the system's 1RM estimation formula. A calculation that has as inputs the weight lifted and the reps and outputs the estimated max weight that could be done for 1 rep max."/>
        </>; 
}
         