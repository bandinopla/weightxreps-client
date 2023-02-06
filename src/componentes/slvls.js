import React from 'react';
import slvlsSrc from "./slvls.png";

export default function({ level, isActive, scale=1 }) {

    if( level<=0 )
    {
        return null;
    }
    //-(51px*@level) 0px;
    const x = -51* Math.max(0, Math.floor(level-1));
    const filter = isActive? "none":  "opacity(40%) grayscale(80%)"; //
 
    return <div style={{ filter , transform:"scale("+scale+")", transformOrigin:"top right", WebkitFilter:filter, maxWidth:"100%", maxHeight:"100%", height:50 , width:50 , position:"absolute", top:0, right:0, backgroundImage:"url("+slvlsSrc+")", backgroundPositionX:x+"px"}}></div>
}