import { useEffect, useRef, useState } from "react";

 
const loader = new Map();

export const IGThumbnail = ({ id })=>{
    
    id="Ca2SuN1lPh5";
    const mounted = useRef(false);
    const [img, setImg] = useState();

    useEffect(()=>{

        mounted.current = true;
        return ()=>mounted.current=false;
    },[])

    useEffect(()=>{

        if( !loader.has(id) )
        {
            loader.set(id, fetch(`https://www.instagram.com/p/${id}/`, { mode:"no-cors"}));
        } 

        loader.get(id).then( resp=>{

            if( mounted.current )
            {
                
            }

        });

    }, [id]);

    return "..."
}