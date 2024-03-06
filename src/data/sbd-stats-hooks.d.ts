import { QueryResult, QueryTuple } from "@apollo/client";
import { GetSbdStatsQuery, GetSbdStatsQueryVariables } from "./generated---db-types-and-hooks";

type WeightClasses = NonNullable<GetSbdStatsQuery["sbdStats"]>["perclass"];

type HookedQuery = GetSbdStatsQuery & {

    /**
     * Filter the weight classes only returning the ones that match the gender and/or bodyweight.
     */
    filterWeightClasses: ( bw:number, isf:0|1|2 )=>WeightClasses,

    /**
     * Returns the score of a particular lift based on how many lifts it beated over the total.
     * 
     * `wclases` should be the return of `filterWeightClasses`
     */
    getScoreFor: ( wclases:WeightClasses, liftType:0|1|2, weight:number ) => {
        total:number, 
        bestThan:number, 
        percent:number,
        classes:NonNullable<NonNullable<NonNullable<GetSbdStatsQuery["sbdStats"]>["perclass"]>[0]>["wclass"][]
    },

    /**
     * Formula used in the SBD Stats to calculate 1RM
     */
    calculate1RM: ( weight:number, reps:number ) => number
}

export function useSBDStatsHook(): QueryResult<HookedQuery, GetSbdStatsQueryVariables>;
export function useSBDStatsLazyHook():QueryTuple<HookedQuery, GetSbdStatsQueryVariables>;
