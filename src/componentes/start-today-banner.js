import { makeStyles } from '@material-ui/core';
import Rive, { EventType } from '@rive-app/react-canvas';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useEffect } from 'react';

const useStyles = makeStyles( theme =>({
    root: {
        width:"100%",
        height:280, 
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
    }
}))


export const StartTodayBanner = ({ onClickStart })=>{
    const style = useStyles();

    const { RiveComponent, rive } = useRive({
        src: '/start-today-banner.riv',
        autoplay: true,
        stateMachines: ["State Machine 1","noise","button"],
        layout: new Layout({
            fit: Fit.Contain, // Keeps the content within the parent while maintaining aspect ratio
            alignment: Alignment.TopCenter, // Centers the content in the parent
        }),
    });

    useEffect(()=>{

        if( rive )
        { 
            const onAnimEnds = (event) => {
                if(event.data.name=='onClickStart') {
                    onClickStart?.();
                    console.log("y?")
                }
            };

            // Listen for when an animation ends
            rive.on(EventType.RiveEvent, onAnimEnds);
            return ()=>{
                rive.off(EventType.RiveEvent, onAnimEnds);
            }
        }

    }, [rive]);

    return <div className={ style.root }>
                <RiveComponent />
            </div>
}