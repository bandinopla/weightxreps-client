import { makeStyles } from "@material-ui/core"
import { TYPES } from "../user-tags/data-types";
import { TextTokenizer } from "react-text-tokenizer"


/**
 * @type {import("react-text-tokenizer").TokenEater}
 */
const ceroesEater = {
    match: /^([0:]+)?([^\.]+)/,
    getReactNode: (m, key) => {
        return <span key={key}>
            <span style={{opacity:0.3}}>{m[1]}</span>
            <span>{m[2]}</span>
        </span>
    }
}  

/**
 * @type {import("react-text-tokenizer").TokenEater}
 */
const millisecondsEater = {
    match:/^\.(\d+)$/,
    getReactNode: (m, key) => {
        const ms = parseFloat(m[1]);
        if( ms==0 ){
            return "";
        }
        return <span key={key} style={{color:"green", fontSize:"0.8em"}}>.{ms}</span>
    }
}

const eaters = [ceroesEater, millisecondsEater];
  

const useStyles = makeStyles( theme=>({

    root: {
        background:"#B3BF99",
        color:"#333",
        fontFamily:"monospace",
        padding:"1px 5px" 
    }

})); 

export const TimeValue = ({ milliseconds }) => {
    const classes = useStyles();
    const text = TYPES.TAG_TIME_hms.value2editor( TYPES.TAG_TIME_hms.components2value(milliseconds) );

    return <strong className={ classes.root+" sha oneline" }>
        <TextTokenizer text={text} tokenEaters={eaters} /> 
    </strong>
}