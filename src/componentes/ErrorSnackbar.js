import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


const Alert = (props) => (<MuiAlert elevation={6} variant="filled" {...props} />);
 

/**
 * Muestra un snackbar de error si el trigger tiene contenido. Se espera un string
 * @param {{ trigger:String }} 
 */
export default function({ trigger, onClose, vertical="top", horizontal="right" }) {

    const [open, setOpen] = React.useState(false);
 
    useEffect( ()=>{

        if( trigger && !open ) setOpen(true);

    }, [trigger] ); 

    const close = ()=>{
        setOpen(false);
        onClose && onClose();
    }

    return <Snackbar open={ open } autoHideDuration={6000} onClose={ ()=>close(false) } anchorOrigin={{vertical , horizontal }}>
                <Alert onClose={()=>close(false)} severity="error">
                {trigger?.toString()}
                </Alert>
            </Snackbar>;
}