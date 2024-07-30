import { useMemo } from "react";
import { useGetSbdStatsLazyQuery, useGetSbdStatsQuery } from "./generated---db-types-and-hooks";
//import {sbdstats} from "./sbd-stats";

// to match the server's default calculations
function calculate1RM( weight, reps ) {
    return Math.round( (weight * ( 46 / (47-reps) )) / 5 ) * 5;
}

export const useSBDStatsHook = () => {
    //const { data, loading, error }  = { data:{ sbdStats:sbdstats }, loading:false, error:null}; 
    const { data, loading, error }  = useGetSbdStatsQuery();

    return {
        loading, error, data: data? hook(data) : null, calculate1RM
    }
} 
 

export const useSBDStatsLazyHook = ()=>{
    const [loadSbdStats, { data, loading, error }]  = useGetSbdStatsLazyQuery();

    const hooked = useMemo(()=>data? hook( data ) : null, [data]);

    return ([
        loadSbdStats, { data:hooked, loading, error, calculate1RM }
    ])
}

/** 
 * @type {import("./sbd-stats-hooks").HookedQuery["filterWeightClasses"]}
 */
function filterWeightClasses(bw, isf, ageClass) {

    let wclasses = this.sbdStats?.perclass?.filter( clas =>  ( isf==null || ( isf == 1-clas.wclass.male) ) && (!bw || ( bw>=clas.wclass.min && bw<=clas.wclass.max ) ) );
 
    if( ageClass > -1 )
    {
        wclasses = wclasses.map( wclass=>({
            ...wclass,
            graph: wclass.graphAge.map( SBD => SBD.map( perAge=>perAge[ageClass] || 0 )  ) //<--- show only the lifts done by the corresponding age group...
        }))
    }

    return wclasses;
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
    let ageClasses = data.sbdStats?.ageClasses.map((cls,i)=>({
        name: cls,
        index:i,
        min: parseInt(cls.split("-"))
    })) 

    ageClasses.sort((a, b) => a.min - b.min); // sort from min to greatest

    return {
        ...data, 
        ageClasses, 
        filterWeightClasses,
        getScoreFor,
    }
}