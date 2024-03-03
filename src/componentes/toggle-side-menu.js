import { makeStyles } from "@material-ui/core";
import { useEffect, useRef } from "react";
import CompareArrowsSharpIcon from '@material-ui/icons/CompareArrowsSharp';

const useStyles = makeStyles( theme =>({
    toggleOnMobile: {
        position:"absolute",
        top:"25%",
        background:"rgba(0,0,0,0.8)",
        zIndex:2,
        width:25,
        height:200,
        display:"flex",
        alignItems:"center",
        border:"2px solid rgba(255,255,255,0.1)",

        "&.right": {
            right:-25,
            borderTopRightRadius:30,
            borderBottomRightRadius:30,
        },
        "&.left": {
            left:-25,
            borderTopLeftRadius:30,
            borderBottomLeftRadius:30,
        }
    }, 

    [ theme.breakpoints.up("lg") ]: {
        toggleOnMobile: {
            display:"none"
        }
    }
}));

/**
 * @typedef {Object} ToogleMenuBtnParams
 * @property {"left"|"right"} side
 */

/** 
 * A small handle looking ui that will seat top 25% and either left or right of the div in which they live in.
 * It will add or remove a class "opened" so the style of that parent knows what to do, we only add a class here, nothing else.
 * 
 * @param {ToogleMenuBtnParams} param0 
 * @returns 
 */
export const ToogleSidebarMenu = ({ side })=>{
    const myRef         = useRef();
    const wasTriggered  = useRef(false);
    const cls           = useStyles();
    const threshold     = 10;
    const screenMarginPercent = 0.25;

    useEffect(()=>{

        let X = 0;

        const onTouchStart = ev => { 
            let evX = ev.touches[0].pageX;

            if( wasTriggered.current ) return;

            // valid margin for opening...
            if( !isOpen() && ((side=='left' && evX<window.innerWidth-window.innerWidth*screenMarginPercent) || (side=='right' && evX>window.innerWidth*screenMarginPercent)) )
            {
                console.log("NOPE", !isOpen(), side, evX, evX>window.innerWidth*screenMarginPercent)
                return;
            } 

            X = evX;
        }

        const onTouchMove = ev=>{
            if( wasTriggered.current || X==0 ) return;

            let diff = ev.touches[0].pageX - X;
            if( side=='left' )
            {
                diff *= -1;
            }

            if( isOpen() )
            {
                diff *= -1;
            }

            console.log("DIFF", diff)

            if( diff > threshold  )
            {
                wasTriggered.current = true;
                trigger();
            }
        }

        const onTouchEnd = ev => {
            wasTriggered.current = false;
            X = 0;
        }

        window.addEventListener("touchstart", onTouchStart)
        window.addEventListener("touchend", onTouchEnd)
        window.addEventListener("touchcancel", onTouchEnd)
        window.addEventListener("touchmove", onTouchMove);

        return ()=>{
            window.removeEventListener("touchstart", onTouchStart)
            window.removeEventListener("touchmove", onTouchMove);
        }

    }, []);

    const trigger = ()=>{

        myRef?.current.parentNode.classList.toggle("opened" )
    }

    const isOpen = ()=>myRef?.current.parentNode.classList.contains("opened");

    return <div ref={myRef} 
                className={ cls.toggleOnMobile + " "+side } 
                onClick={() => trigger()}><CompareArrowsSharpIcon /></div> 
}