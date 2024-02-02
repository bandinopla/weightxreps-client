import { useEffect, useLayoutEffect, useState } from 'react'; 
import { getOrCreateSettingsHandler } from '../utils/local-storage-settings'; 
import { useGetSessionQuery, useLoginMutation, UserFieldsFragmentDoc } from '../data/generated---db-types-and-hooks'; 
import { gql } from '@apollo/client';


const SESSION_TOKEN = 'token'; 


var UID = 0;
var SETTINGS;

export const SessionPolicies = {

    SessionInfo: {
        fields: {
            user: {
                read( user,  a ) {

                    if(user)
                    {
                        UID = parseInt( user.__ref.split(":")[1] );  //<-- i could cache.readFragment but im Mr. Optimization guy....

                        SETTINGS = getOrCreateSettingsHandler( UID, settings=>{
                            settings.convertDisplayUnits        = false;
                            settings.notificationsLastSeenDate  = null;
                            settings.inboxLastSeenDate          = null;
                            settings.firstDayOfWeek             = 0; //sunday
                        });
                    }
                    else 
                    {
                        UID = 0;
                        SETTINGS = null;
                    }

                    
                    
                    // este es el current logged in user. 
                    // Return the cached name, transformed to upper case 
                    // const result = a.cache.readFragment({
                    //     id: a.cache.identify(user),
                    //     fragment: gql`
                    //       fragment UserDummy on User {
                    //         id 
                    //         uname
                    //       }
                    //     `,
                    //   });
 
                    return user;
                  }
            }
        }
    } 

} 


//export const getAuthorizationHeaderValue = ()=> $token() || "" ;

export const getAuthorizationHeaders = ()=> {

    let     token = localStorage.getItem(SESSION_TOKEN);  
    return  token ? { authorization: `Bearer ${token}` } : null;
};


//------------- GET SESSION
 

export const useGetSession = ()=> {

    const { data, loading, error, client, refetch }      =  useGetSessionQuery({ notifyOnNetworkStatusChange:true });   

    const logout = async ()=>{  

        return reload(false); 
        
    }  

    /**
     * 
     * @param {string|boolean|undefined} newToken FALSE=logout, "abc"=set session token and refetch, null=refetch
     */
    const reload = async newToken => {

        if( newToken===false )
        {
            localStorage.removeItem( SESSION_TOKEN ); 
        }
        else if( typeof newToken == 'string' )
        {
            localStorage.setItem( SESSION_TOKEN, newToken );
        }
 
        
        return await client.resetStore()
                            .catch(e => {
                                // ignore errors... most likely "you are not logged in" errors...
                            });
    }
  
    return { 
             session            : data && data.getSession 
            , loadingSession    : loading
            , sessionError      : error  
            , userSettings      : SETTINGS
            , reload
            , logout       
                
        } 
}  

/**
 * Acepta un ReactiveVar como parametro. Cuando se detecta una ReactiveVar se suscribe a su onNextChange event. 
 * 
 * @param {()=>void|null} reactiveSettingOrNot Una ReactiveVar o null.
 * @returns {any} El resultado de la reactive variable
 */
export const useReactiveSetting = (reactiveSettingOrNot, name) => { 
       
    var value       = reactiveSettingOrNot? reactiveSettingOrNot() : undefined;  
    var setValue    = useState(value)[1];  

    useEffect( ()=>reactiveSettingOrNot?.onNextChange( setValue ) ); 

    return value;
}

 

export const useLogin = ()=> {
  
    const { session, reload } = useGetSession();
    const [ doLogin, { data, loading, error, client }] = useLoginMutation() ; 
   

    const _doLogin = async (u, p)=>{

        const result = await doLogin({ variables:{ u, p } });

        if( result.data?.login )
        {  
            return await reload( result.data.login ); 
        }
        else 
        {
            throw new Error("Unespected response...");
        }
    };

    return _doLogin;
}
 