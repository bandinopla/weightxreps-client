 
import Joi from "joi";
import { ImportFromCVS } from "./import-from-csv";
import { fixRPE } from "./fixRPE";
import { enameToEtag } from "./import-from-strongapp";
 
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
    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Format the time based on the duration
    if (hours > 0) {
        return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(remainingSeconds)}`;
    } else if (minutes > 0) {
        return `${padNumber(minutes)}:${padNumber(remainingSeconds)}`;
    } else {
        return remainingSeconds + " sec";
    }
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
                state.log += `@Workout Duration: ${duration}\n`;
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

        if( data.hasOwnProperty("weight_lbs") ) //<--- uses Lbs
        {
            W = ( parseFloat(data.weight_lbs) || 0 );
            wUnit = 'lbs';
        }

        let R = parseFloat(data.reps) || 0; 
        let RPE = fixRPE( parseFloat(data.rpe) || 0 ); 
        let Duration = parseFloat(data.duration_seconds) || 0; 
        let Distance = parseFloat(data.distance_km) || parseFloat(data.distance_miles) || 0; 
        const distanceUnits = data.hasOwnProperty("distance_km")?"km":"miles";
        let com = (data.set_type!='normal'?data.set_type+". ":"") + data.exercise_notes;
        let erow;
        const rpeVal = RPE? `@${RPE} RPE `:"";
        const durationVal = Duration? formatSeconds(Duration) : null;

        //
        // we do this Reps check because if it doesnt use reps, it uses distance. And that can change the way in which we will convert this
        // log in weightxreps...
        //
        if( !R ) // must be using Distance then
        { 
            
            //TODO: IDK where to put "exercise_notes" in this case...

            if( Distance>=1 ) //number is too big. No ename
            {
                state.log += `@${data.exercise_title} / Distance (${distanceUnits}) : ${ Distance }\n`;

                if( Duration )
                {
                    state.log += `@${data.exercise_title} / Duration : ${durationVal}\n`;
                    throw new Error("Dummy")
                }
            }
            else 
            {
                erow = `${W || 1}${wUnit} x ${Math.round( Distance*1000 )} ${rpeVal} (meters)${durationVal?" in "+durationVal : ""}`;
            }
        }
        else 
        {
            erow = `${W || 1}${wUnit} x ${R} ${rpeVal}${durationVal?" in "+durationVal+" | " : ""}${com}`;
        } 

        //
        // if erow is null, it means it was logged as a custom user tag.
        //
        if( erow )
        {
            //
            // ENAME
            //
            if( !state.ename || state.ename!=data.exercise_title || dayChanged )
            {
                const ename = data.exercise_title;
                state.ename = ename;
                const etag = enameToEtag(ename);
                state.log += `#${ename+etag}\n`;
            }

            state.log += erow + "\n";
        }  
    },

    stateAsLog: s=>s?.log
}

export const ImportFromHevyapp = ()=>{ 
    return <ImportFromCVS config={config} fileInputLabel="Select hevyapp backup file .cvs" />
}
