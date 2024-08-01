import { useEffect, useRef, useState } from "react"

export type AutoSaveConfig = { 
    cacheKey:string
}

export type AutoSaveReturn = { 
    config:AutoSaveConfig, 
    autosave: (text:string)=>void,
    getAutosavedText: ()=>string
}

export function useEditorAutosave( config:AutoSaveConfig ):AutoSaveReturn {
 
    let interval = useRef<number>()

    useEffect(()=>{ 

        return () => {
            clearTimeout( interval.current );
        }

    }, []);

    return { 
        config,
        autosave: text => { 

            clearTimeout( interval.current );

            interval.current = window.setTimeout(()=>{
                try 
                {
                    localStorage.setItem( config.cacheKey, text ); 
                }
                catch(error) {
                    
                    // if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                    //     console.error('LocalStorage quota exceeded');
                    // } else {
                    //     console.error('An error occurred while accessing localStorage', error);
                    // }

                }
                
            }, 1000 ); 
            
        },
        getAutosavedText: ()=> {
            let text = localStorage.getItem( config.cacheKey ) || ""
            //localStorage.removeItem( config.cacheKey );
            let defaultPattern = /^\d{4}-\d{2}-\d{2}\n@ *\d+( *bw)?\s*$/i;
            if( defaultPattern.test(text) )
            {
                return ""; //ignore...
            }
            return text;
        }
    }

}