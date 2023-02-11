import { useEffect, useState } from 'react'; 
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

    const logout = ()=>{ 

        //
        // Updateing the Apollo's Client cache... 
        //
        client.writeQuery({
            query: gql`
                query GetSession {
                    getSession {
                        user {
                            ...UserFields
                        }
                        time
                    }
                } 
                ${UserFieldsFragmentDoc}
            `,
            data: { 
                getSession : null
            },
          });

        reload(false); 
        
    }  

    /**
     * 
     * @param {string|boolean|undefined} newToken FALSE=logout, "abc"=set session token and refetch, null=refetch
     */
    const reload = newToken => {

        if( newToken===false )
        {
            localStorage.removeItem( SESSION_TOKEN ); 
        }
        else if( typeof newToken == 'string' )
        {
            localStorage.setItem( SESSION_TOKEN, newToken );
        }

        return refetch();  
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
export const useReactiveSetting = reactiveSettingOrNot => {

    var value       = reactiveSettingOrNot? reactiveSettingOrNot() : undefined; 
    var setValue    = useState(value)[1]; 

    useEffect(function () {

        if( reactiveSettingOrNot==null ) 
        {
            return;
        } 

        var probablySameValue = reactiveSettingOrNot();

        if (value !== probablySameValue) 
        {
            setValue(probablySameValue);
        }
        else 
        {
            return reactiveSettingOrNot.onNextChange(setValue); //devuelve la unsubscribe function
        }

    }, [value]);

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
 