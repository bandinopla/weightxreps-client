import CodeMirror from "codemirror";
import { TAG_CODEMIRROR_TOKENS } from "../../codemirror/tag-parsing";
import { getUserAvailableTagTypes, TYPES as UTAG_TYPES } from "../../user-tags/data-types";
import { dateToYMD, ymd2date } from "../../utils/utils"; 
import { WxDoT_encodeDistance } from "./erow-render-WxDoT";
import { SET_TYPES } from "../../data/set-types";


const $monthName= ["January","February","March","April","May","June","July","August","September","October","November","December"];
const $dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TIME_UTAGS = [
    UTAG_TYPES.TAG_TIME_hms,
    UTAG_TYPES.TAG_TIME_hm,
    UTAG_TYPES.TAG_TIME_h, 
    UTAG_TYPES.TAG_TIME_ms,
    UTAG_TYPES.TAG_TIME_sec, 
]; 


export const JLogTokenizer = config => {

    //const W_Reg     = /(BW\s*[\+\-]?)?(\d+(?:\.\d+)?)?(kg|lbs?)?/i;
    const W_Reg     = /(?:(?:(bw\s*[\+\-]?)?(\d+(?:\.\d+)?)\s*(kg|lbs?)?)|(bw))/i;

    const Xchars    = "x\\*"
    const X         = new RegExp("["+Xchars+"]");
    const IN         = new RegExp("in");

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
                        message : (errorTitle?errorTitle+": ":"")+e.message,
                        errorLine: stream.string
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
                        state.erowType = null;

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
                                       + "\n" + "-".repeat( happened.length+wPos  )+"^",
                                errorLine: stream.string
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
                            message: e.message,
                            errorLine: stream.string
                        });
                    }   

                    //state.lastEblock.erows[state.erowIndex].w = w; 
                    state.W = w;

                    return "weight";
                }
            }
        },

        "T": {
            reg: new RegExp( "("+TIME_UTAGS.map(utag=>utag.reg.source.replace("^","")).join("|")+")" ,"i"),
            token( stream, state ) 
            {   
                
                //ver cuál matchea...
                for( var utag of TIME_UTAGS )
                {
                    const m     = stream.match( utag.reg );
                    if( m )
                    {
                        const val           = utag.editor2value(m);
                        const milliseconds   = utag.value2number(val);

                        state.T = milliseconds; //UTAG_TYPES.TAG_TIME_hms.value2editor( UTAG_TYPES.TAG_TIME_hms.components2value(miliseconds) ); //<--- saves a hh:mm:ss string

                        return "time b";
                    }
                }
            }
        },

        "D": {
            reg: /^(\d+(\.\d+)?)(cm|mi|km|in|ft|yd|m)/i, // the unit must be next to the number with no spaces to avoid confusion with for example: 100 x 5 in very cood speed | <--- "in" is not "inches" there...
            token( stream, state ) {
                const m     = stream.match( this.reg );
                if( m ) 
                {  
                    try 
                    {
                        var d = WxDoT_encodeDistance( parseFloat(m[1]), m[3] );
                    }
                    catch(e)
                    {
                        state.errors.push({
                            line    : stream.lineOracle.line,
                            from    : stream.column(),
                            to      : stream.column()+m[0].length,
                            message : e.message,
                            errorLine: stream.string
                        });

                        return 'error';
                    }

                    state.D = d; 
                    return "distance";
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
                                       + "\n" + "-".repeat( happened.length+wPos  )+"^",
                                errorLine: stream.string
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
                            // if( state.erowComment?.trim().length )
                            // {
                            //     throw new Error("RPE must be at the start of the comment (after the weight, reps & sets), it can't have text before it. Put it at the front!");
                            // }
    
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

                                if( rpe<1 || rpe>10 || (rpe != Math.floor(rpe) && rpe!=Math.floor(rpe)+0.5 ) )
                                { 
                                    offset = rpeString.indexOf( rpe.toString() );
                                    length = rpe.toString().length;
                                    throw new Error("Invalid RPE. It must be a number between 1 and 10. And only a diference of 0.5 between each. Example: @ 6.5 | You wrote: "+rpe);
                                } 
                            } 
                            
                        }
                        catch( e )
                        {
                            state.errors.push({
                                line            : stream.lineOracle.line,
                                from            : stream.column() + offset ,
                                to              : stream.column() + offset + length,
                                message         : e.message,
                                errorLine: stream.string
                            });
                            return;
                        }
                        
                    } 

                    //#region RPE finding...

                    // \s*(\d+(?:\.\d+)?(?:\s*,\s*\d+(?:\.\d+)?)*)
                    // (\d+(?:\.\d+)?)
                    
                    //
                    // RPE is only valid if it is the first thing in the set comment, else, asume the user just wrote a comment.
                    //
                    if( !state.erowComment?.trim().length ) 
                    {
                        //
                        // buscar RPE tipo:  @5
                        //
                        if( m = stream.match(/^\s*@\s*(?:rpe\s*)?(\d+(?:\.\d+)?(?:\s*,\s*\d+(?:\.\d+)?)*)(?:\s*rpe)?/i) )
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
                        else if( (m = stream.match(/^\s*rpe\s*(\d+(?:\.\d+)?(?:\s*,\s*\d+(?:\.\d+)?)*)\s*/i)) || 
                                (m = stream.match(/^\s*(\d+(?:\.\d+)?(?:\s*,\s*\d+(?:\.\d+)?)*)\s*rpe/i)) )
                        {
                            let rpe = __parseRPE(m[1]);

                            __errorIfInvalid( rpe, m[0]);
                            

                            //state.erowComment += m[0]; 
                            state.erowRPE = rpe;
    
                            return "RPE b";
                        }
                    }

 
                    //#endregion
 
                    //
                    // si hay algo mas en la línea...
                    //
                    if( stream.peek() )
                    {   
                        var l = stream.next(); 

                        //
                        // avoid highlighting with the color style to white spaces at the start.
                        //
                        if( l==" " && state.erowComment == "" ) // start of the comment
                        { 
                            stream.eatSpace(); //eat all the white space...
                            return "meta";
                        }  
                          
                        state.erowComment += l;
                        return "setComment";
                    }   
                
            }
        },

        "x": {
            reg: new RegExp( "^\\s*" + X.source +"\\s*"), ///^\s*[x\*]\s*/,
            token( stream ) {
                if( stream.match( this.reg ) )
                {
                    return "meta b";
                }
            }
        },

        "x2": {
            reg: new RegExp( "^\\s*" + X.source.replace("]","/]") +"\\s*"), 
            token( stream ) {
                if( stream.match( this.reg ) )
                {
                    return "meta b";
                }
            }
        },

        "in": {
            reg: new RegExp( "^\\s*" + IN.source +"\\s*"), ///^\s*[x\*]\s*/,
            token( stream ) {
                if( stream.match( this.reg ) )
                {
                    return "meta b";
                }
            }
        },

        "YMD": {
            token( stream, state ) {

                var sol = stream.sol();
                var m = sol && stream.match(/^\s*(\d+-\d+-\d+)\s*$/);
                if( m )
                {
                    var d = ymd2date(m[1],true);

                    if( dateToYMD(d)!=m[1] )
                    {
                        state.errors.push({
                            line            :stream.lineOracle.line,
                            from            : stream.column(),
                            to              : stream.column() + m[0].length,
                            message         :"Invalid date",
                            errorLine: stream.string
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
                
                var m = stream.sol() && stream.match(/^\s*(\w+)\s*(\d+)?\s*$/i, false); //$monthName
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
                            message         :"Invalid date",
                            errorLine: stream.string
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
                state.T = 0;
                state.D = null; 
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
                set.t       = state.T;
                set.c       = state.erowComment.trim();   
                set.d       = state.D; 
                set.type    = state.erowType.type;
                set.rpe     = state.erowRPE; //<--- puede ser un array
                set.line    = state.erowLine ; 
            }
        },



        ...TAG_CODEMIRROR_TOKENS(config)
    } 

    const literalToken = str => ({
        reg: new RegExp( "^\\s*" + str +"\\s*"), 
        token( stream ) {
            if( stream.match( this.reg ) )
            {
                return "meta";
            }
        }
    });

    const _token = (id, endOfLineToken, exitAfterFirstMatch, erowType = SET_TYPES.WxR) => {
        
        const parts     = id.split(" ");

        parts.forEach( p=>{
            if( !tokens[p] )
            {
                tokens[p] = literalToken(p);
            }
        });


        var tokenReg    = new RegExp( "^"+ parts.map( p=>tokens[p].reg?.source.replace("^","")).join("")+"\\s*$","i" );
 

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
 
                    if (stream.match(/\s+$/, false))
                        stream.eatWhile(/\s/);
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
                    //if( state.erowType && state.erowType!=erowType )
                    if( erowType &&state.erowType && (state.erowType!=erowType) && (erowType.type==0 || state.erowType.type==0) ) // dont let mixing weight x reps with weight x distance or time.
                    { 
                        stream.skipToEnd();

                        state.errors.push({
                            line:stream.lineOracle.line,
                            from: 0,
                            to: stream.string.length,
                            message:`This type of set cannot be mixed with the one above, this one is a "${erowType.name}" and the set above is a "${state.erowType.name}"`,
                            errorLine: stream.string + " // " + state.$lastLine
                        })

                        return "error";
                    }

                    state.erowType = erowType;
                    state.$tokenLine = stream.lineOracle.line;
                    state.$lastLine = stream.string;
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
        ["ename", [ 
                    _token("erow: W x D in T x2 S C", "end-of-erow", null, SET_TYPES.WxD), 
                    _token("erow: W x D in T C", "end-of-erow", null, SET_TYPES.WxD), 
                    _token("erow: W x D x2 S C", "end-of-erow", null, SET_TYPES.WxD),  
                    _token("erow: W x D C", "end-of-erow", null, SET_TYPES.WxD), 
                    _token("erow: D in T x2 S C", "end-of-erow", null, SET_TYPES.WxD),
                    _token("erow: D in T C", "end-of-erow", null, SET_TYPES.WxD),
                    _token("erow: D x2 S C", "end-of-erow", null, SET_TYPES.WxD),
                    _token("erow: D C", "end-of-erow", null, SET_TYPES.WxD),

                    _token("erow: W x T x2 S C", "end-of-erow", null, SET_TYPES.WxT),
                    _token("erow: W x T C", "end-of-erow", null, SET_TYPES.WxT),
                    _token("erow: T x2 S C", "end-of-erow", null, SET_TYPES.WxT),
                    _token("erow: T C", "end-of-erow", null, SET_TYPES.WxT),
                    _token("erow: W,W,W x R C", "end-of-erow"),
                    _token("erow: W,W,W C", "end-of-erow"),
                    _token("erow: W x R x2 S C", "end-of-erow"), 
                    _token("erow: W x R C", "end-of-erow"),
                    _token("erow: W x R,R,R C", "end-of-erow"),
                    _token("erow: W S x R C", "end-of-erow"),
                    _token("erow: W C", "end-of-erow"),
                    "error-if-no-erow-0"
                 ]],

        ["TAG", [

            ...getUserAvailableTagTypes().map(key=>_token(`TAG_NAME: ${key}`,"/tag",null, false)) ,
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

    };

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
        },

        /**
         * Converts the state object to the payload expected by the wxr server
         * 
         * @param {Object} state the final state resulted from analizing a workout log using this tokenizer.
         * @param {string[]?} lines the final state resulted from analizing a workout log using this tokenizer.
         * @returns {Object[]} log rows 
         */
        stateToSavePayload( state, lines ) {

            const errors = state.errors?.filter(e=>!e.severity || e.severity=='error');
            //
            // state has errors...
            //
            if( errors.length ) 
            { 
                if( config.printAllErrorsOnThrow )
                {
                    throw new Error( "\n"+errors.map(e=>"LINE >>> "+e.errorLine+"\nError ---> "+e.message).join("\n"))
                }
                // console.error( errors )
                throw new Error("Fix the errors before saving!"); 
            }

            var dayBW           ; 
            var newExercises    = [];
            var lastEBlock      ; 
            var out             = state.rows

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

                    //
                    // new exercises have 0 to negative ID to signal they are new.
                    //
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
                                            : set.w?.usebw ); // with ? because it can be null if the set doesn't use weight
                                            
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
        },


        /**
         * Expects a big chunk of text in the format of a workout log. A backup file for example.
         * 
         * @param {string} text Workout logs... the same way you log them in the editor.
         * @param {number} chunkSize number of lines to parse before doing a "break"
         * @param {(progress:number)=>void} onProgress number from 0 to 1 representing the progress done while parsing
         * @returns {Promise<Object>} Returns the data required to send it to a save function
         */
        async textToPayload( text, chunkSize, onProgress )
        {  
            //return await __parseLines(this, state, lines, chunkSize);
            return new Promise( (resolve, reject)=>{

                const lines = text.split("\n");
                const state = this.startState();
                const totalLines = lines.length;

                __parseLines(this, state, lines, chunkSize, resolve, reject, l=>onProgress && onProgress(l/totalLines) );
                
            });
        }
    }
}

/**
 * Parse the lines
 * @param {JLogTokenizer} tokenizer 
 * @param {Object} state 
 * @param {string[]} lines 
 * @param {number} chunkSize 
 * @param {(finalState:object)=>{}} onFinish
 * @param {(err:string)=>{}} onError
 * @param {(linesProcessed:number)=>{}} onProgress
 * @param {number} lineNumber internal use... to pass it to the lineOracle of the string stream.
 */
async function __parseLines( tokenizer, state, lines, chunkSize, onFinish, onError, onProgress, lineNumber )
{
    let l = 0;
    let ln = lineNumber || 0;

    while( lines.length )
    {
        const line = lines.shift();

        if( line.indexOf("#Missing Exercise")>-1 )
        {
            continue;
        }

        const lineStream = new CodeMirror.StringStream(line, 4, { line:ln++ }); 

        try
        {
            do
            {
                if( !tokenizer.token( lineStream, state ))
                { 
                    lineStream.next();
                } 

                lineStream.start = lineStream.pos;
            }
            while( !lineStream.eol() );
        } 
        catch(e) 
        {
            onError("Oops! "+e.toString());
            return;
        }

        if( ++l>=chunkSize )
        { 
            onProgress(ln);
            setTimeout(__parseLines, 0, tokenizer, state, lines, chunkSize, onFinish, onError, onProgress, ln);
            return;
        }
    }

    try 
    {
        var payload = tokenizer.stateToSavePayload(state, lines); 
    }
    catch(e) 
    {
        onError( e.toString() );
        return;
    }

    onProgress(ln);
    onFinish(payload);
}