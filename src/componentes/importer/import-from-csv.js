import { ImportFromFileToWXR } from "./import-from-wxr" 
import Joi from "joi"; 

const disclaimer = 
`It can/might happen that they update or change the way in which they export their data and this module results in unexpected errors!`;

/**
 * Config for a CVS improter
 * 
 * @typedef {Object} CVSParserConfig
 * @property {bool} askWeightUnitToUser if we should ask the user for the weight unit used in the file
 * @property {( firstRow:any, assumeUseKg:boolean )=>Object} startState Create the start state that will be used as initial state.
 * @property { (state:Object, row:any)=>void} processRow Process a row from the CVS
 * @property {Boolean} canContinueInCaseOfError if it can continue in case of error
 * @property {(state:Object)=>string} stateAsLog turns the state into a weightxreps log
 * @property {Joi.ObjectSchema<any>} schema Schema for a row
 * @property {boolean} verifyEachRow if true, every row will be verified against the schema, else, only the first one.
 */
 

/** 
 * Handles the importing of the CVS and uses the config to delegate the implementation of the details.
 * 
 * @param {CVSParserConfig} config details on how to parse the cvs
 * @param {File} file the CVS file
 * @param {(status:string)=>void} informStatus Send informative text to this function so the user knows wtf is going on.
 * @returns {Promise<string>} The result is a workout log as if it was typed in the lovely workout editor of this site.
 */
const formatCVS = async (config, file, informStatus) => {

    var usekg = true;

    if( config.askWeightUnitToUser === true )
    {
        informStatus("Are the weights in kilograms?"); 

        if( !window.confirm("WEIGHT UNIT\n\nIf not set in the file, what weight unit should be used? \n\nAccept = KG (Kilograms)\nCancel = LB (Pounds)"))
        {
            usekg = false;
        }
    } 

    informStatus("Prepearing to parse cvs");

    const Papa = await import(/* webpackChunkName: "papaparse" */"papaparse");
     
    return new Promise(( resolve, reject )=>{


        informStatus("Parsing starts...");

        let log = "";
        let rowsDone = 0;
        let abortedError;
        let ignoreErrors;
        let userWasPrompted = false;
        var state; 
        let errorsIgnored = 0;

        Papa.parse(file, {
            header:true,
            encoding:"utf-8",
            skipEmptyLines:"greedy",

            chunk: function(results, parser ) 
            { 
                for (let i = 0; i < results.data.length; i++) 
                { 
                    const row = results.data[i]; 

                    try 
                    {
                        if( rowsDone==0 || config.verifyEachRow )
                        {
                            //
                            // verify each row to make sure the schema matches what we expect...
                            //
                            let validationResult = config.schema.validate(row, { allowUnknown:true }); 
                            if( validationResult.error ) //validate each row.... 
                            {  
                                console.error(validationResult.error)
                                throw new Error("Unexpected row format. Bad .csv mabe...");
                            }
                        } 

                        if(!state)
                        {
                            state = config.startState(row, usekg);
                        }

                        config.processRow( state, row ); 
                    }
                    catch(e)
                    {
                        if( config.canContinueInCaseOfError && !userWasPrompted )
                        {
                            userWasPrompted = true;
                            
                            if( window.confirm("WHAT TO DO?\n\nThere was an error parsing some portion(s) of the file. Do you wan't to ignore it and continue tyring to import the file?\n\nAccept = IGNORE ERRORS/ CONTINUE\nCancel = ABORT") )
                            {
                                ignoreErrors = true;
                            }
                        }

                        if( ignoreErrors )
                        {
                            //nothing...
                            errorsIgnored++;
                        }
                        else 
                        {
                            abortedError = e;
                            parser.abort();
                            return;
                        } 
                    }

                };  

                rowsDone+=results.data.length;
                informStatus(`Parsed ${rowsDone} rows...`);
            },
            
            complete: ()=>{

                if( abortedError )
                {
                    reject(`The file you attempt to import has errors, can't proceed :( Details: ${abortedError.message}\n\n${disclaimer}`);
                    return;
                }  

                try
                {
                    log = config.stateAsLog(state);
                }
                catch(e)
                {
                    reject( e.message );
                    return;
                }

                if( !log || log=="" )
                {
                    reject(`Nothing was imported, no data was found in the file.\n\n${disclaimer}`);
                    return;
                }

                informStatus("Parsing complete...");

                if( errorsIgnored>0 )
                {
                    alert(`The cvs was parsed! But we skipped (${errorsIgnored}) rows with errors.\n %${ ((rowsDone-errorsIgnored)/rowsDone*100).toFixed(1) } of the cvs was parsed successfully.\n\n${disclaimer}`);
                }

                resolve( log );
            },
            error: err => reject(`Error parsing cvs --> ${err.message}`)
        });

    });
}


/** 
 * @param {{ config:CVSParserConfig, fileInputLabel:string }} param0 
 * @returns 
 */
export const ImportFromCVS = ({ config, fileInputLabel, fileInputFileExtensions })=>{  

    /** 
     * Let's process the ZIP first in case it was one...
     * @param {File} file 
     * @param {(status:string)=>void} informStatus 
     */
    const onFile = async (file, informStatus) => formatCVS(config, file, informStatus);

    return <ImportFromFileToWXR formatFile={ onFile } fileInputLabel={fileInputLabel} fileInputFileExtensions=".csv" canBeZipped/>
}