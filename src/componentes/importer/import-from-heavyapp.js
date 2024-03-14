 
import Joi from "joi";
import { ImportFromCVS } from "./import-from-csv";
import { fixRPE } from "./fixRPE";
import { enameToEtag } from "./import-from-strongapp";
import { TYPES } from "../../user-tags/data-types";
import { SET_TYPES } from "../../data/set-types";
 
//
// the Hevyapp time string format
//
const dateReg = /^(\d{1,2}) ([A-Za-z]{3}) (\d{4}), (\d{2}):(\d{2})$/;

//
// Expected fields in the CVS...
//
const schema = Joi.object({

    title: Joi.string().allow(""),
    start_time: Joi.string().pattern(dateReg),
    end_time: Joi.string().pattern(dateReg),
    description: Joi.string().allow(""),
    exercise_title: Joi.string(),
    exercise_notes: Joi.string().allow(""),
    set_type:Joi.string().allow(""), //ecom
    weight_kg:Joi.number().default(0).allow(null).allow('').optional(),
    weight_lbs:Joi.number().default(0).allow(null).allow('').optional(),
    reps:Joi.number().default(0).allow(null).allow(''),
    distance_km:Joi.number().default(0).allow(null).allow('').optional(),
    distance_miles:Joi.number().default(0).allow(null).allow('').optional(),
    duration_seconds:Joi.number().default(0).allow(null).allow(''),
    rpe:Joi.number().default(0).allow(null).allow('')

}); 

/** 
 * convert the time string from hevyapp cvs to WXR format
 * 
 * @param {string} dateString heavyapp date string
 * @returns {string} YYYY-MM-DD
 */
const date2YMD = dateString => { 

    // Split the date string into parts
    const parts = dateString.split(/[\s,]+/);
    
    // Extract day, month name, and year
    const day = parts[0];
    const monthName = parts[1];
    const year = parts[2];
    
    // Convert month name to month number
    const months = {
      "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
      "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
    };
    const month = months[monthName]; 
    
    return `${year}-${month}-${padNumber(day)}`;
}

/**
 * Give duration string from 2 heavyapp time strings
 * 
 * @param {string} start start time in hevyapp time format (value from the cvs)
 * @param {string} end end time in hevyapp time format (value from the cvs)
 * @returns {string} the duration in human readable format for use in weightxreps.net
 */
function getDuration(start, end) {
    // Convert strings to total minutes
    const [startHours, startMinutes] = start.split(" ").pop().split(':').map(Number);
    const [endHours, endMinutes] = end.split(" ").pop().split(':').map(Number);
    const startTime = (startHours * 60 + startMinutes)*60;
    const endTime = (endHours * 60 + endMinutes)*60;

    // Calculate the difference in minutes
    const diff = Math.abs(endTime - startTime);

    return formatSeconds( diff ); 
}

/** 
 * Convert seconds to the duration tag expected by a weightxreps custom tag
 * @param {number} seconds 
 * @returns {string} WXR duration tag
 */
function formatSeconds(seconds) { 

    return TYPES.TAG_TIME_hm.value2editor( TYPES.TAG_TIME_hm.components2value(seconds*1000) );
}

// Helper function to pad single-digit numbers with leading zeros
function padNumber(num) {
    return num.toString().padStart(2, '0');
} 


/**
 * @type {import("./import-from-csv").CVSParserConfig}
 */
const config = {
    askWeightUnitToUser: false,
    canContinueInCaseOfError: true, 
    schema,
    verifyEachRow: true,

    startState: (row, usekg)=>{
        return {
            day: null,
            ename: null,
            log:"",
        }
    },

    processRow: (state, data)=>{

        let dayChanged = false; 

        //
        // DAY
        //
        if(!state.day || state.day!=data.start_time )
        {
            state.day = data.start_time;

            state.log += date2YMD( data.start_time )+"\n"; // YYYY-MM-DD 

            state.log += data.title+"\n";
 
            dayChanged = true;

            //
            // duration
            //
            let duration = getDuration(data.start_time, data.end_time);

            if( duration )
            {
                state.log += `@ Workout Duration: ${duration}\n`;
            }

            //
            // LOG
            // 
            if( data.description ) state.log += data.description.replace(/\\n/g,"\n")+"\n"; 
        }

        //
        // EROW
        //
        let wUnit = 'kg';
        let W = parseFloat(data.weight_kg) || 0;
        let setW;

        if( data.hasOwnProperty("weight_lbs") ) //<--- uses Lbs
        {
            W = ( parseFloat(data.weight_lbs) || 0 );
            wUnit = 'lbs';
        }

        setW = W>0? W + wUnit : null;

        let R = parseFloat(data.reps) || 0; 
        let RPE = fixRPE( parseFloat(data.rpe) || 0 ); 
        let Duration = parseFloat(data.duration_seconds) || 0; 
        let Distance = parseFloat(data.distance_km) || parseFloat(data.distance_miles) || 0; 
        const distanceUnits = data.hasOwnProperty("distance_km")?"km":"mi";

        let com = (data.set_type!='normal'?data.set_type+". ":"") + data.exercise_notes;
        let erow;
        const rpeVal = RPE? `@${RPE}RPE `:"";
        const C = rpeVal + com;

        const setT = Duration? formatSeconds(Duration) : null;

        const type = Distance? SET_TYPES.WxD : 
                        !R && Duration ? SET_TYPES.WxT : 
                        SET_TYPES.WxR;

        //
        // ENAME
        //
        if( !state.eblock || state.eblock.ename!=data.exercise_title || state.eblock.type!=type || dayChanged )
        {
            const ename = data.exercise_title;
            state.eblock = {
                ename,
                type
            };
            const etag = enameToEtag(ename);
            state.log += `#${ename+etag}\n`;
        }

        switch( state.eblock.type )
        {
            case SET_TYPES.WxD:
                state.log += (setW? setW+" x ":"") + Distance + distanceUnits + (setT?" in "+setT:"") + " " + C + "\n";
                break;
            case SET_TYPES.WxT:
                state.log += (setW? setW+" x ":"") + setT + " " + C + "\n";
                break;
            default:
                state.log += ( setW ?? 1 ) + " x " + R +" " + C + "\n";
        } 
    },

    stateAsLog: s=>s?.log
}

export const ImportFromHevyapp = ()=>{ 
    return <ImportFromCVS config={config} fileInputLabel="Select hevyapp backup file .cvs" />
}
