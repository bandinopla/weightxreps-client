import { Box, Button, Divider, Paper, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import Alert from '@material-ui/lab/Alert';
import { useTheme } from '@material-ui/styles';
import React, { useContext, useRef } from 'react';
import { ifDark } from '../../MainTheme';
import { JOwnerContext } from '../../pages/journal-context';
import Barra from '../barras';
import { OpenConfirmModal } from '../Dialog';
import Ename from '../ename';
import { RPEChip } from '../RPE-Chip';
import { parsedTags2render } from '../user-text-to-parsed-tags';
import WeightValue from '../weight-value';
import celebrateGIF from "./celebrate.gif";
import "./erow-render.css";
import { JDayContext } from './jday-context';
import { useHistory } from "react-router-dom";

const effintLink = {
    textDecoration:"underline",
    fontWeight:"bold",
    cursor:"pointer",
    "&:hover": { background:"yellow"}
};

const useStyles = makeStyles((theme) => ({
     //
     root: {
          
          margin:"15px 0"
          , marginBottom: theme.spacing(3)
          , backgroundColor: theme.erow.bgColor
          
           
          ,"& .wxr": {
              textAlign:"right"
              , paddingRight:10
              , width:300
              , maxWidth: "100%"
              , flexGrow:0
              , fontSize:"1.2em"
              , "& b":{ color: theme.erow.RepSetColor }
              , "& .w": {
                  color: theme.erow.weightColor
              }
          }

          , "& .effint": {
            [theme.breakpoints.only('xs')]: {
                display:"none"
             },
          },

          "& .Eff-bar": { backgroundColor: theme.eff_color },
          "& .Int-bar": { backgroundColor: theme.int_color },
          "& .PR-bar": { backgroundColor: theme.PR_Bar_color }
 
     },

     bestINT: { 
         "& *":{ color: theme.int_color +" !important", ...effintLink } 
     },

     bestEFF: { 
        "& *":{ color: theme.eff_color +" !important", ...effintLink} 
     },

     erow: {
         display:"flex",
         flexDirection:"row",
         flexWrap:"nowrap",
         justifyContent:"flex-start",
         lineHeight:"25px",

         "& .est": {
            color:"#91a90d",
            fontSize:"0.7em",
            lineHeight:"1em",
            paddingRight:15,
            display:"inline-block"
         },

         "& > div": {
             //flexGrow:1
         },

         "& > .bar": {
             width:140
         },

         "&.PR-Int .w": { 
             ...theme.erowPR  
            ,"& *": {...theme.erowPR }
         },

         "&.PR-Eff .w": { 
            ...theme.erowPR  
           ,"& *": {...theme.erowPR }
         },

         "&.PR-Eff .r": { 
            ...theme.erowPR  
           ,"& *": {...theme.erowPR }
         },

         "&.RMPR .w": {
            ...theme.erowPR,
            "& *": {...theme.erowPR }
         },
         "&.RMPR .r": {
            ...theme.erowPR,
            "& *": {...theme.erowPR }
         }
         , "&.FAILED-ATTEMPT .wxr ": { 
             textDecoration:"red line-through",
             "& *": {
                color:"red !important",
             }
         }
     },

     ecom: {
         backgroundColor: ifDark(theme,"#000","#Fff") 
         , padding:"5px 10px"
         , color:ifDark(theme,"#ccc","#666") 
     },

     stat: {
         overflow:"hidden",
         marginBottom:theme.spacing(1),
         marginTop: -theme.spacing(1),



         "& > div": {
             float:"left",
             paddingRight:10
         },
         "& b": {color:"#fe6600"}
     },

     missing: {

     }
}));
 

export default function Eblock({ data }){

    const classes = useStyles();  
    const history = useHistory();
    const jowner = useContext(JOwnerContext);

    if( data.missing )
    {
        const title = "Empty or Missing exercise reference";
        return <Box padding={2} style={{cursor:"pointer"}}><Alert severity="warning" onClick={()=>OpenConfirmModal({ title, 
                                                                        info:"This can happen if the exercise was either deleted or saved without any reps/sets data (just the name of the exercise was saved)"
                                                                        , open:true 
                                                                        , onConfirm:()=>{}
                                                                    })}>-- {title} --</Alert></Box>;
    }
        

    return <Paper className={classes.root}> 
         
                <Box padding={1} paddingLeft={2}>
                    {/*<Typography variant="h6" gutterBottom>#<b>{ data.exerciseRef.exercise.name }</b></Typography> */}

                    <Button style={{float:"right"}} variant="outlined" onClick={()=>history.push(`/journal/${jowner.uname}/personal-records--${data.exerciseRef.exercise.id}`)}>Personal Records</Button>
                    <Ename gutter {...data.exerciseRef.exercise} variant="h6"/>

                    <div className={classes.stat}> 

                        <Stat label="VOL" value={<WeightValue value={data.stats.vol} inkg={ !data.sets[0].lb }/>}/>
                        <Stat label="REPS" value={data.stats.reps}/>
                        <Stat label="SETS" value={data.stats.sets}/>
                        <BestEffOrInt className={classes.bestEFF}  label="B.Eff." data={ data.exerciseRef.best?.eff } /> 
                        <BestEffOrInt className={classes.bestINT}  label="B.Int." data={ data.exerciseRef.best?.int } /> 
                    </div>
                </Box>
                <Divider variant="middle" style={{marginBottom:10, marginTop:-5}}/>
                
                <Box paddingBottom={1}>
                { data.sets.map( (set,i)=>(<div key={i}>
                
                    <div className={classes.erow+" erow"+(set.pr>0?" RMPR":"")+(set.r==0?" FAILED-ATTEMPT":"") }>
                        <div className="wxr">

                            <EstimatedRM set={set} best={data.exerciseRef.best}/> 

                            { set.pr>0 && <img src={celebrateGIF} />}

                                <strong className="w">
                                    {set.ubw?"BW"+(set.w>0?"+":""):""}
                                    { set.w!=0 && <WeightValue value={set.w} inkg={ !set.lb }/> }
                                </strong> 

                                { set.rpe>0 && <RPEChip value={set.rpe}/>}
                                
                                &nbsp;x <b className="r">{ set.r }</b> x <b>{ set.s }</b></div> 

                        <div className="bar">
                            <Barra weight={set.weight}/> 
                        </div> 

                        <div style={{flexGrow:1, overflow:"hidden"}} className="effint">


                            { 
                            //w={set.weight} r={set.r} best={data.exerciseRef.best}
                            data.exerciseRef.best && <EffIntBars eff={set.eff} int={set.int}/> }

                        </div> 
                    </div>

                { set.c && <div className={classes.ecom}><SubdirectoryArrowRightIcon fontSize="small"/>{ parsedTags2render(set.c.trim()) }</div> }
                </div>
                
                )) }
                </Box>
            </Paper>
}

// const RPE = ({value})=>{
//     const colors = {
//         6:"#219EBC",
//         6.5: "#2A9D8F",
//         7:"#52B788",
//         7.5:"#E9C46A",
//         8:"#F4A261",
//         8.5:"#FF9100",
//         9:"#E76F51",
//         9.5:"#F94144",
//         10:"#E63946"
//     }
//     return <Chip size="small" label={ value+ " RPE"} style={{backgroundColor:colors[value], color:"white", marginLeft:3}}/>;
// }

const BestEffOrInt = ({ data, label, ...rest }) => {

    const jowner = useContext(JOwnerContext);
    const jday   = useContext(JDayContext);

    //
    // en el caso del primer log, se va a calcular el mejor eff e int con la info del día.
    //
    const wasDoneToday = data && data.when==jday.ymd;

    const open = ()=>{
        data && jowner.gotoYMD( data.when );
    }

    if(!data) rest = {};

    if( wasDoneToday )
    {
        return <Stat label={label} value={ <WeightValue value={data.est1rm || data.w} inkg={ !data.lb }/> }/>
    }
 
    return <Stat onClick={open} {...rest} label={label} value={ data? <WeightValue value={data.est1rm || data.w} inkg={ !data.lb }/> : "---"}/> ;
}


const Stat = ({ label, value, ...rest })=> (<div>
        <Typography variant="caption" {...rest}>{label} <b>{value}</b></Typography>
    </div>);
 ;

const EstimatedRM = ({ set }) => { 

    const jowner    = useContext(JOwnerContext);
    const jday      = useContext(JDayContext);

    const w         = set.weight; 
    var estimated   = set.est1rm; //jowner.estimate1RM(w,set.r); 
    var prefix      = "";

    if( estimated<=0 ) return "";

    if( set.added2BW )
    {
        var diff = estimated - jday.bw;
        prefix = "BW"+( diff>0?"+": diff<0? "-" : "" );
        estimated = diff;
    }

 
    return estimated>0? <Tooltip title="Estimated ~1RM"><div className="est">~{prefix}{estimated && <WeightValue nounit value={ estimated } inkg={ !set.lb }/>}</div></Tooltip> : ""; 
};

const EffIntBars = ({ eff, int }) => { 

    const jowner   = useContext(JOwnerContext);  

    let effPercent = eff * 100; //best.eff && ( jowner.estimate1RM(w,r) / best.eff.est1rm)*100;
    let intPercent = int * 100; //(w / best.int.w)*100; 

    if( effPercent+intPercent == 0 ) 
    return "";

    return <div style={{ display:"flex", flexDirection:"column", height:25, margin:3}}> 
                { effPercent>0 && <EffIntBar percent={effPercent} label="Eff" color="red"/> }
                <EffIntBar percent={intPercent} label="Int" color="blue"/> 
            </div>;
}

const EffIntBar = ({ percent, color, label })=>{

    const ref           = useRef();
    const theme         = useTheme();

    let beyond100       = false;
    let originalPercent = Math.round(percent);
    var extra = 0;

    if( percent > 100 )
    {
        extra = Math.min( percent - 100, 100 ); // no mas de 100
        percent = 100 ;
        beyond100 = true;
    }

    // useEffect(()=>{
    //     if( beyond100 )
    //     {
    //         let parent = ref.current.parentNode;
    //         let class2add = "PR-"+label;

    //         while( parent.parentNode )
    //         {
    //             if( parent.className.indexOf(" erow")>0 &&  parent.className.indexOf(class2add)<0 )
    //             {
    //                 parent.className += " "+class2add;
    //                 break;
    //             }
    //             parent = parent.parentNode;
    //         }
    //     }
    // },[]);
    // (beyond100?"PR":"")+" "+

    return <div ref={ref} style={{flexGrow:1, maxHeight:14, position:"relative", borderRadius:50, borderBottom:"1px solid "+theme.effIntBars.borderColor, backgroundColor:beyond100? "#CFCF11" : theme.effIntBars.bg}}>

                <div className={"PR-bar PR" } style={{ position:"absolute", maxWidth:"100%",zIndex:2,borderRadius:50, width: extra+"%", height:"100%", right:0, top:0 }}></div>

                <div style={{position:"absolute",zIndex:1, borderRadius:50, paddingLeft:3,paddingRight:3, background:"#111", opacity:0.9, color:"white", top:0, left:0, lineHeight:"12px", height:12, fontSize:"10px"}}>
                    {label} <b>{originalPercent}</b>
                    </div>
                <div className={label+"-bar" } style={{ maxWidth:"100%",borderRadius:50, width:percent+"%", height:"100%" }}></div> 
                
            </div>
};