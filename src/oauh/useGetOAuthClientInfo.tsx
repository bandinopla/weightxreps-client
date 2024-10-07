import { useEffect, useMemo } from "react";
import useFetch from "../utils/useFetch";
import { $nodeURI, $serverURI } from "../data/db";


type ServerResponse = {
    name:string,
    url:string,
    availableScopes:{ [scopeId:string]:string }
}

export type ClientInfoHookReturn = {
    clientId?:string,
    status:Omit<ReturnType<typeof useFetch>[1], 'data'> & { data?:ServerResponse }
}

export default function useGetOAuthClientInfo( clientId:string, scope:string ) : ClientInfoHookReturn {

    const emptyParams = clientId=="" || scope=="";
    const [fetch, status] = useFetch();
    const response = useMemo<ClientInfoHookReturn["status"]>(()=>{
        if( status.data )
        { 
            let usedScopes = scope.split(",");
            let sysScopes = (status.data as ServerResponse).availableScopes ;
            let invalid:string[] = [];
            //
            // transform the available scopes from "all the ones available in the system" to the ones that this particular client is actually using.
            // NOTE: if scopes are made up or fake, the resulting "availableObjects" will be an empty object with no properties.
            // 
            let availableScopes = usedScopes.reduce<Record<string, string>>((o, usedScope)=>{
                
                let desc = sysScopes[usedScope];

                if( desc )
                {
                    o[ usedScope ] = desc;
                }
                else 
                {
                    invalid.push(usedScope);
                }
                return o;
            },{});
 
            if( Object.keys(availableScopes).length != usedScopes.length )
            {
                return {
                    error:`Requested invalid scope/s: ${invalid}`
                }
            }
            
            return { data: {
                ...status.data, 
                availableScopes
            }}
        } 
        return {};
    }, [status.data, scope])

    useEffect(()=>{

        if( !emptyParams )
        {
            fetch( $nodeURI + "/auth", { client:clientId } );
        }

    },[clientId]);

 
    return { 
        status: emptyParams? { error:"Missing client information (check the url's querystring)" } 
            : status.error ? { error:status.error } : response, 
        clientId 
    };
}