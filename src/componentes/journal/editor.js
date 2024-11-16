import { Button, LinearProgress } from "@material-ui/core";
import { useRef, useEffect, useState } from "react";
import { LogTextEditor, convertJEditorData2Text } from "../../codemirror/LogTextEditor";
import { parseError } from "../../data/db";
import { useGetJEditorDataQuery, useSaveJEditorMutation } from "../../data/generated---db-types-and-hooks";
import { AsciiSpinner } from "../ascii-spinner";
import { makeVar, useReactiveVar } from "@apollo/client";
import "./editor.css";
import { TutorialModal } from "./editor-tutorial"; //
import Alert from "@material-ui/lab/Alert";

import {
    useHistory
} from "react-router-dom";
import { OpenConfirmModal } from "../Dialog";
import { useGetSession } from "../../session/session-handler";
import { OpenJeditorSaveBackdrop } from "./editor-save-backdrop";
import LoadCopyOfWorkoutModal from "./editor-copy-journal";
import { useEditorAutosave } from "./editor-autosave";

const $jeditorError     = makeVar(); 
 

export { TutorialModal, LoadCopyOfWorkoutModal } ; //tutorialNamespace...
export { convertJEditorData2Text }; 
 

//2020-01-18
export const JEditor = ({ ymd, range, onClose, saveTrigger, hintTriggerRef, onLoaded, redirect }) => {

    const getDoc        = useRef();
    const showDocError  = useRef(); 
    const {session }      = useGetSession();
    const history       = useHistory();
    const saveError = useReactiveVar($jeditorError);
    const [jeditorData, setJeditorData] = useState(); 

    const { autosave, getAutosavedText, clear:clearAutosave } = useEditorAutosave({ 
        cacheKey: ()=>`${session.user.id}-autosave`
    });

    const [saveEditor, {client}]    = useSaveJEditorMutation();
    
    const { data, loading, error, refetch }  = useGetJEditorDataQuery({
        variables: {
            ymd, range
        },

        fetchPolicy:"network-only",
        notifyOnNetworkStatusChange:true,
        onCompleted: ( data )=> {
            $jeditorError(null);
            !jeditorData && setJeditorData( data )
        }
    });

    useEffect(()=>{

        const onEventData = (event) => { 

            clearAutosave();
            console.log("clear autosave")
            setJeditorData( event.detail )
        }

        window.addEventListener('jeditor:data', onEventData);

        return ()=>{
            window.removeEventListener('jeditor:data', onEventData )
            clearAutosave(); // if the user closes the editor, he knows what he is doing...
        }

    }, []);


    useEffect(()=>{
        data && setTimeout( onLoaded, 0 )
    },[data]);


    if( !session )
    {
        return null;
    }


    /**
     * Save editor...  
     */
    //TODO: jeditor SAVE
    const save = async ( yesIknow )=>{ 

        $jeditorError(null);

        try
        {  
            //
            // obtener el documento...
            //
            var doc                 = getDoc.current(); 
            var usedDefaultDate     = false;  
            var firstDateTokenIndex = -1; 


            //
            // ultimo día cargado... + averiguar si algun toquen utilizó la default date.
            //
            var __ymd = doc.reduce( (out, token, index)=>{ 

                //
                // se encontró un token de texto o eblock y no es del default date...
                //
                if( (!out || out==ymd) && (token.hasOwnProperty("eid") || token.hasOwnProperty("text") || token.hasOwnProperty("tag") ) )
                {  
                    usedDefaultDate = true;
                } 
    
                return token?.on || out; 

            } , null ) || ymd; 

             
            //
            // si esta guardando pero no pegó nada del día default...
            // pasa si hacen copy and paste y se olvidan de cambiar la fecha...
            // sugerido por: @beritou
            //
            if( !usedDefaultDate )
            { 
                if( !yesIknow )
                {
                    //
                    // abrir promp preguntando...
                    //
                    return await OpenConfirmModal({ open:true
                        , title:"Nothing on "+ymd+"??"
                        , info:"Just checking... Nothing was logged for day "+ymd+", is this intentional? I ask because mabe you copy & pasted a log but forgot to change the date..." 
                        , verb: "Yes, it's fine, i know!"
                        , onConfirm: ()=> save(true)
                        , canCancel: true
                    }); 
                }
                else 
                {
                    ///// Bug reported by ijzersterk_pouja. Al guardar un log que usa fecha distinta a la default pero tiene new exercises, esto hacia que 
                    ///// tire error porque quitaba los new exercise definitions...

                    // var _ymd = ymd; 
                    // //
                    // // quitar todos los toquen referentes al default date...
                    // //
                    // doc = doc.filter( itm=>{
  
                    //     _ymd = itm?.on || _ymd;  
                    //     return _ymd!=ymd; 
                    // });
                }
                
            }  

            //
            // show operation backdrop...
            //
            await OpenJeditorSaveBackdrop( async ()=>{   

                    var saveOp    = await saveEditor({
                        variables: {
                            rows: doc,
                            defaultDate: ymd
                        }
                    });

                    
                    if( !saveOp.data?.saveJEditor )
                    {
                        throw new Error("Unexpected error...");
                    }
                    else 
                    { 
                        clearAutosave(true); //if everything was saved, clear it since it is already saved...

                        // full reload...
                        setTimeout( ()=> window.open( "/journal/"+session.user.uname+"/"+__ymd , "_self"), 2000 );
                       ;
                    }

            });// OpenJeditorSaveBackdrop 
            onClose();


            // //
            // // borrar cache....
            // //
            // try
            // {
            //     await client.resetStore();
            // }
            // catch( e )
            // {
            //     // weird... anyway...
            //     window.open( "/journal/"+session.user.uname+"/"+__ymd , "_self");
            //     return;
            // }   

            // onClose(); 
                
            // if ( redirect )
            // {
            //     //ir al ultimo dia cargado...  
            //     history.push("/journal/"+session.user.uname+"/"+__ymd);
            // } 
            
 
        }

        //
        // error!
        //
        catch(e) 
        { 

            const err = parseError(e);

            var m;

            //
            // detectar formato "JEDITOR:##"
            //
            if( m = err.match(/JEDITOR:(\d+) (.*)/) )
            {
                let line = Number(m[1]);
                showDocError.current( line, m[2] );
                $jeditorError(`Error at line ${ line+1 }: ${m[2]}`);
            }

            //
            // es un string...
            //
            else 
            {
                $jeditorError(err);
            }

            return;
        }
 
    }

    if( loading || !jeditorData )
    {
        return <div>
            <LinearProgress/>
            <AsciiSpinner label="Loading data..."/>
            </div>;
    }  

    if( error ) {  
        return <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={()=>refetch()}>
              RETRY
            </Button>
          }>{parseError(error)}</Alert>;
    }

    //--
    saveTrigger.current = save;
    //--


    return <> 
        <LogTextEditor  defaultYMD={ymd} 
                        usekg={ session.user.usekg } 
                        value={jeditorData.jeditor.did} 
                        exercises={jeditorData.jeditor.exercises} 
                        tags={jeditorData.jeditor.etags} 
                        getDocRef={getDoc} 
                        getShowErrorRef={showDocError}
                        saveTriggerRef={saveTrigger}
                        hintTriggerRef={hintTriggerRef}
                        utags={jeditorData.jeditor.utags}
                        onCodeMirrorReady = { cm =>cm.on("change", ()=>autosave(cm.getValue()) ) }
                        valueAsTextHook = { value => {

                            let saved = getAutosavedText(); 

                            if( saved!=="" && saved!==value && window.confirm("An autosaved text is available. Would you like to load it?"))
                            {
                                return saved;
                            } 
                        }}
                        />
        { saveError && <Alert severity="error">{parseError(saveError)}</Alert> }
    </>
}


