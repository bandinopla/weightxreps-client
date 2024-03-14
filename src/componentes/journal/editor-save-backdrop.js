import { makeVar, useReactiveVar } from "@apollo/client";
import { makeStyles } from "@material-ui/core";
import NoddingGuySrc from "../../banners/nodding-guy.gif";
import ErrorIcon from '@material-ui/icons/Error';
import { Backdrop, CircularProgress, Typography } from "@material-ui/core";
import { useEffect } from 'react';
import { Fireworks } from 'fireworks/lib/react';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
const $jeditorSaveState    = makeVar({ loading:false, error:null, success:null });

const useBackdropStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 133,
      color: '#fff',
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

    let fxProps = {
        count: 1 ,
        interval: 200,
        colors: ['#14FA96','#0FBA70' ],
        bubbleSizeMaximum:2,

        calc: (props, i) => ({
          ...props,
          x: window.innerWidth / 2 + Math.random()*300*(Math.random()>0.5?-1:1),
          y: window.innerHeight / 2 + Math.random()*300*(Math.random()>0.5?-1:1)
        })
      }

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
 

    return <Backdrop className={ classes.backdrop + (data.success===true? " success-"+data.success.toString() : "" ) } 
                     open={ !!shouldBeOpen } >

        <div style={{display:"none"}}>
            <img src={ NoddingGuySrc } alt=""/>
        </div>
        
        { data.loading? <CircularProgress color="inherit" /> 
        : data.success? <div>  
                            <img src={ NoddingGuySrc } alt="" style={{ borderRadius:180 }}/>
                            <Typography variant="h2" className="flikrAnim" style={{color:"white"}}>
                                 Good Job! <ThumbUpIcon style={{ fontSize:50 }}/>
                                 </Typography>
                            <Fireworks {...fxProps} />
                        </div>
        : data.error? <><ErrorIcon fontSize="large"/> Oops! {data.error?.message ?? "Something went wrong"}</>
        : "" }
    </Backdrop>
}