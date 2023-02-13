import { LinearProgress } from "@material-ui/core";
import { useRef } from "react";
import { LogTextEditor, convertJEditorData2Text } from "../../codemirror/LogTextEditor";
import { parseError } from "../../data/db";
import { useGetJEditorDataQuery, useSaveJEditorMutation } from "../../data/generated---db-types-and-hooks";
import { todayAsYMD } from "../../utils/utils";
import { AsciiSpinner } from "../ascii-spinner";
import Snackbar from '@material-ui/core/Snackbar';
import { makeVar, useReactiveVar } from "@apollo/client";
import "./editor.css";

import { OpenTutorial, TutorialModal } from "./editor-tutorial"; //
import Alert from "@material-ui/lab/Alert";

import {
    useHistory
} from "react-router-dom";
import { OpenConfirmModal } from "../Dialog";
import { useGetSession } from "../../session/session-handler";
import { OpenJeditorSaveBackdrop } from "./editor-save-backdrop";

// function Alert(props) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

const $jeditorError     = makeVar();
const $jeditorIsBusy    = makeVar(false);
const $defaultYMD       = todayAsYMD();
 

export { OpenTutorial, TutorialModal } ; //tutorialNamespace...
export { convertJEditorData2Text }; 
 

//2020-01-18
export const JEditor = ({ ymd, range, onClose, saveTrigger, onLoaded, redirect }) => {

    const getDoc        = useRef();
    const showDocError  = useRef(); 
    const {session }      = useGetSession();
    const history       = useHistory();
    const saveError = useReactiveVar($jeditorError);

    const [saveEditor, {client}]    = useSaveJEditorMutation();
    
    const { data, loading, error }  = useGetJEditorDataQuery({
        variables: {
            ymd, range
        },

        fetchPolicy:"network-only"
        ,onCompleted: ()=>$jeditorError(null)
    });

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
                if( (!out || out==ymd) && (token.hasOwnProperty("eid") || token.hasOwnProperty("text")) )
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
 


            await OpenJeditorSaveBackdrop( async ()=>{  
        

                    var saveOp    = await saveEditor({
                        variables: {
                            rows: doc,
                            defaultDate: ymd
                        }
                    });

                    
                    if( !saveOp.data?.saveJEditor )
                    {
                        throw new Error("Unespected error...");
                    }
                    
                    

                    //
                    // borrar cache....
                    //
                    try
                    {
                        await client.resetStore(); 
                    }
                    catch( e )
                    {
                        // weird... anyway...
                        window.open( "/journal/"+session.user.uname+"/"+__ymd , "_self");
                        return;
                    }  

                    onClose();
                    
                     
                    if ( redirect )
                    {
                        //ir al ultimo dia cargado...  
                        history.push("/journal/"+session.user.uname+"/"+__ymd);
                    }

            });// OpenJeditorSaveBackdrop
            

            
 
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

    if( loading )
    {
        return <div>
            <LinearProgress/>
            <AsciiSpinner label="Loading Editor's data..."/>
            </div>;
    }  

    if( error ) { 
        return <Alert severity="error">{parseError(error)}</Alert>;
    }

    //--
    saveTrigger.current = save;
    //--

    onLoaded();

    return <> 
        <LogTextEditor defaultYMD={ymd} usekg={ session.user.usekg } value={data.jeditor.did} exercises={data.jeditor.exercises} tags={data.jeditor.etags} getDocRef={getDoc} getShowErrorRef={showDocError}/>
        { saveError && <Alert severity="error">{parseError(saveError)}</Alert> }
    </>
}


