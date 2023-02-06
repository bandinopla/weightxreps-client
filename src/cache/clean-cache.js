

/**
 * Borra los datos cacheados del JDay y JRange de ese usuario...
 */
export const clearJdayAndJRangeOf = (cache, uid)=>{
    cache.modify({
        fields: (val, options)=>{

            if( options.fieldName=='jday' || options.fieldName=='jrange' )
            {
                if( options.storeFieldName.indexOf(`"uid":"${uid}"`)>0 )
                {
                    return options.DELETE;
                }
            }

            // else do nothing...
            return val;
        }
    });
}


export const updateUserCachedData = (cache, uid, newProps)=>{
 
    var fields = {};

    Object.keys(newProps).forEach( prop => {

        fields[prop] = (_)=>newProps[prop]

    } );

    cache.modify({
        id:`User:${uid}`,
        fields 
    });

    return true;
}

  