import { Box, Button, Divider, Paper, Typography } from "@material-ui/core";
import { useContext, useMemo, useState } from "react";
import { useGetJRangeQuery } from "../../data/generated---db-types-and-hooks";
import { JOwnerContext } from "../../pages/journal-context";
import { date2NiceString, dateToYMD, ymd2date } from "../../utils/utils";
import { JDayContentHeader, JDayHeaderSkeleton } from "./jday-header";
import JRangeTable from "./jrange-table";
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from "@material-ui/lab";
import { parseError } from "../../data/db";
import { JEditorButton } from "./editor-button";
import { colorPaletteForChart } from "../../utils/getColorPaletteForChart";
import { JRangeSetsChart } from "./jrange-chart";
import { JRangeUTags } from "./jrange-utags";
import { StaticLogHighlighter } from "../../codemirror/LogTextEditor";
import { getExampleUTagsLog } from "../../codemirror/tag-parsing";
import { TAG_PREFIX } from "../../user-tags/data-types"; 
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import TimerIcon from '@material-ui/icons/Timer';
import { JRangeWxDoT } from "./jrange-WxDoT";
import { NothingHere } from "../nothing-here-alert";

/**
 * Componente que rendea la pagina de STATS de un "jrange"
 */
export default function JRange({ match:{ params } }) {

    const jowner                = useContext(JOwnerContext);  
    const range                 = Number( params.range.substr(1));
    const  ymd                  = params.ymd;
    const niceDate              = useMemo(()=>date2NiceString(ymd2date (ymd)) ,[ ymd ]);
    const [tab, setTab]         = useState(0);

    const { data:rawData, error, loading }        = useGetJRangeQuery({ variables: {
      uid   : jowner.id ,
      ymd,
      range 
    } }) 


    const handleTabChange = (event, newValue) => setTab(newValue);

    //
    // DETECCION DE TAGS!
    // crear items por agrupacion.
    //
    const data = useMemo(()=>{
 

      if( rawData?.jrange?.days )
      { 
          // TAG -> Exercise
          const tag2exercise    = new Map();

          // EID -> [ eTag, eTag, ... ]
          const eid2tags        = new Map();

          // EID -> Exercise
          const eid2e           = new Map(); /*--->*/ rawData.jrange.exercises.forEach( e=>eid2e.set(e.id, e) );
 
           
          //
          // CREAR**
          // ir dia por dia para identificar exercises que usen TAGS y crear un nuevo "exercise" que
          // represente ese grupo.
          //
          var days = rawData.jrange.days.map( day => {
 
            var did = day.did
            
            //
            // here we "open" up the eblocks and put all sets into the "did" array...
            //
            .reduce( (sets, eblock)=>{

                const e = eid2e.get(eblock.eid);

                eblock  .sets.filter(set=>set.type==0) // only Weight x Reps type of sets...
                        .forEach( set=>sets.push({ ...set, e }) ); //<--- add reference to the exercise.

                return sets;
            } ,[])

            //
            // Create "fake" exercises representing the agrupations per tag. So all exercises with a specific tag will create a
            // new exercise with the name of that tag to aggregate all the set's data.
            //
            .reduce( (out, erow)=>{  

              //
              // si es "official" siempre se asume el tag implicito del "type"
              //
              const ename = erow.e.name + (erow.e.type? " #"+erow.e.type:""); 
        

              //
              // extraer los tags de este exercise...
              //
              const tags = eid2tags.get(erow.e.id) || ename.match(/(#\w+)/gi)?.reduce( (_tags, _tag)=>{

                

                _tag = _tag.toLowerCase(); 

                //
                // prevent adding the same tag more than once......... -_-
                //
                if( _tags.find(t=>t.id==_tag) )
                {
                    return _tags;
                }

                //
                // creamos un "fake" exercise para cada TAG
                //
                if( !tag2exercise.has(_tag) ) 
                {
                    const newTag = { id:_tag, name:_tag, isTag:true, eids:[ erow.e ], type:_tag };

                    tag2exercise.set(_tag, newTag);
                    _tags.push( newTag );
                }
                else 
                {
                  let tagExercise = tag2exercise.get(_tag);

                    _tags.push( tagExercise );
                    
                    if( tagExercise.eids.indexOf(erow.e)<0 )
                    {
                        tagExercise.eids.push(erow.e);
                    }
                }

                //
                // relacionamos el EID con sus TAGS
                //
                if( !eid2tags.has(erow.e.id) ) 
                {
                  eid2tags.set(erow.e.id, _tags);
                }

                return _tags;

              } ,[]);  

              //
              // If this exercise was tagged, add this set as part of that "group"
              // this will allow us to group stats of diferent exercises into a single group.
              //
              tags?.forEach( tag=>{
 
                out.push({
                  ...erow,
                  e: tag  //<<------- el TAG es el "exercise"
                });

              });

              //
              // the set as is...
              //
              out.push(erow);

              return out;

            } ,[]); 


            return {
              ...day,
              did
            }
          });
 
          //#region  REMOVE GROUPS WITH ONLY 1 ITEM
          days.forEach( day=>{
                day.did = day.did.filter( did=>!did.e.isTag || did.e.eids.length>1 )
          })
          //#endregion


          return {
            jrange: {
              ...rawData.jrange,
              days
            }
          }
      }
      else 
      {
        return rawData;
      }

    },[rawData]);


    const { from, to }                          = useMemo(()=>(rawData?.jrange && ({
        from: ymd2date( rawData?.jrange.from ).valueOf(), 
        to  : ymd2date( rawData?.jrange.to ).valueOf()
    })) || {},[rawData]);


    //
    // to be used by reference lines to visualize each sunday in the range
    //
    const sundays = useMemo(()=>{

        const startValue = from;
        const endValue = to;
        const sundays = [];
        const start = new Date(startValue);
        const end = new Date(endValue);
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

        // Get the Sunday for the start date
        let sunday = new Date(start);
        sunday.setDate(sunday.getDate() + (7 - sunday.getDay()) % 7);

        // Iterate over all the Sundays between the start and end dates
        while (sunday <= end) {
            sundays.push(sunday.valueOf());
            sunday.setTime(sunday.getTime() + 7 * oneDay);
        }

        return sundays;

    },[from, to])


    const removeZoom = ev => jowner.gotoYMD(ymd);  

    /**
     * los EIDs seleccionados
     */
    const [selectedEIDs, setSeletedEIDs] = useState([]);

    /**
     * @type {Map<number, string>}
     */
    const eid2color       = useMemo( ()=>{ 

                                    let getColor = colorPaletteForChart();
        
                                    return data?.jrange?.days.reduce( (map, day)=>{

                                                //
                                                // acumular el volume de cada eid. (el mas volumen es el mas importante...)
                                                // 
                                                day.did.forEach( erow=> {

                                                  const eid       = erow.e.id;
                                                  let found       = map.find(i=>i[0]==eid);
                                                  let accumulator = found || [eid, 0, erow.e.type? 10000 : 1];
                                                      accumulator[1] += erow.w*erow.r*erow.s;
                                                      !found && map.push(accumulator);
                                                });

                                                return map;

                                      } , [] ) 
 
                                      //
                                      // ordenar de mayo a menor volume. Dandole prioridad a los "official" exercises
                                      //
                                      .sort( (a,b)=>(b[1]*b[2])-(a[1]*a[2]) ) 

                                      //
                                      // asignar color
                                      //
                                      .reduce( (map, itm, i)=>{

                                                 map.set( itm[0], getColor().substr(1) ); //$colors[i] || $OTHER_COLOR
                                          return map;

                                      },new Map())

                                    },[data]); 

    /**
     * utility function para poder mantener un valor actualizado con el maximo. 
     */
    const ColWeight = (w,inlb)=>({
      w, inlb,
      setIfMax(w2, inlb2){
 
        if(  w2 > this.w )
        {
          this.w = w2;
          this.inlb = inlb2;
        }
        return this;
      }
    });
 
    /**
     * La data para la tabla. Si no hay data del server, es NULL.
     *    e:ID!
          w:Float!
          r:Float!
          s:Float!
        
          pr:Int # 0|1 si es PR o no
          est1rm:Float!
          eff:Float!
          int:Float!

     * @type {[{ exercise:{id:number, name:string, type:string},vol:number,reps:number, max:number, workouts:number }]}
     */
    const tableData = useMemo( ()=>data?.jrange?.days.reduce( (arr,day)=>{

      day.did

        // por cada "set" hecho (pueden ser de distinto eid)
        .forEach( erow=>{

        var row     = arr.find(itm=>itm.exercise.id==erow.e.id);
        const reps  = erow.r*erow.s;
        const vol   = Math.round(erow.w*reps); 

        if( row )
        {
            //acumular
            row.vol  += vol;
            row.reps += reps;
            
            row.max.setIfMax(erow.w, erow.lb); //Math.max( row.max, erow.w ); 
            row.maxe1rm.setIfMax(erow.est1rm, erow.lb); //Math.max( row.maxe1rm, erow.est1rm ); 

            row.maxINT    = Math.max( row.maxINT, erow.int ); 
            row.maxEFF    = Math.max( row.maxEFF, erow.eff );

            row.prs      += Number(erow.pr);

            if( row._lastDay!=day.on ) 
            {
                row.workouts++;
                row._lastDay = day.on;
            }

        }
        else 
        {
            arr.push({ exercise : erow.e, 
                        color   : eid2color.get(erow.e.id),
                        vol      , 
                        reps     , 
                        max       : ColWeight( erow.w, erow.lb ),
                        maxe1rm   : ColWeight( erow.est1rm, erow.lb ),
                        workouts  : 1,
                        maxINT    : erow.int,
                        maxEFF    : erow.eff,
                        prs       : Number(erow.pr),
                        _lastDay  : day.on //<-- usado para incrementar el "workouts"
                      });
        }

      });

      return arr;
    } ,[]) ,[data]);

 
    

    const onSelectRow = eid=>{
      if( selectedEIDs.indexOf(eid)<0 ) {
        setSeletedEIDs([ ...selectedEIDs, eid ]);
      }
      else 
      { 
        setSeletedEIDs( selectedEIDs.filter(_eid=>_eid!=eid) );
      }
    }

    const toggleSelectAll = ()=>{
      if( selectedEIDs.length<tableData.length )
      {
        setSeletedEIDs( tableData.map(row=>row.exercise.id) )
      } 
      else 
      {
        setSeletedEIDs([]);
      }
    }

    const onClickX = ev => { 

        const time = ev?.activeLabel;
        if( time )
        { 
            jowner.gotoYMD( dateToYMD( new Date(time) ) );
        } 
    }

    //
    // siempre seleccionar uno...
    //
    if( !selectedEIDs.length && tableData?.length )
    {
        setSeletedEIDs([ tableData[0].exercise.id ]);
    }

    if( loading ) {
      return <JDayHeaderSkeleton/>;
    }

    if( error ) { 
      return <Alert severity="error">{parseError(error)}</Alert>;
    }
 
    const days = data?.jrange?.days.length || 0;

    return <div>  
              <JDayContentHeader noData={!data.jrange} 
                                  title={ range+" weeks from "+niceDate } 
                                  noDataLabel="No workouts found on this period"
                                  titleChild={<div style={{float:"right", marginLeft:15}} >
                                                    { days>0 && <JEditorButton verb={ days>1?"Edit Days":"Edit" } ymd={ymd} range={range} variant="contained" color="primary" size="large" style={{marginRight:5}}/> }
                                                    <Button onClick={removeZoom} variant="outlined" size="large" ><CloseIcon/></Button>
                                             </div>}>
                      -- <strong>{ days }</strong> days with <strong>workouts</strong> found.
                </JDayContentHeader>

            { data.jrange && days==0 && <NothingHere title="No workouts" description="No workouts found on this period" />}

              { data.jrange && days>0 && <>  
                            <TabContext value={tab}>
                                <Paper>
                                    <Tabs
                                        value={tab}
                                        onChange={handleTabChange}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        centered
                                    >
                                        <Tab icon={<TrendingUpIcon/>} label="Weight x Reps" value={0}/>
                                        <Tab icon={<LocalOfferIcon/>} label="Custom Tags" value={1}/>
                                        <Tab icon={<TimerIcon/>} label="Time & Distance" value={2}/>
                                    </Tabs>
                                </Paper> 

                                <TabPanel value={0}>
                                    { tableData.length>0 && <> 
                                            <JRangeSetsChart selectedEids={selectedEIDs} data={data} from={from} to={to} eid2color={eid2color.get.bind(eid2color)} sundays={sundays}  onClickX={onClickX}/>
                
                                                {/*La tabla*/}
                                                <Box marginTop={1}>
                                                <JRangeTable selectedEids={selectedEIDs} onSelectAllClick={toggleSelectAll} onSelect={onSelectRow} data={tableData} />
                                                </Box>


                                                <br/>
                                                <Divider/>
                                                <br/>
                                    </>}  

                                    {
                                        tableData.length==0 && <NothingHere title="No data" description="No weight for reps workouts found in this period." />
                                    }
                                
                                </TabPanel>


                                <TabPanel value={1}>
                                { rawData?.jrange.utags?.values.length > 0 &&
                                    <>
                                    <Typography variant="h3">Custom Tags</Typography> 
                                    <Typography gutterBottom variant="subtitle1">During this period these are the <a href="/faq#user-tags">custom tags</a> that were defined:</Typography>
                                    <JRangeUTags data={rawData} from={from} to={to} sundays={sundays} onClickX={onClickX}/>  
                                    </> 
                                } 
                                </TabPanel>


                                <TabPanel value={2}>
                                    <JRangeWxDoT data={rawData}/>
                                </TabPanel>

                            </TabContext> 
                              
                                    

                                 
                              
              </>}
          </div>;
}
 
 