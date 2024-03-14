import Joi from "joi";
import { TYPES } from "../../user-tags/data-types";
import { ImportFromCVS } from "./import-from-csv";
import { fixRPE } from "./fixRPE";
import { SET_TYPES } from "../../data/set-types";

const durationScheme = [ 
    Joi.string().pattern(new RegExp(TYPES.TAG_TIME_h.reg)),
    Joi.string().pattern(new RegExp(TYPES.TAG_TIME_hm.reg)),
    Joi.string().pattern(new RegExp(TYPES.TAG_TIME_sec.reg)),
    Joi.string().pattern(new RegExp(TYPES.TAG_TIME_hms.reg)),
    Joi.string().allow("").optional()
];

//
// Expected fields in the CVS...
//
const schema = Joi.object({
    "Date": Joi.date(),
    "Workout Name": Joi.string().allow(""),
    "Workout Duration": durationScheme,
    "Duration": durationScheme,
    "Exercise Name": Joi.string(),
    "Weight":Joi.number().allow(""),
    "Weight Unit":Joi.string().optional(),
    "Reps":Joi.number().allow(""),
    "Workout Notes":Joi.string().allow(""),
    "RPE":Joi.number().default(0).allow(""),
    "Distance":Joi.number().default(0).allow("").optional(),
    "Distance Unit":Joi.string().default("km").allow("").optional(),
});

/**
 * @type {import("./import-from-csv").CVSParserConfig}
 */
const config = {
    askWeightUnitToUser: true,
    canContinueInCaseOfError: true, 
    schema,
    verifyEachRow: true,

    startState: (row, usekg)=>{
        return {
            day: null,
            ename: null,
            log:"",
            assumeWUnit: usekg? 'kg' : 'lbs', //<-- Android has the weight unit field, but iOS doesn't... 
        }
    },

    processRow: (state, data)=>{

        let dayChanged = false;
        const ymd = data.Date.split(" ")[0];

        //
        // DAY
        //
        if(!state.day || state.day!=ymd )
        {
            state.day = ymd;
            state.log += ymd+"\n"; // YYYY-MM-DD 

            state.log += data['Workout Name']+"\n";
            dayChanged = true;
            const duration = data["Workout Duration"] || data["Duration"] || ""; // because strongapp exports this field as "Duration" on iOS and "Workout Duration" on Android... :/

            if( duration )
            {
                state.log += `@ Workout Duration: ${duration}\n`;
            }

            //
            // LOG
            //
            if( data['Workout Notes']?.length )
            {
                state.log += data['Workout Notes'].replace(/\\n/g,"\n") +"\n";
            }
        }

        //
        // EROW
        //
        const ename = data['Exercise Name'];
        const wUnit = data["Weight Unit"] || state.assumeWUnit;

        //
        // TIME
        //
        let T = parseInt(data["Seconds"]) || 0;

        if( T ) T = TYPES.TAG_TIME_hm.value2editor( TYPES.TAG_TIME_hm.components2value( T*1000 ) );


        //
        // WEIGHT
        //
        let W = parseFloat(data["Weight"]) || 1; 

        if( data["Weight"]?.length>5 ) W = W.toFixed(1); //else it comes with a bunch of decimals...

        const setW = W? W+" "+wUnit: "";

        //
        // REPS
        //
        let R = parseFloat(data["Reps"]) || 1; 

        //
        // RPE
        //
        let RPE = fixRPE( parseFloat(data["RPE"] )) || ""; 
        

        //
        // DISTANCE
        //
        let D = parseFloat(data["Distance"]) || 0;

        if( data["Distance"]?.length>5 ) D = D.toFixed(1);

        const DUNIT = data["Distance Unit"] || ( wUnit=='kg'? "km" : "mi" ); //<--- assume km is weight is metric system. else assume miles...
 

        //
        // SET's COMMENT
        //
        let C = data["Notes"] || "";

        if( RPE ) C = "@"+RPE+"RPE "+C;

        
        //
        // SET TYPE
        //
        const type = T && !D ? SET_TYPES.WxT.type : 
                           D ? SET_TYPES.WxD.type :
                               SET_TYPES.WxR.type ;

        //
        // CREATE EBLOCK if necesary...
        //
        if( !state.eblock || state.eblock.ename!=ename || state.eblock.type != type )
        {
            state.eblock = {
                ename,
                type,
                etag : enameToEtag(ename)
            }

            state.log += `#${ename} ${state.eblock.etag}\n`;
        }

        //
        // GENERATE EACH EROW
        //
        switch( type )
        {
            case SET_TYPES.WxT.type:
                state.log += (W? setW+" x ":"") + T + " " + C + "\n";
                break;

            case SET_TYPES.WxD.type:

                let setD = (W? setW+" x ":"") + D + DUNIT + " " + C + "\n";

                if( T ) setD = (W? setW+" x ":"") + D + DUNIT + " in " + T + " " + C + "\n"; 

                state.log += setD;

                break;

            default:
                state.log += setW +" x " + R + " " + C + "\n"; 
        } 

    },

    stateAsLog: s=>s.log
}

/** 
 * @param {string} ename 
 * @returns {string}
 */
export const enameToEtag = ( ename )=>{
    let etag = "";

    if( ename.startsWith("Bench Press") )
    {
        etag = " #bp";
    }
    else if( ename.startsWith("Deadlift") || ename=="Sumo Deadlift (Barbell)" || ename.startsWith("Stiff Leg Deadlift"))
    {
        etag = " #dl";
    }
    else if( ename.startsWith("Clean and Jerk") )
    {
        etag = " #cnj";
    }
    else if( ename=="Chin Up" || ename=="Wide Pull Up")
    {
        etag = " #pull";
    }
    else if( ename=="Squat (Barbell)" || ename=="Squat (Dumbbell)")
    {
        etag = " #sq";
    }
    else if ( ename=="Strict Military Press (Barbell)" )
    {
        etag = " #ohp";
    }
    return etag;
}

export const ImportFromWStrongapp = ()=>{ 
    return <ImportFromCVS config={config} fileInputLabel="Select strongapp backup file .cvs" />
}