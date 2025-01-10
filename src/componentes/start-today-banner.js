import { LinearProgress, makeStyles } from '@material-ui/core';
import { EventType } from '@rive-app/react-canvas';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

const useStyles = makeStyles( theme =>({
    root: {
        width:"100%",
        height: 240, 
        [theme.breakpoints.up("sm")]: {
            height:500
        },
        [theme.breakpoints.up("md")]: {
            height:740
        },

        "& > div": {
            maxWidth:"100%"
        },
        "& canvas": {
            objectFit:"contain",
            maxWidth:"100%"
        }
    },
    mainBannerText: {
        "& .MuiTypography-h3": {
            color:"black !important"
        }
    }
}))

/*
<div style={{ position:"absolute", top:30, left:"35%" }} className={style.mainBannerText}>
            <Typography variant='h3'>START TODAY!</Typography>
            <Typography className='user-text'>Hola como estas</Typography>
        </div>
        */
export const StartTodayBanner = ({ onClickStart })=>{
    const style = useStyles({ isMobile }); 

    return <div style={{ position:"relative", color:"white"}}>

        
         <img src="/banner-starttoday-v2.jpg" style={{ cursor:"pointer"}} onClick={onClickStart}/>
         
        </div>
}
 