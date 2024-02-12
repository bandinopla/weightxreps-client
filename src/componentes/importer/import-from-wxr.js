import { useRef, useState } from "react";
import { LocalFileSelectorButton } from "../local-file-selector-button";
import { todayAsYMD } from "../../utils/utils";
import { useGetJEditorDataLazyQuery, useSaveJEditorMutation } from "../../data/generated---db-types-and-hooks";
import { ApolloError } from "@apollo/client";
import { JLogTokenizer } from "../journal/tokenizer"; 
import { asciiSpinnerInterval } from "../ascii-spinner";
import { pulseInterval } from "../../utils/pulseInterval";
import { useGetSession } from "../../session/session-handler";
 
// function getObjectSizeInKB(obj) {
//     // Convert object to JSON string
//     var jsonString = JSON.stringify(obj);

//     // Calculate size of JSON string in kilobytes
//     var sizeInBytes = new Blob([jsonString]).size; // Size in bytes
//     var sizeInKB = sizeInBytes / 1024; // Convert bytes to kilobytes

//     return sizeInKB;
// }

const TODAY = todayAsYMD();

/**
 * @typedef {Object} ImportFromWxrParams
 * @property {(file:File, informStatus:(status:string)=>void)=>Promise<string>?} formatFile A callback to convert the contents of the text file to the format that weightxreps backup files use
 * @property {string} fileInputLabel
 * @property {string} fileInputFileExtensions
 */
/** 
 * @param {ImportFromWxrParams} param0 
 * @returns 
 */
export const ImportFromWXR = ({ formatFile, fileInputLabel, fileInputFileExtensions })=>{

    const {session }      = useGetSession();
    const [JEditor, setJEditor] = useState();
    const [text, setText] = useState();
    const onJeditorData = useRef();
    const onJeditorDataError = useRef();
    const [saveEditor, {client}]    = useSaveJEditorMutation();

    const [ getJeditorData, { loading, error } ] = useGetJEditorDataLazyQuery({ 
        fetchPolicy:"network-only",
        onCompleted: result=>onJeditorData.current(result),
        onError:err=>onJeditorDataError.current(err)
    });

    /**
     * A txt file has been selected...
     * @param {File} file 
     * @param {(string)=>void} informStatus
     */
    const onFileSelected = async ( file, informStatus ) => {

        informStatus("Reading file...");
  
        var fileText ; 
        var _interval; 

        if( formatFile )
        {
            fileText = await formatFile(file, informStatus); //<-- can throw errors 
        }
        else 
        {
            fileText = await file.text(); 
        }

        if(!fileText || fileText=="")
        {
            throw new Error("The file you selected seems to be empty...");
        }

        if( !fileText.match(/^\d{4}-\d{2}-\d{2}\s*$/m) )
        { 
            throw new Error("The file you selected doesn't look like a weightxreps compatible file.");
        }

        if( !window.confirm("Importing a file will override data. This means that if in the file, for example, there's a log for today and in the site your currently have logged for today too, the contents of the file will override whatever is in the site logged at this time. This can't be undone. Continue?") )
        {
            throw new Error("Canceled");
        }

        //
        // we have the backup file...
        //
        const prom = new Promise( (resolve, reject)=>{ 

            informStatus("Initializing file processing..."); 

            /** 
             * onComplete hook for the lazy query we will be calling to get the "editor" data.
             * @param {import("../../data/generated---db-types-and-hooks").GetJEditorDataQuery} jeditorData 
             */
            onJeditorData.current = jeditorData => {
                //parser... 
                informStatus("Starting to parse "+file.name); 
                
                //
                // Ok, let's get ready to roll...
                //
                JLogTokenizer({
                    tags: jeditorData.jeditor.etags,
                    utags: jeditorData.jeditor.utags,
                    defaultYMD: TODAY,
                    exercises: jeditorData.jeditor.exercises
                }) 
                //
                // parse the document selected by the user
                //
                .textToPayload(fileText,50, progressPercent=>informStatus(`Parsing %${Math.floor(progressPercent*100)}`) )

                        //
                        // document parsed!
                        //
                        .then( payload =>{

                            // TODO: warn or throw Error if too much data...
                            // console.log("Texto parseado", payload);
                            // console.log(`Size ${getObjectSizeInKB(payload)} Kb`)
                            // resolve();

                            // https://github.com/expressjs/body-parser#body-parser  100Kb limite
 
                            //_interval = asciiSpinnerInterval("Sending to server...", informStatus);
                            const txts = [
                                "Sending to server...",
                                "Sending your file...",
                                "Waiting for server...",
                                "Still waiting...",
                                "Yep... still waiting...",
                                "Please wait..."
                            ];

                            _interval = pulseInterval( pulseIndex=>informStatus( txts[pulseIndex%txts.length] ), 3000);

                            return saveEditor({
                                variables: {
                                    rows: payload,
                                    defaultDate: TODAY
                                }
                            }) 
                            .catch( err=> {

                                console.log({ e:err })

                                if( err.networkError && err.networkError.statusCode==413 )
                                {
                                    throw new Error("The file is too large to handle! :(");
                                }
                                //err.networkError.response.statusText

                                throw err;

                            })
                            
                            ;
                        } )

                        //
                        // reset cache
                        //
                        .then( result=>{ 

                            if( !result.data?.saveJEditor )
                            {
                                throw new Error("Unexpected error... Idk what happened...");
                            }

                            alert("File was imported! Reloading...");
                            window.location.reload(); 
                        })
                        
                        .catch( err=>{

                            alert("ERROR: "+err.toString()); 
                            reject(err);
                        } )

                        .finally(()=>{

                            clearInterval(_interval)
                        })
                        ;

            }; 

            /** 
             * onError hook for the lazy query
             * @param {ApolloError} err 
             */
            onJeditorDataError.current = err => {
                console.error( err );
                reject(err);
            };

            /**
             * call the lazy query... get the jeditor data!
             */
            getJeditorData({
                variables: {
                    ymd: TODAY,
                    range: 0
                } 
            });

        }); 
        

        return prom;
    } 

    return <div><LocalFileSelectorButton label={fileInputLabel || "Select *.txt"} only={fileInputFileExtensions || ".txt"} onFileSelected={onFileSelected}/></div>
};