
/**
 * una serie por aspect:
 *      - volume : gruesa
 *      - INT: normal
 *      - EFF: dashed
 *      - PR: puntito
 */

import { useMemo, useState, useContext  } from "react" 
import { date2NiceString, dateToYMD, ymd2date } from "../../utils/utils"; 
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, ReferenceLine } from 'recharts';
import { Box, Button, ButtonGroup, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import Ename from "../ename";
import WeightValue from "../weight-value";
import { JOwnerContext } from "../../pages/journal-context";
  
  


/**
 * 
 * @param {{ eid2color:(eid:number)=>string }} param0 
 * @returns 
 */
export const JRangeGraph = ({ data, eid2color, selectedEids })=>{

    const jowner = useContext(JOwnerContext);

    const [aspectsON, setAspectsON] = useState([0,1,2]); //<--- initial selection. Index de aspects ON
    
    const aspects = useMemo(()=>[
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
            customDot: true,
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
        },

    ], [data]); //-- data como dependencia porque internamente uso un array para tener las series separadas.


    const series = useMemo( ()=>{  
 
        const eid2serieData = new Map();  

        //
        // ir dia por dia y generar una serie por aspecto.
        //
        return data?.jrange?.days.reduce( (seriesOut, day)=>{

            const date = ymd2date(day.on,true);  

            //
            // por cada erow done in this day...
            //
            day.did 

            .forEach( erow=>{

                // EID del erow
                const eid = erow.e.id;

                //
                // por cada ASCPETO...
                //
                aspects.forEach( aspect=>{

                    if( !aspect.eid2serie ) aspect.eid2serie = new Map();

                    var isNew = !aspect.eid2serie.has( eid );  

                    var serie = aspect.eid2serie.get( eid ) || {   

                        label   : erow.e.name+" :: "+aspect.label,  
                        line: {
                          stroke  : "#"+eid2color.get(eid),  
                          ...aspect.line
                        },
                        e       : erow.e,
                        aspect  ,
                        data    :[], 
                    }; 

                    //
                    // agregar la serie si no lo hicimos ya...
                    //
                    isNew && seriesOut.push( serie ); 
                    isNew && aspect.eid2serie.set( eid, serie );

                    //
                    // acumular la data para esta serie/aspect...
                    //
                    const oldDatum  = serie.data.slice(-1)[0]; 
                    const overwrite = oldDatum?.date==day.on;

                    const datum = {
                        date  :day.on,
                        value : aspect.getDayValue( overwrite? oldDatum.value : null, erow ),
                        pr    : aspect.customDot && erow.pr,
                        inlb  : erow.lb,
                        aspect, 
                        e     : erow.e
                    } 

                    if( !datum.value )
                    {
                        return;
                    }

                    //
                    // se agrega un EID:Datum por día.
                    //
                    if( overwrite )
                    {
                        oldDatum.value = datum.value;
                        oldDatum.pr = oldDatum.pr || datum.pr;
                    }
                    else 
                    {
                        serie.data.push( datum );
                    }


                }); 

            } );


            return seriesOut;
        } ,[]); 

    },[data]);
 
    /**
     * Filtramos "series" acorde a los "selectedEids"
     */
    const filteredSeries = useMemo( ()=>{
      
      var lastDay;
      const _series = series.slice(0);

      //
      // crear serie de "workout days"
      // es la data para el "Bar" chart que indica qué días se entrenó y cuáles no.
      // :: agrega la serie en el item [0] de "series"
      //
      data?.jrange?.days.forEach( (day)=>{

          const repsDoneOnThisDay = day.did.reduce( (total, erow)=>selectedEids.indexOf(erow.e.id)>-1? total+erow.r*erow.s : total ,0);

            // chequear si esta en el seelected...
            if( repsDoneOnThisDay == 0 )
            {
              return;
            }

            const date = ymd2date(day.on,true); 

            //#region DAYS SERIE
            //
            // first time running!
            //
            if( !lastDay )
            {
              lastDay = date; //fecha del dia...

              //
              // esta serie es para representar los workouts y para tener ordenado el eje X
              //
              _series.unshift({
                label:"Total Reps",
                line: {
                  yAxisId:"left",
                },
                data: [{
                  date:day.on,
                  value: repsDoneOnThisDay
                  , sunday: date.getDay()==0
                }]
              })
            }
            else 
            {
                // completar la serie 0 con los dias sin workout...
                var d = new Date( lastDay.valueOf() );
                    d.setDate( d.getDate()+1 );

                while( d.valueOf()<date.valueOf() )
                {
                    _series[0].data.push({
                    date: dateToYMD(d),
                    value: 0
                    , sunday: d.getDay()==0
                  });

                  d.setDate( d.getDate()+1 );
                }

                _series[0].data.push({
                  date: dateToYMD(date),
                  value: repsDoneOnThisDay
                  , sunday: date.getDay()==0
                });

                lastDay = date; 
            }
            //#endregion 

            // calcular las reps que hizo ese día...
      }); 
      
      //
      // nos quedamos con la primera (la de los working days) y las que sean de este eid.
      //  
      return _series.filter( (serie, i)=> i==0 || selectedEids.indexOf(serie.e.id)>-1 );
    
    
    },[series, selectedEids] )
    
    const filteredSeriesByAspect = useMemo( ()=>filteredSeries.filter( (serie,i)=>i==0 || aspectsON.indexOf( aspects.indexOf(serie.aspect) )> -1 )  
                                    ,[filteredSeries, aspectsON])

    
    const toogleAspect = i => {
        const isON = aspectsON.indexOf(i)>-1;

        if( isON )
        {
            if( aspectsON.length==1 ) return;
            setAspectsON( aspectsON.filter(y=>y!=i) );
        }
        else 
        {
            setAspectsON([ ...aspectsON, i ]);
        } 
    };

    const handleChartClick = (data, index) => {
        jowner.gotoYMD( data.activeLabel )
    }
 
   
      return (<div >
 
        <ButtonGroup color="primary">
            { aspects.map((_mode,i)=>(<Button key={_mode.label} onClick={()=>toogleAspect(i)} variant={aspectsON.indexOf(i)>-1?"contained":"outlined"}>{_mode.label}</Button>)) } 
        </ButtonGroup>

        <Box padding="10px 0">

        <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer >
                  <ComposedChart 
                    data={ [] } 
                    onClick={handleChartClick}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >  

                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
                   
                    <YAxis yAxisId="left"/> 
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip  content={<CustomTooltip aspects={aspects} aspectsON={aspectsON}/>}/> 

                 
                    { filteredSeriesByAspect[0].data.filter( day=>day.sunday).map( sunday=>(<ReferenceLine  strokeWidth={1}  yAxisId="left" data={ filteredSeriesByAspect } isFront={false} x={sunday.date}  stroke="#ddd" />) )  } 
                        


                    { filteredSeriesByAspect.map( (serie,i)=>{
                    
                              if( i==0 )
                              { 
                                return <Bar { ...serie.line } name={serie.label} key={serie.label}  data={ serie.data } dataKey="value" barSize={20} fill="#ccc" />
                              }
                     
                              return <Line  { ...serie.line }
                                            type="monotone"
                                            dataKey="value" 
                                            name={serie.label} 
                                            key={serie.label}
                                            data={ serie.data }  
                                            connectNulls
                                            dot={serie.line.dot!==false? CustomizedDot : false}
                                            
                                        />} ) }
                </ComposedChart>
                </ResponsiveContainer>
                </div>
                </Box>

                <Box padding={3}>
                    <Grid container
                        direction="row"
                        justifyContent="space-around"
                        alignItems="center">
                        <Grid>
                            <div style={{ display:"inline-block", borderTop:"8px solid #666", width:110}}></div> <br/>Volume
                        </Grid>
                        <Grid>
                            <div style={{ display:"inline-block", borderTop:"3px solid #666", width:110}}></div> <br/>Int (Heavyest)
                        </Grid>
                        <Grid>
                            <div style={{ display:"inline-block", borderTop:"3px dashed #666", width:110}}></div> <br/>Eff (~1RM)
                        </Grid>
                    </Grid>
                </Box>
       </div>);
}


/**
 * Dot que ponemos si hay un PR
 */
const CustomizedDot = (props) => {
    const { cx, cy, stroke, payload, value } = props; 
  
    if (payload.pr) {
      return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill={stroke} viewBox="0 0 1024 1024">
          <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
        </svg>
      );
    }
  
    //
    // default dot
    //
    return <svg x={cx - 5} y={cy - 5} width={10} height={10} fill={stroke} viewBox="0 0 100 100">
      <line x1="50" y1="0" x2="50" y2="200" style={{stroke, strokeWidth:30}}/>
    </svg>;
  };



const CustomTooltip = ({ active, payload, label, aspects, aspectsON }) => {

  if (active && payload && payload.length>1) { 

    //payload[].payload == el DATUM de la serie. /  payload[].color (el color)
    const day = ymd2date( label );
    const toggledAspects = aspects.filter( (_,i)=>aspectsON.indexOf(i)>-1 );

    // obtener las columnas de la tabla...
    const rows      = [];
    const eid2row   = new Map();

    payload.forEach( (p,i) => { 

        if( i==0 ) return;

        const eid = p.payload.e.id; 

        //
        // crear la fila para este Exercise 
        //
        if( !eid2row.get(eid) )
        {
            var row = [ p.payload.e, ...toggledAspects.map(a=>0) ];
            eid2row.set(eid, row); //CERO en todos los valores de los aspects...
            rows.push( row );
        }

        //
        // ir completando las columnas de esta fila..
        //
        toggledAspects.some( (aspect,i)=>{
            if( p.payload.aspect==aspect )
            {
                eid2row.get(eid)[i+1] = p.payload; //<--- { value, inlb }
                return true; // breaks the loop
            }
        } ); 
        
    });

    return (
      <Paper elevation={3}>
        <Box padding={1} border="3px solid #444">
            <Typography variant="h6">{ date2NiceString(day) }</Typography>
            <Typography variant="subtitle1"><strong>{payload[0].value}</strong> total <strong>reps</strong></Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Exercise</TableCell>
                    { toggledAspects.map( aspect=><TableCell key={aspect.label} align="right">{aspect.label}</TableCell> ) }
                </TableRow>
            </TableHead>
            <TableBody>
                { rows.map( row=><TableRow key={row[0].id}>
                    <TableCell component="th" scope="row" style={{maxWidth:200}} className="oneline">
                        <Ename {...row[0]}/>  
                    </TableCell>
                    { toggledAspects.map( (aspect,i)=><TableCell align="right">
                        <WeightValue value={row[i+1].value} inkg={!row[i+1].inlb}/>
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