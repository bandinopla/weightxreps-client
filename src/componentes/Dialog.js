
import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Backdrop, CircularProgress, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeVar, useReactiveVar } from '@apollo/client';
import { AsciiSpinner } from './ascii-spinner';
import { parseError } from '../data/db';
import { Alert } from '@material-ui/lab';


const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.modal+20,
      color: '#fff',
    },
  }));


export const InfoDialog = ({ title, info, children, onConfirm, onClose, verb, canCancel, ...rest })=>{

    const classes = useStyles();
    const [isBusy, setBusy] = useState(false);
    const [taskError, setTaskError] = useState(null)

    const onClickConfirm = async (bool)=>{

        setTaskError(null);

        if(!bool) {
            return onConfirm(false);
        }

        setBusy(true); 

        try
        {
            await onConfirm(true);

        }
        catch(e)
        {
            //nada.... 
            setTaskError( e.toString() );
        }
        

        setBusy(false);
        //alert("ok")

    }

    useEffect(()=>console.log("Info dialog created"),[])

    return <>
        
            <Backdrop open={isBusy} className={classes.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Dialog
                onClose={onConfirm || onClose}
                {...rest}
            >
                <DialogTitle>

                    { onClose && <IconButton style={{float:"right", marginTop:-8}} onClick={onClose}>
                                    <CloseIcon />
                                    </IconButton>}
                    {title}
                    
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    { info || children }
                    </DialogContentText>

                    {taskError!=null && <DialogContentText><Alert severity="error">{ parseError(taskError) }</Alert></DialogContentText> }

                </DialogContent>
                
                
                {onConfirm && <DialogActions> 
                                    {canCancel && <Button onClick={()=>onClickConfirm(false)}  autoFocus>cancel</Button>}
                                    &nbsp;<Button onClick={()=>onClickConfirm(true)} variant="contained" color="primary" autoFocus>

                                        { isBusy && <AsciiSpinner label="Wait"/> }
                                        { !isBusy && (verb || "Ok") }
                                        </Button>
                              </DialogActions>}
                
            </Dialog>
            </>
}



const $openModal = makeVar({ open:false, title:null, info:null, onConfirm:null }); //<--- se le pasa el modal config...


/**
 * Escucha el reactive var y abre el modal...
 */
export const DialogModalListener = ()=>{ 

    const modalInfo = useReactiveVar($openModal);  

    return <InfoDialog {...modalInfo}/>;
}

/**
 * <DialogModalListener/> debe existir en el body. 
 * All llamart a esta funcion los params se le pasan al <InfoDialog/>
 */
export const OpenConfirmModal = ( params )=> {

    var resolvePromt;
    const prom          = new Promise( resolve =>resolvePromt=resolve );
    const onConfirm     = params.onConfirm;

    params.onConfirm = yes => {  

        if( params.canCloseModal && !params.canCloseModal(yes) )
        {
            return;
        }

        if( yes!==true )
        {
            params.onCancel && params.onCancel();
        }
 
        var res = yes===true && onConfirm? onConfirm() : null;
 
        if( res instanceof Promise )
        {
            return res.then( (_res)=>{
                //
                // si todo salió bien, cerramos el modal...
                //
                $openModal(null);
                resolvePromt( _res );
            })
        }
        else 
        {
            $openModal(null); //cerramos solo si salio todo bien...
            resolvePromt( res );
        } 
    } 

    $openModal(params);

    return prom;

}