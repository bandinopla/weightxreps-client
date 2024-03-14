
import { RPEChip } from "../componentes/RPE-Chip";
import {TagBW} from "./to-view/TAG_BW";
import TAG_RANK_toView from "./to-view/TAG_RANK";

// icons
import AccessibilityNewRoundedIcon from '@material-ui/icons/AccessibilityNewRounded'; //BW
import FlashOnRoundedIcon from '@material-ui/icons/FlashOnRounded'; //FPE
import TimerRoundedIcon from '@material-ui/icons/TimerRounded'; //duration
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded'; //blood
import StarHalfRoundedIcon from '@material-ui/icons/StarHalfRounded'; //rank
import ShowChartRoundedIcon from '@material-ui/icons/ShowChartRounded'; //int  
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { UserTypedText } from "../componentes/user-typed-text";

export const TAG_PREFIX = "@";
export const TAG_START_OF_DEFINITION_REGEXP = new RegExp(`^\\s*${TAG_PREFIX}\\s*`,"i")



/**
 * TYPES is an object where each key is the ID of the type of data that a tag can hold.
 * a tag is like a variable in a programing language. 
 */
export const TYPES = {

    "TAG_BW": {
        dataTypeDesc    : "Bodyweight",
        description     : "(Automatic) Bodyweight of the day",
        value2view      : v=><TagBW value={ parseInt(v)/1000 } />, 
        icon            : AccessibilityNewRoundedIcon
    }, 
    

    "TAG_RPE": {
        reg          : /^\s*RPE\s*(1?\d(?:\.\d)?)/i,
        dataTypeDesc : "RPE",
        description  : "Tag the RPE of an arbitrary aspect of your training",
        example      : `${TAG_PREFIX} Workout Dificulty: RPE 7`,
        editor2value : m=>m[1],  
        value2view   : v=><RPEChip value={parseFloat(v)}/>, 
        value2editor : v=>`RPE ${v}`,
        icon         : FlashOnRoundedIcon
    },

    "TAG_RPE2": {
        kindOf       : "TAG_RPE",
        reg          : /^\s*(1?\d(?:\.\d)?)\s*RPE/i,
        example      : `${TAG_PREFIX} Accesory work dificulty: 7 RPE`
    } , 


    "TAG_TIME_h": {
        reg                 : /^\s*(\d+(?:\.\d+)?)\s*hs?/i,
        dataTypeDesc        : "Duration",
        icon                : TimerRoundedIcon,
        description         : "Tag the duration of something...",
        example             : `${TAG_PREFIX} Workout duration (in hours): 1.5h`,

        editor2value        : m=>m[1],
        value2number        : val=>parseFloat(val) * 3600000,   //to milliseconds
        components2value    : c => (c / 3600000).toFixed(1),
        //value2view          : v=>`${v}h`, 
        value2editor        : v=>`${v}h`,

        value2view (v) {
 
            const milliseconds      = this.value2number(v);
 
            const seconds           = Math.floor(milliseconds / 1000);
            const hours             = Math.floor(seconds / 3600);
            const minutes           = Math.floor((seconds % 3600) / 60);
            const remainingSeconds  = seconds % 60;
            
            const padZero = (value) => (value < 10 ? `0${value}` : value);
            const formattedHours = padZero(hours);
            const formattedMinutes = padZero(minutes);
            const formattedSeconds = padZero(remainingSeconds);

            if( hours<1 )
            {
                return `${formattedMinutes}:${formattedSeconds}`;
            }
            
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      
              
        }
    },

    "TAG_TIME_hm": {
        kindOf              : "TAG_TIME_h",
        //reg                 : /^\s*(?:(\d+)\s*hs?\s*)?(\d+)\s*m(?:ins?)?/i,
        reg                 : /^\s*(?:(\d+)\s*hs?)(?:\s*(\d+)\s*m(?:ins?)?)?(?:\s*(\d+(?:\.\d+)?)\s*s(?:ecs?)?)?/,
        example             : ["Session duration: 2h 25min","Time on the bike: 1h15m15sec", "Cardio: 1h 20.3s"].map( s=>`${TAG_PREFIX} ${s}` ).join("\n") ,
        //editor2value        : m=>(m[1]??"0")+"|"+m[2]+"|0",
        editor2value        : m=> {

            const h = parseInt(m[1]);
            const min = parseInt(m[2] ?? 0);
            let s = parseFloat(m[3] ?? 0);

            const ms = Math.floor( s % 1 * 1000);
            s = Math.floor(s);

            return [h,min,s,ms].join("|"); 
        },

        value2number        : val=>TYPES.TAG_TIME_hms.value2number(val), 
        components2value    : c=>TYPES.TAG_TIME_hms.components2value(c), 

        value2editor        : val=>{
            const [ HH, MM, SS, MS ] = val.split("|").map(v=>parseInt(v));
            let sec = SS+MS/1000;

            return (HH>0? HH+"hs " : "") + (MM>0? MM+"min " : "")+(sec>0? sec+"sec " : "");
        },
    },

    "TAG_TIME_ms": {
        kindOf              : "TAG_TIME_h",
        reg                 : /^\s*(?:\s*(\d+)\s*m(?:ins?)?)(?:\s*(\d+(?:\.\d+)?)\s*s(?:ecs?)?)?/,
        example             : [ "Rest time: 3 mins 14sec", "Burpees: 2m15.2s" ].map( s=>`${TAG_PREFIX} ${s}` ).join("\n") ,
        editor2value        : m=>TYPES.TAG_TIME_hm.editor2value([null,"0", m[1], m[2]]),
        value2number        : val=>TYPES.TAG_TIME_hms.value2number(val), 
        components2value    : c=>TYPES.TAG_TIME_hms.components2value(c), 
        value2editor        : val=>{
            const [ _, M, S, MS ] = val.split("|").map(v=>parseInt(v));
            const sec = S+( MS /1000);
            return M+"min"+(sec>0? " "+sec+"sec" : "");
        },
    },

    "TAG_TIME_sec": {
        kindOf              : "TAG_TIME_h",
        reg                 : /^\s*(\d+(?:\.\d+)?)\s*s(?:ecs?)?/i,
        example             : ["3 sec", "5secs", "2.5s"].map( s=>`${TAG_PREFIX} Rest per set (in seconds): ${s}` ).join("\n") ,
        editor2value        : m=>m[1],
        value2number        : val=>parseFloat(val) * 1000,
        components2value    : c => {
            const sec = c / 1000;
            return (sec%1? sec.toFixed(1) : sec) + "s"; 
        }, 
        value2editor        : v=>`${v}`,
    },

    "TAG_TIME_hms": {
        kindOf              : "TAG_TIME_h",
        reg                 : /^\s*(?:(\d{1,3}):)?(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?/i,
        example             : ["Rest between sets (MMSS): 3:24","Workout duration (HHMMSS): 1:20:00"].map( s=>`${TAG_PREFIX} ${s}` ).join("\n") ,
        editor2value        : m=>[ m[1] ?? '0',m[2], m[3], m[4] ?? '0'] .join("|"),

        value2editor        : val=>{

            const [ HH, MM, SS, MS] = val.split("|");

            return `${ parseInt(HH)>0? HH.padStart(2, '0') + ":" : ""}${ MM.padStart(2, '0') }:${ SS.padStart(2, '0') }${MS?`.${MS}`:""}`;
        },
 
        value2number        : val=>{

            const [ HH, MM, SS, MS] = val.split("|").map(d=>parseInt(d));
            return HH*3600000 + MM*60000 + SS*1000 + (MS ?? 0);
        },

        components2value: milliseconds => {

            const seconds = Math.floor(milliseconds / 1000);
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            const _milliseconds = milliseconds % 1000;
          
            const padZero = (value) => (value < 10 ? `0${value}` : value);
            const formattedHours = padZero(hours);
            const formattedMinutes = padZero(minutes);
            const formattedSeconds = padZero(remainingSeconds);
          
            return `${formattedHours}|${formattedMinutes}|${formattedSeconds}|${_milliseconds}`;
        }
    },


    //MAP = (2/3) * diastolic pressure + (1/3) * systolic pressure
    "TAG_BLOOD": {
        reg          : /^\s*(\d+)\s*-\s*(\d+)/i,
        icon         : FavoriteRoundedIcon,
        dataTypeDesc : "Blood Pressure",
        description  : "Track blood pressure values (diastolic-systolic)",
        example      :  ["Blood Pressure: 120-80","Blood Pressure (short format): 12-8"].map( s=>`${TAG_PREFIX} ${s}` ).join("\n") , 

        editor2value : m=>{

            let [_, systolic, diastolic ] = m; 
 

            //
            // check normal(?) values
            //
            return [['systolic', parseInt(systolic), 200, 90],['diastolic',parseInt(diastolic), 120, 60]]
            
            .map( (limit, i, arr)=>{

                let v                   = limit[1];
                const usingShortVersion = arr[0][1]<20 || arr[1][1]<20;

                if( usingShortVersion )
                {
                    //
                    // it is used the short format
                    //
                    v *= 10; 
                }

                if( v<limit[3] || v>limit[2] )
                {
                    throw new Error(`Invalid ${limit[0]}, expected a value between ${limit[3]}mmHg and ${limit[2]} mmHg, got: ${v}mmHg`);
                }

                return v;

            })

            .join("-")
            
            ; 

        },

        /**
         * Calculates the mean arterial pressure (MAP)
         */
        value2number : val=>{

            const [systolic, diastolic] = val.split("-").map(v=>parseInt(v));

            const MAP = (2/3) * diastolic + (1/3) * systolic;

            return MAP*1000000 + diastolic*1000 + systolic;

        }, 

        value2components: val => {
            return val.split("-").map(v=>parseInt(v));
        },

        components2value: comp => `${comp[0]}-${comp[1]}`,

        addComponents       : (A,B)=>{
            if( isNaN(B) )
            {
                return [ A[0]+B[0], A[1]+B[1] ]
            }
            
            return [ A[0]+B, A[1]+B ]
        },

        subComponents       : (A,B)=>{
            if( isNaN(B) )
            {
                return [ A[0]-B[0], A[1]-B[1] ]
            }
            
            return [ A[0]-B, A[1]-B ]
        },

        divComponents       : (A,B)=>{
            if( isNaN(B) )
            {
                return [ A[0]/B[0], A[1]/B[1] ]
            }
            
            return [ A[0]/B, A[1]/B ]
        },
    },  

    
    "TAG_RANK": {
        reg          : /^\s*\d+(?:\.\d)?\/\s*\d+/,
        dataTypeDesc : "Rank",
        icon         : StarHalfRoundedIcon,
        description  : "Rank a particular aspect on an arbitraty scale",
        example      : ["Stress: 4.5/10","Pain: 5/10", "Will to live: 50/100"].map( s=>`${TAG_PREFIX} ${s}` ).join("\n"),
        editor2value : m=>m[0].replace(/\s/,""), 
        value2number : v => {
            const [ rank, outOf ] = v.split("/").map(l=>parseInt(l));
            return rank / outOf;
        },
        components2value: c => {
            let outOf = 10;
            return `${ (c*outOf).toFixed(1) }/${outOf}`;
        },
        value2view(v) { 
            return <TAG_RANK_toView value={ this.value2number(v) }/> 
        }
    }, 


    "TAG_INT": {
        reg          : /^\s*(\d+(?:\.\d+)?)/,
        dataTypeDesc : "Number",
        icon         : ShowChartRoundedIcon,
        description  : "Tag a numeric value",
        example      : ["Steps: 65","Liters of water: 3.2"].map( s=>`${TAG_PREFIX} ${s}` ).join("\n"),
        editor2value : m=>m[1], 
    },

    "TAG_STRING": {
        reg             : /^(.*)/i,
        example         : ["Feel like: shit","mood: grumpy"].map( s=>`${TAG_PREFIX} ${s}` ).join("\n"), 
        dataTypeDesc    : "Short Text",
        icon            : ChatBubbleIcon,
        isJustText      : true, //flag to know if this tag represents arbitrary text.
        canBeCharted    : false,
        description     : "Tag a an arbitrary aspect. 12 Characters max. The graph will be flat and will only serve to show the value.",
        editor2value    : m=>{

            const v = m[1].trim();
            if( v.length>12 )
            {
                throw new Error("Max length of a tag value is 12 characters. You typed: "+v.length);
            }
            return v;

        },
        value2editor    : v=>v,
        value2view      : v=><UserTypedText text={v} noWrap/>
    },


}




export const getUserAvailableTagTypes = ()=>Object.keys(TYPES).filter( key=>!!TYPES[key].reg);
export const getUserAvailableTypes = ()=>getUserAvailableTagTypes().map(key=>TYPES[key]);

//
// default behaviour if the value is a number and it can be used for sorting and such...
// if "editor2value" returns a number, then all these default work fine.
//
const TYPE_DEFAULTS = {
    canBeCharted        : true,
    value2number        : v=>Number(v),         // a number that can be plotted on a line graph
    //value2components    : v=>Number(v),       // only define this is "value2number" would not be a valid component.
    value2view          : v=><span>{v}</span>,  // returns the visual represenation of the value so the user van view it on screen
    value2editor        : v=>`${v}`,            // converts the values back into the format that the user types on the journal editor.

    
    addComponents       : (A,B)=>A+B,
    subComponents       : (A,B)=>A-B,
    divComponents       : (A,B)=>A/B,
    components2value    : C=>String(C),         // based on the components that this type creates per value, return the value that represents this component/s
}


//
// to feed tooltips
//
const typedesc2description = new Map();


//
// copy all props of "kingOf"
//
Object.keys(TYPES).forEach(key=>{

    if( key.length>12 ) {
        throw new Error("Hey! Key ["+key+"] must be 12 characters or less!! this is because the DB stores this in a VARCHAR(12)")
    }

    TYPES[key].key = key;

    if( TYPES[key].kindOf )
    {
        TYPES[key] = {
            ...TYPES[TYPES[key].kindOf],
            ...TYPES[key], 
        }
    }
    else 
    {
        TYPES[key] = {
            ...TYPE_DEFAULTS,
            ...TYPES[key], 
        }
    }

    typedesc2description.set( TYPES[key].dataTypeDesc, TYPES[key].description );
})


/**
 * returns the description of the TYPE with this type as "dataTypeDesc"
 */
export const tagTypeDesc2Description = type => {
    return typedesc2description.get( type );
}