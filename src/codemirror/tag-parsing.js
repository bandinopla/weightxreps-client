
import { getUserAvailableTypes, TAG_START_OF_DEFINITION_REGEXP, TAG_PREFIX } from "../user-tags/data-types";
  
/**
 * Returns an example text log to show how the diferent tags can be used
 * @returns {string}
 */
export const getExampleUTagsLog = () => {

    let exampleShown = new Set();
    let exampleNumber = 1;
    const TYPES = getUserAvailableTypes();

    return `Imagine this is a log, to create tags you have the following options: 

${ TYPES
                      .map( (type,i, arr)=>{


                        //#region Group examples sharing the same base
                        if( exampleShown.has( type.key ) )
                        {
                            return null;
                        }

                        exampleShown.add( type.key );

                        let desc        = type.description; //`${i+1}) ${type.description}\n${type.example}` 
                        let examples    = [ type.example, ...arr    .filter( t=>t.kindOf==type.key && t.description==type.description )
                                                                    .map( t=>{

                                                                        exampleShown.add( t.key );
                                                                        return t.example 
                                                                
                                                                    }) ];
                        //#endregion
                        
                        return `${exampleNumber++}) ${type.description}\n${ examples.join("\n").trim() }` ;


                     })
                     .filter( line=>line )
                     .join("\n\n") }
                     
After the ${TAG_PREFIX} keyword you can press CTRL+SPACE to trigger the autocomplete in case you have tags already created and want to reuse their names!`;
} 

/**
 * Adds token parsers so CodeMirror can parse the tags' values on the journal editor.
 */
const typesForCodeMirror = ()=>{
    let out = {};

    const TYPES = getUserAvailableTypes();

    TYPES.forEach( type=>{

        const key = type.key; 

        if( !type.reg ) return;

        out[key] = {
            reg:type.reg,
            token( stream, state ) 
            {
                var wPos    = stream.column();
                const m     = stream.match( this.reg );

                if( m )
                {
                    
                    try
                    { 
                        state.tagValue  = type.editor2value( m );

                        if( typeof state.tagValue!='string' )
                        {
                            throw new Error(`tag ${key} generated an invalid tag value, it must be a string!`);
                        }

                        if( state.tagValue.length>12 )
                        {
                            throw new Error(`Max length of a tag value is 12, tag ${key} generated a value of ${state.tagValue.length} characters.` );
                        }
                    }
                    catch(e)
                    {
                        state.errors.push({
                            line    : stream.lineOracle.line, 
                            from    : wPos,
                            to      : wPos+m[0].length,
                            message:  e.message
                        });

                        stream.skipToEnd(); 
                        return "error";

                    }
                    
                    state.tagType   = key;
                    return "utag utag-"+(type.isJustText?"text":"value")
                }
            }
        }

    } );

    return out;
}
 

export const TAG_STYLES = {
    "& .cm-utag": { 
        color:"#00846A", 
        fontWeight:"bold",
        textShadow:"1px 1px #ccc"
    },

    "& .cm-utag-name": {  
        textDecoration:"underline",
        color:"#444",
        textShadow:"none"
    }, 

    "& .cm-utag-value": {  
        color:"#FF7900",
        
    },

    "& .cm-utag-text": {  
        color:"#84B4FF",
        fontWeight:"none",
    },
}

export const TAG_CODEMIRROR_TOKENS = config => ({
    "TAG": {
        reg: TAG_START_OF_DEFINITION_REGEXP,
        token( stream, state ) {
            const sol   = stream.sol(); 
            const m     = stream.match( this.reg );

            if( m ) 
            {
                state.tagValue = null;
                state.currentTag = { tag:"" }
                state.rows = [ ...state.rows, state.currentTag ];
                return "utag";
            }
        }
    },
    "TAG_NAME:": {
        reg: /^([^:]+):/,
        token( stream, state ) {

            const m = stream.match( this.reg );
            if( m )
            {
                const tagName = m[1].trim();

                if( tagName.length>30 )
                {
                    state.errors.push({
                        line: stream.lineOracle.line,
                        from: 0,
                        to: stream.string.length,
                        message:"The name of the tag must be between 1 and 30 characters. Yours is "+ (tagName.length),
                        severity:"error"
                    });

                    return "error";
                }

                state.tagName = tagName;

                const isNew = !config.utags.find(utag=>utag.name.toLowerCase()==tagName.toLowerCase());

                if( isNew )
                {
                    state.errors.push({
                        line:stream.lineOracle.line,
                        from: 0,
                        to: stream.string.length,
                        message:"This tag seems to be new, it will be created on save.",
                        severity:"info"
                    });
                }

                return  isNew? "new-ename" : "utag utag-name" 
            }
        }
    }, 

    ...typesForCodeMirror(),

    "/tag": {  
        token( stream, state ) { 
                state.activeToken = null;
                state.tokenChilds = null;  
                state.currentTag.tag    = state.tagName;
                state.currentTag.value  = state.tagValue;
                state.currentTag.type   = state.tagType;
                state.currentTag = null;
        } 
    },

    "error-if-no-tag-set": {
        token( stream, state )
        {
            if( state.tagValue ===null )
            {
                stream.skipToEnd();
                
                state.activeToken   = null;

                state.errors.push({
                    line:stream.lineOracle.line,
                    from: 0,
                    to: stream.string.length,
                    message:"Invalid custom tag format, expecting something like: @ tagName : 123 ",
                    errorLine: stream.string
                });

                state.lastEblock    = null;

                return "error";
            }
 
        }
    }
});
 