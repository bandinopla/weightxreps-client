import "./SBDStatsPage.css";

import { Box, Button, Chip, Container, Divider, FormControl, FormHelperText, Grid, Input, InputBase, InputLabel, makeStyles, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import WeightValue from "../componentes/weight-value";
import ShareIcon from '@material-ui/icons/Share';
import { OpenConfirmModal } from "../componentes/Dialog";

import Snackbar from '@material-ui/core/Snackbar';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { trackEvent } from "../componentes/google-tracker";
import { PageLoadIndicator } from "./page-loader-ui";
import { parseError } from "../data/db";
import { useSBDStatsHook } from "../data/sbd-stats-hooks";

export const LiftId2Name = ["SQUAT","BENCH","DEADLIFT"];
export const SBDCOLORS = ["#0081C8","#FCB131","#EE334E"];



const LBS2KG                    = 0.4535924; 


export default function SBDStatsPage() {

    var location = window.location; 
 

    const loadState = ExtractSharedQuery( location.search );
    
    const { data, loading, error, calculate1RM }  = useSBDStatsHook();

    const [gender, setGender] = useState( loadState?.gender || 0 );
    const [useLbs, setUseLbs] = useState( loadState?.inlbs || 0 );
    const [ageClass, setAgeClass] = useState(loadState?.ageclass || -1);

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
                    weight = calculate1RM( weight, reps ) //Math.ceil( (weight * ( 36 / (37-reps) )) / 5 ) * 5;
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
                    color           : SBDCOLORS[i],
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


        series.forEach( serie=>{

            let bw = serie.params?.bw || 0;

            if( bw && useLbs )
            {
                bw *= LBS2KG; //esta escrito en LBs...
            }
            
            const wclasses = data.filterWeightClasses( bw, gender==0? null : gender-1, ageClass );
            
            if( bw )
            { 
                serie.wClasses      = wclasses;
                serie.wClassNames   = wclasses.flatMap(wc=>wc.wclass).map( wclass => {

                    let plus            = wclass.max>=500;
                    let classBW         = plus? Math.floor( wclass.min ) : wclass.max;  

                    return  (wclass.male?"Male ":"Female ") + (plus?"+":"") + classBW + " Kg "+ (useLbs? " | "+(plus?"+":"") + Math.round(classBW/LBS2KG) + " Lbs" : "" )
                }); 
            }

            const score = data.getScoreFor(wclasses, serie.lift, serie.wRef );

            serie.refIsBestThan = score.bestThan;
            serie.totalLifts = score.total;

            wclasses.forEach( wclass => {
                wclass.graph.forEach( (row, col)=>{
                    serie.data[col] += row[serie.lift];
                })
            });

        });

        return series;


    }, [data, gender, useLbs, SBD, ageClass] );

     
    
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


    return <Container > <br/>

                <Grid container spacing={1}>
                    <Grid item >   
                        <Typography variant="h6">Compare your best lifts against <strong style={{color:"#EE334E"}}>{data.sbdStats.total.toLocaleString() || "world class"}</strong> competition RAW lifts done arround the world!</Typography>
                        
                        {/* <Typography variant="subtitle2" gutterBottom>RAW = No knee wraps or suit on the squat, no straps or suit on the deadlift and no bench shirt on the bench press and pausing 1 second on the chest (no touch and go).</Typography>
  */}

                        <Typography variant="caption">
                        This page <a href="https://openpowerlifting.gitlab.io/opl-csv/" target="_blank">uses data</a> from the <a href="https://www.openpowerlifting.org" target="_blank">OpenPowerlifting project</a>. Data download date: { new Date(data.sbdStats.date).toLocaleString() }  
                        </Typography>
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
                    <iframe style={{maxWidth:"100%"}} width="560" height="215" src="https://www.youtube.com/embed/Q7XUBA6VtZw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    <Instructions/>
                    </Grid> */}

                </Grid>
                 <br/> 


                <Paper elevation={5}>
                    <Box padding={3}>
                <form className="sbd"  noValidate autoComplete="off">

<Grid container>
    <Grid item xs={4}>
        <FormControl >
            <InputLabel id="sex">GENDER</InputLabel>
            <Select value={gender} onChange={ e=>setGender(e.target.value)} style={{ textAlign:"center"}}>
                <MenuItem value={0}>---- All ----</MenuItem>
                <MenuItem value={1}>Males only</MenuItem>
                <MenuItem value={2}>Females only</MenuItem>
            </Select>
        </FormControl> 
    </Grid>
    <Grid item xs={4}>
        <FormControl >
            <InputLabel id="agec">AGE</InputLabel>
            <Select value={ageClass} onChange={ e=>setAgeClass(e.target.value)} >
            <MenuItem value={ -1 } >--- ANY ---</MenuItem>
                {
                    data && data.ageClasses.map( cls=><MenuItem value={ cls.index} key={cls.index}>{ cls.name }</MenuItem>  )
                }
                
            </Select>
        </FormControl>
    </Grid>
    <Grid item xs={4}>
        <FormControl >
            <InputLabel id="sex">UNIT</InputLabel>
            <Select value={useLbs}  onChange={ e=>setUseLbs(e.target.value)}> 
                <MenuItem value={0}>Kilograms</MenuItem>
                <MenuItem value={1}>Pounds</MenuItem>
            </Select>
        </FormControl> 
    </Grid>
    
    
    { LiftId2Name.map( (liftName,i)=><Grid key={i} item xs={4} style={{ marginTop:10}}><FormControl error={SBD[i]?.error}>
        <InputLabel htmlFor={liftName}>{liftName}</InputLabel>
        <Input value={SBD[i]?.rawValue} onChange={ e=>setSBD(i, e.target.value) } id={liftName}/>
        <FormHelperText>{ SBD[i]?.error? SBD[i]?.error : SBD[i]?.weight? "1RM = "+ SBD[i].weight : "Type your best RAW " + liftName }</FormHelperText>
    </FormControl></Grid> )} 

</Grid>



    


</form></Box>
                </Paper>
 
                
 
                
                <Share gender={gender} inlbs={useLbs} sbd={SBD} ageclass={ageClass}/>
 
            
            
            <CatChart series={graphData} inlbs={useLbs}/>
            {
                /* data.sbdStats.perclass.map( categoryData=>(<CatChart data={categoryData} />) )*/
            } 
 
 </Container >
}
 

const CatChart = ({ series, inlbs }) => {

    const theme = useTheme();
    //const graphData = useMemo( ()=>data.graph.map( (values,i)=>({ weight:i*5, squats:values[0], benches:values[1], deadlifts:values[2] }) ), [data]);

    const getWeight = (data)=>inlbs? data.weight*2.204623 : data.weight;
     
    return <div style={{padding:10, margin:10 }}>
         

            <div>

            <Grid container spacing={2}>
                { series.map( serie=><Grid key={serie.lift} item xs={12} md={4}>
 


                    <Typography variant="h4">
                        
                        {LiftId2Name[serie.lift]} { serie.totalLifts>0 && <LiftScore value={serie.refIsBestThan/serie.totalLifts}/> }
                    </Typography>
                    <LinearQualificationBar value={ serie.totalLifts? serie.refIsBestThan/serie.totalLifts : 0} color={serie.color}/> 
                    <div>Total lifts: <b>{serie.totalLifts.toLocaleString('en-US')}</b></div>

                     <div style={{ fontSize:"1.3em"}}> 

                                            { serie.params?.estimated? "~" : ""}
                                            { serie.params?.weight>0 && <strong><WeightValue inkg={inlbs?0:1} value={ serie.params.weight*(inlbs? LBS2KG : 1) }/></strong> }
                                            { serie.params?.bw>0 && <> @ <strong>{serie.params.bw}</strong></>}


                                            { !serie.params?.bw && <Chip size="small" label={ "Any "+ (serie.gender>0? serie.gender==1? "Male":"Female" : "") +" class" } variant="outlined" style={{ marginLeft:10}}/>  }
                                            { serie.wClassNames.map( name =><Chip size="small" label={  name + " class" } variant="outlined" style={{ marginLeft:10}}/> )}

                                            
                                             
                                        </div>  

                    <div  style={{  height:200, padding:"10px 0" }}>
                    <ResponsiveContainer>
                    <LineChart>
                        <CartesianGrid strokeDasharray="1 1" stroke={ theme.referenceLineColor}/>
                        <XAxis dataKey={getWeight} type="number" />
                        <YAxis /> 
                        <Tooltip formatter={(value, name, props)=>value+" Lifts"} labelFormatter={(v)=>(Math.ceil( v/5 )*5)+" "+(inlbs?"Lbs!!":"Kg") }/>
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
            
            </div>
            ;
}

 

  export const LinearQualificationBar = ({ value, color }) => {
 

      return <div> 
                <div style={{ width:"100%", backgroundColor:"#333", borderRadius: 15}}>
                    <div style={{ height:10, width:(value*100)+"%", backgroundColor:color, borderRadius: 15 }}></div>
                </div>
            </div>;
  }


  export const LiftScore = ({ value, justVerb }) => {
      let verb = "low"; 
      let cls = "";

      if( value>0.98 )
      {
          verb = "Legendary"
          cls = "legendary";
      }
      else if( value>0.9 )
      {
          verb = "Elite"
          cls = "elite"
      }
      else if( value>0.8 )
      {
          verb = "Very strong"
          cls = "verystrong"
      }
      else if( value>0.7 )
      {
          verb = "Strong"
          cls = "strong"
      }
      else if( value>0.6 )
      {
          verb = "Good"
          cls = "good"
      }
      else if( value>0.4 )
      {
          verb = "average"
          cls = "average"
      }
      else 
      {
          verb = "poor"
          cls = "poor"
      } 

      if(!value) return "";

      if( justVerb )
      {
        return <span className={`bg ${cls}`}>{verb}</span>;
      }
       

      return <span style={{fontSize:"0.6em"}}><span className={`bg ${cls}`}>{verb}</span> %{Math.round(value*100)}{value>1?"+":""} </span>
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
                    detected: true,
                    ageclass: parseInt(data[5]) || 0
                }
            }
            catch(e) 
            {
                return;
            }
        }
  }

  const Share = ({ sbd, inlbs, gender, ageclass }) => {

    const [open, setOpen] = useState();
    const closeSnack = ()=>setOpen(false);

    let tocoAlgo = sbd[0]?.weight || sbd[1]?.weight || sbd[2]?.weight || gender>0;

    if( !tocoAlgo ) return "";

    let data = [
         sbd[0]?.rawValue || "",
         sbd[1]?.rawValue || "",
         sbd[2]?.rawValue || "",
         inlbs,  
         gender,
         ageclass
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

    return <div style={{ margin:"50px 0", textAlign:"center" }}>
         

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