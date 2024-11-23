import { __resolveReferencedExerciseId, __resolveReferencedUserId } from "./type-policies";

const query2pages = new Map(); 

export const SearchResultsPolicy = {
    SearchResult: {
        fields: {
            exercise: __resolveReferencedExerciseId,
            user: __resolveReferencedUserId
        }
    }
    ,
    Query: {
        fields: { 
            search: {
                keyArgs:["query"],
                merge: (existing = [], incoming, { args: { query, page = 1 }}) => {

                    if( !query2pages.has(query) )
                    {
                        query2pages.set(query, []);
                    }
                    const $pages = query2pages.get( query );
                    
                    $pages[ page ] = incoming;

                    if( existing )
                    {
                        return $pages.reduce( (out, page)=>{

                            out.results.push( ...page.results );

                            out.page = page.page;

                            return out;

                        } , {
                            referencedExercises:[],
                            referencedUsers:[],
                            results:[],
                            page: 1
                        });
                    }

                    return incoming;
                }
            }
        }
    }
}