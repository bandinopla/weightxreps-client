import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, Button, CircularProgress, Divider, FormControl, FormHelperText, InputAdornment, LinearProgress, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import { RPEChip } from "../componentes/RPE-Chip";
//---
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeVar, useReactiveVar } from "@apollo/client";
import { CurrentUserContext, SettingSuccessSnackbar, useSettingsStyles } from "./settings";
import { Alert } from "@material-ui/lab";
import { useSetSettingMutation } from "../data/generated---db-types-and-hooks";
import { parseError } from "../data/db";
import { clearJdayAndJRangeOf } from "../cache/clean-cache";
import PublishIcon from '@material-ui/icons/Publish';
import { UnameRef } from "../componentes/uname";


const $cols                 = new Array(12).fill(0);
const useStyles = makeStyles( theme =>({

    tableContainer: {
        height:400
        , position:"relative"
    },

    table: {
        position:"absolute", 
        //left: "calc(-500px + 50% )",
        //width:1000
    }

}) );


const $changePercentEvent   = makeVar();

export const RPETableWidget = ({setting})=>{
 
    const [colOffset, setColOffset]     = useState(0); // del 0 al 2 ( 3 paginas )
    const [width, setWidth]             = useState();
    const classes = useStyles();


    useEffect( ()=>{ 
         
        window.addEventListener('resize', doTableResize, true);
        doTableResize();

        return ()=>window.removeEventListener('resize', doTableResize, true);

    }, [] );

    const doTableResize = ()=>{
        const vw = Math.floor((Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))*0.8);
        setWidth(vw);
    }


    const colScroll = dir => {
        const c = Math.max( 0, Math.min( colOffset+dir,  2 ) )
        setColOffset( c );
    }



    const tableRows = useMemo( ()=>{

        const rpes = setting.defaults.filter( (v,i)=>i%3==1 )
                        .reduce( (out, val)=>{
                            if( out.indexOf(val)<0 )
                            {
                                out.push(val)
                            }
                            return out;
                        } ,[])
                        .sort( (a,b)=>b-a ); // vienenen rep, rpe, percent...

        return rpes.map( rpe=>{

            const row = [ rpe ];

            for (let i = 0; i < 12; i++) 
            {
                const rep = i+1;
                const defaultValue  = setting.defaults.find( (v,j,arr)=>arr[j-2]==rep && arr[j-1]==rpe );
                const overritten    = setting.overrides.find( (v,j,arr)=>arr[j-2]==rep && arr[j-1]==rpe  );
 

                row.push( { rpe, rep:i+1, defaultValue, override:overritten, setting  } ); // ponerl el valor de coincida con RPE e i+1 as REP.        
            }

            return row;
        });


    } ,[setting]);
 
//calc(-500px + 50% ) - absolute pos y width.
//386 HEIGHT table ----style={{width, left:`calc(-${Math.floor(width/2)}px + 50% )` }}
    return <> 
            <PercentChangeModal/>

            <ImportCSVWidget sid={setting.id}/>

            <Typography variant="subtitle2" gutterBottom>
                <UnameRef uid={1080} uname="Skullengaged"/> made a <a href="https://docs.google.com/spreadsheets/d/1BmUzqruLxg98rKsi6ocneIUnKMwzndhigo8yUg15_0g/edit#gid=0" target="_blank"><strong>CVS template</strong> you can download</a> from Google Docs.
                <br/>
                <br/>
                Click on the % you want to change. You can <strong>hold mouse + drag</strong> to scroll the table horizontally when/if needed. 
                </Typography>

            <div className={classes.tableContainer}>
            <TableContainer component={Paper} elevation={3} className={classes.table} >
                <Table padding="checkbox" >
                <TableHead>
                    <TableRow>
                    <TableCell align="center">RPE</TableCell>

                    {/* <TableCell padding="checkbox" align="right">
                        <IconButton onClick={()=>colScroll(-1)} disabled={colOffset==0}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>

                    </TableCell> */}

                    { $cols.map( (_,i)=>(<TableCell key={i} align="center">

                        <strong>{ (i+1)+4*colOffset }</strong> rep
                        
                    </TableCell>) ) } 

                    {/* <TableCell padding="checkbox" align="left">
                        <IconButton onClick={()=>colScroll(1)} disabled={colOffset==2}>
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </TableCell> */}

                    </TableRow>
                </TableHead>
                <TableBody>

                    {tableRows 
                    .map((row,i) => (

                    <TableRow key={i} hover>
                        <TableCell align="center"> 
                            <RPEChip value={row[0]}/>
                        </TableCell>
 
                        {/* <TableCell></TableCell> */}

                        { $cols.map( (_,i)=>(<TableCell key={i} align="center">

                                <RPEChangeNumber value={row[ (i+1)+4*colOffset ]}/>

                            </TableCell>) ) } 

                            {/* <TableCell></TableCell> */}
  
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </div>
            
            </>;
}

const RPEChangeNumber = ({ value }) => {

    const val = value.override || value.defaultValue;
    return <Button variant="text" onClick={()=>$changePercentEvent( value )}>{ (value.override? "*":"")+ (val*100).toFixed(1)}%</Button>
}

const PercentChangeModal = ()=> {

    const currentUser       = useContext(CurrentUserContext);
    const classes           = useSettingsStyles();
    const value             = useReactiveVar($changePercentEvent); 
    const [error, setError] = useState();
    const [busy, setBusy]   = useState();
    const txtRef            = useRef();
    const [success, setSuccess]         = useState();
    const [setSetting, {client}]        = useSetSettingMutation();

    useEffect( ()=>setError(null), [value] );

    
    const handleClose = ()=>{
        if( busy ) return;
        $changePercentEvent(null);
    }

    //
    // SAVE
    //
    const setCustomValue = async ( backToDefault )=> { 

        var val = Number( txtRef.current.value );

        if( backToDefault==true )
        {
            val = 0;
        }
        else 
        {
            if( isNaN(val) || val<40 || val>100 )
            {
                setError("Percent must be numeric between 40 and 100");
                return;
            } 
        }

        

        setError(null);
        setBusy(true);

        try 
        {  
            var resp = await setSetting({
                variables: {
                    id      : value.setting.id,
                    value   : [ value.rep, value.rpe, val/100 ] //val es un numero 0-100
                },

                //
                // update cache: borrar todo lo que hubiera hecho uso de EFF 
                //
                update: (cache, {data} ) => {

                    //
                    // borrar jdays
                    // borrar jranges
                    //
                    clearJdayAndJRangeOf( cache, currentUser.id ); 

                }
            });  
 
            setSuccess( `${value.rep} REP @ ${value.rpe} RPE set to ---> ${val || (value.defaultValue*100).toFixed(1)}%`)
            $changePercentEvent(null); 

        }
        catch( e )
        {
            setError( parseError(e) );
        }

        setBusy(false); 
    }
 

    //if( !value ) return "";


    const isOverritten  = value!=null && value.override>0 && (value.override != value.defaultValue);
    const val           = value?.override || value?.defaultValue;

    return <>

            <SettingSuccessSnackbar open={success} onClose={()=>setSuccess(false)} text={ success }/>

            { value!=null && <Dialog open={ value!=null } onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Change % for {value.rep} REP @ {value.rpe} RPE</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Customize your percentage for this RPE/REP combination:
                    </DialogContentText>
                    { isOverritten && <Alert severity="info">Currently overritten. Default value is <strong>{(value.defaultValue*100).toFixed(1)}</strong></Alert>}

                    <FormControl error={error!=null}>
                        <TextField
                            label="Percent that this combination represent"  
                            fullWidth 
                            defaultValue={ (val*100).toFixed(1) } 
                            disabled={busy}
                            inputRef={txtRef}
                            autoFocus
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                className: classes.input,
                                style:{ fontSize:"3em" }
                            }}
                            />
                        <FormHelperText> 
                            {error}
                        </FormHelperText>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary" disabled={busy}>
                    Cancel
                </Button>

                { isOverritten && <Button onClick={()=>setCustomValue(true)} color="primary" variant="outlined" disabled={busy}>
                    Revert to default
                </Button> }

                <Button onClick={setCustomValue} color="primary" variant="contained" disabled={busy}>
                    { busy? <CircularProgress size={25}/> : "Save change" }
                </Button>
                </DialogActions>
            </Dialog>}</>;
}


// https://www.papaparse.com/
const ImportCSVWidget = ({ sid })=>{

    const currentUser                   = useContext(CurrentUserContext);
    const [starting, setStarting]       = useState(false);
    const [uploading, setUploading]     = useState(false);
    const [ lib, setLib ]               = useState(null);
    const [error, setError]             = useState(null); 
    const [setSetting, {client}]        = useSetSettingMutation();
    const [success, setSuccess]         = useState(false);

    const loadLibrary = async ()=>{

        setStarting(true);
        const _lib = await import(/* webpackChunkName: "cvs-parser" */'papaparse');
        setLib( _lib );
        setStarting(false);

    }

    const onUserSelectFile = (e)=>{

        e.preventDefault();
        let files;

        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }

        if( !files )
        {
            return;
        }

        if( !files[0].name.match(/\.csv$/) )
        {
            setError("File must be a *.csv");
            return;
        }
 

        lib.parse( files[0], {
            dynamicTyping: true,
            complete: function(results) {
                console.log(results);

                if( results.errors.length )
                {
                    setError("Failed to parse the file. Can't say exaclty why... but it did. ");
                }
                else 
                {
                    // ir line by line y generar info de result...
                    const out       = [];
                    const errors    = [];

                    results.data.forEach( (line, ln)=>{

                        var [ rep, rpe, value ] = line;
                        var _errors = [];

                        if( isNaN(rep) || rep!=Math.floor(rep) || rep<1 || rep>12 )
                        { 
                            _errors.push( `Line ${ln+1} Column 1 , "REP value": Especting a whole number between 1 and 12. Got --> ${rep}` );
                        }

                        if( isNaN(rpe) || rpe<6 || rpe>10 || ( rpe!=Math.floor(rpe) && rpe%1!=0.5 ) )
                        { 
                            _errors.push( `Line ${ln+1} Column 2, "RPE value": Especting a whole number between 6 and 10. And only .5 as decimal portion if any. Got --> ${rpe}` );
                        } 

                        var ovalue = value;

                        if( value>1 )
                        {
                            //debe ser de 1 a 100....
                            value = value/100;
                        }

                        if( isNaN(value) || value<.5 || value>1 )
                        { 
                            _errors.push( `Line ${ln+1} Column 3, "% value": Percent value should not go below 50% nor 100%. Got --> ${ovalue}` );
                        }

                        if( typeof rep=='string' && typeof rpe=='string' && typeof value=='string' && ln==0 )
                        {
                            //es la fila de labels...
                            return;
                        }

                        out.push({ rep, rpe, value });

                        if( _errors.length )
                        { 
                            Array.prototype.push.apply( errors, _errors );
                        }
                    });

                    if( errors.length )
                    {
                        errors.unshift("You will need to fix these errors before being able to import the file.");
                        setError( errors );
                    }
                    else 
                    {
                        //
                        // ALL GOOD!!!
                        //
                        //setConfirmData( out );
                        uploadCSV( out );
                    } 
                }

            }
        });
        
    }


    const uploadCSV = async (lines) => {

        setUploading(true);

        //
        // "achatar" array... [num, num, num, num]...
        //
        const flatValues = lines.reduce( (out, row)=>{

            out.push( row.rep, row.rpe, row.value );
            return out;

        } ,[]);


        try 
        {  
            var resp = await setSetting({
                variables: {
                    id      : sid,
                    value   : flatValues
                },

                //
                // update cache: borrar todo lo que hubiera hecho uso de EFF 
                //
                update: (cache, {data} ) => {

                    //
                    // borrar jdays
                    // borrar jranges
                    //
                    clearJdayAndJRangeOf( cache, currentUser.id ); 

                }
            });  
            
            setSuccess(true); 
        }
        catch( e )
        {
            setError( parseError(e) );
        }

        setUploading(false); 
    }

    return <Box padding={1} marginBottom={2}>

            { (uploading || starting) && <LinearProgress/> }

            { !lib && <Button startIcon={<PublishIcon/>} onClick={ ()=>loadLibrary() } variant="outlined">Load from a *.csv</Button> }
            { lib && <div>
                

                { !error && !success && <div>
                    
                    <Typography variant="body2" gutterBottom>
                        The CSV file is espected to have 3 columns: REP, RPE, VALUE. Where "VALUE" is the % you wish to give to the REP@RPE combination.
                        "VALUE" is espected to be either a number from 0.5 to 1 or 50 to 100. Yes, using less than 50% on a RPE 6 makes no sense.
                    </Typography>
                    <Box padding={2}><input type="file" accept=".csv" onChange={onUserSelectFile} /></Box></div> }

                    

                { error && <div style={{ border:"2px solid red", padding:10, whiteSpace:"break-spaces", wordBreak:"break-word"}}>

                    <Box textAlign="center" marginBottom={1}><Button onClick={()=>setError(null)} variant="outlined">close</Button></Box>
                    { Array.isArray(error) && error.map(err => <Alert severity="error">{err}</Alert> ) }
                    { typeof error == "string" && <Alert severity="error">{error}</Alert> }
                    </div>
                }

                
                { success && <div style={{ padding:10 }}> 
                    <Alert severity="success" onClose={ ()=>setSuccess(null)  || setLib(null) }>File Uploaded and processed!</Alert> 
                    </div> }
                 
                <br/>
                <Divider/>
                </div>}
        </Box>

}