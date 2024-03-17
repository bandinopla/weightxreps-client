import {
    makeVar,
    useReactiveVar
} from "@apollo/client";
import { IconButton } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import { makeStyles } from '@material-ui/core/styles';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useGetCalendarDaysQuery } from '../data/generated---db-types-and-hooks';
import { JOwnerContext } from '../pages/journal-context';
import { ymd2date } from '../utils/utils';
import { AsciiSpinner } from './ascii-spinner';
import { useGetSession, useReactiveSetting } from "../session/session-handler";
import DownArrow from '@material-ui/icons/ArrowDropDown';
import UpArrow from '@material-ui/icons/ArrowDropUp';


const LEFT_ICON     = SkipPreviousIcon;
const RIGHT_ICON    = SkipNextIcon;
const LEFT_FF_ICON  = FastRewindIcon;
const RIGHT_FF_ICON = FastForwardIcon;
const LOCK_ICON_OFF     = LocationSearchingIcon;
const LOCK_ICON_ON     = MyLocationIcon;



const useStyles = makeStyles( theme => ({
     
    root: {
        flex:1,
       "& > div": {
           float:"left"

           ,"& >div":{ 
               lineHeight:"25px",
               height:25,
               textAlign:"center", 
               //margin:1,
               fontSize:"0.9em",
               
           }
       },

       "& > .monthNames": {
           float:"none", 
           overflow:"hidden",
           //leftmargin:"10%"
       },

       "& .days": {
           width:"10%"
           ,"& >div":{ textAlign:"right ", paddingRight:5 }
       },

       "& .cell": { 
            background: theme.palette.background.default,//theme.calendario.cellM0BgColor ,
            filter: "invert(11%)",
            height:"100%",
            width:"100%"
            ,borderRadius:2

            , "&.m1": {
                //background: theme.calendario.cellM1BgColor
                filter: "invert(21%)",
            }
            ,"&.future": {
                fontStyle:"italic",
                opacity:0.33
            }
       },

       "& .hasData" : {
           background: theme.dataCell.background,  //theme.calendario.hasDataColor+ " !important",
           color:theme.dataCell.color,
           filter:"none !important"
       },
       

       "& .pinned": {
           background:theme.palette.primary.main + " !important",
           color:theme.palette.primary.contrastText+ " !important",
           filter: "none !important",
           animation:"pulse-animation 0.5s infinite ease-in-out"
       },

       "& .highlighted": {
            background:theme.palette.secondary.main + " !important",
            color: theme.palette.secondary.contrastText+ " !important",
            filter: "none !important",
            opacity:0.7,
             
            "&.hasData": {
                opacity:1
            }
       }
    },

    menu: {
        paddingLeft:"10%" ,
        "& svg": {
            color: theme.palette.text.primary
        }
    }
 
  }));
 

const TODAY         = new Date();
const HOY           = new Date().valueOf();
const calStatus     = makeVar(null);
const DayInMS       = 24 * 60 * 60 * 1000;

export default function({ ymd, rangeHighlight, widthInWeeks, onClickDay }) {

    const jowner    = useContext( JOwnerContext );
    const { userSettings }  = useGetSession(); 
    const firstDayOfWeek    = useReactiveSetting( userSettings?.firstDayOfWeek );  

    const changeFDOW = userSettings ? n => {
        console.log(userSettings?.firstDayOfWeek)
        userSettings?.firstDayOfWeek(n)
    } : null; 

    const $startDay = firstDayOfWeek || 0;
    const WEEKS     = widthInWeeks ?? 12;
    const DAYS      = 7; 
    const date      = ymd2date(ymd); //new Date( ymd.substr(0,4), Number(ymd.substr(5,2))-1, ymd.substr(8) ); 
    
    const pinnedDay                                 = date.valueOf();
    const pinnedKey                                 = date.getFullYear()*10000 + (date.getMonth()+1)*100 + date.getDate();
    const [ cursor, setCursor ]                     = useState( pinnedDay );  
    const range                                     = Number(rangeHighlight) * 7;
    var rangeDateStart                              ;

    if( range ) 
    {
        let d = new Date(pinnedDay);
            d.setDate( d.getDate()-range );
        rangeDateStart = d.valueOf();
    }

    const onClick = (dayKey, hasData) => {

        const ymd = dayKey.toString().replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3");

        if( onClickDay )
        {
            onClickDay( ymd, hasData )
            return;
        }
        
        jowner.gotoYMD( ymd  );
    }

    const calcRange = (center, leftOffset, rightOffset) => {
        let d = new Date();
            d.setTime(center);

        d.setDate( d.getDate()+Math.round(leftOffset) ); 

        //que el primer dia sea un domingo....
        d.setDate( d.getDate()-d.getDay() + $startDay );

        let from = d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); //d.valueOf();

        d.setDate( d.getDate()+ Math.abs(Math.round(leftOffset)) + Math.round(rightOffset) );

        d.setDate( d.getDate()+ ( 7 - d.getDay() + $startDay ) ); //y que termine un sabado

        let to = d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();

        return {
            from, to 
        }
    }; 

    const { loading, data, error, fetchMore}              = useGetCalendarDaysQuery({
                                                                variables   : {
                                                                    uid     :jowner.id,
                                                                    ...calcRange(cursor, -Math.round(WEEKS*DAYS*0.5),Math.round(WEEKS*DAYS*0.5))
                                                                } 
                                                            });

    const [cellProps, setCells]                           = useState( new Array(WEEKS*DAYS).fill(0) );

    const go = (dir)=>{  

            if( !dir || dir===0 )
            {
                setCursor(pinnedDay);
                return;
            }

            let step = 4;

            if( Math.abs(dir)>1 )
            {
                step = WEEKS;
                dir = dir>0? 1: -1;
            }

            let d = new Date();
                d.setTime(cursor);
                d.setDate( d.getDate() + 7*dir*step );

            setCursor( d.valueOf() ); 
    };


    useEffect(()=>{
        const focusCalendar = ()=>{ 
            go(0)
        };
        document.body.addEventListener("calendar:focus", focusCalendar);
        return ()=>document.body.removeEventListener("calendar:focus", focusCalendar);

    },[ymd]);
 
 
    
    useEffect( ()=>{ 

        if(!data) return;
 

        let d = new Date(cursor);
            ///d.setTime(cursor);
            d.setDate( d.getDate()+ Math.round(-(WEEKS*DAYS*0.5)) );  
            d.setDate( d.getDate()-d.getDay() + $startDay );  
  
            let firstWithNoData = 0;
            let lastWithNoData  = 0;
           
        //
        // armamos la grilla de la vista actual... 
        //
        setCells(  new Array(WEEKS*DAYS).fill(0).map((_,i)=>{
           
            let key         = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate() ;  

            //
            // hay data?
            //
            let isDefined   = data?.getCalendarDays.find( itm=>Math.floor(Number(itm)/10)==key) ;
            let hasData     = isDefined == (key*10+1).toString(); 
            let dayOfMonth  = d.getDate();
            let month       = d.getMonth();
            const showYear  = d.getFullYear() != TODAY.getFullYear() ? "'"+d.getFullYear().toString().substr(2) : null;
            let highlighted = d.valueOf()>rangeDateStart && d.valueOf()<pinnedDay;


            //
            // si no esta definido, marcar para luego cargar mas data...
            //
            if(!isDefined) {
                firstWithNoData = firstWithNoData || key;
                lastWithNoData  = key;
            }

            d.setDate( d.getDate()+1 );
            
            return {
                hasData,
                num: dayOfMonth,
                month, 
                showYear,
                pinned: key==pinnedKey,
                ymd:key,
                highlighted,
                isFuture: Math.floor( d.valueOf() / DayInMS)-1 > Math.floor(HOY / DayInMS)
            }
            
        } )); 

        //
        // data load....
        //
        let timer = setTimeout( ()=>{
            
            //
            // necesitamos cargar mas datos??
            //
            if( firstWithNoData>0 )
            {   
                //
                // sip. Nos falta data. Cargar mas!!
                // 
                calStatus({ loading:true });
                fetchMore({ variables:{ uid :jowner.id, from:firstWithNoData, to:lastWithNoData } })
                
                    .then(  calStatus, 
                            err=>calStatus({ error:true }) )
                ;
            } 
        
        } ,500 ); 

        return ()=>clearInterval(timer);
            
    } ,[data, ymd, cursor, rangeHighlight]); 


    //
    // esta cargando o todavía no se disparo el "useEffect" que llena el array cellProps
    //
    if( loading || cellProps[0]==0 ) //<-- el initial value...
    {
        return <AsciiSpinner label="Loading calendar..."/>;
    }

    return <div>  
                <CalendarGrid hasMoved={pinnedDay!=cursor} data={cellProps} weeks={WEEKS} days={DAYS} onClickMove={go} onClick={onClick} FDOW={ $startDay } onChangeFDOW={changeFDOW}/>  
                <CalendarLoadIndicator />
           </div>;
 

}



export function CalendarGrid({ data, hasMoved, weeks, days, onClickMove, onClick, FDOW, onChangeFDOW, cantSelectIfNoData }) {

    const classes = useStyles();
 
    var w           = 90/weeks; //90%...
    var d           = 0;
    
    
    var MONTHNAME = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    var DAYS        = ["","Mon","","Wed","","Fri",""];

    DAYS = DAYS.slice(FDOW) .concat(DAYS.slice(0, FDOW ));
 
    var monthNames  = useMemo(()=>{

        var currentMonth; 
        var _monthNames = [];

        /**
         * == calculando Month Names bar ==
         * agrego month name donde inicia el dia 1 de ese mes.
         * y solamente si hay al menos 2 slots libres (para que entre el texto del nombre)
         */
        data?.forEach( (d,i)=>{

            let column = Math.floor(i/7);  
            const namePostfix = d.showYear? " "+d.showYear : "";

            if( _monthNames.length==0 ) 
            { 
                currentMonth = { colSpan:1, name:MONTHNAME[ d.month ]+namePostfix, monthID:d.month, lastColumn:column };
                _monthNames.push(currentMonth); 
            }
            else 
            {
                if( d.month!=currentMonth.monthID )
                {
                    let newMonthColSpan = 1;

                    if( currentMonth.lastColumn==column )
                    {
                        currentMonth.colSpan--;
                        //newMonthColSpan++;
                    }

                    currentMonth = { colSpan:newMonthColSpan, name:MONTHNAME[ d.month ]+namePostfix, monthID:d.month, lastColumn:column };
                    _monthNames.push(currentMonth); 
                }
                else 
                {
                    if( currentMonth.lastColumn!=column ) {
                        currentMonth.lastColumn = column;
                        currentMonth.colSpan++;
                    }
                }
            }

        } );

        return _monthNames;

    },[data]);
 



    return <div className={classes.root}>

                <div className="monthNames">
                    <div style={{width:"10%",float:"left"}}></div>
                    { monthNames.map( (month,i) =>(
                            <div key={i} className="oneline" style={{width:(month.colSpan*w)+"%", float:"left"}}>{month?.name || "..."}</div>
                            )) }
                </div>

                <div className="days">
                    { DAYS.map( (dayName, _dIndex)=>{

                        if( FDOW == _dIndex && onChangeFDOW)
                        {
                            const Icon = FDOW==1? DownArrow : UpArrow;
                            return <div><Icon onClick={()=>onChangeFDOW( 1-FDOW )}/></div>
                        }
                        else 
                        {
                            return <div>{dayName}</div>
                        } 
                    } )} 
                </div>

                { new Array(weeks).fill(0).map( (_,week_i)=>(<div key={"week"+week_i} style={{width:w+"%"}}>
                    { new Array(days).fill(0).map( (_,day_i)=>(<div key={"day"+day_i} style={{paddingBottom:1, paddingRight:1}}><Cell {...data[d++]} onClick={onClick} cantSelectIfNoData={cantSelectIfNoData}/></div>) ) }    
                </div>) ) }

                <div className={classes.menu}>
                    
                        <IconButton onClick={()=>onClickMove(-2)}><LEFT_FF_ICON/></IconButton> 
                        <IconButton onClick={()=>onClickMove(-1)}><LEFT_ICON/></IconButton> 
                        <IconButton disabled={!hasMoved} onClick={()=>onClickMove(0)}>
                            { hasMoved? <LOCK_ICON_OFF/> : <LOCK_ICON_ON/> }
                        </IconButton> 
                        <IconButton onClick={()=>onClickMove(1)}><RIGHT_ICON/></IconButton>  
                        <IconButton onClick={()=>onClickMove(2)}><RIGHT_FF_ICON/></IconButton>
                        
                </div>
            </div>
}


const Cell = ({ ymd, hasData, num, month, pinned, highlighted, onClick, cantSelectIfNoData, isFuture })=>(
    //onClick(ymd)
    <ButtonBase key={ymd} disabled={cantSelectIfNoData && !hasData} focusRipple onClick={()=>onClick(ymd, hasData)} className={"cell m"+(month%2)+" " + ( hasData && "hasData")+" "+(pinned && " pinned")+" "+(highlighted && " highlighted")+" "+(isFuture && " future") }>
         {num} 
    </ButtonBase>);


const CalendarLoadIndicator = () => {
    const status = useReactiveVar(calStatus);

    return <div style={{textAlign:"right"}}> {!status? "" : status.loading? "Loading..." : "" } </div>;
}