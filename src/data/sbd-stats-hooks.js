import { useMemo } from "react";
import { useGetSbdStatsLazyQuery, useGetSbdStatsQuery } from "./generated---db-types-and-hooks";

export const useSBDStatsHook = () => {
    const { data, loading, error }  = useGetSbdStatsQuery();

    return {
        loading, error, data: data? hook(data) : null
    }
} 
 

export const useSBDStatsLazyHook = ()=>{
    const [loadSbdStats, { data, loading, error }]  = useGetSbdStatsLazyQuery();

    const hooked = useMemo(()=>data? hook( data ) : null, [data]);

    return ([
        loadSbdStats, { data:hooked, loading, error }
    ])
}

/** 
 * @type {import("./sbd-stats-hooks").HookedQuery["filterWeightClasses"]}
 */
function filterWeightClasses(bw, isf) {
    return this.sbdStats?.perclass?.filter( clas =>  ( isf==null || ( isf == 1-clas.wclass.male) ) && (!bw || ( bw>=clas.wclass.min && bw<=clas.wclass.max ) ) );
}

/** 
 * @type {import("./sbd-stats-hooks").HookedQuery["getScoreFor"]}
 */
function getScoreFor ( wclases, liftType, weight ){

    let total = 0;
    let bestThan = 0;  

    wclases.forEach( ({ graph })=>{

        graph.forEach( (vals, i)=>{ 

            let w = i*5;
            let segmentLifts = vals[ liftType ];

            if( weight>w )
            {
                bestThan += segmentLifts;
            }

            total += segmentLifts;

        });

    });

    return {
        total, 
        bestThan, 
        percent:bestThan/total,  
        classes: wclases.map(w=>w.wclass)
    }

}

/** 
 * @param {import("./generated---db-types-and-hooks").GetSbdStatsQuery} data 
 * @returns 
 */
function hook( data )
{
    return {
        ...data, 

        filterWeightClasses,
        getScoreFor 
    }
}