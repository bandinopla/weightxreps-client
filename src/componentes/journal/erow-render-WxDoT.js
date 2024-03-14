/**
 * Everything related to weight x distance or time.
 */

import { Box, Divider, useMediaQuery, useTheme } from "@material-ui/core";
import Barra from "../barras";
import { DistanceValue, SpeedValue } from "../distance-value";
import { ProgressBar, ProgressBarsContainer } from "../progress-bar";
import { TimeValue } from "../time-value";
import { parsedTags2render } from "../user-text-to-parsed-tags";
import { SetWeight } from "./erow-render";
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import { cmToOriginalUnit, toCentimeters } from "../../utils/normalize-distance";
import { TYPES } from "../../user-tags/data-types";


/**
 * Weight x Distance (over time optionally)
 */
export const renderWxD_Erows = (eref, sets, classes, theme) => {
 
    const progressPercent = ( v, min, max, splitPercents ) => { 

        if( v==0 ) return 0;

        if( splitPercents && max )
        {
            const minPercent = min? ((v - min) / min) : 0;
            const maxPercent = max? v/max : 0;
            return [ (-1-minPercent) * 100, maxPercent * 100];
        }


        if( min && !max )
        { 
            return v/min * 100;
        }

        return v/max * 100;
    }

    return sets.map( (set,i)=>(<div key={[eref.exercise.id,i,set.w,set.r,set.s].toString()}>

                                    <ErowWxDoT  speed={set.speed} 
                                                force={set.force}
                                                time={set.t} 
                                                distance={set.d} 
                                                distanceUnit={set.dunit}
                                                weight={set}  
                                                speedBar={(set.speed/eref.best?.prsWxDorT?.topSpeed?.val) *100} 
                                                distanceBar={progressPercent(set.d, eref.best?.prsWxDorT?.minDistance?.val, eref.best?.prsWxDorT?.maxDistance?.val )} 
                                                timeBar={progressPercent(set.t, eref.best?.prsWxDorT?.minTime?.val, eref.best?.prsWxDorT?.maxTime?.val, true )}
                                                forceBar={(set.force/eref.best?.prsWxDorT?.maxForce?.val) *100}
                                                comment={set.c} 
                                                classes={classes} /> 
        
                               </div>));
}

export const ErowWxDoT = ({ weight, time, distance, distanceUnit, speed, force, speedBar, distanceBar,timeBar,forceBar, comment, classes }) => {
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return <>
            <div className={classes?.erow+" erow"}>

                <div className="wxr">

                    <div className="est">
                        { speed>0 && <SpeedValue value={speed} displayUnit={distanceUnit}/> }
                        { force>0 && <span style={{paddingLeft:10, paddingRight:2}}>~{force.toFixed(1)}N</span>}
                    </div>

                    { weight?.w>0 && <>{ SetWeight(weight)} x </> }  

                    
                    
                    { distance>0 && <b className="r"> <DistanceValue value={distance} unit={distanceUnit}/> </b> }
                    
                    { time>0 && <>
                                    { distance? " in ": "" }
                                    <TimeValue milliseconds={time}/></> }

                    { weight?.s>1 && <>&nbsp;x <b className="s">{ weight.s }</b></> }
                    
                </div>

                {!smallScreen && <> 
                                    <div className="bar"><Barra weight={weight?.w} /></div>
                                    
                                    <div style={{flexGrow:1, overflow:"hidden"}} className="effint">
                                        <Bars speedBar={speedBar} distanceBar={distanceBar} timeBar={timeBar} forceBar={forceBar} theme={theme} />
                                    </div>
                                    </>}

            </div>

            {   // for small screens, make the bars take an entire row.
                smallScreen && <><Box marginBottom={3}>
                                <Bars speedBar={speedBar} distanceBar={distanceBar} timeBar={timeBar} forceBar={forceBar} theme={theme} />
                                </Box>
                                <Divider/>
                                <br/>
                                </>}

            { !!comment && <div className={classes?.ecom}><SubdirectoryArrowRightIcon fontSize="small"/>{ parsedTags2render(comment, true) }</div> }
            </>

}

const Bars = ({ speedBar, distanceBar, timeBar, forceBar, theme })=>{
    return <ProgressBarsContainer>

                { !!speedBar && <ProgressBar label="Speed" value={ speedBar } color={theme.eff_color}/>   }

                { !!distanceBar && <ProgressBar label="Distance" value={ distanceBar } color={theme.int_color}/> } 

                { !!timeBar && <ProgressBar label="Time" value={ timeBar } color={theme.palette.primary.main}/> }

                { !!forceBar && <ProgressBar label="Force" value={ forceBar } color={theme.palette.secondary.main}/> }

            </ProgressBarsContainer>
}


export const WxDoT_encodeDistance = ( num, unit ) => {
    const cm = Math.floor(toCentimeters( num, unit ) * 100);

    if( cm>4294967295 )
    {
        throw new RangeError("Value too big!");
    }

    return { val: cm, unit };
} 

/**
 * Distance is stored in the db as centimeters*100
 */
export const WxDoT_decodeDistance = val => val/100;

/**
 * Turns an erow returned by jeditor into text for the editor.
 * But doesnt render the weight, only the rest.
 */
export const WxDoT_JeditorErow2Text = ( jerow ) => {

    let out = "";

    if( jerow.d ) //distance
    {
        const cm    = WxDoT_decodeDistance(jerow.d);
        const d     = cmToOriginalUnit(cm, jerow.dunit);

        out = `${d}${jerow.dunit}`;
    }

    if( jerow.t ) //time
    {
        if( jerow.d ) {
            out += " in ";
        }

        const ms = jerow.t; 
        const seconds = Math.floor(ms / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        let token ;
        
        if( hours>0 )
        {
            token = TYPES.TAG_TIME_hm; 
        }
        else if( minutes>0 )
        {
            token = TYPES.TAG_TIME_ms; 
        }
        else {
            token = TYPES.TAG_TIME_sec; 
        }

        const val = token.components2value( ms );
        out += token.value2editor( val );
    }

    if( jerow.s > 1 ) out += " x "+jerow.s;

    if( jerow.c ) out += " "+jerow.c.trim();

    return out;
} 