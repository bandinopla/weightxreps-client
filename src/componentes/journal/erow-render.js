import { Box, Divider, Grid, Hidden, IconButton, Paper, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import Alert from '@material-ui/lab/Alert';
import { useTheme } from '@material-ui/styles';
import { useContext, useRef } from 'react';
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
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { SBDRankLeyend, SetSBDRank } from './erow-sbdrank';
import { renderWxD_Erows } from './erow-render-WxDoT';
import { ProgressBar, ProgressBarsContainer } from '../progress-bar';
import { statsOfWxDoT } from './erow-stats-WxDoT';
import { BrowserView } from 'react-device-detect';

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
          , backgroundColor: theme.ucardBgColor 
          
           
          ,"& .wxr": {
              textAlign:"right"
              , paddingRight:10
              , width:350
              , maxWidth: "100%"
              , flexGrow:0
              , fontSize:"1.2em"
              , whiteSpace:"nowrap"
              , "& b":{ color: theme.palette.primary.main }
              , "& .w": {
                  color: theme.palette.primary.main
              },
              [theme.breakpoints.up('md')]: {
                width:"33%"
              }
          }

          , "& .effint": {
            [theme.breakpoints.only('xs')]: {
                //display:"none"
             },
          },

          "& .PR-bar": { backgroundColor: theme.PR_Bar_color }
 
     },
 

     effIntLink: {
        
        fontWeight:"bold",
        cursor:"pointer",
        
        

        "& *":{
            color: theme.palette.primary.contrastText +" !important",
            backgroundColor: theme.palette.primary.main+" !important",
            padding: "0 2px",
            textDecoration:"underline",
            borderRadius: 5,
    
            "&:hover": { background:"yellow"}
        }
        
     },

     erow: {
         display:"flex",
         flexDirection:"row",
         flexWrap:"nowrap",
         justifyContent:"flex-start",
         lineHeight:"25px", 
         marginBottom:"10px",

         "& .est": {
            color:"#91a90d", 
            lineHeight:"1em",
            paddingRight:15,
            display:"inline-block",
            fontSize:"0.85em"
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
         }, 
     },

     ecom: { 
        ...theme.dataCell
         , padding:"5px 10px" 
         , margin:"8px 10px"
         , borderRadius: 3
         , boxShadow:"2px 1px 5px rgba(0,0,0,0.5)"
         , "& svg": {
            color: theme.dataCell.color
         }
     },

     stat: {
         overflow:"hidden",
         marginBottom:theme.spacing(1),
         marginTop: -theme.spacing(1), 

         "& > div": {
             float:"left",
             paddingRight:10
         },
         "& b": { 
            color: theme.palette.secondary.main
         },
         [theme.breakpoints.down('sm')]: {
            display:"flex",
            "& > div": {
                //float:"none",  
            },
         }
     },

     missing: {

     }
}));
 
const separateEblocksByType = eblock=>{

    const groups = [];
    
    if(eblock.missing) return [eblock];

    for( let set of eblock.sets ) 
    {
        const isWxR = Number(set.type==0);

        if( !groups[isWxR] ) groups[isWxR] = [];
        groups[isWxR].push( set );
    }  

    return groups.map( sets=>({ ...eblock, sets }) );

} ;

export default function Eblock({ data:eblock }){
    return separateEblocksByType(eblock).map( (data,i)=> <EblockUI key={data.eid+"/"+i} data={data} /> );
}

function EblockUI({ data }){

    const classes = useStyles();  
    const history = useHistory();
    const jowner = useContext(JOwnerContext);
    const theme = useTheme();

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
         
                <Box padding={1} paddingLeft={2} position={"relative"}>
                    {/*<Typography variant="h6" gutterBottom>#<b>{ data.exerciseRef.exercise.name }</b></Typography> */}

                    <IconButton style={{ position:"absolute", top:0, right:0 }} variant="outlined" title='Personal Records' onClick={()=>history.push(`/journal/${jowner.uname}/personal-records--${data.exerciseRef.exercise.id}`)}><MenuBookIcon/></IconButton>
                    <Ename gutter {...data.exerciseRef.exercise} variant="h6"/>

                    <div className={classes.stat}> 

                        { // Weight x reps
                            data.sets[0].type==0 && <>
                                <Stat label="VOL" value={<WeightValue value={data.stats.vol} inkg={ !data.sets[0].lb }/>}/>
                                <Stat label="REPS" value={data.stats.reps}/>
                                <Stat label="SETS" value={data.stats.sets}/>
                                <BestEffOrInt className={classes.effIntLink}  label="B.Eff." data={ data.exerciseRef.best?.eff } /> 
                                <BestEffOrInt className={classes.effIntLink}  label="B.Int." data={ data.exerciseRef.best?.int } />
                            </>
                        }

                        { // Weight x Time or Distance
                            data.exerciseRef.best?.prsWxDorT && statsOfWxDoT( data.exerciseRef.best?.prsWxDorT, jowner, data.sets ).map( stat=><Stat label={stat.label.toUpperCase()} value={stat.value}/>)
                        }
                         
                    </div>
                </Box>
                <Divider variant="middle" style={{marginBottom:10, marginTop:-5}}/>
                
                <SBDRankLeyend>
                <Box paddingBottom={2}>

                { data.sets[0].type>0 && renderWxD_Erows(data.exerciseRef, data.sets, classes, theme) }

                { data.sets[0].type==0 && data.sets.map( (set,i)=>(<div key={[data.eid,i,set.w,set.r,set.s].toString()}>
                
                    <div className={classes.erow+" erow"+(set.pr>0?" RMPR":"")+(set.r==0?" FAILED-ATTEMPT":"") }>
                        <div className="wxr">

                            { set.r>0 && <div style={{ float:"left", marginLeft:8, marginTop:3}}>
                                <SetSBDRank weight={ set.r>1? set.est1rm : set.w } type={data.exerciseRef.exercise.type} isf={jowner.isf}/>
                            </div> }

                            <EstimatedRM set={set} best={data.exerciseRef.best}/> 

                            { set.pr>0 && <img src={celebrateGIF} />}

                                { SetWeight(set) }

                                { set.rpe>0 && <RPEChip value={set.rpe}/>}
                                
                                &nbsp;x <b className="r">{ set.r }</b> x <b>{ set.s }</b>
                        </div> 

                        <Hidden smDown>
                            <div className="bar">
                                <Barra weight={set.weight} reps={set.r===0? 0 : null}/> 
                            </div> 
                        </Hidden>

                        <div style={{flexGrow:1, overflow:"hidden"}} className="effint" smDown>
                            <Hidden smDown>
                                <EffIntBars data={data} set={set} theme={theme}/>          
                            </Hidden>
                        </div> 
                    </div>

                    {/*
                    // for small screens, make the bars take an entire row.
                    */}
                    <Hidden smUp>
                        <Grid container>
                            <Grid xs={4} style={{ display:"flex", justifyContent:"center"}}>
                                <Box padding={"0 10px"}>
                                <Barra weight={set.weight} reps={set.r===0? 0 : null} /> 
                                </Box>
                            </Grid>
                            <Grid xs={8}>
                                <EffIntBars data={data} set={set} theme={theme}/>
                            </Grid>
                        </Grid> 
                        <Divider/>
                        <br/>
                    </Hidden>

                { set.c && <div className={classes.ecom}><SubdirectoryArrowRightIcon fontSize="small"/>{ parsedTags2render(set.c, true) }</div> }
                </div>
                
                )) }
                </Box>
                </SBDRankLeyend>

            </Paper>
}

export const SetWeight = set=>(<strong className="w">
                                { set.ubw?"BW"+(set.w>0?"+":""):"" }
                                { set.w!=0 && <WeightValue value={set.w} inkg={ !set.lb }/> }
                               </strong>);

const EffIntBars = ({ data, set, theme  })=>{
    return <>
    { data.exerciseRef.best && <ProgressBarsContainer ifMobileTeleport={set}>
                                    {set.r>0 && set.r<11 && <ProgressBar desc="Comparing the estimated 1RM from this set with your best ever estimated 1RM." label="Eff" value={set.eff *100} color={theme.eff_color}/>  }
                                    <ProgressBar desc="Comparing the weight used against the heavyest you ever logged for this exercise." label="Int" value={set.int *100} color={theme.int_color}/> 
                                </ProgressBarsContainer>
                                }</>
}

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

    let clickHandler = {};

    if( !wasDoneToday)
    {
        clickHandler = {onClick:open};
    }
    else 
    {
        rest = {};
    }
 
    return <Stat {...clickHandler} {...rest} label={label} value={ data? <WeightValue round={data.est1rm>0} prefix={data.est1rm?"~":""} value={data.est1rm || data.w} inkg={ !data.lb }/> : "---"}/> ;
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

 
    return estimated>0? <Tooltip title="Estimated ~1RM"><div className="est">~{prefix}{estimated && <WeightValue nounit round value={ estimated } inkg={ !set.lb }/>}</div></Tooltip> : ""; 
};