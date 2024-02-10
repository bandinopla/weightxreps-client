

/**
 * creates an interval but calls callback with the times it was called.
 * @param {(pulseIndex:number)=>void} callback 
 * @param {number} frecuency milliseconds of the interval delay
 * @returns 
 */
export function pulseInterval( callback, frecuency ) {
    let i = 0;

    callback(i);
    return setInterval(()=>callback(i++), frecuency);
}