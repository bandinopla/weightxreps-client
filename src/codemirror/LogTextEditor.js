import { makeStyles } from "@material-ui/core";
import CodeMirror from "codemirror";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import { useEffect, useMemo, useRef } from "react";
import { jEditorTagTokenToString } from "../componentes/journal/tags";
import { kg2lb } from "../componentes/weight-value";
import "./LogTextEditor.css";
import { TAG_STYLES } from "./tag-parsing";
import { TAG_START_OF_DEFINITION_REGEXP } from "../user-tags/data-types";
import Fuse from 'fuse.js';
import { JLogTokenizer } from "../componentes/journal/tokenizer";
import { WxDoT_JeditorErow2Text } from "../componentes/journal/erow-render-WxDoT";
const searcher = new Fuse([], { findAllMatches:true })

require('codemirror/addon/hint/show-hint');
require('codemirror/addon/lint/lint');
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
 


const _errorCSS = {
    background:"red",
    color:"white !important",
    fontWeight:"bold"
};

const useStyles = makeStyles( theme=>({

    root: {
        fontSize:16,
        color:"#ccc",

        "& .CodeMirror":{
            minHeight:600,  
        }, 

        "& .cm-error": _errorCSS,
        "& .cm-invalid-date": _errorCSS, 
        "& .cm-jdate": { 
            color:"#9D4EDD", 
            textShadow:"1px 1px #ccc"
        },

        "& .cm-BW": {
            color: "#3A86FF" , 
            textShadow:"1px 1px #ccc"
        },

        "& .cm-DELETE": {
            background:"#212529",
            color:"#FCBF49"
        },

        "& .cm-b": {
            fontWeight:"bold"
        },

        "& .cm-existing-ename": {
            color:"blue", 
            fontWeight:"bold"
        },
        "& .cm-new-ename": {
            color:"#00BBF9", 
            fontWeight:"bold" 
        },

        "& .cm-weight": {
            color:"#FF7900"
        },
        "& .cm-time": {
            color:"#B5942F"
        },
        "& .cm-distance": {
            color:"#FF59C3"
        },

        "& .cm-rep": {
            color:"#00BBF9"
        },

        "& .cm-set": {
            color:"#F15BB5"
        },

        "& .cm-setComment": {
            color:"#359FF4",
            fontStyle:"italic",
            backgroundColor:"#E8F4FD"
        },

        "& .cm-RPE": { 
            color:"#40916c", 
            textShadow:"1px 1px #ccc"
        },

        // "& .new::after": {
        //     content:"'new'",
        //     background:"yellow",
        //     margin:"3px",
        //     padding:"3px",
        //     position:"absolute",
        //     fontSize:"10px",
        //     top:"-5px"
        // },
        ...TAG_STYLES

    }

}));


const $errors = [];




CodeMirror.defineMode("wxr-editor", function(cmCfg, modeCfg){ 
    return JLogTokenizer(modeCfg); 
});

CodeMirror.registerHelper("fold", "wxr-editor", function(cm, start) {
    var maxDepth    = 100;  
    var endLine     = 0;
    const totalLines = cm.doc.lineCount();
    const getLine = i=>cm.doc.lineInfo(i).handle; 
    var token = getLine( start.line ).stateAfter?.rows.slice(-1)[0] ; // line, ch

    if( !token ) 
    {
        return null;
    }
    
    //
    // es un DAY tag
    //
    if( token.on )
    { 
        for (let lineNumer = start.line+1; lineNumer < totalLines; lineNumer++) 
        { 
            const state = getLine(lineNumer).stateAfter;

            if( !state )
                continue;

            const lineToken = state.rows.slice(-1)[0];
            

            endLine = lineNumer;

            if( lineToken?.on )
            {
                endLine--;
                break;
            }
        } 

        if( endLine )
        {
            return {
                from: CodeMirror.Pos( start.line, cm.getLine(start.line).length),
                to  : CodeMirror.Pos(endLine, cm.getLine(endLine).length)
            };
        }
    }

    //
    // es un eblock
    //
    else if( token.name!=null )
    {
        for (let lineNumer = start.line+1; lineNumer < totalLines; lineNumer++) 
        { 
            const state = getLine(lineNumer).stateAfter;

            if( !state )
            continue;

            const lineToken = state.rows.slice(-1)[0]; 

            endLine = lineNumer;

            if( !lineToken.erow )
            {
                endLine--;
                break;
            }
        } 

        if( endLine )
        {
            return {
                from: CodeMirror.Pos( start.line, cm.getLine(start.line).length),
                to  : CodeMirror.Pos(endLine, cm.getLine(endLine).length)
            };
        }
    }

    return null;
  });


function synonyms(cm, option) { 
     
        var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
        var start = cursor.ch, end = cursor.ch;
        var optionsToSuggest = [];

        // exercises = [ {e, days, reps} ]
        var hints = option.exercises; //.map( e=>"#"+e.name );

        // si estamos dentro de un "ename row", ofrecer autocomplete de tags... 
        console.log( "SYNON", line, start )

        /**
         * fill enames: first symbol in line is "#" or no "#" in line
         * fill etags: index of # is not the first in the line
         * fill utags: first token in line is "tag"
         */

        var m;

        //if( m = line.match(/^(\s*tag +)([^:\n]*)/) )
        if( m = line.match( new RegExp( `(${TAG_START_OF_DEFINITION_REGEXP.source})([^:\n]*)`,"i" ) ) )
        {
            // tag name mode
            start   = m[1].length;
            end     = start + m[2].length;

            optionsToSuggest = option.utags.map( utag=>utag.name ); 
 
        }
        else if( (m=line.substr(0,start).lastIndexOf("#")) != line.indexOf("#") )
        {
            // etags
            start = m;
            end = start + line.substr(start).replace(/^(\S+).*$/,"$1").length;
            optionsToSuggest = option.tags; 
        }
        else 
        {
            //enames
            start = 0;
            end = line.length; 
            optionsToSuggest = option.exercises.map( e=>"#"+e.e.name );  
        }


        searcher.setCollection( optionsToSuggest ); 
        const searchPattern = line.substr(start, start+end );


 
        return {        list    : searchPattern.trim()==""? optionsToSuggest : searcher.search( searchPattern ).map(res=>res.item),
                        from    : CodeMirror.Pos(cursor.line, start),
                        to      : CodeMirror.Pos(cursor.line, end) } 
}



const _setToString = (set, usekg) => {

    const setInLbs = set.lb==1? 1 : !usekg;

    return (set.usebw?"BW":"")+ (set.usebw? (set.v>0?"+":"")  : "") 
            + ( set.lb? kg2lb(set.v) : set.v || "" ) 
            + ( setInLbs==usekg? (set.lb?"lb ":"kg") : "" ) //<-- si tienen distinto valor significa que necesita ver el unit
}


/**
 * Un editor highlighteado solo para leer.
 */
export const StaticLogHighlighter = ({ exercises, tags, utags, initialValue, lines })=>{

    const classes       = useStyles();
    const txt           = useRef();

    useEffect(()=>{

        var myCodeMirror = CodeMirror.fromTextArea(txt.current,{ 
            lineWrapping    :true, 
            mode:  {
                name:"wxr-editor", 
                tags, 
                utags,
                exercises,//<- existing enames
                defaultYMD:"2020-01-01"
            }, 
            readOnly :true,
            foldGutter: true, 
            lineNumbers: true,  
            //hintOptions: {hint: synonyms, exercises, tags }, 
            gutters: ["CodeMirror-lint-markers","CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            lint: __lintEditor,
            lineWrapping: true,
            lineHeight: lines,
            viewportMargin: Infinity
            
        });

        return ()=>{
            myCodeMirror.toTextArea();
            txt.current = null;
        }

    },[]);

    return <div className={classes.root}>
        <textarea ref={txt} autoFocus  defaultValue={initialValue}></textarea> 
    </div>

}

const __lintEditor = {
    getAnnotations(doc, options, editor ){

        const state         = editor.getStateAfter();
        var editorErrors    = [...state.errors, ...$errors];

        //
        // collect info de NEW exercises...
         

        if( editorErrors.length==0 ) return [];

         
        $errors.length=0; //<-- quitamos el error para que no quede "pegado" en el editor.
       
        return editorErrors.map(e=>({
            message     : e.message, 
            severity    : e.severity || "error",
            from:{ line:e.line, ch:e.from },
            to:{ line:e.line, ch:e.to },
        })); 
    }
};

export const LogTextEditor = ({ usekg, exercises, tags, value, getDocRef, getShowErrorRef, defaultYMD, utags, hintTriggerRef, saveTriggerRef, onCodeMirrorReady, valueAsTextHook })=> {

    const classes       = useStyles();
    const txt           = useRef();
    const save          = useRef();  
    const cmirror       = useRef();  

    /**
     * Si value es un array, se asume lo devolvió el backend, por lo que lo convertimos a string...
     */
    const valueAsText  = useMemo( ()=>{ 

        let txt = ""; 

        if( typeof value == 'string' )
        {
            txt = value;
        } 
        else if( typeof value == 'object') 
        {
            txt = __convertJEditorDataToText(value, usekg, utags);
        }

        if( valueAsTextHook )
        {
            let txtHooked = valueAsTextHook(txt);
            
            if( txtHooked )
            {
                return txtHooked;
            }
        }

        return txt;

    }, [value] );

    useEffect( ()=>{

        var myCodeMirror = CodeMirror.fromTextArea(txt.current,{ 
            extraKeys       : { "Ctrl-Space": "autocomplete", "Cmd-Space":"autocomplete", "Shift-Space":"autocomplete", "Alt+Tab":"autocomplete", 
                                "Ctrl-Enter": ()=>{ saveTriggerRef.current() }
            },// "'#'": "autocomplete" }, 
            lineWrapping    :true, 

            mode:  {
                name:"wxr-editor", 
                tags, 
                exercises,//<- existing enames
                utags, //<-- user defined tags
                defaultYMD
            }, 
            foldGutter: false, 
            lineNumbers: true,  
            tabSize: 4,
            hintOptions: {hint: synonyms, exercises, tags, utags }, 

            //
            // esto es para que se muestren los "markers" en el costado del editor
            //
            gutters: ["CodeMirror-lint-markers","CodeMirror-linenumbers", "CodeMirror-foldgutter"],

            //
            // si hay errores, pone un icono de error y el subrayado ese abajo de la linea conflictiva. On hover muestra error message.
            //
            lint: __lintEditor
          }); 

        ////CodeMirror.commands.autocomplete(myCodeMirror, null, { completeSingle: false })
 
        if( hintTriggerRef )
        {  
            hintTriggerRef.current = ()=> { 
                CodeMirror.commands.autocomplete(myCodeMirror, null, { completeSingle: false })
            };
        }

          //
          cmirror.current = myCodeMirror;
          //

          getShowErrorRef.current = (line, error)=>{

            //myCodeMirror.doc.lineInfo(0).text ---> el texto de esa línea
            const to = myCodeMirror.doc.lineInfo(line).text.length;

            $errors.push({
                message:error, 
                line, from:0, to  
            });
            myCodeMirror.performLint();
          }

          //
          // TODO: jeditor get lines
          //
          getDocRef.current = ()=>{
           
                const cm = myCodeMirror;

                const doc = cm.getStateAfter(null, true); 
                const payload = cm.doc.getMode().stateToSavePayload(doc);

                return payload;
          } 

          myCodeMirror.focus();

          onCodeMirrorReady && onCodeMirrorReady(myCodeMirror)

          //
          // on dismount...
          //
          return ()=>{
 
            if( hintTriggerRef )
            {
                hintTriggerRef.current = null;
            }

                getDocRef.current = null;
                getShowErrorRef.current = null;
                myCodeMirror.toTextArea(); //<---- destroy CM instance 
          }

    }, []);

    

    useEffect( ()=>{

        if( cmirror.current )
        {
            cmirror.current.setValue(valueAsText);
        }

    }, [valueAsText]);

    

    return <div className={classes.root}>
        <textarea ref={txt} autoFocus  defaultValue={valueAsText}></textarea> 
    </div>
}


// TODO: jeditor data to text
const __convertJEditorDataToText = (value, usekg, utags) => {

        if(!Array.isArray(value))
        {
            return "????";
        }

        //convert to string....
        var out = [];

        value.forEach( datum => {

            switch( datum.__typename )
            {
                case "UTagValue":  
                    out.push( jEditorTagTokenToString(datum, utags) );
                    break;

                case "JEditorBWTag": // viene en KILOS
                    //console.log("BW TAG!!!", usekg, datum.bw)
                    out.push( "@ "+  ( !usekg? kg2lb(datum.bw) : datum.bw )  +" bw" );
                    break;

                case "JEditorDayTag":
                    out.push( "\n"+datum.on );
                    break;

                case "JEditorText":
                    const txt = datum.text.trim();
                    txt.length && out.push(txt);
                    break;

                case "JEditorEBlock":
                    //if( datum.sets.length )
                    {
                        out.push("\n#"+datum.e.name);
 
                        datum.sets
                        
                        //
                        // generar version de sets comprimidos
                        //
                        .reduce( (out,set)=>{ 

                            if( set.type!=0 )
                            {
                                out.push( set );
                                return out;
                            }

                            var prev                = out.slice(-1)?.[0];
                            var prevSet             = prev?.sameWeight?.slice(-1)[0] || prev?.sameRep?.slice(-1)[0] || prev; 
                            var prevIsCompressed    = Array.isArray( prev?.sameWeight || prev?.sameRep );
                            
                            var canBeCompressed     = prev && prev.c==set.c && prev.rpe==set.rpe && prev.usebw==set.usebw && prev.s==set.s;

                            // W x R,R,R
                            // W,W,W x R


                            //
                            // same WEIGHT diferent rep
                            // 
                            if( set.s==1 && prevSet?.rpe==set.rpe && prevSet?.v==set.v && prevSet?.usebw==set.usebw && prevSet.s==set.s && prevSet?.c==set.c )
                            {

                                //si el prev esta en un comprimido "W x R,R,R,R"...  
                                if( prev?.sameRep )
                                {
                                    //prev = prev.sameRep.pop();
                                    //out.push( prev );
                                    out.push( set );
                                } 

                                else if( !prev.sameWeight  )
                                {  
                                    out[ out.length-1 ] = {
                                        sameWeight: [
                                            prev, set
                                        ],
                                        ...set
                                    }
                                }
                                else 
                                {
                                    prev.sameWeight.push(set);
                                }
                            }

                            //
                            // same REP diferent weight
                            //
                            else if( set.s==1&& prevSet?.rpe==set.rpe && prevSet?.r==set.r && prevSet?.s==set.s && prevSet?.c==set.c )
                            {
                                
                                if( prev?.sameWeight ) //el anterior es un "W x R,R,R"
                                {
                                    //ignore...
                                    out.push( set );
                                }

                                else if( !prev.sameRep )
                                {  
                                    out[ out.length-1 ] = {
                                        sameRep: [
                                            prev, set
                                        ],
                                        ...set
                                    }
                                }
                                else 
                                {
                                    prev.sameRep.push(set);
                                }
                            }

                            //
                            // unqiue
                            //
                            else 
                            { 
                                out.push( set );
                            }

                            return out; 
                        } ,[])  
                        
                        //
                        // render...
                        //
                        .forEach( set=> {
  
                            if( set.type>0 )
                            {
                                out.push( (set.v? _setToString(set, usekg) + " x " : "") + WxDoT_JeditorErow2Text( set ))
                                return;
                            }

                            //
                            // nos fijamos si es una version "W,W,W" o solo "W"
                            //
                            var w = set.sameRep? set.sameRep.map(s=>_setToString(s, usekg)).join(", ") : 
                                    set.sameWeight? _setToString(set.sameWeight[0], usekg) : _setToString(set, usekg);

                            //
                            // nos fijamos si es "R,R,R" o "R"
                            //
                            var r = set.sameWeight? " x "+set.sameWeight.map(s=>s.r).join(", ") : ( set.s>1 || set.r>1 ? " x " + set.r : set.r===0? " x 0":"" );

                            
                            //
                            // si es "R,R,R" pero todas las reps son iguales...
                            // convertir en "R x S"
                            //
                            if( set.sameWeight && set.sameWeight.every((s,i, arr)=>s.r==arr[0].r) )
                            {
                                r = " x " + set.sameWeight[0].r;
                                set.s = set.sameWeight.length;
                            }

                            //
                            // String version del set...
                            //
                            out.push(
                                w
                                + r
                                + ( set.s>1 ? " x "+set.s : "" )
                                + ( set.rpe ? " @"+set.rpe+" RPE":"")
                                + ( set.c? " "+set.c.trim() : "")
                            );
                        });
                        //out.push("");
                    } 
                    break;
            }

        } );
 
     
        return out.join("\n").trim();     
}
 

export const convertJEditorData2Text = (data, usekg, utags) => {
    return __convertJEditorDataToText( data, usekg, utags );
}