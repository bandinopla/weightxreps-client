import { useContext, useMemo, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import PaletteIcon from '@material-ui/icons/Palette';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import { TableSortLabel, Tooltip, Typography } from '@material-ui/core';
import { JOwnerContext } from '../../pages/journal-context';
import WeightValue from '../weight-value';
import Ename from '../ename';
import RoomIcon from '@material-ui/icons/Room';



export default function JRangeTable({ data, onSelect, onSelectAllClick, selectedEids=[] }){

    const jowner                                = useContext(JOwnerContext);

    /**
     * voy a poner el Index del sort column, y si es negativo el oren es inverso.
     * @type {Number}
     */
    const [sortBy, setSortBy]   =   useState(1);

    //
    // los tags van arriba de todo...
    //
    const prioritizeTAGsThen = secondarySort => (a,b)=>a.exercise.isTag? b.exercise.isTag? secondarySort(a,b) : -1
                                                          : b.exercise.isTag? 1 : secondarySort(a,b);


    const sortableColumns = useMemo(()=>[
            { label:"Volume"      , isw:true , round:true, prop:"vol"  , sort:(a,b)=>b.vol-a.vol } 
        ,   { label:"Reps"        , prop:"reps"  , sort:(a,b)=>b.reps-a.reps }

        ,   { label:"INT"        , isw:true , prop:"max"  , sort:(a,b)=>b.max.w-a.max.w }
        ,   { label:"~EFF"        , isw:true , nounit:true, prefix:"~", prop:"maxe1rm"  , sort:(a,b)=>b.maxe1rm.w-a.maxe1rm.w }

        ,   { label:"B.Int"     , prop:"maxINT"  , sort:(a,b)=>b.maxINT-a.maxINT, format:v=>Math.round(v*100)+"%" }  
        ,   { label:"B.Eff"     , prop:"maxEFF"  , sort:(a,b)=>b.maxEFF-a.maxEFF, format:v=>Math.round(v*100)+"%" } 
        
        ,   { label:"Days"        , prop:"workouts"  , sort:(a,b)=>b.workouts-a.workouts }
        //,   { label:"PRs"         , prop:"prs" , sort:(a,b)=>b.prs-a.prs }
    ],[]);

    const columnIsActive = i=>Math.abs(sortBy)==i+1;

    const setSortHandler = i=>()=>{
        if( columnIsActive(i) )
        {
            setSortBy( sortBy*-1 ); //<-- toggle direction
        }
        else 
        {
            setSortBy(i+1);
        }
    }
  
    return (
        <TableContainer component={Paper}>
          <Table size="small" padding="none"> 

            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={ selectedEids.length > 0 && selectedEids.length < data.length }
                        checked={ selectedEids.length == data.length }
                        onChange={onSelectAllClick} 
                    />
                </TableCell>
                <TableCell padding="checkbox">
                    <PaletteIcon/>
                </TableCell>
                <TableCell>Exercise</TableCell>

                { sortableColumns.map( (col,i)=>(<TableCell key={col.label} align={ "center"}>
                        <TableSortLabel active={ columnIsActive(i) }
                                        direction={ sortBy<0?"asc":"desc" } 
                                        onClick={ setSortHandler(i) } >{ col.label }</TableSortLabel>
                </TableCell>))}
                 
              </TableRow>
            </TableHead>


            <TableBody>
              {data


              .sort( prioritizeTAGsThen((a,b)=>sortableColumns[ Math.abs(sortBy)-1 ].sort( sortBy>0?a:b,sortBy>0?b:a)) ) //<--- SORT

              .map((row) => (
                <TableRow key={row.exercise.id}
                    onClick={(event) => onSelect(row.exercise.id)}
                    hover
                    selected={ selectedEids.indexOf(row.exercise.id)>-1 }
                    >
                    <TableCell  padding="checkbox">

                        <Checkbox
                          checked={selectedEids?.indexOf(row.exercise.id)>-1} 
                        />

                    </TableCell>
                    <TableCell padding="checkbox">
                        <StopRoundedIcon style={{color:"#"+row.color}}/>
                    </TableCell>
                  <TableCell style={{maxWidth:200}}>
                        { row.exercise.isTag? <Tooltip title={<ol>{row.exercise.eids.map(e=><li>{e.name}</li>)}</ol>}><span><RoomIcon fontSize="small"/> tagged with <strong>{row.exercise.id}</strong> ({row.exercise.eids.length})</span></Tooltip> 
                                            : <Ename {...row.exercise} nohash /> }
                  </TableCell>


                  {sortableColumns.map( col=>{
                  
                      const itm = row[col.prop]; 
                      const val = itm.hasOwnProperty("w")? itm.w : itm;
                      const inkg = itm.hasOwnProperty("w")? itm.inlb==0 : jowner.usekg;
                      const hasValue = val.w>0 || (!isNaN(val) && val>0);

                      return <TableCell key={col.prop} align="center">

                            { col.isw && ( hasValue ? <WeightValue nounit={col.nounit} prefix={col.prefix} round={col.round} value={val} inkg={inkg}/> : <NoValue/> ) }
                            { !col.isw && ( hasValue? col.format? col.format(val) : val : <NoValue/> ) }

                        </TableCell>} )}

 


                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      );
}

const NoValue = ()=>(<Typography variant="caption" style={{color:"#ccc"}}>---</Typography>)