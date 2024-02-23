import { makeVar } from "@apollo/client";
import { Box, Button, ButtonGroup, Chip, Container, Grid, makeStyles, Paper, TablePagination, Typography } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
//--
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
//--
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { Alert } from "@material-ui/lab";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AsciiSpinner } from "../componentes/ascii-spinner";
import Barra from "../componentes/barras";
import { InfoDialog } from "../componentes/Dialog";
import { JDayContentHeader } from "../componentes/journal/jday-header";
import UnameTag from "../componentes/uname";
import WeightValue from "../componentes/weight-value";
import { useGetCommunityStatsLazyQuery, useGetOfficialExercisesQuery } from "../data/generated---db-types-and-hooks"; 
import { useGetSession } from "../session/session-handler";
import { OpenDMButton } from "../session/ui/dms-window/dm-window";
import "./CommunityStats.css";
import { PageLoadIndicator } from "./page-loader-ui";



const useStyles = makeStyles( theme => ({
       
     root: {
         "& .SQ": { display:"none" },
         "& .BP": { display:"none" },
         "& .DL": { display:"none" },
         "& .M" : { display:"none" },
         "& .F" : { display:"none" },

         "&.SQ .SQ": { display:"block" },
         "&.BP .BP": { display:"block" },
         "&.DL .DL": { display:"block" },
         
         "&.g-0 .M": { display:"block" },
         "&.g-1 .F": { display:"block" },
         "&.g-2 .M": { display:"block" },
         "&.g-2 .F": { display:"block" },
     }

  }));


const $OnStatsResponse  = makeVar();
const $genders          = ["male","female","both"];
const $gMatcher         = new RegExp(`(YEAR--)?(${$genders.join("|")})--(\\w+)`,"i"); // el "g" lo vuelve statefull y multiples exec en el mismo string incrementan lastIndex

export default function CommunityStats({ match:{  path, url, params:{ filtermask } } }) {
 

 
    const classes                       = useStyles();
    const history                       = useHistory();    
    const div                           = useRef();
    const cache                         = useRef(new Map());
    const [page, setPage]               = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const urlParams = useMemo( ()=>{

        const m = $gMatcher.exec( filtermask );  
        
        return m? { gender:$genders.indexOf(m[2]), type: m[3], period:m[1]? 1 : 0 } : null;

    } ,[filtermask]); 

    const gender    = urlParams? urlParams.gender : 2 ;  
    const etype     = urlParams?.type;
    const period    = urlParams?.period;

    //const [etype, setEType]             = useState();
    //const [gender, setGender]           = useState(2);

    const { data:official, loading:loadingOfficial, error:errorOfficial }       = useGetOfficialExercisesQuery();
    const [getStats, { data, loading, error, refetch, called }]                 = useGetCommunityStatsLazyQuery({
        notifyOnNetworkStatusChange:true
    }); 
    const stats = data?.communityStats;  
     

    useEffect( ()=>{

        

        //
        // arrancamos cargando el primer etype.
        //
        // if( !called && official )
        // {    
 
        //     // getStats({
        //     //     variables: {
        //     //         etype: official.officialExercises[0].id
        //     //     } 
        //     // }); 
        // }  
        if( official )
        {
            if( !etype || !official.officialExercises.find(e=>e.id.toLowerCase()==etype.toLowerCase()))
            { 
                //history.push( path.substr(0, path.lastIndexOf("/")+1 )+$genders[gender]+"--"+official.officialExercises[0].id );
                onExerciseChange(official.officialExercises[0].id);
            }
            else 
            {
                //
                // trigger data load!
                // 
                getStats({
                    variables: {
                        etype: (urlParams.period==1? "$":"")+etype
                    } 
                }); 
            }
        }


        
    }, [urlParams, official]);  
 

    const _setClassName = (remove, add)=> {
        var cn = div.current.className;
        remove && (cn = cn.replace(remove,""));
        add && (cn = cn+" "+add);
        div.current.className = cn;
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10)); 
    };

    const open = (type, gender, _period)=>{ 

        let p = _period!=null? _period : period;
        setPage(0);
        history.push( path.substr(0, path.lastIndexOf("/")+1 )+ ( (p==1?"YEAR--":"")+  $genders[gender]+"--"+type ));
    }

    const onExerciseChange = _type => {
        // setEType(_type);
        // setPage(0);
        // getStats({ variables: { _type }} );
        //(setGender(g) || setPage(0))
        //history.push( path.substr(0, path.lastIndexOf("/")+1 )+$genders[gender]+"--"+_type );

        open( _type, gender );
    }

    const onGenderChange = g => {
        etype && open( etype, g );
    }

    const onPeriodChange = p => {
        etype && open( etype, gender, p);
    }


    //if( loading || error )  
    const notReady = loadingOfficial || errorOfficial;
    const columns = useMemo( ()=>[
        {
            className:"HEAVYEST",
            prop:"heavyest",
            renderer: _weightRenderer
            ,items:[]
        },
        {
            className:"BESTESTIMATED1RM",
            prop:"estimated",
            renderer: _weightRenderer
            ,items:[]
        },
        {
            className:"MOSTCOLUME",
            prop:"volume",
            renderer: _volumeRenderer
            ,items:[]
        }
    ],[]);
 


    //
    // initializing...
    //
    if( notReady )
    {
        return <Container maxWidth="lg">
                    <PageLoadIndicator isLoading={loadingOfficial} error={errorOfficial} onRetry={ ()=>refetch() } />
                </Container>;
    }  
 

    if( !etype && official )
    { 
        //setGender(2); //all...
        //onExerciseChange( official.officialExercises[0].id );
    }

    const officialExercise = official?.officialExercises.find(e=>e.id.toLowerCase()==etype?.toLowerCase());
    //console.log( etype, officialExercise, official?.officialExercises )

    if(!officialExercise) {
        return "...";
    }

    return <Container maxWidth="lg" ref={div} className={classes.root}>
  
  <br/>
                 <StatsFilterControls  
                                     busy={ !stats || loading}
                                     data={ official?.officialExercises }
                                     gender             ={gender}
                                     etype              ={etype}
                                     period             ={period}
                                     onGenderChange     ={ g=>onGenderChange(g)  }
                                     onExerciseChange   ={ etype=>onExerciseChange(etype) }
                                     onPeriodChange = { p=>onPeriodChange(p) }
                                     />   

            <JDayContentHeader title={ loading?<AsciiSpinner label="Loading stats.."/> : error? "Oops! *_*" : ( stats?.title || "..." ) + " at: "+officialExercise.variants[0] }>

            { (loading || error ) && <Box marginTop={2}><PageLoadIndicator isLoading={loading} error={error} onRetry={ ()=>refetch() } /></Box> }
            
            { stats && <>
                        Last scan: <strong>{ new Date(stats.timestamp).toLocaleString() }</strong> - Updated every <strong>~{stats.scanFrecuency}</strong> aprox.
                        <br/><br/>
                        
                        <ExtraInfo label="What is this section?">
                            <Typography variant="body2">
                                The community stats are calculated based on what is logged in the journals on exercises with a <ExplainHowToParticipate exercises={official?.officialExercises}>specific name or tag</ExplainHowToParticipate> 
                                <br/>For the estimated 1RM the system uses the default values for the 1RM formula. (It doesn't use RPE)
                            </Typography>
                        </ExtraInfo>

                        </> } 
            </JDayContentHeader>
             

                
                <WhosAheadGraph data={stats}/>
  
        

                <Grid container   
                        direction="row"
                        justifyContent="space-around"
                        alignItems="flex-start">  

                    { columns.map( col=>{
                    
                        var colHasData = false;

                        return <Grid key={col.prop} item xs={12} sm={4}>

                        <div className={col.className+" sha"} /> 
                        
                        <Box padding={1}>

                            {  stats?.[ col.prop ] 

                                .map( (itm,i)=>({
                                    ...itm, 
                                    rank:i+1,
                                    xbw: itm.bw.v>0? itm.w.v / itm.bw.v : 0, //bw puede ser 0
                                    officialExercise
                                }) )

                                .filter( itm=>gender==2 || gender==itm.by.isf ) 
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map( (itm, i, arr)=>{
                                    
                                    colHasData = true;
                                    return col.renderer(itm,i,arr);
                                    
                                }) }

                                { !colHasData && <i>--- nothing yet... ---</i>}

                            {/*
                                col.items
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map( col.renderer )
                            */}
                        </Box>
                    </Grid>;} ) }
                </Grid>

                { stats!=null && stats?.heavyest.length>0 && <Paper elevation={1}><TablePagination component="div"
                         count={ stats?.heavyest.filter( itm=>gender==2 || itm.by.isf==gender ).length  }
                         rowsPerPage={rowsPerPage}
                         page={page}
                         onPageChange={handleChangePage} 
                         onRowsPerPageChange={handleChangeRowsPerPage}
                        /></Paper> }
                 

            </Container>;
}
 

const RankPosition = ({ pos })=>(<sup style={{float:"left"}}><strong>{pos}. </strong> </sup>);

const _weightRenderer = item => {
  
    const w         = item.w.v; //item.originalw?.v || item.w.v;
    const xBW       = item.bw.v? (w/item.bw.v) : 0;

     
    const onFire    = xBW>0 && xBW >= item.officialExercise.coolxbw;

    return <Box key={item.e.id} margin="10px 0" >
                
                    <Grid container> 
                    
                    <Grid item xs={5}> 
                        <Barra weight={w} reps={!item.originalw? item.reps : null }/>   
                        <RankPosition pos={item.rank}/>
                        <Box textAlign="center">
                            <strong>{item.originalw?"~":""}<WeightValue round={item.originalw!=null} value={w} inkg={!item.w.lb}/></strong>
                        </Box>
                    </Grid> 

                    <Grid item xs={7}>
                        <UnameTag {...item.by} ymd={item.ymd}/>
                        <Typography variant="caption" component="div" noWrap>{ item.e.name }</Typography>
                        { item.bw?.v>0 && <Typography noWrap variant="button">
                            @ <WeightValue value={item.bw.v} inkg={!item.bw.lb}/> 
                            {xBW && <>(<span style={{fontSize:10}}>x</span>{xBW.toFixed(2)}) {onFire && <>🔥</>}</>}
                        </Typography>}
                    </Grid>
                    
                </Grid>
            </Box> ;
}
 


const _volumeRenderer = item => {
    return <Box key={item.e.id} margin="10px 0">
                    <Grid container> 
                
                        <Grid item xs={3}>
                            <RankPosition pos={item.rank}/>
                            <Box width={90} textAlign="right" paddingRight={1}>
                                <strong><WeightValue round value={item.w.v} inkg={!item.w.lb}/></strong>
                                <Typography variant="caption" component="div">in <strong>{ item.totalReps }</strong> reps</Typography>
                                </Box>
                        </Grid>


                        <Grid item xs={9}>
                            <UnameTag {...item.by}/>
                            <Typography variant="caption" component="div" noWrap>{ item.e.name }</Typography>
                            { item.bw?.v>0 && <Typography noWrap variant="button">
                                @ <WeightValue value={item.bw.v} inkg={!item.bw.lb}/> 
                            </Typography>}
                        </Grid>
                        
                    </Grid>
                </Box>
             ;
}


const StatsFilterControls = ({ busy, gender, period, etype, data:officialExercises, onGenderChange, onExerciseChange, onPeriodChange })=>{ 
     
    return <Box style={{float:"right"}}>  
  
                <ArrowRightAltIcon style={{width:60, height:60}}/>  

            <FormControl disabled={busy} variant="outlined"  style={{ marginRight:5}}>
                <InputLabel >Period</InputLabel>
                <Select 
                    value={period}
                    onChange={ev=>onPeriodChange(ev.target.value) }
                    label="period"
                >
                <MenuItem value={0}>Month</MenuItem>
                <MenuItem value={1}>Year</MenuItem>  
                </Select>
            </FormControl> 


            <FormControl disabled={busy} variant="outlined"  style={{ marginRight:5}}>
                <InputLabel >Gender</InputLabel>
                <Select 
                    value={gender}
                    onChange={ev=>onGenderChange(ev.target.value) }
                    label="gender"
                >
                <MenuItem value={0}>Male</MenuItem>
                <MenuItem value={1}>Female</MenuItem> 
                <MenuItem value={2}>Both</MenuItem> 
                </Select>
            </FormControl> 
 
            { etype && <FormControl disabled={busy} variant="outlined"  >
                <InputLabel >Exercise</InputLabel>
                <Select  
                    label="exercise"
                    onChange={ ev=> onExerciseChange(ev.target.value) }
                    value={etype}
                    defaultValue={0}
                >
                    { officialExercises?.map( (e,i)=>(<MenuItem value={e.id}>{ e.variants[0] }</MenuItem>) ) } 
                </Select>
            </FormControl> }

            
            
            </Box>
}
 


const ExplainHowToParticipate = ({ exercises, children })=>{

    const [open, setOpen] = useState();
    const { session } = useGetSession();

    return <>
 
        <Chip icon={<HelpOutlineIcon/>} variant="outlined" onClick={()=>exercises && setOpen(true)} label={children}/>
        <InfoDialog scroll="body" open={open} maxWidth="sm" fullWidth title="How to get listed here..." onClose={ ()=>setOpen(false) }>
            
            <Typography gutterBottom>
            Some exercise's names are automatically recognized and for the rest you must add a special "tag" on the name of the exercise for it to be recognized by the system. Below you there's a list of all the "official exercises" and their tags (if you use these tags on your exercises, they will be listed in the corresponding list)
            </Typography>

            <Typography gutterBottom>
            By <strong>"tag"</strong> we refer to adding the text of the tag somewhere in the exercise name. There are 2 ways to add a tag:
            <ol>
                <li><Typography variant="body2">On a <strong>new exercise</strong>: When you log a new exercise, just append the tag's text at the end. The line would look like: <strong>#Some New Exercise #sq</strong> in case of tagging it to be listed among the squats.</Typography></li>
                <li><Typography variant="body2">When <strong>renaming</strong> an exercise: If you go to your exercises section and rename any, add the tag somewhere in the new name!</Typography></li>
            </ol>
            </Typography>

            { session && <Alert severity="info">
                If you have another variation not listed here in another language <OpenDMButton otherUser={{id:"1" }} label="Send me a DM" /> and i will add it!
            </Alert> }

            <Box marginTop={3}>
            <TableContainer component={Paper}>
                <Table size="small" >
                    <TableHead>
                    <TableRow>
                        <TableCell>Exercise</TableCell>
                        <TableCell>Tag</TableCell>
                        <TableCell>Recognized names (no need for tag)</TableCell> 
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {exercises.map((e) => (
                        <TableRow key={e.id}>
                        <TableCell component="th" scope="row">
                            {e.variants[0]}
                        </TableCell>
                        <TableCell><Chip size="small" label={e.tag}/></TableCell>
                        <TableCell>
                            {e.variants.map( v=><Chip size="small" variant="outlined" label={"#"+v}/> ) }
                        </TableCell> 
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Box>
        </InfoDialog>
    </>;
}



const WhosAheadGraph = ({ data }) => {

    const {session} = useGetSession();
    if( !data || data.heavyest.length<2 ) return "";

    const First     = data.heavyest[0].w;
    const Last      = data.heavyest[data.heavyest.length-1].w;

    var MAX         = First.v;
    var MIN         = Last.v;
    var W           = MAX-MIN;
    const myid      = session?.user?.id;

    const mine      = myid>0? data.heavyest.find( itm=>itm.by.id==myid) : null;

    //data.heavyest   .w.v ////inkg={Last.lb==0}  /// itm.by.id
    return <div>

        <div style={{position:"relative", overflow:"hidden"}}>
            
            <div style={{float:"right"}}><WeightValue value={First.v} inkg={1}/></div>
            <div style={{float:"left"}}><WeightValue value={Last.v}  inkg={1}/></div>
            <div style={{ margin:"0 auto", width:"30%", textAlign:"center"}}><WeightValue value={Last.v+W/2}  inkg={1}/></div>
        </div>
        
        <Paper square style={{ padding:2, position:"relative", width:"100%", height:30, marginBottom:50}}>
            { data.heavyest.map( (itm,i)=>{

                var me = itm.by.id==myid;
                return <div style={{ zIndex:me?"3":"auto", background: me?"red": "rgba(0,0,0,0.3)", position:"absolute", left:(((itm.w.v-MIN)/W)*99)+"%", width:3, height:me?45:28}}> </div>;

            } ) }

            { mine && <div style={{ zIndex:4, background:"red", position:"absolute", paddingLeft:10, paddingRight:10, top:38, color:"white", left:(((mine.w.v-MIN)/W)*99)+"%" }}> <b>You</b> </div> }
        </Paper>

        
    
    </div>;
}


const ExtraInfo = ({ children, label }) => {
    const [show, setShow] = useState(false);

    if(!show) {
        return <Button onClick={()=>setShow(true)} variant="outlined">{label}</Button>;
    }

    return <Paper elevation={4} style={{padding:10}} square > <Button onClick={()=>setShow(false)} variant="contained">close</Button> <hr/>{children}</Paper>;
}