import React, { useRef } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles'; 
import LinearProgress from '@material-ui/core/LinearProgress';
import { Box, IconButton, Typography, useMediaQuery } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { OpenConfirmModal } from './Dialog';
import { Alert } from '@material-ui/lab';
import BarChartIcon from '@material-ui/icons/BarChart';


const useStyles = makeStyles(theme=>({
    root: {
        display:"flex",
        flexDirection:"column",  
        paddingLeft:10,
        paddingRight:10,
        height:"100%",
        justifyContent:"center",
    },
    bar: {
        display:"flex", 
        flexDirection:"row",  
        overflow:"hidden", 
        marginBottom:1,
        lineHeight:"10px",
        alignItems:"center"
    },
    bars: {
        display:"flex", 
        flexDirection:"column",
        flexGrow:1
    },
    label: {
        width:80,
        textAlign:"right",
        paddingRight:10,
        fontFamily:"monospace",  
        fontSize:"11px"
    },
    fill: props=>({
        backgroundColor:props.fillColor,
        flexGrow:1,
        display:"flex",
        flexDirection:"row",
        alignItems:"stretch",
        minHeight:5
    }), 
    barLabel: {
        background:"rgba(0,0,0,0.5)",
        color:"white",
        fontSize:"11px",
        padding:"1px 3px"
    }
})) ; 


/**
 * Progress bar, allows value to be an array with [min, max] values to show 2 bars. One for each aspect.
 * If it recieves an array, it will crease one bar (the main one) comparing value against the MAX value, and a tiny bar comparing against the min value.
 * @param {*} param0 
 * @returns 
 */
export const ProgressBar = ({ label, desc, value, color, noHelp }) => {
 
    const fillColor = "#ccc";
    const classes = useStyles({ color, fillColor });

    let valIsArray = Array.isArray(value);

    let percent2 = valIsArray? value[0] : 0;
    let percent = valIsArray? value[1] : value; 

    if( percent==0 && percent2!=0 )
    {
        percent = percent2;
        percent2 = 0;
        valIsArray = false;
    }

    percent = percent.toFixed(1);
    percent2 = percent2.toFixed(1);

    const explain = ev=>{
        ev.preventDefault();

        OpenConfirmModal({ open:true
            , title:`${label} Bar`
            , info: <div>
                        {desc && <Box marginBottom={5}><Alert severity='info'>{desc}</Alert></Box>}
                        {!valIsArray && <Typography>This aspect is at <strong>{percent}%</strong> of the maximum value ever logged here.</Typography>}
                        {valIsArray && <div>
                            <Typography variant='h4'>Max</Typography> if the goal is to reach a maximal value (greatest), the current value is at <strong>{percent}%</strong> of the maximum value ever logged here. 
                            <br/>
                            <Typography variant='h4'>Min</Typography> if the goal is to reach a minimal value (smallest), the current value is at <strong>{percent2}%</strong> of the minimum value ever logged here.
                            </div>}
                    </div>
            , verb: "Ok, got it" 
            , canCancel: false
        });
    }



    const barLabel = false? "Not enough data yet..." :  valIsArray? `Max: ${percent}% / Min: ${percent2}%` : percent + "%"

    return <div className={classes.bar} style={{ opacity: percent==0? 0.3 : 1}}>
                <strong className={classes.label}>{label}</strong>
                <div className={classes.bars}>
                    <Bar percent={percent} color={color} useLabel={barLabel}/>
                    {percent2!=0 && <Bar percent={percent2} color={color} />}
                </div>
                {!noHelp && <div>
                    <a href="#" onClick={explain}>( ? )</a>
                </div>}
            </div>;
}
/*<div className={classes.fill} style={goesBeyond100? { backgroundColor: color}: goesUnder100? { backgroundColor:"yellow" } : null }>
                <div style={{ background: goesBeyond100? "yellow": goesUnder100? fillColor : color, width: (goesBeyond100? extra : goesUnder100? Math.min(100,100+percent) : percent) +"%"}}>
                    <span className={classes.barLabel}>{goesBeyond100? "PR | ":percent==100?"Tie PR | ":""}{percent.toFixed(1)+"%"}</span>
                </div>
            </div>*/

const Bar = ({ percent, color, useLabel })=>{
    const fillColor = "#ccc";
    const classes = useStyles({ color, fillColor });

    const val = parseFloat(percent);
    const extra = val-100;
    const goesBeyond100 = extra>0; 
    const goesUnder100 = val<0;

    const label = typeof useLabel=='string'? useLabel : (goesBeyond100? "PR | ":val==100?"Tie PR | ":"")+val+"%";

    // return <div className={classes.fill } style={goesBeyond100? { backgroundColor: color}: goesUnder100? { backgroundColor:"red" } : null }>

    //             <div style={{ background: goesBeyond100? "yellow": goesUnder100? fillColor : color, width: (goesBeyond100? extra : goesUnder100? Math.max(0,100+percent) : percent) +"%"}}>
    //                 {useLabel && <span className={classes.barLabel+" oneline"}>{label}</span>}
    //             </div>
    //         </div> ;
    return <div className={classes.fill+(goesBeyond100?" PR" :"")} style={goesBeyond100? { backgroundColor: "yellow"}: goesUnder100? { backgroundColor:"red" } : null }>

                <div style={{ background: goesBeyond100? color: goesUnder100? fillColor : color, width: (goesBeyond100? 100-extra : goesUnder100? Math.max(0,100+val) : val) +"%"}}>
                    {useLabel && <span className={classes.barLabel+" oneline"}>{label}</span>}
                </div>
            </div> ;
}


const set2ref = new Map();
let x = 0;

export const ProgressBarsContainer = ({ children })=>{
    const classes       = useStyles(); 

    return <div className={classes.root} >{children}</div>;
}