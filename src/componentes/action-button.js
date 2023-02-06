import { Button, CircularProgress } from "@material-ui/core";
import { useState } from "react";


export const ActionButton = ({ children, execAction, ...rest })=>{
    const [busy, setBusy] = useState();
    const callAction = async ()=>{
        setBusy(true);
        await execAction();
        setBusy(false);
    }

    return <Button disabled={busy} onClick={ ()=>callAction() } {...rest}>
                { busy? <CircularProgress size={25}/> : children}
           </Button>;
}