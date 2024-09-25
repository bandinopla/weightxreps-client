
import gql from "graphql-tag";
import { inDevMode } from "../system-config"; 
import { BriefUserFieldsFragmentDoc } from "./generated---db-types-and-hooks";
//import fake from "./mock";
const fake = {};

export const __resolveReferencedUserId = {
    read( current, { cache } ) {
 
        if( isNaN(current) ) return current;

        return cache.readFragment({
            id: 'User:'+current, // The value of the to-do item's unique identifier
            fragment: BriefUserFieldsFragmentDoc,
          });
    }
}

export const __resolveReferencedExerciseId = {
    read( current, { cache } ) {  
 
        return cache.readFragment({
            id: 'Exercise:'+current, 
            fragment: gql`fragment ExerciseFields on Exercise {
                id
                name 
                type
            }`,
          });
    }
}


export const BaseTypePolicies = {  

    

    Query: {
        fields: {  

            getActivityFeed: {

                keyArgs:["type"],

                /** 
                 * @param {Array} existing 
                 * @param {Array} incoming 
                 * @returns 
                 */
                merge( existing, incoming ) {

                    if( existing )
                    {  
                        return incoming .concat( 

                                                //
                                                // Ignorar lo existing que haya venido en el incoming:
                                                // lo que viene se prioriza...
                                                // se borra si está en el array "viejo"
                                                //
                                                existing.filter( old => incoming.findIndex(itm=>itm.user.__ref==old.user.__ref)<0 ) 

                                            )
                                            
                                            // ordenar por fecha de mas nuevo a mas viejo
                                            .sort( (a,b)=>new Date(b.when) - new Date(a.when) );
                    }

                    return incoming;
                }
            },

            globalFeed: {    
                
                /*
                keyArgs: false, 
                merge(existing, incoming){
                    return {
                        cursor: incoming.cursor,
                        feed: [ ...existing.feed, ...incoming.feed ]
                    }
                }, */
                 
                read( current, { variables } ) { 

                    if( !current && inDevMode)
                    {     
                        return fake.GetFeed;
                    } 

                    return current;
                },  
                
            } 
            
            , getCalendarDays: {

                keyArgs:["uid"],  
                 
                merge(current, incoming) {

                    return current? [ ...current, ...incoming ] : incoming;
                },  
                 
              
                // read( current, { variables, args }) {
                    
                //     if( !current && inDevMode)
                //     {   
                //         return fake.FAKE_CALENDAR_DATA;
                //     }  
                // } 
            } 

            // , jday: {
            //     read( current, { variables } ) {
            //         if( !current && inDevMode ) 
            //             return fake.JDayData( variables );
            //     }
            // }

            , jcomments: {
                read(current){
                    if( !current && inDevMode ) 
                        return fake.JComments;
                }
            }

            , alsoposted: {
                keyArgs:["ymd"] 
            }
 

        }
    }
}