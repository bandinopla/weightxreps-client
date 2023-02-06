

export const todayAsYMD = () => {
    let d = new Date();
    let key = d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); 
    return key.toString().replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3");
}


export const dateToYMD = (d, asLocal=false) => { 

    var key; 

    if( asLocal )
    {
        key = d.getFullYear ()*10000+(d.getMonth()+1)*100+d.getDate(); 
    }
    else 
    {
        key = d.getUTCFullYear ()*10000+(d.getUTCMonth()+1)*100+d.getUTCDate(); 
    }
    

    return key.toString().replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3");
}


export const date2NiceString = date => {
    let m = date.toString().match(/^(?<day>\w+) (?<month>\w+) (?<date>\d+) (?<year>\d+)/);
    return m.groups.day+" "+m.groups.date+", "+m.groups.month+" "+m.groups.year;
};

export const ymd2date = (ymd, asUTC)=> {

    if( asUTC )
        return new Date( Date.UTC( ymd.substr(0,4), Number(ymd.substr(5,2))-1, ymd.substr(8) ) )
    
    return new Date( ymd.substr(0,4), Number(ymd.substr(5,2))-1, ymd.substr(8) ) 
};


/** 
 * @param {[Object]} objects  
 */
export const mergeObjects = objects => {

    let result = {};
 
     objects.forEach( obj => {

        //pegamos todas las propidedades en result
        Object.keys(obj).forEach( prop=> {

            if( result.hasOwnProperty(prop) && (typeof result[prop]=='object') && (typeof obj[prop]=='object'))
            {
                //si ambos son object... 
                // merge!!
                result[prop] = mergeObjects( [ result[prop], obj[prop] ] );
                return;
            }

            result[prop] = obj[prop];
        });

     });

     return result;
}


export const isEmail = txt => txt.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)!=null;