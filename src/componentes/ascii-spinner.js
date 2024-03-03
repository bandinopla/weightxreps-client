import { useEffect, useRef } from "react";



/**
 * Creates an intervall that will call callback with label + spinning ascii icon
 * @param {string} label 
 * @param {(label:string)=>void} callback 
 * @returns 
 */
export function asciiSpinnerInterval (label, callback) {
    const frames = "┤┘┴└├┌┬┐";
    var _frame = 0;
    const total = frames.length;

    return setInterval( ()=>{ 
        _frame++;
        
        callback( frames.substr(_frame%total,1)+" "+ label.substr(0, _frame%label.length)+" "+ label.substr(_frame%label.length) );

    }, 100)
}

 

/**  
 * @returns 
 */
export const AsciiSpinner = ({ label, styles })=>{ 

    const ref = useRef();

    useEffect(()=>{ 

        const anim = asciiSpinnerInterval(label, txt => { 
                                if( ref.current )
                                    ref.current.innerHTML=txt ;
                            } );

        return ()=>clearInterval(anim);
    });

    return <div ref={ref} style={{...styles}}></div>; //frames.substr(frame,1)+" "+label+".".repeat( frame%3 );
}