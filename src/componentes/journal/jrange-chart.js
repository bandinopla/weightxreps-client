import { Box, Button, ButtonGroup, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@material-ui/core";
import { useMemo, useState } from "react";
import { CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { date2NiceString, dateToYMD, ymd2date } from "../../utils/utils";
import Ename from "../ename";
import WeightValue from "../weight-value";

const aspects = [
    {
        label:"Reps",
        getDayValue : ( oldValue, erow ) => oldValue + erow.r*erow.s,
        line       : false
    },
    {
        label:"Volume",
        getDayValue : ( oldValue, erow ) => oldValue + erow.w*erow.r*erow.s,
        line       : { 
            bar:true,
            yAxisId:"right",
            strokeWidth: 5, 
            dot:false
        }
    },
    {
        label:"INT",
        getDayValue : ( oldValue, erow ) => Math.max( oldValue, erow.w ),
        line       : {
            yAxisId:"left",
            strokeWidth: 2
        }
    },
    {
        label:"EFF",
        getDayValue : ( oldValue, erow ) => erow.est1rm? Math.max( oldValue, erow.est1rm ) : null,
        line       : {
            yAxisId:"left",
            strokeWidth: 2,
            strokeDasharray:"3 3",
            dot:false
        }
    }
]

export function JRangeSetsChart({ data:jeditorData, from, to, selectedEids, eid2color, sundays, onClickX  }) {

    const theme     = useTheme()
    const data      = jeditorData?.jrange?.days;
    const [aspectsON, setAspectsON] = useState(aspects.map((_,i)=>i)); 
 

    const series    = useMemo(()=>{
         
        
        return data?.reduce((out, day)=>{ 


        const ymd       = day.on;
        const ymdToTime = ymd2date( ymd ).valueOf();
        

        day.did.forEach( set=>{ 
            
            aspects.forEach( aspect=>{

                let serieID = `${set.e.name} :: ${aspect.label}`;
                let serie   = out.find(s=>s.serieID==serieID);

                if( !serie )
                {
                    serie = {
                        serieID,
                        aspect,
                        eid: set.e.id,
                        color: aspect.line? eid2color(set.e.id) : null,
                        data:[]
                    }

                    out.push( serie );
                }

                let dayData = serie.data.find(d=>d.ymd==ymd);

                if( !dayData )
                {
                    serie.data.push( { 
                        value:aspect.getDayValue(0, set) 
                        , ymd
                        , ymdToTime
                        , aspect
                        , set  
                    } )
                }
                else 
                {
                    dayData.value = aspect.getDayValue( dayData.value, set ); 
                }
 

            }); 

        });

        return out;

    },[])},[data]); 

    //
    // filter the "series" by "selectedEIDs" and "aspectsON"
    //
    const filtered = useMemo(()=>series.filter( serie => selectedEids.indexOf( serie.eid )>-1 
                                                            && 
                                                         aspectsON.indexOf( aspects.indexOf(serie.aspect) )>-1 ) 
        ,[data, selectedEids, aspectsON])
 
    const toogleAspect = i => {
        const isON = aspectsON.indexOf(i)>-1;

        if( isON )
        {
            if( aspectsON.length==2 ) return; //---Porque el primer aspect "total reps" esta hidden
            setAspectsON( aspectsON.filter(y=>y!=i) );
        }
        else 
        {
            setAspectsON([ ...aspectsON, i ]);
        } 
    };

    return <div>

        <ButtonGroup color="primary">
            { aspects.filter((_,i)=>i>0) // ignore first aspect...
                     .map((_mode,i)=>(<Button key={_mode.label}  onClick={()=>toogleAspect(i+1)}  variant={aspectsON.indexOf(i+1)>-1?"contained":"outlined"}>{_mode.label}</Button>)) } 
        </ButtonGroup>
        
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
                <ComposedChart data={ [ ] } onClick={onClickX} > 
                    <CartesianGrid strokeDasharray="2 1" vertical={false} stroke={theme.backgroundColorOnTop}/>

                    {/* <XAxis dataKey="ymd" type="category" allowDuplicatedCategory={false}/> */}
                    <XAxis dataKey="ymdToTime" 
                                        scale="time" 
                                        domain={[ from, to ]} 
                                        type="number" 
                                        tickFormatter={ date => dateToYMD( new Date(date) ) } 
                                        stroke={theme.palette.text.primary}
                                         />

                    <YAxis yAxisId="left"  stroke={theme.palette.text.primary}/> 
                    <YAxis yAxisId="right" orientation="right" stroke={theme.palette.text.primary}/>

                    { sundays.map( x=><ReferenceLine yAxisId="left" x={x} stroke={ theme.referenceLineColor }/> )}

                    {/* <Tooltip cursor={{ stroke: 'red', strokeWidth: 2 }} /> */}
                    <Tooltip content={<CustomTooltip selectedEids={selectedEids} aspectsON={aspectsON} series={filtered}/>} />

                    {
                        filtered        .filter( serie=>serie.aspect.line )
                                        .map( serie=><Line 
                                                { ...serie.aspect.line }
                                                stroke={ "#"+serie.color }
                                                type="monotone"
                                                dataKey="value"
                                                name={serie.serieID}
                                                key={ serie.serieID}
                                                data={ serie.data }
                                                connectNulls  
                                                /> )
                    }

                </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
}

const CustomTooltip = ({ active, payload, label, selectedEids, aspectsON, series }) => {
    if (active && payload) 
    {  
        const rows      = []; // [ [{Exercise, Erow, Erow,... ], ... ]
        const eid2row   = new Map();

        series.forEach( serie=>{

            const eid           = serie.eid;
            const aspetIndex    = aspects.indexOf( serie.aspect ) ;
            const data          = serie.data.find( d=>d.ymdToTime==label );

            if(!data) return;

            //
            // crear la fila para este Exercise 
            //
            if( !eid2row.get(eid) )
            {
                var row = [ serie.data[0].set.e , ...aspectsON.map(a=>0) ];
                eid2row.set(eid, row); //CERO en todos los valores de los aspects...
                rows.push( row );
            }

            eid2row.get(eid)[ 1+aspectsON.indexOf(aspetIndex) ] = data;

        });

        return (
            <Paper elevation={3}>
              <Box padding={1} border="3px solid #444">
                  <Typography variant="h6">{ date2NiceString( new Date(label) ) }</Typography> 
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                      <TableRow>
                          <TableCell>Exercise</TableCell>
                          { aspectsON.map( aspectIndex=><TableCell key={aspects[aspectIndex].label} align="right">{aspects[aspectIndex].label}</TableCell> ) }
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      { rows.map( row=><TableRow key={row[0].id}>
                          <TableCell component="th" scope="row" style={{maxWidth:200}} className="oneline">

                              { row[0].isTag? <span>Tagged with <strong>{row[0].name}</strong> ({row[0].eids.length})</span> : <Ename {...row[0]}/> } 

                          </TableCell>
                          { aspectsON.map( (aspectIndex,i)=><TableCell align="right" key={aspectIndex}>

                              { i==0? <strong>{row[i+1].value}</strong>
                                :
                                <WeightValue value={row[i+1].value} inkg={!row[i+1].set.inlb}/>
                                }
                              

                          </TableCell> ) } 
                      </TableRow> ) }
                  </TableBody>
                </Table>
              </TableContainer>
              </Box>
            </Paper>
          ); 
    }
  
    return null;
  };