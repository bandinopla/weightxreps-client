import { useEffect, useMemo } from 'react';
import { makeVar, useReactiveVar } from '@apollo/client';
import { Badge, withStyles } from '@material-ui/core';
import {
    gql
} from "@apollo/client";
import { parseError } from '../data/db';
import { useGetInboxQuery, useGetNotificationsQuery } from '../data/generated---db-types-and-hooks';
import { __resolveReferencedUserId } from '../data/type-policies';
import { useGetSession, useReactiveSetting } from './session-handler';



const $newMessagesCount = makeVar(0);  
const $newNotificationsCount = makeVar(0);  


/** 
 * @param {Array} existing 
 * @param {Array} incoming 
 * @returns 
 */
 const mergeNotifications = ( existing, incoming, { readField } ) =>
 {  
     if( !incoming ) 
     { 
         return existing;
     }

     const sortByDate = (a,b)=>b.date - a.date;
     //
     // util. Para poder obtener el mismo resultado que readField pero pasando "prop1.prop2.prop3" etc...
     //
     // const readNested = (prop, target) => prop.split(".").reduce( (val, cprop)=>readField(cprop,val), target ); 

     //
     // obtener el valor de la prop "when" segun el tipo que sea...
     //
     const getWhenOf = msg => readField("when", msg); 

     //
     // para poder hacer el sort. Agregarle una propiedad "date" que sea un Date object con el valor de "when"
     // 
     let _incoming = { ...incoming };

     _incoming.notifications = incoming .notifications
                                        .map(msg=>({ ...msg, date:new Date( getWhenOf(msg) ) }))
                                       
                                       ;
 

     if( existing )
     { 
         //
         // Ordenar por FECHA ("when") de más reciente a más viejo.
         // 

         // merge users dicc
         // merge notifications
 
          
         //return [...existing, ...incoming].sort(sortByDate); 
         let _return = {
             __typename:"Inbox",
 
             notifications   : [  
                                    ..._incoming.notifications,
                                    ...existing.notifications
                                   ]

                                    //
                                    // Priorizar "incoming" y quitar duplicados.
                                    //
                                   .filter( (itm, i, arr) =>arr.findIndex(o=>o.__ref==itm.__ref)==i )

                                   //
                                   // ordenar por fecha...
                                   //
                                   .sort(sortByDate), 

             referencedUsers : _incoming.referencedUsers? [  
                                                            ..._incoming.referencedUsers,
                                                            ...existing.referencedUsers
                                                          ]

                                 // priorizar "incoming"
                                 // quitar duplicados
                                 //
                                 .filter( (ref,i, arr)=>arr.findIndex(itm=>itm.__ref==ref.__ref)==i )
                                 : existing.referencedUsers
         }
 
         
         return _return;
     }

     _incoming.notifications.sort(sortByDate);
      

     return _incoming;//.sort(sortByDate);;
 }



export const inboxTypePolicies = { 

    /*
    INotification: {
        fields: {
            when: {
                read( existing ) {
                    return existing ? new Date( existing ) : null
                }
            }
        }
    }, */

    IBy         : { fields: { by            : __resolveReferencedUserId } },
    ITO         : { fields: { to            : __resolveReferencedUserId } },
    IHasJOwner  : { fields: { jowner        : __resolveReferencedUserId } }, 
    IMessageRef : { fields: { inResponseTo  : __resolveReferencedUserId } }, 
    
    Query       : {
        fields  : {
            getInbox: { 
                keyArgs     : false, 
                merge       : mergeNotifications
            },

            getNotifications: { 
                keyArgs     : false, 
                merge       : mergeNotifications
            },

            getLogInbox: {
                keyArgs     : ["logid"],
                merge       : mergeNotifications
            },

            getAllPublicInteractionsInbox: {
                keyArgs     : false, 
                merge       : mergeNotifications
            }
        }
    }
}

 
/**
 * @typedef {ReturnType<typeof useInbox>} UseInboxReturnType
 */
 

export const useInbox = ( type, uid, SETTINGS ) =>{
 
 
    //
    // i know this is not optimal... but i had to refactor this.
    //
    const propName      = type==1? "getInbox" : "getNotifications";

    const DMs                   = useGetInboxQuery({ notifyOnNetworkStatusChange:true });
    const Notifs                = useGetNotificationsQuery({ notifyOnNetworkStatusChange:true });
    const reactiveLastSeen      = SETTINGS?.[ type==1? "inboxLastSeenDate": "notificationsLastSeenDate" ];
    const lastSeen              = useReactiveSetting( reactiveLastSeen ); 
    // //last Seen
    // const setting       = SETTINGS?.[ type==1? "inboxLastSeenDate": "notificationsLastSeenDate" ];
    // const lastSeen      = useReactiveSetting( setting );


    const  { data, loading, error, fetchMore } = type==1? DMs : Notifs ; 
    const parsedError = useMemo(()=>error? parseError(error) : null ,[error]);

    const inbox = data?.[propName]?.notifications ;


    /**
     * The goal here is to condense the individual messages grouping them by, if they are DMs, the id of the use to which the session user is talking to.
     */
    const filteredInbox = useMemo(()=>{

        if( !inbox || !uid ) return; 

        //se supone vienen ordenados por fecha...
        //agruparlos. Mostrar solo 1 por username....   
        //
        // quitar todos los items (salvo el más reciente) relacionados con un DM de un usuario.
        // 
        let uidDM   = new Map(); 

        return inbox
        
        .map( msg => { //<--- combine DMs

            let otherUID; //user DM

            // DM | DMSent | LikeOnMyDM

            switch( msg.__typename ) 
            {
                case "DM":
                case "LikeOnDM": 

                if( msg.text.length>80 ) { 
                    msg = {
                        ...msg,
                        text: msg.text+"[...]"
                    } 
                }

                //
                // if "to" el item es un "sent message" de nosotros hacia ese usuario...
                // if "by" es un DM enviado a nosotros
                //
                otherUID = msg.by.id==uid? msg.to.id : msg.by.id; //el context del mensaje
                break; 
            } 
 
            //
            // si estamos en el contexto de un "DM"...
            //
            if( otherUID )
            {
                //
                // si no hay nada ya procesado... es un item reciente:
                //
                if( !uidDM.has(otherUID) )
                {
                    let combined = { _combined:true, count:0, notification:msg };
                    uidDM.set(otherUID, combined);
                    return combined;
                }

                //
                // else, es un evento viejo. 
                //
                uidDM.get(otherUID).count++;  
                return null; // we don't add this since it is already represented by the combined item created above.
            }



            //
            // todo lo demas se agrega así como viene
            //
            return msg; 
        })

        .filter( itm=>itm!=null )

        // .map( msg => { //<--- calculate freshness...
        //     const item  = msg._combined? msg.notification : msg;
        //     let itmDate = new Date( item.when ); 
        //     let unseen = (!lastSeenDate || lastSeenDate<itmDate) && ( item.by!=null && (item.by.id!=uid) );

        //     // if(unseen)
        //     // {
        //     //     console.log( itmDate, lastSeenDate )
        //     // }

        //     return {
        //         ...msg,
        //         isFresh: unseen //---> by "is fresh" we mean, it hasn't been seen by the user on this browser since "lastSeenDate"
        //         , date : itmDate
        //     }
        // })
        
        ; 

    },[ inbox, uid ]);

    /**
     * A fresh message is a message that it is considered new for the user in this current browser session.
     * We compare the date of the last time the user saw the inbox vs the date of the message to determine if the user has seen it.
     * A message is "fresh" for 12 hours even if the user has seen it...
     */
    const inboxWithFreshness = useMemo(()=>{   
 
        const lastSeenDate = lastSeen? new Date(lastSeen) : null;

        return filteredInbox?.map( itm => {
 
            const item = itm._combined? itm.notification : itm;

            let itmDate = new Date( item.when ); 

            let isUnseen = (!lastSeenDate || lastSeenDate<itmDate) && ( item.by!=null && (item.by.id!=uid) );  
    
            return { 
                ...itm,
                isUnseen,
                caca:true
            } ;
    
        } )  ;

    }, [ filteredInbox, lastSeen, uid ])

  
    //
    // fetch NEW data
    //
    const checkForNewNotifications = ()=>{

        let newerThan = data?.[propName]?.notifications[0]?.when;   
         
        return fetchMore({
            variables: {
               newerThan
            }
        })
    }

    //
    // fetch OLD data
    //
    const loadOlderNotifications = (when)=>{

        let olderThan = when || data[propName].notifications.slice(-1)[0].when;
 
        if( !olderThan ) {
            return Promise.resolve([]);
        }

        return fetchMore({
            variables: {
                olderThan
            }
        })
        .then( res => res.data[propName]?.notifications.length>0 );
    } 
 
 
    
 
  
 
    return {
              inbox 
            , filteredInbox: inboxWithFreshness //<--- grouping DMs into a single item (the latest message in that chat)
            , unread: inboxWithFreshness?.reduce( (t, itm)=>t + Number(itm.isUnseen), 0) ?? 0
            , loading
            , error     : parsedError
            , checkForNewNotifications
            , loadOlderNotifications 
            // , setUnseenNotificationsCount: (totalUnseen)=> {

            //     const rVar = type==1? $newMessagesCount : $newNotificationsCount;

            //     //rVar(totalUnseen);
            //     return setTimeout(rVar, 100, totalUnseen);
            // },
            ,markAllAsRead: ()=>{
                reactiveLastSeen(new Date().toUTCString());
            },
            propName
        };
}


/**
 * Encargado de buscar nuevos mensajes...
 */
export const InboxManager = ({ type })=>{

    const autoFetchNewer            = true;
    const { session:currentSession}            = useGetSession();
    const fetchIntervalInSeconds    = 120;

    //regularmente pedir los nuevos mensajes...
    const { inbox, error, checkForNewNotifications, propName } = useInbox(type);
    //console.log("Calling useGetInboxQuery ")
 

    //
    // BUSCAR NUEVOS MENSAJES CADA X SEGUNDOS...
    //
    //#region Fetch new messages...
    useEffect( ()=>{

        var interval;

        const startTimeout = ()=>{

            clearInterval(interval);

            interval = setTimeout( ()=>{
 

                if( !autoFetchNewer) return; 
                     
                    checkForNewNotifications()
                        .then( res => {
  
                            //
                            // si mo devuelve nada [inbox] no va a cambiar, asi que hay que repetir...
                            //
                            if( !res.data[propName] || res.data[propName].notifications.length==0 )
                            {
                                startTimeout();
                            }
                        })
                        .catch( e=>{
 
                            startTimeout();

                        } ) // ignore errors....  

            }, fetchIntervalInSeconds*1000 );
        }

        if( currentSession )
        {
            startTimeout();
        }  
        

        return ()=>clearInterval(interval);

    }, [inbox, currentSession] );
    //#endregion

    return "";
}





///
///------------ BADGE ------------------
///
const LowerBadge = withStyles((theme) => ({
    badge: {
      right: -3,
      top: 13,
      border: `2px solid red`,
      padding: '0 4px',
    //   [theme.breakpoints.up("md")]: {
    //       display:"none"
    //   }
    },
  }))(Badge); 
 
  /**
   * Badge: pone un numero con la cantidad de mensaje sno leidos.
   * 
   * @typedef {Object} NotificationsBadgeParams
   * @property {Boolean} showOnlyOnMobile If set, solo se muestra en XS
   * 
   * @param { ...NotificationsBadgeParams} param0 
   * @returns 
   */
export const NotificationsBadge = ({children, small, type, showOnlyOnMobile})=> {

    const user = useGetSession();
    const newMessages = type==1? user.messages.unread : user.notifications.unread;
    //const newMessages = useReactiveVar(type==1? $newMessagesCount : $newNotificationsCount);

    const Element = LowerBadge; //showOnlyOnMobile? LowerBadge : Badge;

    return <Element badgeContent={newMessages} color="error" variant={ small? "dot":"standard"}>
                    {children}
            </Element> ;
} 

 
/**
 * @link https://www.apollographql.com/docs/react/data/mutations/#updating-local-data
 * @link https://www.apollographql.com/docs/react/caching/cache-interaction/#using-cachemodify
 * 
 * ==Add new
 * Agrega 1 item nuevo al array de notifications... 
 * 
 * ```javascript 
 * {    
 *      // Append a *NEW* item
 *      update: updateCachedNotificationsArray( data => ({
 *          getInbox: { // <-- nombre de la mutacion que devolvió el inbox que queres modificar.
 *              __typename:"DM",
 *              ...
 *          }
 *        }) 
 *     )} 
 * ```
 * 
 * ==Modificar un item
 * ```javascript 
 * {
 *      update: updateCachedNotificationsArray( data => ({
 *          getInbox: {
 *              __modifyThis: {
 *                  item: { __typename, id, ... } //<--- referencia a un item del Inbox
 *                  , fieldsModifiers: {
 *                      someField( currentValue ) {
 *                          return "new value";
 *                      }
 *                  } 
 *              }
 *          }  
 *      }) 
 * }
 * ```
 * == DELETE MODE
 * ```javascript
 * {
 *  update: updateCachedNotificationsArray( data => ({
 *      getInbox: {
 *          // por cada item de las notificaciones, se llama a remove. Si devuelve true se borra.
 *          remove: itemFieldReader => {
 *              return itemFieldReader("id")==123; //
 *          }
 *      }
 *  }) 
 * }
 * 
 * ```
 * 
 * @param { (data:any)=>{[queryField:string]:any} } how 
 * @returns 
 */
export const updateCachedNotificationsArray = ( how )=>{

    return ( cache, { data }) => {

            var newNotifs       = how(data);
            const fields        = Object.keys(newNotifs);
            const modifySpecs   = {};
            const forceReturn   = false;
 
            //
            // por cada field...
            //
            fields.some( field => {

                var _fieldObj = newNotifs[field];

                //
                // DELETE mode
                //
                if( typeof _fieldObj.remove == 'function' )
                {
                    modifySpecs[ field ] = (existing, {readField}) => {

                        return {

                            //
                            // filtramos las notifications, quitamos las que nos indique el callback "remove"
                            //
                            notifications   : existing.notifications.filter( ref=>{ 

                                //
                                // el callback "remove" nos dice si el tiem hay que borrarlo o no...
                                //
                                var mustRemove = _fieldObj.remove( prop=>readField(prop, ref) );

                                //
                                // tambien borrar el objeto al que hacia referencia
                                //
                                if( mustRemove ) 
                                    cache.evict({ id: ref.__ref }); 

                                //
                                // si no se borro, devolver true
                                //
                                return !mustRemove; 
                            }),

                            referencedUsers : [ ...existing.referencedUsers ]
                        }; 

                    };
                    return;
                }

                //
                // MODIFY mode?
                //
                if( typeof _fieldObj.__modifyThis == 'object' )
                {
                    const item          = _fieldObj.__modifyThis.item;
                    const itemCacheId   = item.__typename+":"+item.id; 

                    cache.modify({
                        id      : itemCacheId,
                        fields  : _fieldObj.__modifyThis.fieldsModifiers
                    }); 
                        
                    return; 
                } 
 
                //
                // ADD NEW item mode...
                //
                modifySpecs[ field ] = existing => {
   
                    var itm         = newNotifs[field];  
                    
                    var fragment    = gql`fragment ${itm.__typename}Fragment on ${itm.__typename} { 
                                            ${ Object.keys(itm).join(" ")} 
                                     } `;
 
                    const newNotif  = cache.writeFragment( { data: itm, fragment } );

                    return {
                        notifications   : [ newNotif, ...existing.notifications ],
                        referencedUsers : [ ...existing.referencedUsers ]
                    };  
                };

            });

            //
            // modificar si hay algo que modificar
            //
            if( Object.keys(modifySpecs).length>0 )
            { 
                cache.modify({ fields: modifySpecs }); 
            }
            
        }  
}