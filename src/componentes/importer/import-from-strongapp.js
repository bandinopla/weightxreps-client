import Joi from "joi";
import { TYPES } from "../../user-tags/data-types";
import { ImportFromCVS } from "./import-from-csv";
import { fixRPE } from "./fixRPE";


//
// Expected fields in the CVS...
//
const schema = Joi.object({
    Date: Joi.date(),
    "Workout Name": Joi.string().allow(""),
    "Duration": [ 
        Joi.string().pattern(new RegExp(TYPES.TAG_TIME_h.reg)),
        Joi.string().pattern(new RegExp(TYPES.TAG_TIME_hm.reg)),
        Joi.string().pattern(new RegExp(TYPES.TAG_TIME_sec.reg)),
        Joi.string().pattern(new RegExp(TYPES.TAG_TIME_hms.reg)),
        Joi.string().allow("")
    ],
    "Exercise Name": Joi.string(),
    "Weight":Joi.number(),
    "Reps":Joi.number().allow(""),
    "Workout Notes":Joi.string().allow(""),
    "RPE":Joi.number().default(0).allow(null).allow(""),
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
            usekg
        }
    },

    processRow: (state, data)=>{

        let dayChanged = false;

        //
        // DAY
        //
        if(!state.day || state.day!=data.Date )
        {
            state.day = data.Date;

            state.log += data.Date.split(" ")[0]+"\n"; // YYYY-MM-DD 

            state.log += data['Workout Name']+"\n";
            dayChanged = true;

            if( data.Duration.length )
            {
                state.log += `@Workout Duration: ${data.Duration}\n`;
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
        // ENAME
        //
        if( !state.ename || state.ename!=data['Exercise Name'] || dayChanged )
        {
            state.ename = data['Exercise Name'];
            state.log += `#${data['Exercise Name']}\n`;
        }

        //
        // EROW
        //
        let W = parseFloat(data["Weight"]) || 1;
        let R = parseFloat(data["Reps"]) || 1; 
        let RPE = fixRPE( parseFloat(data["RPE"] )) || ""; 

        state.log += `${W}${state.usekg?"kg":"lbs"} x ${R} ${RPE}\n`;
    },

    stateAsLog: s=>s.log
}

export const ImportFromWStrongapp = ()=>{ 
    return <ImportFromCVS config={config} fileInputLabel="Select strongapp backup file .cvs" />
}