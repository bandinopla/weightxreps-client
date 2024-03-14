import { useMemo, useState } from "react"
import { DistanceValue, SpeedValue } from "../distance-value"
import Ename from "../ename"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TimeValue } from "../time-value";
import { TableSortLabel } from "@material-ui/core";
import { NothingHere } from "../nothing-here-alert";


const COLUMNS = [
    {
        label:"Exercise", 
        reduce: erow => erow.exercise ?? erow, 
        render: val=>(<Ename {...val}/>),
        sort: (a,b)=>b.name.toLowerCase()<a.name.toLowerCase()? -1 : b.name==a.name? 0 : 1
    },
    {
        label:"Max. Force", 
        reduce: (erowA,erowB) => !erowB || erowA?.force>erowB?.force ? erowA : erowB, 
        render: val=> val.force>0? <strong>{val.force.toFixed(1)}N</strong> : "---",
        sort: (a,b)=>b.force-a.force
    },
    {
        label:"Max Speed", 
        reduce: (erowA,erowB) => !erowB || erowA?.speed>erowB?.speed ? erowA : erowB, 
        render: val=> val.speed>0? <SpeedValue value={val.speed} displayUnit={val.dunit}/> : "---",
        sort: (a,b)=>b.speed-a.speed
    },
    {
        label:"Total Dist.", reduce:(erowA, erowB)=>{ 
                                                        if( erowA?.$total ) 
                                                        {
                                                            erowA.$total += (erowB.d ?? 0) * erowB.s;
                                                            if( !erowA.unit && erowB.dunit )
                                                            { 
                                                                erowA.unit = erowB.dunit;
                                                            }
                                                        } 
                                                        return erowA.$total? erowA : { $total: (erowA.d ?? 0)*erowA.s + (erowB?.d ?? 0)*(erowB?.s || 0), unit: erowA.dunit }
                                                     },

        render: val=>val.$total>0 ? <DistanceValue value={val.$total} displayUnit={val.unit}/> : "---",
        sort: (a,b)=>b.$total-a.$total
    },
    {
        label:"Min. Dist.", 
        reduce: (erowA,erowB) =>!erowB || ( erowA?.d>0 && erowA?.d<erowB?.d ) ? erowA : erowB, 
        render: val=> val.d? <DistanceValue value={val.d} displayUnit={val.dunit}/> : "---",
        sort: (a,b)=>b.d-a.d
    },

    {
        label:"Max. Dist.", 
        reduce: (erowA,erowB) =>!erowB || ( erowA?.d>erowB?.d ) ? erowA : erowB, 
        render: val=> val.d>0? <DistanceValue value={val.d} displayUnit={val.dunit}/> : "---",
        sort: (a,b)=>b.d-a.d
    },
    
    {
        label:"Min. Time", 
        reduce: (erowA,erowB) => !erowB || (erowA?.t>0 && erowA?.t<erowB?.t) ? erowA : erowB, 
        render: val=> val.t? <TimeValue milliseconds={val.t}/> : "---",
        sort: (a,b)=>b.t-a.t
    },
    {
        label:"Max. Time", 
        reduce: (erowA,erowB) => !erowB || (erowA?.t>erowB?.t) ? erowA : erowB, 
        render: val=> val.t? <TimeValue milliseconds={val.t}/> : "---",
        sort: (a,b)=>b.t-a.t
    },
    {
        label:"T. Time", 
        reduce: (erowA, erowB)=>( isNaN(erowA)? (erowA.t??0)*erowA.s : erowA ) + (erowB?.t??0)*(erowB?.s??1) , 
        render: val=> val>0? <TimeValue milliseconds={val}/> : "---",
        sort: (a,b)=>b-a
    },
    {
        label: "Days",
        reduce: (acc, erow) => {
            if( acc instanceof Set )
            {
                acc.add( erow.ymd );
                return acc;
            }
            else 
            {
                const set = new Set( [ acc.ymd ] );

                if( erow ) set.add( erow.ymd ); 

                return set;
            }
        }, 
        render: val=><strong>{ val.size  }</strong>,
        sort: (a,b)=>b.size-a.size
    }
]

/**
 * @param {{ data:import("../../data/generated---db-types-and-hooks").GetJRangeQuery }} param0
 * @returns 
 */
export const JRangeWxDoT = ({ data }) => {

    const [sortBy, setSortBy]   =   useState(-7); // + means greates to smalles, and - sorts from smallest to greatest.

    const rows = useMemo(()=>{

        const out = [];
        const dids = data.jrange.days?.flatMap( day=>day.did.map( eblock=>({ ...eblock, ymd:day.on })) );

        // for each exercise
        data.jrange?.exercises?.forEach( exercise =>{

            //all the sets type>0
            const sets =  dids.filter( did=>did.eid==exercise.id)
                                .flatMap( did=>did.sets?.filter( set=>set.type>0 ).map( set=>({ ...set, exercise, ymd:did.ymd })) );
       
            if( sets.length )
            { 
                // values per column 
                out.push(COLUMNS.map( column=> sets.length==1? column.reduce(sets[0]) : sets.reduce( column.reduce ) ));
            }

        });  

        return out;

    },[data]); 

    const sorted = useMemo(()=>{

        const i = Math.abs(sortBy) - 1;

        const arr = rows.sort((a,b)=>{
            const sorter = COLUMNS[i].sort;
            const result = sorter(a[i],b[i]);
            return result;
        });

        if( sortBy<0 ) 
            arr.reverse();

        return arr;

        
    },[sortBy, rows]); 
 
    if(!rows.length) return <NothingHere title="No data" description="No exercise using time or distance was used in this period."/>

    return (<TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                { COLUMNS.map( (column,i)=> <TableCell key={column.label}>
                                            <TableSortLabel active={ Math.abs(sortBy) == i+1 } direction={sortBy<0? "desc" : "asc"}
                                            onClick={()=>setSortBy( Math.abs(sortBy) == i+1 ? -sortBy : i+1 )}
                                            > {column.label} </TableSortLabel>
                                        </TableCell> ) } 
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((row,i) => (
                <TableRow key={i}> 
                  { COLUMNS.map( (column, columnIndex)=> <TableCell key={columnIndex}>{ column.render(row[columnIndex]) }</TableCell> ) }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
}