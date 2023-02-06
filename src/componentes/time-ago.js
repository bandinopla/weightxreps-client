import { useEffect, useState } from "react";
import { date2timeago } from "./TimeAgoDisplay";


/**
 * Muestra cuanto tiempo paso desde esa fecha. Y se actualiza cada X segundos.
 * 
 * @param { { when: string|Date }} param0 
 * @returns 
 */
export const TimeAgo = ({when})=>{

    const update_every_x_seconds = 60;

    if( typeof when=='string' ) {
        when = new Date(when);
    }
    
    const [timeAgo, setTimeAgo] = useState();

    if(!timeAgo && when) {
        setTimeAgo( date2timeago(when) );
    }

    useEffect( ()=>{
 
        let int;
        let diff = new Date().getTime() - when.getTime();

        if( diff < 1000*60*60*24 ) //menos de un dia...
        {
            int = setInterval( ()=>{

                let t = date2timeago(when);

                if( t!=timeAgo)
                {
                    setTimeAgo( t );
                } 
            
            }, update_every_x_seconds*1000 );  
        }

        return ()=>clearInterval(int);

    }, [timeAgo] );

    return <>{timeAgo}</>;
};