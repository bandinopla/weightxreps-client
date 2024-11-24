import { useEffect, useState } from 'react';
import { getOrCreateSettingsHandler } from '../utils/local-storage-settings';
import { useGetSessionQuery, useLoginMutation } from '../data/generated---db-types-and-hooks';
import { useInbox } from './inbox-manager';
import { parseError } from '../data/db';


const SESSION_TOKEN = 'token'; 

var GUEST_SETTINGS = getOrCreateSettingsHandler( "guest", settings=>{
    settings.convertDisplayUnits        = false;
    settings.notificationsLastSeenDate  = null;
    settings.inboxLastSeenDate          = null;
    settings.firstDayOfWeek             = 0; //sunday
    settings.rankSetType                = 0;    
});

export const SessionPolicies = {} 


//export const getAuthorizationHeaderValue = ()=> $token() || "" ;

export const getAuthorizationHeaders = ()=> {

    let     token = localStorage.getItem(SESSION_TOKEN);  
    return  token ? { authorization: `Bearer ${token}` } : null;
};


//------------- GET SESSION
 
/**
 * 
 * @returns 
 */
export const useGetSession = ()=> {

    const { data, loading, error }                          = useGetSessionQuery({ notifyOnNetworkStatusChange:true });   
    const uid                                               = data?.getSession?.user.id;
    const SETTINGS                                          = uid? getOrCreateSettingsHandler( uid, settings=>{
                                                                                                settings.convertDisplayUnits        = false;
                                                                                                settings.notificationsLastSeenDate  = null;
                                                                                                settings.inboxLastSeenDate          = null;
                                                                                                settings.firstDayOfWeek             = 0; //sunday
                                                                                                settings.rankSetType                = 0;    
                                                                                            }) : GUEST_SETTINGS
    const messages                                          = useInbox(1, uid, SETTINGS);
    const notifications                                     = useInbox(2, uid, SETTINGS);

    const logout = async ()=>{  

        return reload(false); 
        
    }  

    useEffect(()=>{ 
        if( data )
        {
            document.body.classList.add("appReady")
        }
        else if( error )
        {
            document.querySelector('#sys-error > span').innerHTML =  parseError(error);
            document.body.classList.add("sysError");

        }
    },[data, error])

    /** 
     * Reloads the session token.
     * @param {string|boolean|undefined} newToken FALSE=logout, "abc"=set session token and refetch, null=refetch
     * @returns {string} the new sesison token.
     */
    const reload = async (newToken, reloadPage=true) => {

        if( newToken===false )
        {
            localStorage.removeItem( SESSION_TOKEN ); 
        }
        else if( typeof newToken == 'string' )
        {
            localStorage.setItem( SESSION_TOKEN, newToken );
        }
 
        if( reloadPage )
            window.location.reload();

        return newToken

        // return await client.resetStore()
        //                     .catch(e => {
        //                         // ignore errors... most likely "you are not logged in" errors...
        //                     });
    }
   
    return { 
             session            : data?.getSession 
            , loadingSession    : loading
            , sessionError      : error  
            , userSettings      : SETTINGS
            , messages 
            , notifications
            , reload
            , logout   
            // , messages    
            // , notifications
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
   

    const _doLogin = async (u, p, reloadAfterLogin=true )=>{

        const result = await doLogin({ variables:{ u, p } });

        if( result.data?.login )
        {   
            return await reload( result.data.login, reloadAfterLogin );
        }
        else 
        {
            throw new Error("Unexpected response...");
        }
    };

    return _doLogin;
}
 