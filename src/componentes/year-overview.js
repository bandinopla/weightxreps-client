
import { useContext, useMemo } from 'react';
import styles from './year-overview.module.css';
import { dateToYMD, ymd2date } from '../utils/utils';
import { JOwnerContext } from '../pages/journal-context';
import { useGetYearOverviewQuery } from '../data/generated---db-types-and-hooks';
import { parseError } from '../data/db';
import { useDarkModeOn } from '../MainTheme';

/**
 * @typedef {Object} YearOVerviewParams
 * @property {string} ymd YYYY-MM-DD string
 * @property {number[]?} daysData
 * @property {(day:Date)=>void} onClickDay
 * @property {Date} focusOn
 * @property {JSX.Element?} header Header to use instead of the month's names.
 */

/**
 * @typedef {Object} MonthLabel
 * @property {number} count
 * @property {number} num
 * @property {string} name
 */

/**
 * @typedef {Object} CalInfo
 * @property {Date[]} dates 
 * @property {MonthLabel[]} months
 * @property {number} weeks
 */


export const YearOVerview = ({ ymd })=>{
    const jowner    = useContext( JOwnerContext );
    const darkMode = useDarkModeOn();
    const { loading, data, error } = useGetYearOverviewQuery({
        variables: {
            uid: jowner.id,
            year: Number( ymd.split("-")[0] )
        }
    });

    const onClickDay = d => {
        jowner.gotoYMD( dateToYMD(d) );
 
        setTimeout( ()=>document.body.dispatchEvent(new Event("calendar:focus")),0);
        ;
    }; 

    return <div className={darkMode? styles.dark:styles.light }><YearOVerviewGrid ymd={ymd} 
                            daysData={ data?.getYearOverview } 
                            focusOn={ymd2date(ymd,true)} 
                            onClickDay={onClickDay}
                            header={error? <i>{"Failed to load year overview due to: "+parseError(error)}</i> : null}
                            />
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
const YearOVerviewGrid = ({ ymd, daysData, onClickDay, focusOn, header })=>{ 

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
            dates, months, weeks
        }

    },[ymd]); 

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

        if( daysData )
        {
            return colorStyles[ daysData[i] ];
        }

        return "";
    }

    

    return <div> 

        {
            header || <div className={styles.monthNames}>
            { calInfo.months.map( (monthLabel,i) =><div key={i}>{monthLabel.count>2? monthLabel.name : ""}</div> )}
        </div>
        }
        
        <div className={styles.container}>

            { calInfo.dates.map((d,i)=><div key={i} className={styles.item+" "+cellColor(i,d)} onClick={()=>onClickDay(d)}></div> ) }
            
        </div>
    </div>;
}