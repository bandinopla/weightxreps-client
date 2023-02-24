


const shortText = txt => { 
    const SHORT_TEXT_MAX_CHARS = 80;
    txt = unescape(txt).trim();
    return  txt.length>=SHORT_TEXT_MAX_CHARS? txt.substr(0,SHORT_TEXT_MAX_CHARS).trim() + "[...]" : txt;
 }


/**
 * Todo texto escrito por el usuario debería pasar por acá
 */
export const UserTypedText = ({ text, short })=> {

    if( !text || text.trim().length==0 ) {
        return <strong style={{color:"red"}}>[deleted]</strong>;
    }

    //whiteSpace:"break-spaces", wordBreak:"break-word"
    return <div style={{ display:"inline", fontFamily:"'Azeret Mono', monospace",whiteSpace:"pre-wrap", wordBreak:"normal", wordWrap:"break-word" }}>{ short? shortText(text) : text }</div>;
}