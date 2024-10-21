import { useTheme } from "@material-ui/core";
import { useGetSession, useReactiveSetting } from "../session/session-handler";
import { WxDoT_decodeDistance } from "./journal/erow-render-WxDoT";


const imperialUnits = {
    'mi': 63360,
    'yd': 36,
    'ft': 12,
    'in': 1
};
const imperialKeys = Object.keys(imperialUnits);
const imperialValues = Object.values(imperialUnits);

const metricUnits   = {
    'km': 100000,
    'm': 100,
    'cm': 1
};
const metricUnitsKeys = Object.keys(metricUnits);
const metricUnitsValues = Object.values(metricUnits); 


export function DistanceValue({ value, unit, postfixUnit, nounit, round, prefix }) {

    const { session, userSettings } = useGetSession();
    const changeValue               = useReactiveSetting( userSettings?.convertDisplayUnits );   
    const sessionUseKg              = session?.user?.usekg ?? true;
    const theme                     = useTheme();
    var useImperial                 = false;

    if( (changeValue==1 && sessionUseKg==0) //<--- a "su unit" y su unit es LBS 
        || (changeValue==2 && sessionUseKg==1) //<--- al unit "opuesto" y su unis es KG
        || ( changeValue==0 && imperialKeys.includes(unit) ) //<--- el peso de este weight is LBS
         )
         {
            useImperial = true;
            if( changeValue!=0 ) round = true;
         } 

    var w = WxDoT_decodeDistance(value); // cm 
    var keys = metricUnitsKeys;

    var _unit =  keys[keys.length-1];
    var conversionFactors = metricUnitsValues;

    if( useImperial )
    {
        w = w/2.54; // cm to inch
        keys = imperialKeys;
        _unit =  keys[keys.length-1];

        conversionFactors = imperialValues;
    } 

    for (let i = 0; i < conversionFactors.length; i++) 
    {
        let v = w / conversionFactors[i];
        if( v>=1 )
        { 
            w = v;
            _unit = keys[i];
            break;
        }     
    }

    //
    // if the number has too many decimals, probably from converting between imperial and metric, cap it to 1 decimal...
    //
    if( (w % 1 !== 0 && w.toString().split('.')[1].length > 1) )
    {
        round = true;
    }

    if( round )
    {
        w = w.toFixed(1);
    }

    return <div style={{display:"inline", whiteSpace:"nowrap"}}>
        <span style={{color:theme.palette.primary.main}}>{round?"~":""}{w}</span> 
        <b style={{color: useImperial? theme.palette.secondary.main : theme.palette.primary.main, fontSize:"0.9em"  }}>{_unit}{postfixUnit}</b>
    </div>

}

/**
 * @typedef {Object} SpeedValueParams
 * @property {number} value expects a number in meters
 * @property {string} displayUnit unit in which to display this value
 */

/** 
 * @param {SpeedValueParams} param0 
 */
export function SpeedValue({ value, displayUnit }) {  
    return <DistanceValue round value={value*10000} unit={displayUnit} postfixUnit="/s"/>
}