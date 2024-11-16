import { useEffect, useRef, useState } from "react"

export type AutoSaveConfig = { 
    cacheKey:()=>string
}

export type AutoSaveReturn = { 
    config:AutoSaveConfig, 
    autosave: (text:string)=>void,
    getAutosavedText: ()=>string,
    clear: ( stopAutosaving:boolean )=>void
}

class LocalStoragePolyfill {
    setItem = (key: string, value: string) => localStorage?.setItem(key, value);
    getItem = (key: string) => localStorage?.getItem(key) ?? null;
    removeItem = (key: string) => localStorage?.removeItem(key);
    clear = ( ) => localStorage?.clear();
}

const $lstorage = new LocalStoragePolyfill();

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
                $lstorage.setItem(config.cacheKey(), text);
                
            }, 1000 ); 
            
        },
        getAutosavedText: ()=> {
            let text = $lstorage.getItem( config.cacheKey() ) || ""
            //localStorage.removeItem( config.cacheKey );
            let defaultPattern = /^\d{4}-\d{2}-\d{2}\n@ *\d+( *bw)?\s*$/i;
            if( defaultPattern.test(text) )
            {
                return ""; //ignore...
            }
            return text;
        },
        clear: ( stopAutosaving :boolean )=>{
            $lstorage.removeItem(config.cacheKey())
            if( stopAutosaving )
            {
                clearTimeout( interval.current );
            }
        }
    }

}