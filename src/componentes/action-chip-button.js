import { Chip, CircularProgress } from "@material-ui/core";
import { useState } from "react";
 
import ErrorSnackbar from "./ErrorSnackbar";
import { parseError } from "../data/db";



/**
 * @typedef {object} ActionChipButtonParams
 * @property {Class} IconClass icono
 * @property {string} label el label del boton
 * @property {string} labelWhenSending el label del boton cuando esté en estado de "busy"
 * @property {(c:(status:string)=>void)=>Promise} executeAction ejecutador de la accion
 * 
 * @param {ActionChipButtonParams} param0 
 * @returns 
 */
export const ActionChipButton = ({ IconClass, label, labelWhenSending, executeAction, size = "small" })=>{
 
    const [error, setError] = useState();
    const [busy, setBusy]   = useState(false);
    const [statusText, setStatusText] = useState(null);

    const onClick = ()=>{
        setError(null);
        setBusy(true);
        setStatusText(null)

        executeAction( status=>setStatusText(status) )
            .catch( error => setError(error) )
            .finally(()=>setBusy(false)); 
    }


 
    return <><Chip icon={busy? <CircularProgress size={10}/> : <IconClass fontSize={size}/> }
                label={busy? statusText || labelWhenSending : label} 
                variant="outlined"
                clickable
                size={size}
                onClick={onClick}
                disabled={busy}
            />
            <ErrorSnackbar trigger={ error && parseError(error) } vertical="bottom" horizontal="center"/>
            </>
};