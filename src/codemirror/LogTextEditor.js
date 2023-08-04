import { makeStyles } from "@material-ui/core";
import CodeMirror from "codemirror";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import { useEffect, useMemo, useRef } from "react";
import { jEditorTagTokenToString } from "../componentes/journal/tags";
import { kg2lb } from "../componentes/weight-value";
import { dateToYMD, ymd2date } from "../utils/utils";
import "./LogTextEditor.css";
import { TAG_CODEMIRROR_TOKENS, TAG_STYLES } from "./tag-parsing";
import { getUserAvailableTagTypes, TAG_START_OF_DEFINITION_REGEXP } from "../user-tags/data-types";
import Fuse from 'fuse.js' 

  
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
const $monthName= ["January","February","March","April","May","June","July","August","September","October","November","December"];
const $dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const useStyles = makeStyles( theme=>({

    root: {
        fontSize:16,
        color:"#ccc",

        "& .CodeMirror":{
            //height:"auto" , 
            minHeight:400, 
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

        "& .cm-rep": {
            color:"#00BBF9"
        },

        "& .cm-set": {
            color:"#F15BB5"
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

const JLogTokenizer = config => {

    //const W_Reg     = /(BW\s*[\+\-]?)?(\d+(?:\.\d+)?)?(kg|lbs?)?/i;
    const W_Reg     = /(?:(?:(bw\s*[\+\-]?)?(\d+(?:\.\d+)?)(kg|lbs?)?)|(bw))/i;

    const Xchars    = "x\\*"
    const X         = new RegExp("["+Xchars+"]");

    const extractWeightInfo = m => {
        const w     = { v:0 };
        var sign    = 1; 
        var BW = m[1] || m[4];

        //if( m[0].trim().length==0 ) return;  

        // use BW
        if( BW )
        {
            w.usebw = BW.slice(-1)=='-'? -1 : 1;
        }

        if( m[2] ) {
            w.v = parseFloat( m[2] );
        }

        if( m[3] )
        {
            if( m[3].substr(0,2) == 'lb' )
            {
                w.lb = 1;
            }
        }

        if( !w.v && !w.usebw ) {
            return;
        }

        if( w.v>2000 )
        {
            /// 2022.01.13 :: user Markus pidió comentar esto porque usa el sitio tambien para trackear cardio, etc...
            // throw new Error("Unrealistic weight... if you lifted that, congrats! But, there's 99% chances there's an error... please type a realistic weight ^_^");
        }

        return w;
    }

    const getIntValue = v => {
        const n = parseInt(v);
        
        if( n>1000 )
        {
            throw new Error("This value is too large! Can't be right! Unrealistic...");
        }

        return n;
    }

    const __tokenSingleInt = ( erowProp, cls, errorTitle ) => { 
        
        return function (stream, state){

            const m     = stream.match( this.reg );

            if( m ) {

                try 
                {
                    var reps = getIntValue( m[0] )
                }
                catch(e)
                {
                    state.errors.push({
                        line    : stream.lineOracle.line,
                        from    : stream.column(),
                        to      : stream.column()+m[0].length,
                        message : (errorTitle?errorTitle+": ":"")+e.message
                    });
                }
                
                //state.lastEblock.erows[state.erowIndex][erowProp] = reps;
                state[erowProp] = reps;
                return cls;
            }
        }
    }

    const __dayMarker = (state, stream, ymd) => {
        state.errors.push({
            line: stream.lineOracle.line,
            from: 0,
            to: stream.string.length,
            message: "Everything below this will be logged on day \""+ymd+ "\"",
            severity:"ymd"
        });
    }
 

    const tokens = {


        "ename": {
            token(stream, state){ 

                const sol   = stream.sol();
                const i     = stream.column();
                const m     = stream.match(/^\s*(#\w+)/);
                const line  = stream.lineOracle.line; 
                const ExistingEnameClass    = "existing-ename";
                const NewEnameClass         = "new-ename line-new";

                //quitar error para esta linea... 

                // inicio de
                if( m )
                {   
                    if( !state.lastEblock || state.lastEblock.line!=line ) // || state.lastEblock.name!=stream.string 
                    {
                        // es uno que ya existe? 
                        const eid = config.exercises.map( e=>e.e||e ).find( e=>"#"+e.name.trim().toLowerCase()==stream.string.trim().toLowerCase() )?.id;
                        const existe = eid!=null; 

                        ///console.log("Existe?", stream.string, existe )
                        state.lastEblock = { name:stream.string, existe, eid, line };
                        state.erowIndex  = -1;

                        //state.rows.push(state.lastEblock);
                        state.rows = [ ...state.rows, state.lastEblock ];

                        !existe && state.errors.push({
                            line,
                            from: 0,
                            to: stream.string.length,
                            message:"This exercise will be created on save.",
                            severity:"info"
                        });

                    }

                    //
                    // inicio de definición de un ename
                    //
                    if( sol ) //ename
                    {  
                        state.blockCount++;
                        state.ename = m[1];
                        return state.lastEblock.existe?ExistingEnameClass:NewEnameClass;
                    }

                    //
                    // definiendo un etag (marcar distinto los "official" tags)
                    //
                    else 
                    {  
                        return config.tags.indexOf( m[1] )>-1? "variable-2" : state.lastEblock.existe?ExistingEnameClass:NewEnameClass;
                    }
                }
 
                //
                // no hay matches y estamos en el inicio de una linea...
                //
                if( i==0 )
                {
                    //all good!!
                    state.ename = null;
                    //$errors.splice( $errors.findIndex(e=>e.line==line),1 );
                }
                else 
                {
                    //
                    // estamos dentro de un ENAME row...
                    //
                    if( state.ename )
                    {
                        if( stream.eatWhile(/[^#]+/) )
                        {
                            return state.lastEblock.existe?ExistingEnameClass:NewEnameClass;
                        }
                        else 
                        {
                            stream.skipToEnd();
                            return "error";
                        }
                    } 
                }

                return null;
            }
        },

        "W,W,W": {

            reg: new RegExp("^\\s*("+W_Reg.source+"(\\s*,\\s*"+W_Reg.source+")+)","i"),

            //
            // match <blob,blob,blob>
            //
            //reg: new RegExp("^\\s*([^,"+Xchars+"]+(\\s*,\\s*[^,"+Xchars+"]+)+)","i"),

            token( stream, state ) {

                const sol   = stream.sol();
                const m     = stream.match( this.reg );

                if( sol && m ) 
                { 
                    var wPos    = stream.column();
                    const WWWs  = m[0].split(",").map( (setString,i)=>{ 

                        setString = setString.trim();

                        var m = setString.match(W_Reg);  
 
                        var error;

                        try
                        {
                            if( m[0] != setString )
                            {
                                throw new Error("Invalid weight!!!");
                            }
                            var w = extractWeightInfo(m); 
                            
                        }
                        catch(e)
                        {
                            error = e.message;
                        } 
                        

                        if( !w )
                        {
                            const happened = "Error happened here: ";
                            state.errors.push({
                                line:stream.lineOracle.line,
                                //from: 0,
                                //to: stream.string.length,
                                from:wPos,
                                to: wPos+setString.length,
                                message:( error || "Weight \""+setString+"\" is invalid (meaning, idk what it says...), please fix it.") + "\n"+happened+stream.string
                                       + "\n" + "-".repeat( happened.length+wPos  )+"^"
                            });

                            console.log("ERROR!", setString, state.errors.slice(-1)[0]);
                        }
                        else 
                        {
                            wPos += setString.length+1;
                        }
                        

                        return w;
                    });


                    if( WWWs.some(w=>!w) )
                    {
                        //error 
                        stream.skipToEnd(); 
                        return "error";
                    }

                    //state.lastEblock.erows[state.erowIndex].w = WWWs; 
                    state.W = WWWs;


                    return "weight";
                }

            }

        },

        "W": {
            reg: new RegExp("^\\s*"+W_Reg.source,"i") ,///^\s*\d+/,
            token( stream, state ) 
            {
                const sol   = stream.sol();
                const m     = stream.match( this.reg );

                if( sol && m && m[0].length>0 ) {
 
                    try
                    { 
                        var w = extractWeightInfo(m); 
                    }
                    catch(e) 
                    { 
                        state.errors.push({
                            line    :stream.lineOracle.line,
                            from    : stream.column(),
                            to      : stream.column()+m[0].length,
                            message: e.message
                        });
                    }   

                    //state.lastEblock.erows[state.erowIndex].w = w; 
                    state.W = w;

                    return "weight";
                }
            }
        },

        "R": {
            reg:/^\s*\d+/,
            token: __tokenSingleInt("R","rep b","REP")
            // token( stream, state ) 
            // { 
            //     const m     = stream.match( this.reg );

            //     if( m ) {

            //         try 
            //         {
            //             var reps = getIntValue( m[0] )
            //         }
            //         catch(e)
            //         {
            //             state.errors.push({
            //                 line    : stream.lineOracle.line,
            //                 from    : stream.column(),
            //                 to      : stream.column()+m[0].length,
            //                 message : e.message
            //             });
            //         }
                    
            //         state.lastEblock.erows[state.erowIndex].r = reps;
            //         return "rep b";
            //     }
            // }
        },

        "R,R,R": {
            reg:/^\s*(\d+(?:\s*,\s*\d+)+)/,
 
            token( stream, state ){
                const m     = stream.match( this.reg );

                if( m ) { 

                    var wPos    = stream.column();
                    var RRRs = m[0].split(",").map( w=>{

                        try
                        { 
                            var rep = getIntValue(w);
                        }
                        catch(e) 
                        {
                            const happened = "Error happened here: ";
                            state.errors.push({
                                line    : stream.lineOracle.line, 
                                from    : wPos,
                                to      : wPos+w.length,
                                message:  e.message  + "\n"+happened+stream.string
                                       + "\n" + "-".repeat( happened.length+wPos  )+"^"
                            });
                        }

                        wPos += w.length+1;
                        return rep;

                    });
 

                    //state.lastEblock.erows[state.erowIndex].r = RRRs;
                    state.R = RRRs;
                    return "rep b";
                }
            }
        },

        "S": {
            reg:/^\s*\d+/, 
            token: __tokenSingleInt("S","set b","SET")
            // token( stream, state ) 
            // { 
            //     const m     = stream.match( this.reg );

            //     if( m ) {   
            //         state.lastEblock.erows[state.erowIndex].s = parseFloat( m[0] );
            //         return "set b";
            //     }
            // }
        },

        "C": {
            reg:/^(\s.*)?/,
            repeatUntilFail:true,
            token(stream, state) {
  
                    
                    var m; 

                    const __parseRPE = rpeMatch => {

                        if( rpeMatch.indexOf(",")>0 )
                        {
                            return rpeMatch.split(",").map( rpeString=>parseFloat(rpeString) );
                        }
                        else 
                        {
                            return parseFloat( rpeMatch );
                        }
                    }

                    const __errorIfInvalid = (rpe, rpeString) => {

                        var offset = 0;
                        var length = rpeString.length;

                        try
                        {
                            if( state.erowComment?.trim().length )
                            {
                                throw new Error("RPE must be at the start of the comment (after the weight, reps & sets), it can't have text before it. Put it at the front!");
                            }
    
                            if( state.erowRPE != null )
                            {
                                throw new Error("Only one (1) RPE value allowed per \"set\". Current RPE: "+state.erowRPE);
                            }
    
                            // que sean array
                            let rpes = rpe; //Array.isArray( rpe )? rpe : [ rpe ];

                            if( Array.isArray(rpe) )
                            {
                                //
                                // que haya la cantidad correspondiente de sets...
                                // ya sea W,W,W
                                // o R, R, R
                                // o tomando en cuenta los sets...
                                //
                                var sets = Array.isArray(state.W)? state.W      //<-- Caso W,W,W
                                            : Array.isArray(state.R)? state.R   //<-- Caso R,R,R
                                            : new Array(state.S).fill(0);       //<-- Caso S

                                if( rpe.length != sets.length )
                                {
                                    throw new Error("You typed RPE values for "+ rpe.length+" sets but only logged "+sets.length+" set"+(sets.length>1?"s":"")+" in this line.");
                                }
                            }
                            else 
                            {
                                rpes = [ rpe ]; //<- que sea un array para que el bloque verificador de abajo se pueda escribir 1 vez y no hacer un if...
                            }

                            //
                            // analizar cada rpe...
                            //
                            for ( let i = 0; i < rpes.length; i++ ) 
                            {
                                const rpe = rpes[i];

                                if( rpe<6 || rpe>10 || (rpe != Math.floor(rpe) && rpe!=Math.floor(rpe)+0.5 ) )
                                { 
                                    offset = rpeString.indexOf( rpe.toString() );
                                    length = rpe.toString().length;
                                    throw new Error("Invalid RPE. It must be a number between 6 and 10. And only a diference of 0.5 between each. Example: @ 6.5 | You wrote: "+rpe);
                                } 
                            } 
                            
                        }
                        catch( e )
                        {
                            state.errors.push({
                                line            : stream.lineOracle.line,
                                from            : stream.column() + offset ,
                                to              : stream.column() + offset + length,
                                message         : e.message
                            });
                            return;
                        }
                        
                    } 

                    //#region RPE finding...

                    // \s*(\d+(?:\.\d+)?(?:\s*,\s*\d+(?:\.\d+)?)*)
                    // (\d+(?:\.\d+)?)

                    //
                    // buscar RPE tipo:  @5
                    //
                    if( m = stream.match(/^@\s*(?:rpe\s*)?(\d+(?:\.\d+)?(?:\s*,\s*\d+(?:\.\d+)?)*)(?:\s*rpe)?/i) )
                    { 
                        let rpe = __parseRPE(m[1]); //parseFloat(m[1]);

                        __errorIfInvalid( rpe, m[0]);
 
                        //state.erowComment += m[0]; 
                        state.erowRPE = rpe; //<--- sera un numero o un array de numeros
 
                        return "RPE b";
                    }

                    //
                    // RPE tipo:  "rpe 5" o "5 rpe"
                    //
                    else if( (m = stream.match(/^rpe\s*(\d+(?:\.\d+)?(?:\s*,\s*\d+(?:\.\d+)?)*)\s*/i)) || 
                             (m = stream.match(/^(\d+(?:\.\d+)?(?:\s*,\s*\d+(?:\.\d+)?)*)\s*rpe/i)) )
                    {
                        let rpe = __parseRPE(m[1]);

                        __errorIfInvalid( rpe, m[0]);
                        

                        //state.erowComment += m[0]; 
                        state.erowRPE = rpe;
 
                        return "RPE b";
                    }
 
                    //#endregion
 
                    //
                    // si hay algo mas en la línea...
                    //
                    if( stream.peek() )
                    {   
                        var l = stream.next(); 
                        state.erowComment += l;   
                        return "meta";
                    }   
                
            }
        },

        "x": {
            reg: new RegExp( "^\\s*" + X.source +"\\s*"), ///^\s*[x\*]\s*/,
            token( stream ) {
                if( stream.match( this.reg ) )
                {
                    return "meta";
                }
            }
        },

        "YMD": {
            token( stream, state ) {

                var sol = stream.sol();
                var m = sol && stream.match(/^\s*(\d+-\d+-\d+)\s*/);
                if( m )
                {
                    var d = ymd2date(m[1],true);

                    if( dateToYMD(d)!=m[1] )
                    {
                        state.errors.push({
                            line            :stream.lineOracle.line,
                            from            : stream.column(),
                            to              : stream.column() + m[0].length,
                            message         :"Invalid date"
                        });

                        return "invalid-date";
                    }
 
                    state.currentDay = m[1]; 
                    state.rows = [ ...state.rows, { on:state.currentDay }]; 

                    __dayMarker( state, stream, state.currentDay); 

                    return "jdate b"; 
                }
            }
        }, 

        "MONTH-OR-DAY-#": {
            token(stream, state) {
                
                var m = stream.sol() && stream.match(/^\s*(\w+)\s*(\d+)?\s*/i, false); //$monthName
                if( m )
                {
                    var dayOfWeek ;
                    var dayNum    = parseInt(m[2] || 0); 
                    var monthNum  = $monthName.findIndex( name=>name.toLowerCase()==m[1].toLowerCase() || name.substr(0,3).toLowerCase()==m[1].toLowerCase() );

                    //
                    // si no se encontró por mes, buscar por día...
                    //
                    if( monthNum<0 )
                    {
                        monthNum = new Date().getMonth();
                        
                        dayOfWeek = $dayNames.findIndex( name=>name.toLowerCase()==m[1].toLowerCase() || name.substr(0,3).toLowerCase()==m[1].toLowerCase() )

                        if( dayOfWeek<0 )
                        {
                            return;
                        }
                        else 
                        {
                            dayNum = dayNum || new Date().getDate();
                        } 
                    } 



                    // consumir el token...
                    stream.match( m[0], true );

                    var d = new Date( new Date().getFullYear(), monthNum, dayNum );

                    if( d.getDate() != dayNum || (dayOfWeek!=null && d.getDay()!=dayOfWeek))
                    {  
                        //invalid
                        state.errors.push({
                            line            :stream.lineOracle.line,
                            from            : stream.column(),
                            to              : stream.column() + m[0].length,
                            message         :"Invalid date"
                        });

                        return "invalid-date";
                    }

                    state.currentDay    = dateToYMD(d, false);
                    state.rows          = [ ...state.rows, { on:state.currentDay }]; 

                    __dayMarker( state, stream, state.currentDay); 

                    return "jdate b"; 
                }
            }
        },

        "DELETE": {
            token(stream, state) {

                if( stream.sol() && stream.match(/^\s*DELETE\s*$/i))
                {
                    state.errors.push({
                        line: stream.lineOracle.line,
                        from: 0,
                        to: stream.string.length,
                        message: "Journal Log \""+state.currentDay + "\" will be DELETED once you save.",
                        severity:"delete-flag"
                    });

                    //state.rows.push({ delete:true });
                    state.rows = [ ...state.rows, { delete:true } ];
                    return "DELETE b";
                }
            }
        },

        "BW": {
            token(stream, state) 
            {
                var m;
                    //
                    // @ ## bw
                    //
                if( (m = stream.string.match(/^\s*@\s*(\d+(?:\.\d+)?)\s*(kg|lbs?)?\s*bw\s*$/i))
                    ||

                    //
                    // ## bw
                    //
                    (m = stream.string.match(/^\s*(\d+(?:\.\d+)?)\s*(kg|lbs?)?\s*bw\s*$/i) ))
                {
                    stream.skipToEnd();

                    // state.rows.push({ 
                    //     bw:parseFloat( m[1] ),
                    //     lb: m[2]? m[2].toLowerCase()=='kg'? 0 : 1 : null
                    // });
                    state.rows = [ ...state.rows, { 
                                                    bw:parseFloat( m[1] ),
                                                    lb: m[2]? m[2].toLowerCase()=='kg'? 0 : 1 : null
                                                }];

                    return "BW b";
                }
            }
        },

        //
        // dummy token. El único propósito de este token es de "pushear" un erow nuevo.
        //
        "erow:": {
            token( stream, state ) {

                state.erowIndex++;
                state.erowComment   = "";
                state.erowRPE       = null;
                state.W = 0;
                state.R = 1;
                state.S = 1;
                state.erowLine      = stream.lineOracle.line;
                state.currentSet    = { erow:true };
                state.rows = [ ...state.rows, state.currentSet];
 
                return "erow";
            }
        },
 

        //
        // dummy token. Para saber si se esperaba un EROW pero no se matcheó con ninguno...
        //
        "error-if-no-erow-0": {
            token( stream, state ) {
  
                if( state.erowIndex<0 )
                {
                    stream.skipToEnd();
                    
                    state.activeToken   = null;

                    state.errors.push({
                        line:stream.lineOracle.line,
                        from: 0,
                        to: stream.string.length,
                        message:"Especting set's information for exercise ["+state.lastEblock.name+"]. Something like weight x reps, etc..."
                    });

                    state.lastEblock    = null;

                    return "error";
                }
            }
        },

        "end-of-erow": {
            token( stream, state ) {

                const set = state.currentSet; 

                set.w       = state.W;
                set.r       = state.R;
                set.s       = state.S;
                set.c       = state.erowComment.trim();   
                set.rpe     = state.erowRPE; //<--- puede ser un array
                set.line    = state.erowLine ;
            }
        },



        ...TAG_CODEMIRROR_TOKENS(config)
    } 

    const _token = (id, endOfLineToken, exitAfterFirstMatch ) => {
        
        const parts     = id.split(" ");
        var tokenReg    = new RegExp( "^"+ parts.map( p=>tokens[p].reg?.source.replace("^","") ).join("")+"\\s*$","i" );
 

        tokens[id] = {

            tokenChilds( parts, stream, state )
            { 
                //
                // no hay mas child para matchear.
                //
                if( !parts || parts.length==0 )
                    return; 

                //
                // si nos pasamos a otra línea, ya devolver null. 
                // esto esta pensado para que los childs esten en una mísma línea...
                //
                if( stream.lineOracle.line!=state.$tokenLine )
                {
                    return;
                }    
                    
                const token = tokens[ parts[0] ];
                const cls   = token.token( stream, state );

                if( cls )
                { 
                    if( !token.repeatUntilFail )
                        state.activeToken = { token: this.tokenChilds.bind(this, parts.slice(1)) }; // avanza al siguiente child 
 
                    //
                    // ** IMPORTANTE **
                    // estamos en el final de la linea pero no se llamó nunca al último token...
                    // esto puede pasar cuando se llega al final del stream. CodeMirror al final del stream deja de llamar token.
                    //
                    if( stream.eol() )
                    {
                        //
                        // yo sé que no va a devolver nada, es solo para darle closure al erow....
                        //
                        if ( endOfLineToken != null )
                        {
                            tokens[ endOfLineToken ].token( stream, state );
                        } 
                    }

                    return cls;
                }  
                
            },

            token( stream, state )
            { 
                // nuestro pattern matchea? y hay algo en la linea...

                if( stream.match( tokenReg, false ) && stream.string.trim().length>0 )
                {  
                    state.$tokenLine = stream.lineOracle.line;
                    state.activeToken = { token: this.tokenChilds.bind(this, parts.slice(0)) };
                    return state.activeToken.token( stream, state );
                } 
            },

            exitAfterFirstMatch
        }

        return id;
    }


    const schema = [
        ["YMD"],
        ["MONTH-OR-DAY-#"],
        ["BW"],
        ["DELETE"],
        ["ename", [ _token("erow: W,W,W x R C", "end-of-erow"),
                    _token("erow: W,W,W C", "end-of-erow"),
                    _token("erow: W x R x S C", "end-of-erow"), 
                    _token("erow: W x R C", "end-of-erow"),
                    _token("erow: W x R,R,R C", "end-of-erow"),
                    _token("erow: W S x R C", "end-of-erow"),
                    _token("erow: W C", "end-of-erow"),
                    "error-if-no-erow-0"
                 ]],

        ["TAG", [

            ...getUserAvailableTagTypes().map(key=>_token(`TAG_NAME: ${key}`,"/tag")) ,
            "error-if-no-tag-set"
        ]]
    ];
 

    const match = (stream, state) => {

        if( state.activeToken )
        { 
            const cls = state.activeToken.token(stream, state);  

            if( cls )
            {
                //
                // si hay childs, y ocurrió un match, reseteamos el counter... para loopearlos y poder volver a reecontrar otro token igual
                //
                if( state.tokenChilds?.length )
                { 
                    state.tokenChildIndex = 0;
                } 

                return cls;
            }
            else 
            { 
                //if has childs... etc...
                if( state.tokenChilds?.length )
                {    
                    if( state.tokenChildIndex<state.tokenChilds.length )
                    {  
                        state.activeToken = tokens[ state.tokenChilds[state.tokenChildIndex] ];
                        state.tokenChildIndex++; 

                        //
                        // loop back
                        //
                        return match( stream, state);
                    }   
                } 

                state.activeToken = null;
                state.tokenChilds = null;
                    
                }
            }

        //
        // buscar un token hasta que matchee...
        //
        for (let i = 0; i < schema.length; i++) 
        {
            const tokenName = schema[i][0]; 
            const token     = tokens[ tokenName ];

            const cls = token.token(stream, state);

            if( cls )
            {
                //
                // activeToken queda ahi hasta que no matchee nada...
                //
                state.activeToken       = token;

                //
                // si tiene childs... recordarlos (para loopearlos)
                //
                state.tokenChilds       = schema[i][1]?.slice(0);
                state.tokenChildIndex   = 0;
                return cls;
            }
        }

    }
 


    return {
        startState: ()=>({ 
            blockCount:0
            , lastBlock:null
            , rows:[] 
            , lastEblock:null
            , lastErow:null
            , lastTextRow:null
            , currentDay: config.defaultYMD
            , errors:[] 
        }),

        token(stream, state) {

            //
            // had to recode this because this hardcoded value... https://github.com/codemirror/codemirror5/blob/658bff7c56b7829aeabb8a914be5ca728d8aba0b/src/line/highlight.js#L161
            // 
            let cls = match(stream, state);

            if( cls )
            {
                return cls;
            } 


            //
            // ningun token matcheo...
            //  

            if( !state.lastTextRow || !state.rows.slice(-1)[0].text )
            {
                state.textSoFar     = (stream.match(/^.*/,true)?.[0] || "")  ; //la linea entera 
                state.lastTextRow   = { text:state.textSoFar.trim() };
                //state.rows.push(state.lastTextRow);
                state.rows = [ ...state.rows, state.lastTextRow ];
            }
            else 
            {
                state.textSoFar = (state.textSoFar || "") + "\n"+ (stream.match(/^.*/,true)?.[0] || "")  ; //la linea entera 
                state.lastTextRow.text = state.textSoFar.trim();
            } 

            return null;
        }
    }
}


CodeMirror.defineMode("wxr-editor", function(cmCfg, modeCfg){ 
    return JLogTokenizer(modeCfg); 
});

CodeMirror.registerHelper("fold", "wxr-editor", function(cm, start) {
    var maxDepth    = 100;  
    var endLine     = 0;
    //const state = cm.doc.childrens[0].lines[start]?.stateAfter;//cm.doc.children[0].lines
 
 
    const lines = cm.doc.children.reduce( (out, child)=>{ 
        Array.prototype.push.apply( out, child.lines );
        return out;
    }, []); //lines 
 
    
    const token = lines[ start.line ].stateAfter.rows.slice(-1)[0] ; // line, ch

    if( !token ) 
    {
        return null;
    }
    
    //
    // es un DAY tag
    //
    if( token.on )
    { 
        for (let lineNumer = start.line+1; lineNumer < lines.length; lineNumer++) 
        { 
            const state = lines[lineNumer].stateAfter;

            if( !state )
                continue;

            const lineToken = state.rows.slice(-1)[0];
            

            endLine = lineNumer;

            if( lineToken.on )
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
        for (let lineNumer = start.line+1; lineNumer < lines.length; lineNumer++) 
        { 
            const state = lines[lineNumer].stateAfter;

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
            lineHeight: lines

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

export const LogTextEditor = ({ usekg, exercises, tags, value, getDocRef, getShowErrorRef, defaultYMD, utags })=> {

    const classes       = useStyles();
    const txt           = useRef();
    const save          = useRef();  
    const cmirror       = useRef();

    /**
     * Si value es un array, se asume lo devolvió el backend, por lo que lo convertimos a string...
     */
    const valueAsText  = useMemo( ()=>{ 

        if( typeof value == 'string' )
        {
            return value;
        }

        if( !value ) return "";

        return __convertJEditorDataToText(value, usekg, utags);

    }, [value] );

    useEffect( ()=>{

        var myCodeMirror = CodeMirror.fromTextArea(txt.current,{ 
            extraKeys       : { "Ctrl-Space": "autocomplete", "Cmd-Space":"autocomplete", "Shift-Space":"autocomplete"},// "'#'": "autocomplete" }, 
            lineWrapping    :true, 

            mode:  {
                name:"wxr-editor", 
                tags, 
                exercises,//<- existing enames
                utags, //<-- user defined tags
                defaultYMD
            }, 
            foldGutter: true, 
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

                //
                //  trigger a re-parsing of the entire doc. 
                //
                cm.getDoc().setValue( cm.getDoc().getValue() );

                const doc = cm.getStateAfter(); 

                if( doc.errors?.filter(e=>!e.severity || e.severity=='error').length ) 
                {
                    throw new Error("Fix the errors before saving!"); 
                }

                // $errors.push({
                //     message:"Hay un error aca", 
                //     line: 3, from:0, to:5  
                // });

                //  myCodeMirror.performLint();

                // obtener listado de NUEVOS exercises...
                var dayBW           ; 
                var newExercises    = [];
                var lastEBlock      ; 
                var out             = doc.rows
                
                .reduce( (out, row)=>{

                    if( row.erow )
                    { 
                        lastEBlock.erows.push( row );
                    }
                    else 
                    {
                        if ( row.hasOwnProperty("eid") )  //( row.eid != null )
                        {
                            lastEBlock = { ...row, erows:[] };
                            out.push( lastEBlock );
                        }
                        else 
                        {
                            out.push( row );
                        } 
                    }

                    return out;

                }, [])

                .map( row=>{

                    if( row.erows )
                    {
                        var eid = row.eid;

                        if( !eid )
                        {
                            eid = newExercises.findIndex( e=>e.newExercise.replace(/\s/g,"").toLowerCase()==row.name.replace(/\s/g,"").toLowerCase() );

                            if( eid<0 )
                            {
                                eid = newExercises.push({ newExercise:row.name })-1;
                            } 

                            //
                            // "negative" number es flag para saber que es nuevo. 
                            // CERO es el primer nuevo...
                            //
                            eid = -eid ;
                        }

                        //
                        // algún set utilizó BW???
                        //
                        const usedBW     = row.erows.find( set=>
                            Array.isArray(set.w)? set.w.find(w=>w.usebw) || null
                                                : set.w.usebw );
                                                
                        if( usedBW && !dayBW )
                        { 
                            throw new Error(`JEDITOR:${usedBW.line} You used BW but never wrote how much you weight! Please specify your bodyweight (using the "@ ## BW" tag)`); 
                        }

                        return { 
                            eid     :Number(eid), 
                            erows   :row.erows 
                        };
                    }

                    //
                    // el BW se debe definir por día
                    //
                    if( row.on ) dayBW = null; 
                    if( row.bw ) dayBW = row.bw;
 
                    if( row.text=="" ) return null;
                    return row; 
                });

                if( newExercises.length )
                {
                    out = [
                        ...newExercises, 
                        ...out
                    ]
                }

            return out.filter( row=>row!=null ); 
          }  
 

          myCodeMirror.focus();

          //
          // on dismount...
          //
          return ()=>{
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
                    console.log("BW TAG!!!", usekg, datum.bw)
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
 

                            console.log("********",set)

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
 

export const convertJEditorData2Text = (data, usekg) => {
    return __convertJEditorDataToText( data, usekg );
}