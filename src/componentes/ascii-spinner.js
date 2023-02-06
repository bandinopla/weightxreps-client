import { useEffect, useRef } from "react";




export const AsciiSpinner = ({ label })=>{
    const frames = "┤┘┴└├┌┬┐";

    const ref = useRef();

    useEffect(()=>{

        var _frame = 0;
        const total = frames.length;
        const anim = setInterval( ()=>{ 
            _frame++;
            
            if( ref.current )
                ref.current.innerHTML = frames.substr(_frame%total,1)+" "+ label.substr(0, _frame%label.length)+" "+ label.substr(_frame%label.length);

        }, 100);

        return ()=>clearInterval(anim);
    });

    return <div ref={ref}></div>; //frames.substr(frame,1)+" "+label+".".repeat( frame%3 );
}