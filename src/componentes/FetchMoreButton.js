import React, { useEffect } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import ErrorSnackbar from "./ErrorSnackbar";
import CheckIcon from '@material-ui/icons/Check';
import { parseError } from "../data/db";
import HistoryIcon from '@material-ui/icons/History';

/**
 * @typedef {Object} FetchMoreButtonParams 
 * @property {()=>Promise} fetchMore
 * @property { Boolean} hide
*/ 


/** 
 * Un boton para ofrecerle al usuario la posibilidad de iniciar la carga de mas items.
 * Muestra un spinner al estar busy, un snackbar en caso de error y un check icon si se lo oculta (indicando que se vio todo)
 * 
 * "fetchMore" debe devolver una promesa. Si resuelve a "true" se considera que no hay mas nada para cargar.
 * 
 * @param {...FetchMoreButtonParams} props 
 * @returns 
 */
 export default function FetchMoreButton ({ fetchMore, forceLoading, forceHide, nomore }) {

    const [loading, setLoading] = React.useState(false);
    const [error, setError]     = React.useState(); 
    const [hide, setHide]       = React.useState(false);
    
 

    const handleClick = ()=> {
        if( loading ) return;

        setLoading(true);
        setError(null);
        
        fetchMore()  
            .then( res => {

                if( res !== true ) {
 
                    setHide(true);
                }

            })
            .catch( opError => {

                opError = parseError(opError);
                setError( "Fetch error: "+opError);
            })
            .finally( ()=>setLoading(false) );
    }

    // on mount: reset hide variable
    useEffect( ()=>{
        
        setHide(false);  
        
    }, [] );

    return <>
            <ErrorSnackbar trigger={error} vertical="bottom" horizontal="center"/>
            {!( typeof nomore=='boolean'? nomore :  hide || !!forceHide) && <Button disabled={ forceLoading || loading } variant="contained" onClick={ handleClick } startIcon={<HistoryIcon/>}>
                { forceLoading || loading? <CircularProgress /> : "Load more" } 
            </Button> }
            { (typeof nomore=='boolean'? nomore : hide || !!forceHide) && <CheckIcon /> }
            </>
}