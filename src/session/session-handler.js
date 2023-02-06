import { useEffect, useState } from 'react';
import { makeVar } from '@apollo/client';
import { parseError } from "../data/db";
import { useReactiveVar } from '@apollo/client';
import { getOrCreateSettingsHandler } from '../utils/local-storage-settings';
import { ReactiveVar } from '@apollo/client';

import { useGetSessionQuery, useLoginMutation } from '../data/generated---db-types-and-hooks';


const $token                 = makeVar( localStorage.getItem("token") ); 
const $currentSession        = makeVar();


//export const getAuthorizationHeaderValue = ()=> $token() || "" ;

export const getAuthorizationHeaders = ()=> {
    let token = $token();

    if(!token)
        return null;

    return {
        authorization: `Bearer ${token}`
    }
};


//------------- GET SESSION
 

export const useGetSession = ()=> {

    const { data, loading, error, client }      = useGetSessionQuery();
    let userSettings; 

    const logout = ()=>{

        localStorage.removeItem("token");
        $token(false); 
        
        window.open("/","_self");

        /*
        client.resetStore().catch(e=>{
            //ignroe errors...
        });
        */
        
    }

    //aca meter el localstore settings...
    if( data?.getSession )
    {
        //-------------------------------------------------
        //     U S E R   L O C A L   S E T T I N G S
        //-------------------------------------------------
        userSettings = getOrCreateSettingsHandler( data.getSession.user.id, settings=>{
            settings.convertDisplayUnits        = false;
            settings.notificationsLastSeenDate  = null;
        });

        //
        // setear la reactive var solo si cambio el UID
        //
        //if( $currentSession()?.user.id!=data.getSession.user.id )
        //{
            //
            // { user, userSettings }
            //
            // $currentSession({ 
            //     user: data.getSession.user,
            //     userSettings
            // });

            setTimeout( $currentSession, 100, { 
                user: data.getSession.user,
                userSettings,
                logout
            });
        //}
    }  
    else 
    {
        setTimeout( $currentSession, 100, null ); 
    }
     
    
  
    return { session            : data && data.getSession
            , userSettings
            
            , loadingSession    : loading
            , sessionError      : error && parseError(error)
            , logout             
        } 
}

/**
 * hook para quienes el session object pero no quieren tenes que lidiar con el loading state o error state.
 * @returns {{ user:{id:number, uname:string, __etc }, userSettings:{ [key:string]:ReactiveVar }, logout:()=>void } | null}
 */
export const useCurrentSession = () => {
    const csess = useReactiveVar($currentSession); 
    return  csess;
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



// ------------------ LOGIN
// const DO_LOGIN = gql`
//     mutation DoLogin($u:String!, $p:String!) {
//         login( u:$u, p:$p ) 
//     }
// `;

export const useLogin = ()=> {
 
    const token = useReactiveVar($token);
    const [ doLogin, { data, loading, error, client }] = useLoginMutation() ;// useMutation( DO_LOGIN ); 
 
    //var loginWasOk = localStorage.getItem("token") !=null;
  

    const _doLogin = (u, p)=>{
         
        return doLogin({ variables:{ u, p } })
                        .then( ({data})=>{
                            
                            if( data?.login )
                            { 
                                console.log("LOGIN!!!");
 
                                return setSessionToken(data.login,client);
                                //localStorage.setItem( "token", data.login ); 
                                //$token(data.login); 
                                //client.resetStore().catch(e=>console.error(e)); //triggers un refetch de todos los queries...
                            }

                        });
    };

    return [ _doLogin
            , {
                loginWasOk      : token    , 
                loadingLogin    : loading, 
                loginError      : error && parseError(error) 
            } ];
}


/**
 * Setea el token de session y reinicia el cache...
 * @param {string} token 
 */
export const setSessionToken = (token, client) => {
    localStorage.setItem( "token", token ); 
    $token(token); 
    client.resetStore().catch(e=>console.error(e)); 
    return token;
}