import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation
} from "react-router-dom";

const url2scroll = new Map();

export const RestoreScroll = ()=>{
 
    const location = useLocation();

    useLayoutEffect(()=>{
 

        if( url2scroll.has(location.pathname) )
        { 
            setTimeout(()=>{
                window.scrollTo(0, url2scroll.get(location.pathname)); 
            }, 0)
        }


        return ()=>{
 
            url2scroll.set( location.pathname,  window.scrollY ) ; 

        }

    });

    return "";
}