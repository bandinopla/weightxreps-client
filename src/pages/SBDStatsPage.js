import { Box, Button, ButtonGroup, Chip, Container, Divider, FormControl, FormHelperText, Grid, Input, InputBase, InputLabel, LinearProgress, makeStyles, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, ComposedChart, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { AsciiSpinner } from "../componentes/ascii-spinner";
import WeightValue from "../componentes/weight-value";
import { useGetSbdStatsQuery } from "../data/generated---db-types-and-hooks"
import ShareIcon from '@material-ui/icons/Share';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { OpenConfirmModal } from "../componentes/Dialog";

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import LanguageIcon from '@material-ui/icons/Language';
import { trackEvent } from "../componentes/google-tracker";
import { PageLoadIndicator } from "./page-loader-ui";
import { parseError } from "../data/db";

const LiftId2Name = ["SQUAT","BENCH","DEADLIFT"];
const LBS2KG                    = 0.4535924; 

const SBDStatsPage = ()=> {

    var location = window.location; 
 

    const loadState = ExtractSharedQuery( location.search );
    
    const { data, loading, error }  = useGetSbdStatsQuery();
 
    const male    = true; // null true o false(female)
    const bw      = 0;

    const [gender, setGender] = useState( loadState?.gender || 0 );
    const [useLbs, setUseLbs] = useState( loadState?.inlbs || 0 );

    // valor de los inputs...
    const [SBD, _setSBD] = useState([null,null,null]); 

    const setSBD = (lift, rawValue, useAsSBD) => {

        var m;

        var sbdCopy = [... ( useAsSBD || SBD ) ];
        const base  = {
            weight: null, 
            bw:0, 
            rawValue 
        }

        if( (m = rawValue.match(/^\s*(\d+(?:\.\d+)?)\s*(?:x\s*(\d+))?\s*(?:@\s*(\d+(?:\.\d+)?))?\s*$/)) )
        { 
            /*
            m[1] = el peso
            m[2] = las reps
            m[3] = el BW
            */
            let reps    = m[2]? parseFloat(m[2]) : 1;
            let weight  = parseFloat(m[1]);

            if( reps>12 )
            {
                sbdCopy[lift] = {
                    ...base ,
                    error   : "Only 12 reps or less..." 
                }
            }
            else 
            {
                //Brzycki: weight × (36 / (37 - reps)) (another way to write it)

                if( reps>1 )
                {
                    weight = Math.ceil( (weight * ( 36 / (37-reps) )) / 5 ) * 5;
                }

                sbdCopy[lift] = {  
                    ...base,
                    weight  , 
                    estimated   : reps>1,
                    bw          : m[3]? parseFloat(m[3]) : 0
                }; 
            } 
            
        }
        else if( rawValue.trim().length>0 ) // hay algo escrito... pero debe estar mal
        {
            sbdCopy[lift] = {
                ...base ,
                error   : "Invalid format" 
            }
        }
        else // empty field...
        {
            sbdCopy[lift] = base;
        }

        _setSBD( sbdCopy );
        return sbdCopy;
    }


    useEffect( ()=>{

        if( loadState?.detected && !SBD[0])
        {  
            setSBD(2, loadState.dl, setSBD(1, loadState.bp, setSBD(0, loadState.sq) ));
        }

    },[] );


    // const wclasses = useMemo( ()=>{

    //     if(!data) return;

    //     var classes = [ [],[] ];


    //     data.sbdStats.perclass.forEach( cat => {

    //         var i = cat.wclass.male? 0 : 1;

    //         classes[i].push({
    //             bw      : cat.wclass.max==500? Math.floor(cat.wclass.min)+1 : cat.wclass.max,
    //             plus    : cat.wclass.max==500,
    //             lb      : 0
    //         });

    //     } );

    //     return classes;


    // }, [data] );

    const graphData = useMemo( ()=>{

        if(!data) return;  
         

        const series = [];

        SBD.forEach( (sbd,i)=>{

            if( !sbd || sbd.weight==null || sbd.weight>0 )
            {
                series.push({
                    lift            : i,
                    data            : (new Array(500/5)).fill(0),
                    params          : sbd, //puede ser null
                    color           : ["#0081C8","#FCB131","#EE334E"][i],
                    //wclassName      : null, // null = all... 
                    wClasses        : [],
                    wClassNames     : [],

                    //el peso "referencia" sobre el cual calcular el puntaje... en KG
                    wRef            : sbd?.weight>0? useLbs? sbd.weight*LBS2KG : sbd.weight : 0, // tienen que ser menor a esto...
                    refIsBestThan   : 0 ,
                    totalLifts      : 0 , 
                    gender          // 0 all  1 male  2 female
                });
            }

        }); 


        series.length && data.sbdStats.perclass.forEach( ({ graph, wclass })=>{

            //
            // A) no hay genero definido
            // B) hay genero y somo ese genero.
            //
            if( !gender || ( (2-gender) == wclass.male ) ) // 1==true
            {

                // no tiene BW o esta en la categoria...
                series.forEach( serie=>{

                    let bw = serie.params?.bw || 0;

                    if( bw && useLbs )
                    {
                        bw *= LBS2KG; //esta escrito en LBs...
                    }

                    //
                    // A) !params = acepta todo
                    // B) hay params pero no se definio un BW, acepta cualquier BW.
                    // C) se definio un BW, ver si estamos en esta categoria...
                    //
                    if( !serie.params || bw==0 || ( bw>=wclass.min && bw<=wclass.max ) )
                    { 

                        //
                        // todavia no se definio el wClassName
                        //
                        if( bw>0 && serie.wClasses.indexOf(wclass)<0)
                        { 
                            let plus            = wclass.max>=500;
                            let classBW         = plus? Math.floor( wclass.min ) : wclass.max;  

                            serie.wClasses.push( wclass );
                            serie.wClassNames.push( (wclass.male?"Male ":"Female ") + (plus?"+":"") + classBW + " Kg "+ (useLbs? " | "+(plus?"+":"") + Math.round(classBW/LBS2KG) + " Lbs" : "" ) ); 
                        }

                        graph.forEach( (vals, col)=>{

                            let w = col*5;
                            let segmentLifts = vals[ serie.lift ];
                            serie.data[col] += segmentLifts;

                            //
                            if( serie.wRef )
                            {
                                serie.refIsBestThan += (serie.wRef>w? segmentLifts : 0);
                                serie.totalLifts    += segmentLifts;
                            } 

                        });
                    }

                });
 
            } 

        });

        return series;


    }, [data, gender, useLbs, SBD] );

     
    /**
     * W Class:
     *      ANY
     *      Male - ANY
     *      Female - ANY
     *      female - X
     *      male - X
     */

    //
    //if( true ) return <Container><AsciiSpinner label={"Loading data..."}/></Container>;
    if( loading || error ){
        return <PageLoadIndicator isLoading={loading} error={ error? parseError(error) : null }  />;
    }


    return <Container >

            <Paper variant="outlined" square style={{padding:20}}>


                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h3"><strong><LanguageIcon fontSize="large"/> SBD World Rank</strong></Typography>
                        
                        <Typography variant="h6">Compare your best lifts against <strong style={{color:"#EE334E"}}>{data.sbdStats.total.toLocaleString() || "world class"}</strong> competition RAW lifts done arround the world!</Typography>
                        
                        <Typography variant="subtitle2" gutterBottom>RAW = No knee wraps or suit on the squat, no straps or suit on the deadlift and no bench shirt on the bench press and pausing 1 second on the chest (no touch and go).</Typography>
 

                        <Typography variant="caption">
                        This page <a href="https://openpowerlifting.gitlab.io/opl-csv/" target="_blank">uses data</a> from the <a href="https://www.openpowerlifting.org" target="_blank">OpenPowerlifting project</a>. Data download date: { new Date(data.sbdStats.date).toLocaleString() }  
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <iframe style={{maxWidth:"100%"}} width="560" height="215" src="https://www.youtube.com/embed/Q7XUBA6VtZw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </Grid>

                </Grid>
                
                <Divider style={{margin:"20px 0"}}/>


                <form  noValidate autoComplete="off">

                    <FormControl style={{marginRight:15}}>
                        <InputLabel id="sex">GENDER</InputLabel>
                        <Select value={gender} onChange={ e=>setGender(e.target.value)} style={{width:200, textAlign:"center"}}>
                            <MenuItem value={0}>---- All ----</MenuItem>
                            <MenuItem value={1}>Males only</MenuItem>
                            <MenuItem value={2}>Females only</MenuItem>
                        </Select>
                    </FormControl>  


                    { LiftId2Name.map( (liftName,i)=><FormControl error={SBD[i]?.error}>
                        <InputLabel htmlFor={liftName}>{liftName}</InputLabel>
                        <Input value={SBD[i]?.rawValue} onChange={ e=>setSBD(i, e.target.value) } id={liftName}/>
                        <FormHelperText>{ SBD[i]?.error? SBD[i]?.error : SBD[i]?.weight? "1RM = "+ SBD[i].weight : "Type your best RAW " + liftName }</FormHelperText>
                    </FormControl> )}

                    
 

                    <FormControl style={{marginLeft:15}}>
                        <InputLabel id="sex">UNIT</InputLabel>
                        <Select value={useLbs}  onChange={ e=>setUseLbs(e.target.value)}> 
                            <MenuItem value={0}>Kilograms</MenuItem>
                            <MenuItem value={1}>Pounds</MenuItem>
                        </Select>
                    </FormControl> 
                    
 

                </form>
 
                <Instructions/>
 
                
                <Share gender={gender} inlbs={useLbs} sbd={SBD}/>

            </Paper>
            
            
            <CatChart series={graphData} inlbs={useLbs}/>
            {
                /* data.sbdStats.perclass.map( categoryData=>(<CatChart data={categoryData} />) )*/
            } 
 
 </Container >
}

export default SBDStatsPage;

 


const CatChart = ({ series, inlbs }) => {

    //const graphData = useMemo( ()=>data.graph.map( (values,i)=>({ weight:i*5, squats:values[0], benches:values[1], deadlifts:values[2] }) ), [data]);

    const getWeight = (data)=>inlbs? data.weight*2.204623 : data.weight;
     
    return <Paper style={{padding:10, margin:10 }}>
         

            <div>

            <Grid container spacing={2}>
                { series.map( serie=><Grid item xs={4}>
 

                    <LinearQualificationBar value={ serie.totalLifts? serie.refIsBestThan/serie.totalLifts : 0} color={serie.color}/> 

                    <Typography variant="h4">
 
                        {/* <LiftWeightValue data={serie.params} inlbs={inlbs}/> */}
                        
                        {LiftId2Name[serie.lift]} { serie.totalLifts>0 && <LiftScore value={serie.refIsBestThan/serie.totalLifts}/> }
                    </Typography>

                     <div style={{ fontSize:"1.3em"}}><Divider style={{margin:"10px 0", overflow:"hidden"}}/>

                                            { serie.params?.estimated? "~" : ""}
                                            { serie.params?.weight>0 && <strong><WeightValue inkg={inlbs?0:1} value={ serie.params.weight*(inlbs? LBS2KG : 1) }/></strong> }
                                            { serie.params?.bw>0 && <> @ <strong>{serie.params.bw}</strong></>}


                                            { !serie.params?.bw && <Chip size="small" label={ "Any "+ (serie.gender>0? serie.gender==1? "Male":"Female" : "") +" class" } variant="outlined" style={{ marginLeft:10}}/>  }
                                            { serie.wClassNames.map( name =><Chip size="small" label={  name + " class" } variant="outlined" style={{ marginLeft:10}}/> )}

                                            
                                            
                                        <Divider style={{margin:"10px 0"}}/></div>  

                    <div  style={{  height:200, padding:"10px 0" }}>
                    <ResponsiveContainer>
                    <LineChart>
                        <CartesianGrid strokeDasharray="1 1" />
                        <XAxis dataKey={getWeight} type="number" />
                        <YAxis /> 
                        <Tooltip formatter={(value, name, props)=>value+" Lifts"} labelFormatter={(v)=>(Math.ceil( getWeight({weight:v})/5 )*5)+" "+(inlbs?"Lbs":"Kg") }/>
                        <Legend />
 
                                <Line connectNulls dot={false} strokeWidth={2} 
                                        dataKey="lifts" 
                                        data={ serie.data.map((lifts,i)=>({ weight:i*5, lifts})) } 
                                        name={ LiftId2Name[serie.lift]  } 
                                        type="monotone" stroke={serie.color}  />
                                        { serie.params?.weight && <ReferenceLine x={ Math.round(serie.params.weight/5)*5 } strokeWidth={3} stroke={serie.color} label="You" />} 

                    </LineChart>
                    </ResponsiveContainer>
                    </div>

                </Grid>)}
            </Grid>

            
            </div>
            
            </Paper>
            ;
}

 

  const LinearQualificationBar = ({ value, color }) => {
 

      return <div> 
                <div style={{ width:"100%", backgroundColor:"#eee", borderRadius: 15}}>
                    <div style={{ height:10, width:(value*100)+"%", backgroundColor:color, borderRadius: 15 }}></div>
                </div>
            </div>;
  }


  const LiftWeightValue = ({ data, inlbs }) => {
      if( !data || !data.weight ) return "";

      return <><strong>{data.weight}</strong>{inlbs?"Lbs":"Kg"} </>;
  }


  const LiftScore = ({ value }) => {
      let verb = "low";

      if( value>0.98 )
      {
          verb = "Legendary"
      }
      else if( value>0.9 )
      {
          verb = "Elite"
      }
      else if( value>0.8 )
      {
          verb = "Very strong"
      }
      else if( value>0.7 )
      {
          verb = "Strong"
      }
      else if( value>0.6 )
      {
          verb = "Good"
      }
      else if( value>0.4 )
      {
          verb = "average"
      }
      else 
      {
          verb = "poor"
      } 
       

      return <span style={{fontSize:"0.6em"}}>Score: <strong>{verb}</strong> (%{Math.round(value*100)}{value>1?"+":""})</span>
  }


  const ExtractSharedQuery = querystring => {
        var m = querystring?.match( /load=([^&]+)/ );
        if( m )
        {
            let data = atob(m[1]);
            try 
            {
                data = JSON.parse(data);

                return {
                    sq      : data[0],
                    bp      : data[1],
                    dl      : data[2],
                    inlbs   : parseInt(data[3]) || 0 ,
                    gender  : parseInt(data[4]) || 0 ,
                    detected: true
                }
            }
            catch(e) 
            {
                return;
            }
        }
  }

  const Share = ({ sbd, inlbs, gender }) => {

    const [open, setOpen] = useState();
    const closeSnack = ()=>setOpen(false);

    let tocoAlgo = sbd[0]?.weight || sbd[1]?.weight || sbd[2]?.weight || gender>0;

    if( !tocoAlgo ) return "";

    let data = [
         sbd[0]?.rawValue || "",
         sbd[1]?.rawValue || "",
         sbd[2]?.rawValue || "",
         inlbs,  
         gender
    ]//FileCopyIcon  <ShareIcon/> <strong></strong>

    const url = "https://weightxreps.net/sbd-stats?load=" + btoa( JSON.stringify(data) );

    const openShareModal = ()=> {

        if( sbd[0]?.error || sbd[1]?.error || sbd[2]?.error )
        {
            alert("Fix the errors (in red) first!");
            return;
        }

        //track...
        trackEvent("share","sbd rank","link generated");

        OpenConfirmModal({
            title:"Copy & Send this link"
            , open:true
            , fullWidth:true
            , info: <ShareThisUrl url={url}/>
            , verb:"Copy Link"
            , canCancel: true
            , onConfirm: ()=>{
                navigator.clipboard.writeText(url).then( ()=>setOpen(true) );
            }
        });

    }

    return <div style={{ marginTop:10, textAlign:"center" }}>
        <Divider/><br/>

        <Snackbar open={open} autoHideDuration={3000} onClose={closeSnack} message="Link copied to clipboard!" /> 

        <Button startIcon={<ShareIcon/>} variant="contained" color="secondary" size="large" onClick={ openShareModal }>Share Results</Button>
    </div> 
  }




  const useShareStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center' 
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

  const ShareThisUrl = ({ url }) => {
      const classes = useShareStyles();
      return <Paper component="form" className={classes.root}>
                        <InputBase className={classes.input} readOnly value={url}></InputBase> 
                    </Paper>
  }



const Instructions = ()=>{
   
    const [open, setOpen] = useState();

    return <Box marginTop={2}>
        <Divider/><br/> 
        { !open && <Button variant="outlined" onClick={()=>setOpen(true)} startIcon={<HelpOutlineIcon/>}>Instructions / README</Button> }
        { open && <Grid container>
             
                <Grid item xs={12}>
                    <Button variant="outlined" onClick={()=>setOpen(false)} >CLOSE</Button><br/><br/>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableBody>

                                <TableRow>
                                    <TableCell colSpan={2} style={{backgroundColor:"#efefef"}}>
                                        This tool will compare the lifts you type above against <strong>competition RAW lifts</strong> done by <strong>Powerlifting Athletes</strong> all arround the world. 
                                        <br/>Depending on how you stack against them, you will be provided with a score to help you gauge your level against the pros.
                                        <br/>The charts will show the most lifted weights ( x axis is weight and y axis is number of lifts )
                                    </TableCell> 
                                </TableRow>

                                <TableRow>
                                    <TableCell>Typing a Weight</TableCell>
                                    <TableCell>Type your 1RM or "Weight x Reps" of your best set. Example: 190 x 5</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Adding your Bodyweight</TableCell>
                                    <TableCell>... add a "@" symbol next to the weight followed by your bodyweight to compare only in your weight class. Example: 190 @ 80
                                        <br/> The tool will then only compare your lifts against the correct weight class according to your bodyweight.
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Remove a lift</TableCell>
                                    <TableCell>If you type "0" (a cero) the lift will be removed from the results. Useful if for example you dont give a sh#t about squats, they would be removed.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>}
    </Box>
}