


const shortText = txt => { 
    const SHORT_TEXT_MAX_CHARS = 80;
    txt = unescape(txt).trim();
    return  txt.substr(0,SHORT_TEXT_MAX_CHARS).trim()+"...";
 }


/**
 * Todo texto escrito por el usuario debería pasar por acá
 */
export const UserTypedText = ({ text, short, noWrap, style={} })=> {

    if( text.trim()=="|" )
    {
        return "";
    }

    if( !text || text.trim().length==0 ) {
        return <strong style={{color:"red"}}>[deleted]</strong>;
    }

    //whiteSpace:"break-spaces", wordBreak:"break-word"
    return <div style={{ display:"inline", whiteSpace: noWrap? "nowrap" : "pre-wrap", wordBreak:"normal", wordWrap:"break-word", ...style }}>{ short? shortText(text) : text }</div>;
}