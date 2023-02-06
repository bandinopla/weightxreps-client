import { useEffect } from 'react';
import { makeVar, useReactiveVar } from '@apollo/client';
import { Badge, withStyles } from '@material-ui/core';
import {
    gql
} from "@apollo/client";
import { parseError } from '../data/db';
import { useGetInboxQuery } from '../data/generated---db-types-and-hooks';
import { __resolveReferencedUserId } from '../data/type-policies';
import { useCurrentSession } from './session-handler';

const $newMessagesCount = makeVar(0);  


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

 

export const useInbox = ()=>{
    const  { data, loading, error, fetchMore } = useGetInboxQuery()  //useQuery( GET_INBOX );  
    
 
    //
    // fetch NEW data
    //
    const checkForNewNotifications = ()=>{

        let newerThan = data?.getInbox?.notifications[0]?.when;   
         
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

        let olderThan = when || data.getInbox.notifications.slice(-1)[0].when;
 
        if( !olderThan ) {
            return Promise.resolve([]);
        }

        return fetchMore({
            variables: {
                olderThan
            }
        })
        .then( res => res.data.getInbox?.notifications.length>0 );
    } 
 
 
    let rtrn = data?.getInbox.notifications ;
  
 
    return {
              inbox     : rtrn //data?.getInbox.notifications
            , loading
            , error     :error && parseError(error)
            , checkForNewNotifications
            , loadOlderNotifications 
            , setUnseenNotificationsCount: (totalUnseen)=> {
                //$newMessagesCount(totalUnseen)
                setTimeout($newMessagesCount, 100, totalUnseen)
            }
        };
}


/**
 * Encargado de buscar nuevos mensajes...
 */
export const InboxManager = ()=>{

    const autoFetchNewer            = true;
    const currentSession            = useCurrentSession();
    const fetchIntervalInSeconds    = 120;

    //regularmente pedir los nuevos mensajes...
    const { inbox, error, checkForNewNotifications } = useInbox();
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

                console.log("INTERVAL!")

                if( !autoFetchNewer) return;

                    //cargar....
                    console.log("NEWER THAN: ", inbox.slice(-1)[0].id)  
                     
                    checkForNewNotifications()
                        .then( res => {
  
                            //
                            // si mo devuelve nada [inbox] no va a cambiar, asi que hay que repetir...
                            //
                            if( !res.data.getInbox || res.data.getInbox.notifications.length==0 )
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
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      [theme.breakpoints.up("md")]: {
          display:"none"
      }
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
export const NotificationsBadge = ({children, showOnlyOnMobile})=> {
    const newMessages = useReactiveVar($newMessagesCount);
    const Element = showOnlyOnMobile? LowerBadge : Badge;

    return <Element badgeContent={newMessages} color="secondary">
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