import { Box, Button } from "@material-ui/core";
import { useContext, useMemo, useState } from "react"; 
import { useGetJRangeQuery } from "../../data/generated---db-types-and-hooks";
import { JOwnerContext } from "../../pages/journal-context"; 
import { date2NiceString, ymd2date } from "../../utils/utils";
import { JDayContentHeader, JDayHeaderSkeleton } from "./jday-header";
import JRangeTable from "./jrange-table";
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from "@material-ui/lab";
import { parseError } from "../../data/db";
import { JRangeGraph } from "./jrange--chart";
import { JEditorButton } from "./editor-button";

//#region mock data
const mockEx        = [];
const someExercise  = ()=> {

    if( mockEx.length && Math.random()>0.2 )
    {
        return mockEx[ Math.floor(Math.random()*mockEx.length) ];
    }

    const eid = Math.round( Math.random()*1000 );
    var e = {
        id  : eid,
        name: "Exercise-"+eid,
        type: [null, null,"SQ", null, null, null, "BP", null, "DL"][  Math.floor(Math.random()*9) ],
        best: {
          ynt: 150+100*Math.random(),
          eff: 180+100*Math.random(),
        }
    }

    mockEx.push(e);
    return e;
}

/**
 * @type {[{ on:Date, did:[ {exercise:{id:number, name:String, type:string|null }, w:number, r:number, s:number } ] }]}
 */
const mockData = new Array(100).fill(0).map( _=>({
                        exercise:someExercise(),
                        w: 100+100*Math.random(),
                        r: 1+Math.floor(Math.random()*10),
                        s: 1+Math.floor(Math.random()*10),
                        when: new Date( new Date().valueOf()- Math.round(1814400000*3*Math.random()) ) 
                    }) )

                    //agrupar por fecha...
                    .reduce( (out, erow)=>{

                        let f = new Date(Date.UTC( erow.when.getFullYear(),erow.when.getMonth(),erow.when.getDate(), 0, 0, 0, 0  ));
                        let found = out.find( day=>day.on.valueOf()==f.valueOf() );
                        if(!found) {
                            found = { on:f, did:[] };
                            out.push(found);
                        }

                        found.did.push(erow);
                        return out;
                    } ,[]) 

                    .sort( (a,b)=>a.on-b.on )
                    ;
 
 

//#endregion


/**
 * Color para cuando haya mas ejerciciso que el numero de colores en la paleta oficial.
 */
const $OTHER_COLOR = "ccc";

/**
 * Paleta de colores del chart
 */
const $colors = ["e63946" ,"a8dadc","457b9d","1d3557","264653","2a9d8f","e9c46a","f4a261","e76f51"];


/**
 * Componente que rendea la pagina de STATS de un "jrange"
 */
export default function JRange({ match:{ params } }) {

    const jowner                = useContext(JOwnerContext); 
    //const changeUnitValue       = useReactiveSetting( session?.userSettings?.convertDisplayUnits ); 
    const range                 = Number( params.range.substr(1));
    const  ymd                  = params.ymd;
    const niceDate              = useMemo(()=>date2NiceString(ymd2date (ymd)) ,[ ymd ]);

    const { data:rawData, error, loading }        = useGetJRangeQuery({ variables: {
      uid   : jowner.id ,
      ymd,
      range 
    } }) //{ data:mockData };  


    //
    // DETECCION DE TAGS!
    // crear items por agrupacion.
    //
    const data = useMemo(()=>{

      if( rawData?.jrange?.days )
      { 
          // TAG -> exercise
          const tag2exercise    = new Map();

          // EID -> [ eTag, eTag, ... ]
          const eid2tags        = new Map();

          const eid2e           = new Map();

          rawData.jrange.exercises.forEach( e=>eid2e.set(e.id, e) );

          //
          // CREAR**
          // ir dia por dia para identificar exercises que usen TAGS y crear un nuevo "exercise" que
          // represente ese grupo.
          //
          var days = rawData.jrange.days.map( day => {

            //e : eid2e.get(erow.eid)
            var did = day.did
            
            .reduce( (sets, eblock)=>{

                const e = eid2e.get(eblock.eid);
                eblock.sets.forEach( set=>sets.push({ ...set, e }) );
                return sets;
            } ,[])

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
              // si hay TAGS
              //
              tags?.forEach( tag=>{
 
                out.push({
                  ...erow,
                  e: tag  //<<------- el TAG es el "exercise"
                });

              });


              out.push(erow);
              return out;

            } ,[]); 


            return {
              ...day,
              did
            }
          });

          //
          // DELETE** los TAGS creados si tienen solo 1 item en ellos...
          //
          //#region  quitar TAGS que agrupen 1 solo exercise
          const eids2remove = [];

          for (const [tag, eTag] of tag2exercise) {
            if( eTag.eids.length<2 )
            {
              //quitarlo!!
              eids2remove.push(tag);
            }
          }

          if( eids2remove.length )
          {
              days.forEach( day=>{
                day.did = day.did.filter( erow=>eids2remove.indexOf(erow.e.id)<0 );
              });
          }
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



    const removeZoom = ev => jowner.gotoYMD(ymd);  

    /**
     * los EIDs seleccionados
     */
    const [selectedEIDs, setSeletedEIDs] = useState([]);

    /**
     * @type {Map<number, string>}
     */
    const eid2color       = useMemo( ()=>data?.jrange?.days.reduce( (map, day)=>{

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

                                          map.set( itm[0], $colors[i] || $OTHER_COLOR  );
                                          return map;

                                      },new Map())

                                      ,[data]); 

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

    //
    // siempre seleccionar uno...
    //
    if( !selectedEIDs.length && tableData )
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

              { data.jrange && <>
                              

                              {/* El chart! 
                              <PieChart data={graphDataFiltered}/> 
                              */}

                              <JRangeGraph data={data} eid2color={eid2color} selectedEids={selectedEIDs} />
 
                              {/*La tabla*/}
                              <Box marginTop={1}>
                                <JRangeTable selectedEids={selectedEIDs} onSelectAllClick={toggleSelectAll} onSelect={onSelectRow} data={tableData} />
                              </Box>
              </>}
          </div>;
}
 
 