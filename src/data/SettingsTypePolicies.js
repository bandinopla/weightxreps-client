

export const SettingsTypePolicy = {
    
    CCSetting: {
        fields: {
            ccs: {
                merge(current, incoming) { 
                    //
                    // no dejar que sea null. Una vez que vino el dato, recordarlo siempre.
                    //
                    return current || incoming;
                }
            }
        }
    },

    OptionSetting: {
        fields: {
            options: {
                merge( current, incoming ) {
                    return current || incoming; //<-- una vez que viene, no borrarlo.
                }
            }
        }
    },

    RPESetting: {
        fields: {
            defaults: {
                merge( current, incoming ) {
                    return current || incoming; //<-- una vez que viene, no borrarlo.
                }
            },

            //
            // mantener UPDATED copi actual, no reemplazar por incoming. Usar incoming para "completar"
            //
            overrides: {
                merge( current, incoming ) {
                    if( !current ) return incoming;

                    var out = current.slice(0);

                    //
                    // buscar si ya existe el override...
                    //
                    for (let i = 0; i < incoming.length; i+=3) 
                    {
                        const rep       = incoming[i];
                        const rpe       = incoming[i+1];
                        const percent   = incoming[i+2];

                        const replace   = out.findIndex( (v,i,arr)=>v==rep && arr[i+1]==rpe );

                        //
                        // DELETE old override.
                        //
                        if( replace>-1 )
                        {
                            //borrar el viejo...
                            out.splice( replace, 3 );
                        }

                        //
                        // INSERT incoming
                        //
                        out.push( rep, rpe, percent );
                    }

                    return out;
                }
            }
        }
    }
} 