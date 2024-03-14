
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Fragment, useMemo, useState } from 'react';
import Barra from '../componentes/barras';
import WeightValue from '../componentes/weight-value';
import { Button } from '@material-ui/core';
import { NothingHere } from '../componentes/nothing-here-alert'; 
import { PRsHistoryHeader } from '../componentes/journal/prs-history';
import { JOwnerContext } from './journal-context';



const useStyles = makeStyles( theme => ({
    r: {
        color: theme.palette.primary.main 
    },
    rm: {
        fontSize:"0.8em"
    },
    oddRow: { 
            backgroundColor: theme.palette.action.hover, 
    }
}) );



/**
 * @typedef { import("../data/generated---db-types-and-hooks").GetPRsOfQuery["getPRsOf"]  } WxrPRs
 */

/** 
 * @param {{ data:WxrPRs, user:import('../data/generated---db-types-and-hooks').User, onClickLog:(ymd:string)=>void }} param0 
 */
export const RecordsWxR = ({data, user, onClickLog})=>{

    const classes = useStyles();
    const [expanded, setExpanded] = useState([]);

    const repData = useMemo(()=>{

        //unique reps
        return [ ...new Set( data.prs.map(pr=>pr.r) ) ].sort( (a,b)=>a-b ).map( RM=>data.prs.filter(pr=>pr.r==RM).reverse()); 

        
    }, [data]);

    const outdated = useMemo(()=>{

        return repData.map( rmHistory=>repData.some( sets=>sets[0].r>rmHistory[0].r && sets[0].w>=rmHistory[0].w ) );
        
    }, [repData])

    const toggle = (i)=>{

        const cpy = [...expanded];
        cpy[i] = !cpy[i];

        setExpanded(cpy)
    } 

    if( repData.length==0 )
    return <NothingHere title='No Weight x Reps Prs yet..' description="There are no logs doing reps with this exercise atm..." />

    return (<> 

        <Box padding={3}>
            <Typography variant="h5" gutterBottom>Most used rep range</Typography>
            <JOwnerContext.Provider value={user} >
                <Box padding={3}>
                    <PRsHistoryHeader match={{ params: { eid: data.exercise.id} }} owner={user}/>
                </Box>
            </JOwnerContext.Provider>

            <Typography variant="h5" gutterBottom>Best max weight for repetitions</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                
                <TableCell align="center">Max Reps</TableCell>
    
                <TableCell ></TableCell>
                <TableCell  align="center" >Weight</TableCell>
                <TableCell  align="center" >Bodyweight</TableCell>
                <TableCell  align="center" >Log</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repData.map((row,i) => (
                <Fragment key={row[0].r}> 
                    <TableRow className={ i%2? classes.oddRow : ""}> 
                        
                        <TableCell component="th" scope="row" align="center">
                            <Typography variant="h4"><span className={classes.r}>{row[0].r}</span><span className={classes.rm}>rm</span></Typography>
                        </TableCell> 

                        {
                            outdated[i] ? <TableCell colSpan={3} >
                                        Pending new PR attempt...
                                    </TableCell> : 
                            <>
                                <TableCell  align="center" >
                                    <Barra weight={row[0].w} />
                                </TableCell>
                                <TableCell  align="center" >
                                    <Typography variant="h4"> 
                                        <WeightValue value={row[0].w} inkg={row[0].lb==0} />  
                                    </Typography>
                                    { row[0].a2bw>0 && 
                                        <>BW{row[0].a2bw>0?" + ":" - "}<WeightValue value={Math.abs(row[0].a2bw)} inkg={row[0].lb==0} /></> }
                                </TableCell>
                                <TableCell  align="center" >
                                    <Typography variant="h4">
                                        {row[0].bw? <WeightValue value={row[0].bw} inkg={ user.usekg } /> : "?" }
                                        
                                    </Typography>
                                </TableCell>
                                
                            </>
                            
                        }
                        <TableCell  align="center" >
                            <IconButton onClick={() => toggle(i)}>
                                {expanded[i] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                            <Button variant='outlined' onClick={()=>onClickLog(row[0].when)} className='oneline'>{row[0].when}</Button>
                        </TableCell>

                        


                    </TableRow>
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={expanded[i]} timeout="auto" unmountOnExit>
                                <Box margin={1}>
                                    <Typography variant="h6">History</Typography>
                                    <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            
                                            <TableCell align='center'>Weight</TableCell>
                                            <TableCell align='center'>Bodyweight</TableCell> 
                                            <TableCell align='center'>Log</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody> 
                                    {
                                        row.map(pr=><TableRow key={pr.when}>

                                            
                                            <TableCell align='center'>
                                                <WeightValue value={pr.w} inkg={pr.lb==0}/> {pr.a2bw>0 && <>(BW{pr.a2bw>0?"+":"-"}<WeightValue value={pr.a2bw} inkg={pr.lb==0} />)</> }
                                            </TableCell>
                                            <TableCell align='center'>
                                                {pr.bw? <WeightValue value={pr.bw} inkg={ user.usekg } /> : "?" }
                                            </TableCell>
                                            <TableCell component="th" scope="row" align='center' >
                                                <a href="#" onClick={ev=>ev.preventDefault() || onClickLog(pr.when) }>{pr.when}</a>
                                            </TableCell>
 
                                        </TableRow>)
                                    }
                                    </TableBody>
                                    </Table>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>);
}