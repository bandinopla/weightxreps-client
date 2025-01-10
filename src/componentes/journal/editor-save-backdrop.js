import { makeVar, useReactiveVar } from "@apollo/client";
import { makeStyles } from "@material-ui/core";
import ErrorIcon from '@material-ui/icons/Error';
import { Backdrop, CircularProgress, Typography } from "@material-ui/core";
import { useEffect } from 'react';
import "./editor-save-backdrop.css";
import { AnimatedLogoIntro } from "../SplashScreenIntro";

const $jeditorSaveState    = makeVar({ loading:false, error:null, success:null });

const useBackdropStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 133,
      "& *": {
        color: '#fff !important',
      }
    },
  })); 



/**
 * 
 * @param { ()=>Promise } task 
 */
export const OpenJeditorSaveBackdrop = async ( task ) => {

    $jeditorSaveState({
        loading: true
    });

    let error;

    try 
    { 
        await task(); 
    }
    catch( e )
    {
        error = e;
    }

    $jeditorSaveState({
        loading: false,
        success: !error,
        error
    });  
     

    if( error )
    {
        throw error;
    }

}  


export const JeditorSaveBackdrop = ()=>{

    const classes               = useBackdropStyles();  
    const data                  = useReactiveVar($jeditorSaveState);
    const shouldBeOpen          = data.loading || data.success || data.error;

    useEffect(()=>{

        var interval;

        if( !data.success && !data.loading )
        {
            // autoclose if error....
            interval = setInterval( ()=>$jeditorSaveState({}), 2000 ); // autoclose this modal in this time...
        }
        // else... leave the success modal covering the screen because the editor will do a window reload....

        return ()=>clearInterval(interval);

    }, [ shouldBeOpen ])

    // useEffect(()=>{

    //     window.addEventListener("keydown", ev=>{
    //         $jeditorSaveState({ loading:false, success:null, error:null });

    //         setTimeout(()=>{
    //             $jeditorSaveState({ loading:false, success:true, error:{ message:"saraza pla blas"} });
    //         },300);
    //     })
    // },[]);
 

    return <Backdrop className={ classes.backdrop + ( " success-"+data.success?.toString() ) } 
                     open={ !!shouldBeOpen } >
        
        { data.loading? <CircularProgress color="inherit" /> 
        : data.success? <div>  
                            <AnimatedLogoIntro/>
                        </div>
        : data.error? <Typography variant="h4" ><ErrorIcon fontSize="large"/> Oops! {data.error?.message ?? "Something went wrong"}</Typography>
        : "" }
    </Backdrop>
}