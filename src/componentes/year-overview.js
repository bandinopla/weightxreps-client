
import { useContext, useEffect, useMemo, useState } from 'react';
import styles from './year-overview.module.css';
import { dateToYMD, ymd2date } from '../utils/utils';
import { JOwnerContext } from '../pages/journal-context';
import { useGetYearOverviewQuery } from '../data/generated---db-types-and-hooks';
import { parseError } from '../data/db';
import { useDarkModeOn } from '../MainTheme';
import { useGetSession, useReactiveSetting } from '../session/session-handler';
import { AsciiSpinner } from './ascii-spinner'; 

/**
 * @typedef {Object} YearOVerviewParams
 * @property {string} ymd YYYY-MM-DD string
 * @property {number[]?} daysData
 * @property {(day:Date)=>void} onClickDay
 * @property {Date} focusOn
 * @property {JSX.Element?} header Header to use instead of the month's names.
 * @property {number} firstDayOfWeek 0=sunday 6=Saturday
 */

/**
 * @typedef {Object} MonthLabel
 * @property {number} count
 * @property {number} num
 * @property {string} name
 */

/**
 * @typedef {Object} CalInfo
 * @property {Array<Date>} dates 
 * @property {MonthLabel[]} months
 * @property {number} weeks
 * @property {number} year
 */


export const YearOVerview = ({ ymd })=>{
    const jowner    = useContext( JOwnerContext );
    const darkMode = useDarkModeOn();
    const { userSettings }  = useGetSession(); 
    const firstDayOfWeek    = useReactiveSetting( userSettings?.firstDayOfWeek );
    const $startDay         = firstDayOfWeek || 0;
    const $year             = Number( ymd.split("-")[0] );

    const { loading, data, error } = useGetYearOverviewQuery({
        variables: {
            uid: jowner.id,
            year: $year
        }
    });

    const focus = ()=>{
        setTimeout( ()=>document.body.dispatchEvent(new Event("calendar:focus")),0);;
    }

    const onClickDay = d => {
        jowner.gotoYMD( dateToYMD(d) );
        focus();
    }; 

    const gotoYear = year => {
        jowner.gotoYMD( year+"-"+ymd.split("-").slice(1).join("-") ); 
        focus();
    }

    return <div className={darkMode? styles.dark:styles.light } style={{marginBottom:10}}>

            <div className={styles.layout}>

                <div className={styles.year}>
                    { loading? <AsciiSpinner label={" "}/> : <YearsLoggedWidget years={data?.getYearsLogged} pinned={$year} onClickYear={gotoYear}/> }
                </div>

                <div className={styles.mainArea}>
                <YearOVerviewGrid ymd={ymd} 
                            daysData={ data?.getYearOverview } 
                            focusOn={ymd2date(ymd,true)} 
                            onClickDay={onClickDay}
                            header={error? <i>{"Failed to load year overview due to: "+parseError(error)}</i> : null}
                            firstDayOfWeek={$startDay}
                            /></div>
            </div>
           </div>
};

const colorStyles = [
    styles.cell0,
    styles.cell1,
    styles.cell2,
    styles.cell3,
    styles.cell4,
];

/** 
 * Displays a grid of all the weeks of the year
 * @param {YearOVerviewParams} param0 
 * @returns 
 */
const YearOVerviewGrid = ({ ymd, daysData, onClickDay, focusOn, header, firstDayOfWeek })=>{ 

    /**
     * @type {CalInfo}
     */
    const calInfo = useMemo(()=>{

        const d = ymd2date(ymd);
        const d0 = new Date( d.getFullYear(), 0, 1);
        const dF = new Date( d.getFullYear()+1, 0, 0);
        const days2add = 52 * 7;

        d0.setDate( d0.getDate() - d0.getDay() );  
        dF.setDate( dF.getDate() + (6 - dF.getDay()) );  

        const diffMs = dF - d0;
        const differenceInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const weeks = Math.ceil( differenceInDays/7 ) ; 
 
        /**
         * @type {MonthLabel[]}
         */
        const months = [];
        let lastMonth;

        const dates = new Array( weeks*7 ).fill(0).map((_,i)=>{
            const day = new Date(d0);
            day.setDate( day.getDate() + i);
            //
 
            if( i%7 == 0 ) //first row
            {
                const monthNum = day.getMonth();

                if(!lastMonth || (lastMonth.num != monthNum) )
                {
                    lastMonth = {
                        num: monthNum,
                        count: 0,
                        name: day.toDateString().split(" ")[1]
                    }

                    months.push(lastMonth);
                }

                lastMonth.count++; 
            }

            return day;
        });
 
        return {
            dates, months, weeks, year:d.getFullYear()
        }

    },[ymd, firstDayOfWeek]); 

    /**
     * Determines the color of the cell
     * @param {number} i 
     * @param {Date} d 
     * @returns {string}
     */
    const cellColor = (i,d) => {

        if( d.getUTCFullYear()==focusOn.getUTCFullYear() 
        &&  d.getUTCMonth()==focusOn.getUTCMonth() 
        &&  d.getUTCDate()==focusOn.getUTCDate() )
        {
            return styles.cellOnFocus+" PR";
        }

        if( d.getFullYear()!=calInfo.year )
        {
            return styles.hiddenCell;
        }

        if( daysData )
        {
            return colorStyles[ daysData[i+firstDayOfWeek] ];
        }

        return "";
    }

     
    return <div className={styles.mainArea}>  
            {
                header || <div className={styles.monthNames}>
                { calInfo.months.map( (monthLabel,i) =><div key={i}>{monthLabel.count>2? monthLabel.name : ""}</div> )}
            </div>
            }
            
            <div className={styles.container}>

                { calInfo.dates.slice(firstDayOfWeek).map((d,i)=><div key={i} className={styles.item+" "+cellColor(i,d)} onClick={()=>onClickDay(d)}></div> ) }
                
            </div>
        </div>
    ;
}

/**
 * @typedef {Object} YearsLoggedWidgetParams
 * @property {Array<number>?} years
 * @property {number} pinned year pinned
 * @property {(year:number)=>void} onClickYear 
 */
/** 
 * Shows all the years in which the user has logged data
 * @param {YearsLoggedWidgetParams} param0 
 */
const YearsLoggedWidget = ({ years, pinned, onClickYear }) => {
    const [offset, setOffset] = useState(0);
    const gap       = 1; 

    useEffect(()=> setOffset(0),[pinned]); 

    if( !years?.length )
    {
        return <div className={styles.pinnedYear}>{pinned}</div>;
    }

    const i         = years?.indexOf(pinned) + offset;  
    let startIndex  = i - gap*2; //can be negative... 
    let endIndex    = i;

    if( startIndex<0 )
    {
        startIndex = 0;
        endIndex = gap*2 ;
    }
    else 
    {
        startIndex += gap;
        endIndex += gap; 
    }

    if( endIndex>=years.length )
    {
        startIndex = years.length - gap*2 - 1;
        endIndex = years.length-1;
    }  
 

    const move = dir => {
        let ni = Math.min( years.length-1, Math.max(0, i+dir) ); 
        setOffset( ni-(i-offset) );
    }

    return <>
        <div className={styles.btn+(startIndex<=0?" "+styles.hidden:"")} onClick={e=>move(-1)||e.preventDefault()}>▲</div>
        { years?.slice(startIndex,endIndex+1).map( y=><div key={y} className={ y==pinned? styles.pinnedYear : ""} onClick={()=>onClickYear(y)}>{y}</div>)}
        <div className={styles.btn+(endIndex+1>=years.length?" "+styles.hidden:"")} onClick={e=>move(1)||e.preventDefault()}>▼</div> 
    </>;
}