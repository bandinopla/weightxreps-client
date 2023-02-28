import { useContext, useMemo, useState } from "react";
import { JOwnerContext } from "../../pages/journal-context";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PaletteIcon from '@material-ui/icons/Palette';
import { Box, Checkbox, Typography, useTheme } from '@material-ui/core';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import { colorPaletteForChart } from "../../utils/getColorPaletteForChart";
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { date2NiceString, dateToYMD, ymd2date } from "../../utils/utils";
import { UTagValue } from "../../user-tags/UTagValue";
import TagTypeChip from "../../user-tags/TagTypeChip";

export function JRangeUTags({ data:jeditorRangeQueryData, from, to, sundays, onClickX  }) {
 
    const data                                  = jeditorRangeQueryData?.jrange?.utags;  
    const theme                                 = useTheme();
    const [selectedTagIds, setSelectedTagIds]   = useState([])
    const tableRowsData                         = useMemo( ()=>{
        
        if(!data ) return;

        let getColor = colorPaletteForChart(); 
        
        //#region CALCULATE DEFAULT TYPE OF EACH TAG
        //
        // find the "type" most used per each tag to know what type to use as default for the agregated values
        // 

        /** 
         * @param {[UTagValue]} values 
         * @returns {string}
         */
        const getDefaultType = values => values.reduce( (map, val)=>{
 
            let type        = val.type;

            let counter     = map[type];

            if( !counter )
            {  
                map[type] = 1; 
            }
            else 
            {
                map[type] = counter + 1;
            } 

            //
            // the type most used in "values"
            //
            map['__defaultType'] = Object   .keys(map)
                                            .filter(k=>k!=='__defaultType')
                                            .reduce( (prevKey, currKey)=>map[prevKey]>map[currKey]?prevKey:currKey )
 

            return map;

        } ,new Map())['__defaultType'];


        //#endregion 

        /**
         * @type {[UTagValue]}
         */
        let values = data.values.map( tval=>new UTagValue(tval) );


        let unchartableCount = 0;
        const unchartableStartPercent = 0.1;
        const unchartablePercentIncrease = 0.03;
 
 
        //
        // each tag can have diferent types....  SQUAT:RPE   SQUAT:TIME
        //
        return data.tags

                        //
                        // Separate tags based on the type of data that their LineGraph will plot. 
                        // because a TAG can have the same name and store diferent types of values, so one line chart per type of compatible data should be used.
                        //
                        .reduce((out, utag)=>{
  
                            //
                            // utag values of this utag
                            //
                            const utagValues    = values.filter(v=>v.tagid==utag.id)
                                                        

                            //
                            // unique base types used
                            //
                            const baseTypesUsed = [ ...new Set( utagValues.map(v=>v.baseType)) ]

                            console.log("BASE TYPES", baseTypesUsed)

                            return [
                                ...out,

                                //
                                // one tag per baseType variation
                                //
                                ...baseTypesUsed.map( baseType=>(
                                    {
                                        ...utag,
                                        baseType,
                                        canBeCharted: utagValues.find( tval=>tval.baseType==baseType ).canBeCharted(),

                                        //
                                        // values of this utag & baseType
                                        //
                                        values: utagValues.filter( tval=>tval.baseType==baseType )
                                }) )
                            ]

                        },[])
        
                        //
                        // for each utag....
                        //
                        .map( utag=>({ 

                            ...utag     , 

                            defaultType : getDefaultType( utag.values ),            //<-- type to be used for aggregated values
                            days        : new Set(utag.values.map(v=>v.ymd)).size,  //<-- number of days in which it was applied
                            fakePercent : utag.canBeCharted? 0 : unchartableStartPercent + unchartablePercentIncrease*(unchartableCount++),
                            
                            color       : getColor(), 

                            minmaxVals  : utag.canBeCharted && utag.values .reduce( (out, val, i)=>{
 
                                                        if( i==0 )
                                                        {
                                                            return { min:val, max:val }
                                                        }
                                                        else 
                                                        {
                                                            out.min = val.numValue < out.min.numValue? val : out.min;
                                                            out.max = val.numValue > out.max.numValue? val : out.max; 

                                                            return out;
                                                        }  

                                                      },{})
                        }))


                        .map( tdata=>({
                            ...tdata,

                            totalVal    : tdata.canBeCharted && tdata.values.reduce( (A, B) => A.add( B, tdata.defaultType)  ), 

                            graphSerie  : tdata.values.map( val=>({
                                                                    tagValue: val,
                                                                    percent:  

                                                                            //
                                                                            // normal value
                                                                            //
                                                                            tdata.canBeCharted ?
                                                                                    val.numValue==tdata.minmaxVals.max.numValue? 1 
                                                                                    : 
                                                                                    (
                                                                                        val.sub(  tdata.minmaxVals.min, tdata.defaultType ).toNumber() 
                                                                                        /
                                                                                        tdata.minmaxVals.max.sub( tdata.minmaxVals.min, tdata.defaultType ).toNumber() 
                                                                                    ) 
                                                                            :

                                                                            //
                                                                            // fix the line in a nice position on the graph and increase the Y position a bit
                                                                            // so they stack up on top of each other so it's easyer to see them even if they share
                                                                            // the same day
                                                                            //
                                                                            tdata.fakePercent
                                                                            
                                                                            ,

                                                                    time: ymd2date( val.ymd ).valueOf()
                                                            }))
                        }))

        },[data] );
 
    const [ filteredData, renderChart ] = useMemo(()=>{

        let series = tableRowsData?.filter( data=>!selectedTagIds.length || selectedTagIds.indexOf(data.id)>-1 )
        let renderChart = series?.some(serie=>serie.days>1);

        return [ series, renderChart ]
        
    },[tableRowsData, selectedTagIds])


    const tableColumns = useMemo(()=>[
        {
            label:"",
            value : row =>{
                const Icon = row.values[0].$type.icon;
                return <Icon style={{color:"#555"}}/>
            } // 
        },
        {
            label:"Type",
            align: "left",
            value: row =><TagTypeChip type={row.values[0].$type.dataTypeDesc}/>
        },
        {
            label:"Name",
            value: row=><span> {row.automatic && <strong>(auto)</strong>} { row.name }</span> 
        },
        {
            label:"Days",
            value: row=>row.days
        },
        {
            label:"Min",
            value: row=>row.canBeCharted ? row.minmaxVals.min.toView() : "---"
        },
        {
            label:"Max",
            value: row=>row.canBeCharted ? row.minmaxVals.max.toView() : "---"
        },
        {
            label:"Avg",
            value: row=>row.canBeCharted ? <div style={{ whiteSpace:"nowrap"}}>~{  row.totalVal.div(row.days).toView() }</div> : "---"
        }
    ],[]);


    const toggleSelectAll = ()=>{
        if( selectedTagIds.length<tableRowsData.length )
        {
            setSelectedTagIds( tableRowsData.map(row=>row.id) )
        } 
        else 
        {
            setSelectedTagIds([]);
        }
    }

    const onSelectRow = tid=>{

        if( selectedTagIds.indexOf(tid)<0 ) 
        {
            setSelectedTagIds([ ...selectedTagIds, tid ]);
        }
        else 
        {   
            setSelectedTagIds( selectedTagIds.filter(_tid=>_tid!=tid) );
        }
    }


    if(!data ) return "";

 

    return (<>

                {renderChart && 
                <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer >
                        <ComposedChart data={ [ ] } onClick={ onClickX }> 
                        <CartesianGrid strokeDasharray="2 1" vertical={false} stroke={theme.backgroundColorOnTop}/>
                            <XAxis dataKey="time" 
                                    scale="time" 
                                    domain={[ from, to]} 
                                    type="number" 
                                    tickFormatter={ x => dateToYMD( new Date(x) ) }  
                                    stroke={theme.palette.text.primary}
                                    />

                            <YAxis yAxisId="left" padding={{ top: 10 }} domain={[0,1]} stroke={theme.palette.text.primary}/> 

                            { sundays.map( (x,i)=><ReferenceLine key={i} yAxisId="left" x={x} strokeWidth={2}  stroke={theme.referenceLineColor}/> )}
                             
                            <Tooltip content={<CustomTooltip selectedTagIds={selectedTagIds} series={tableRowsData}/>} />
                             
                            { filteredData
                                            .map( tag=><Line type="monotone"
                                                                dataKey="percent"
                                                                yAxisId="left"
                                                                name={tag.tagName}
                                                                key={tag.id}
                                                                data={ tag.graphSerie }
                                                                connectNulls
                                                                stroke={tag.color} 
                                                                strokeWidth={2}
                                    ></Line> ) } 

                                    
                        </ComposedChart> 
                    </ResponsiveContainer> 
                </div>
                } 
                <TableContainer component={Paper}>
                <Table size="small" padding="none"> 

                    <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={ selectedTagIds.length > 0 && selectedTagIds.length < tableRowsData.length }
                                checked={ selectedTagIds.length == tableRowsData.length }
                                onChange={toggleSelectAll} 
                            />
                        </TableCell>
                        <TableCell padding="checkbox">
                            <PaletteIcon/>
                        </TableCell> 

                        { tableColumns.map( (col,i)=>(<TableCell key={col.label} align={ col.align ?? "center"}>
                                {/* <TableSortLabel active={ true }
                                                direction={ "asc" } 
                                                >{ col.label }</TableSortLabel> */}
                                                { col.label }
                        </TableCell>))}
                        
                    </TableRow>
                    </TableHead>


                    <TableBody>
                    {
                    
                    tableRowsData 

                    .map((row, i) => (
                        <TableRow key={i} hover onClick={(event) => onSelectRow(row.id)}>
                            <TableCell  padding="checkbox">

                                <Checkbox
                                checked={selectedTagIds?.indexOf(row.id)>-1} 
                                />

                            </TableCell>
                            <TableCell padding="checkbox">
                                <StopRoundedIcon style={{ color:row.color }}/>
                            </TableCell> 


                        {tableColumns.map( col=>{
                        

                            return <TableCell key={col.id} align={ col.align ?? "center"}>

                                    { col.value(row) }

                                </TableCell>} )}

        


                        </TableRow>
                    ))}
                    </TableBody>

                </Table>
                </TableContainer>
        </>
      );
}


const CustomTooltip = ({ active, payload, label, selectedTagIds, series }) => {
 
    if (active && payload) 
    {
        const rows      = []; 

        series
        .filter( s=>!selectedTagIds.length || selectedTagIds.indexOf(s.id)>-1 )
        .forEach( serie=>{

            //
            // can be many points in the same day. For example if you redeclare the same variable with diferent values on the same day
            //
            const datum = serie.graphSerie.filter(d=>d.time==label);

            if(!datum.length) return;  

            datum.forEach( _datum=>rows.push({
                                            name        : serie.name,
                                            color       : serie.color,
                                            valueNode   : _datum.tagValue.toView(),
                                            typeOfData  : _datum.tagValue.$type.dataTypeDesc,
                                            Icon        : <_datum.tagValue.$type.icon/>
                                        }) ); 
        } );

        return (
            <Paper elevation={3}>
              <Box padding={1} border="3px solid #444">
                  <Typography variant="h6">{ date2NiceString( new Date(label) ) }</Typography> 
              <TableContainer component={Paper}>
                <Table size="small" padding="checkbox">
                  <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                                <PaletteIcon/>
                            </TableCell> 
                            <TableCell></TableCell>
                            <TableCell>Type</TableCell>

                          <TableCell>Name</TableCell>
                          
                          <TableCell>Value</TableCell> 
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      { rows.map( row=><TableRow key={row.name}>

                        <TableCell padding="checkbox">
                                <StopRoundedIcon style={{ color:row.color }}/>
                            </TableCell> 

                            <TableCell align="right"> 
                            { row.Icon }
                          </TableCell>

                          <TableCell align="left"> 
                            <TagTypeChip type={row.typeOfData}/>
                          </TableCell>

                          <TableCell component="th" scope="row" style={{maxWidth:200}} className="oneline">
                                { row.name }
                          </TableCell>

                          
                          <TableCell>{row.valueNode}</TableCell>
                           
                      </TableRow> ) }
                  </TableBody>
                </Table>
              </TableContainer>
              </Box>
            </Paper>
          ); 
    }

    return null;
}