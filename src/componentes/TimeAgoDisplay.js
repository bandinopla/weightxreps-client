import { Typography } from "@material-ui/core";

//
// time = UTC time since epoch
//



export function date2timeago( time, returnUnitsOf, bracketsLimitIndex ) {

    let label = "moments";
    const TODAY = new Date( );

    //The number of milliseconds between 1 January 1970 00:00:00 UTC
    ///return time;

    let d = time instanceof Date? time : new Date(time); 

    let v = TODAY.valueOf() - d.valueOf() ; 

    const brackets = [
        [31557600000,"year"],
        [2629800000,"month"],
        [604800000,"week"],
        [86400000,"day"],
        [3600000,"hour"],
        [60000,"minute"],
        [1000,"second"]
    ];

    for (let i = 0; i < brackets.length; i++) {
        const bracket   = brackets[i];
        const units     = Math.floor( v / bracket[0] ) ; //es un estimado, no es necesario ser exacto

        if( units>=1 || ( bracketsLimitIndex!=null && i==bracketsLimitIndex) ) {

            if( returnUnitsOf==bracket[1] )
            {
                return units;
            }

            if( units<1 )
            {
                label = "less than a "+ bracket[1];
                break; 
            }
            
            label = units+" "+bracket[1]+(units>1 ? "s":"") ;
            break;
        } 
    }

    if( returnUnitsOf != null )
    {
        return 0;
    }

    return label +" ago";
}

/**
 * Le pasas un timestamp : Date.UTC(...)
 * Y devuelve el tiempo relativo que paso del presente a esa fecha.
 */
export default function({ time, ...rest }) {
 
    return <Typography variant="caption" { ...rest}>{date2timeago(time)}</Typography>;
}