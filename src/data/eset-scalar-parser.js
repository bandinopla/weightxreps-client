

export const ESetScalarTypePoliciy = {  
    // EBlock: {
    //     fields: {
    //         sets: {
    //             read( current, { cache } ) { 
                     
    //                 return current.map( setData=>{

    //                     let set = { w:0, r:1, s:1 };
 
    //                     /**
    //                      * - Un string que contiene "BW" significa que el peso se agregó al BW
    //                      * - si termina en "l" significa que se ingresó como Pounds y no KG
    //                      * - el numero puede ser negativo.
    //                      * - si inicia con "!" es un PR
    //                      * 
    //                      * Casos posibles:
    //                      *      "100l" --> meaning. son 100 pero se ingreso como LBS
    //                      *      "-20"  --> numero negativo
    //                      *      "BW+20l" --> 20 (in lbs) added to BW
    //                      *      "BW" --> solo uso BW...
    //                      */
    //                     const extractW = str=>{ 

    //                         if( typeof str=="string" && str.charAt(0)=="!" )
    //                         {
    //                             set.isPR = true;
    //                             str = str.substr(1);
    //                         }

    //                         if( str=="BW" ) 
    //                         {
    //                             set.added2BW = true;
    //                             return 0;
    //                         }

    //                         let m = str.match(/^(BW)?([-\+]?\d+(?:\.\d+)?)(l)?/);

    //                         if( m[1] ) {
    //                             set.added2BW = true;
    //                         }

    //                         if( m[3] ) {
    //                             set.inlbs = true;
    //                         }
                            
    //                         return Number(m[2]);
    //                     }

    //                     if( !isNaN(setData) ) 
    //                     {
    //                         set.w = setData;
    //                         return set;
    //                     }

    //                     //let w = setData[0];
 
    //                     if( typeof setData == 'string' )
    //                     { 
    //                             set.w = extractW(setData); 
    //                     }
    //                     else 
    //                     {
    //                         set.w = setData[0]; // numeric...

    //                         if( typeof set.w == 'string' )
    //                         {
    //                             set.w = extractW(set.w);
    //                         }

    //                         for (let i = 1; i < setData.length; i++) {
                                
    //                             const v = setData[i];
    
    //                             if( isNaN(v) )
    //                             {
    //                                 set.c = v;
    //                                 break;
    //                             }
            
    //                             set[ i==1?"r":"s" ] = v;
    //                         }
    //                     }

                        

    //                     return set; 
    //                 } );
    //             }
    //         }
    //     }
    // }
}