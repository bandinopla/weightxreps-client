/** 
 * When importing RPE values, other apps might allow diferent RPE values, but hee in weightxreps we only allow
 * RPE from 6 to 10 and only .5 as "in between"
 * 
 * @param {number} rpeValue 
 * @returns {number} the RPE in the valid range WXR logs accept
 */
export function fixRPE( rpeValue )
{
    if( isNaN(rpeValue) || rpeValue<6 || rpeValue>10 )
    {
        return 0;
    }

    return Math.round(rpeValue * 2) / 2;
}