import { Box, Button, Divider, TablePagination, useMediaQuery } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from "@material-ui/core/Typography";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Alert } from '@material-ui/lab';
import { useTheme } from "@material-ui/styles";
import { useContext, useMemo, useState } from "react";
import { parseError } from "../../data/db";
import { useGetPRsOfQuery } from "../../data/generated---db-types-and-hooks";
import { JOwnerContext } from "../../pages/journal-context";
import { ymd2date } from "../../utils/utils";
import { AsciiSpinner } from "../ascii-spinner";
import WeightValue from "../weight-value";
import { EditExerciseButton } from "./exercises";
import { JDayContentHeader } from "./jday-header";
import {Custom1RMFactorChip} from "./custom-1rm-factor-chip";
import { RepsOfChart } from "./prs-history-repsof-chart";

const $five     = new Array(5).fill(0);
const $one      = [0];
const $thisYear  = new Date().getFullYear();

 

export const PRsHistoryTable = ({ match:{params} })=>{

    const theme           = useTheme();
    const isOnSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    var $cols             = isOnSmallScreen? $one : $five;

    const jowner          = useContext(JOwnerContext);
    const { data, loading, error } = useGetPRsOfQuery({
        variables: {
            eid: params.eid
        }
    }); 

    const arr       = data?.getPRsOf.prs || [];
    const factor    = data?.getPRsOf.factor;

    const [colOffset, setColOffset] = useState(0);
    const [page, setPage]           = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    //
    // lo sunique RMs (reps) utilizados. Ordenados de menor a mayor.
    //
    const UniqueRMs = useMemo( ()=>data?.getPRsOf.prs.reduce( (out, pr)=>{
        if( out.indexOf(pr.r)<0 ) 
        {
            out.push(pr.r);
        }
        return out;
    },[]).sort( (a,b)=>a-b) ,[data]);



    if( UniqueRMs?.length<$cols.length )
    {
        $cols = UniqueRMs;
    }


    const colScroll = dir => ()=> {

        if( UniqueRMs.length<$cols.length ) return;

        setColOffset(  Math.max( Math.min( colOffset+1*dir, UniqueRMs.length-$cols.length ), 0 )  );

    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10)); 
    };

    const ymdToNice = ymd => {
      var d = ymd2date(ymd );
      var s = d.toString().split(" ");
      

      return `${d.getFullYear()!=$thisYear?s[3]+" - ":""}${s[1]} ${s[2]}`;
    }


    //
    // load indicator...
    //
    if( loading ) return <AsciiSpinner label="Loading PRs history..."/>;

    //
    // check errors...
    //
    if( error )
    {
      return <Alert severity="error">{ parseError(error) }</Alert>
    }


    if( !arr.length )
    {   //
        // esto puede pasar si por ejemplo creó un log con un exercise, despues borro el log. Ahí, el exercise sigue existiendo en la tabla exercises...
        // 
        return <Alert severity="info">No data for this exercise yet...</Alert>
    }

    //rowsPerPageOptions={[25, 50, 100]}
    return (<>


        <Paper elevation={2} style={{margin:"50px 0"}}>
        <Box margin={3} padding={3}>
            <Typography gutterBottom>
                In this table you can see the personal records on this exercise. They are <strong>sorted from the most recent to the oldest</strong> in chronological order by date (top is closest date to today and lowest is oldest).
            </Typography>
            <br/>
            <Typography >
                To see what's your PR (Personal Record) on a particular RM (Repetition Max) you go to the column on the desired RM and look the top most value (that will be the most recent) and the lowest you read on that column that would be past PRs (old records on thet RM)
            </Typography>
            <br/>
            <Alert severity="info">You can <strong>click on the date</strong> to go to that log</Alert>
        </Box>
        </Paper>


        { jowner.custom1RM>0 && <Custom1RMFactorChip style={{float:"left"}} factor={jowner.custom1RM}/> } 

        <TablePagination component="div"
                         count={arr.length}
                         rowsPerPage={rowsPerPage}
                         page={page}
                         onPageChange={handleChangePage} 
                         onRowsPerPageChange={handleChangeRowsPerPage}
                         ActionsComponent={TestAction}
                        />

        <TableContainer component={Paper}>
          <Table dense  padding="checkbox" >
            <TableHead>
              <TableRow>
                <TableCell align="center">Date</TableCell>

                <TableCell padding="checkbox" align="right">
                    <IconButton onClick={colScroll(-1)} disabled={colOffset==0}>
                         <KeyboardArrowLeftIcon />
                    </IconButton>

                </TableCell>

                { $cols.map( (_,i)=>(<TableCell key={i} align="center">{ UniqueRMs[i+colOffset]? <><strong>{UniqueRMs[i+colOffset]}</strong>RM</> : "" }</TableCell>) ) } 

                <TableCell padding="checkbox" align="left">
                    <IconButton onClick={colScroll(1)} disabled={colOffset==UniqueRMs.length-$cols.length}>
                         <KeyboardArrowRightIcon />
                    </IconButton>
                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>

              {arr
                .slice(0)
                .reverse()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row,i) => (

                <TableRow key={i} hover>
                  <TableCell align="center">
                      <Button onClick={()=>jowner.gotoYMD(row.when)} className="oneline " > {ymdToNice(row.when)} </Button>
                  </TableCell>

                  <TableCell  padding="checkbox"></TableCell>

                  { 
                    //
                    // cada ROW tiene 1 solo RM PR
                    // acá el COLS.map  hace un loop por cada known rep, 1, 2, 3, etc...
                    //
                    $cols.map( (_,i)=>{
                         
                        const RM    = jowner.estimate1RM( row.w, row.r); 
                        const REP   = UniqueRMs[i+colOffset];

                        //
                        // facemos la "inversa" de la fórmula de 1RM...
                        //
                        const estRM = Math.ceil( RM / ( jowner.est1RMFactor/((jowner.est1RMFactor+1)-REP)) / 2.5 ) * 2.5;
  

                        return <TableCell key={i} align="center">{row.r==UniqueRMs[i+colOffset]? <WeightValue value={row.w} inkg={!row.lb}/> : 
                                          
                                            <i style={{color:"#ccc"}}>
                                                {UniqueRMs[i+colOffset]<11 && estRM>0? <>~<WeightValue nounit value={estRM} inkg={!row.lb}/></> : "---"}
                                            </i> 
                                          
                                          }</TableCell>;
                   }) }

                  <TableCell  padding="checkbox"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>);
    
}

const TestAction = (props)=>{
    console.log( props )
    return <><IconButton disabled={props.page==0} onClick={ ()=>props.onPageChange(null,props.page-1) }>
                <ExpandLessIcon />
            </IconButton>

            <IconButton disabled={ (props.rowsPerPage*props.page)+props.rowsPerPage >=props.count } onClick={ ()=>props.onPageChange(null,props.page+1) }>
                <ExpandMoreIcon />
            </IconButton></>
             
}


export const PRsHistoryHeader = ({ match:{params} })=>{
 
  const { data, loading, error }  = useGetPRsOfQuery({
      variables: {
          eid: params.eid
      }
  }); 

  const NODATA = data && !data.getPRsOf;

  const graphData = useMemo(()=>[{ 
                                   name:"Total sets"
                                 , data:data?.getPRsOf?.setsOf.filter(rm=>rm.r<=20) 
                                                             .reduce( (out,row)=>{
 
                                                                if( out.slice(-1)[0]?.r<row.r-1 || ( !out.length && row.r>1) )
                                                                {
                                                                    // fill "lost" sets...
                                                                    var r = !out.length? 0 : out.slice(-1)[0].r;
 
                                                                    while( r++ < row.r-1 ) {
                                                                        out.push({ r, count:0, volume:0 });  
                                                                    } 
                                                                }
 
                                                                out.push({ ...row, volume: row.r * row.count });
                                                                return out;
                                                             } ,[]) || []
                                
                                }] 
                    ,[data]); // r  count 

                    console.log("------", graphData)

  if( loading )
  {
    return <AsciiSpinner label="Loading PRs..."/>;
  } 

  if( error )
  {
      return ":(";
  } 

  return <> 
        {/* <JDayContentHeader title={data?.getPRsOf.exercise.name || "???"}>

            <EditExerciseButton exercise={data?.getPRsOf.exercise} style={{float:"right"}}/>

            Workouts: <strong>{data?.getPRsOf.totalWorkouts}</strong> | PRs: <strong>{data?.getPRsOf.prs.length}</strong> | Total Reps: <strong>{data?.getPRsOf.setsOf.reduce( (total, itm)=>total+itm.r*itm.count ,0)}</strong>
          </JDayContentHeader> */}

          

          <div>

            { graphData?.[0].data.length>0?  
            <><Typography variant="caption">Amount of sets done so far of the given rep range (x axis. Capped at 20)</Typography> 
            <RepsOfChart data={graphData}/></> : "-- Never did sets of less than 21 reps --" }

          </div>
      </>;

}