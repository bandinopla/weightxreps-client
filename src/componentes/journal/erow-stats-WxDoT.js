import { DistanceValue, SpeedValue } from "../distance-value";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { TimeValue } from "../time-value";


/**
 * Stats of an EBlock of type Distance or Time
 */
export const statsOfWxDoT = (stats, jowner, sets) => {
 
    const out = [];

    const logLink = ymd=>`/journal/${jowner.uname}/${ymd}`;

    if( stats.maxForce )
    {
        out.push({
            label:"B. Force",
            value: <Link to={logLink(stats.maxForce.when)}>
                ~<strong>{stats.maxForce.val.toFixed(1)}</strong> {stats.maxForce.unit}
            </Link>
        })
    }

    if( stats.topSpeed )
    {
        out.push({
            label:"B. Speed",
            value: <Link to={logLink(stats.topSpeed.when)}><SpeedValue value={stats.topSpeed.val} displayUnit={stats.topSpeed.unit}/>  </Link>
        });
    }

    if( stats.minDistance )
    { 
        if( stats.maxDistance )
        {
            out.push({
                label:"Min/Max B. Dist.",
                value: <>
                        <Link to={logLink(stats.minDistance.when)}><DistanceValue value={stats.minDistance.val} unit={stats.minDistance.unit}/>  </Link> /
                        <Link to={logLink(stats.maxDistance.when)}><DistanceValue value={stats.maxDistance.val} unit={stats.maxDistance.unit}/>  </Link> 
                        </>
            });
        }
        else 
        {
            out.push({
                label:"B. Dist.",
                value: <Link to={logLink(stats.minDistance.when)}><DistanceValue value={stats.minDistance.val} unit={stats.minDistance.unit}/>  </Link>
            });
        }
    }

    if( stats.minTime )
    {
        if( stats.maxTime )
        {
            out.push({
                label:"Min/Max B. Time",
                value: <>
                        <Link to={logLink(stats.minTime.when)}><TimeValue milliseconds={stats.minTime.val}/></Link> /
                        <Link to={logLink(stats.maxTime.when)}><TimeValue milliseconds={stats.maxTime.val}/></Link>
                        </>
            })
        }
        else
        {
            out.push({
                label:"B. Time",
                value: <Link to={logLink(stats.minTime.when)}><TimeValue milliseconds={stats.minTime.val}/></Link>
            })
        }
    } 

    const totalSets = sets.reduce((acc, set)=>acc+set.s,0)

    const totalDistance = sets.reduce( (acc, set)=> acc + set.d * set.s, 0);

    if( totalSets>1 && totalDistance )
    {
        out.push({
            label:"Total Dist.",
            value: <DistanceValue value={totalDistance} unit={ sets[0].dunit }/>
        })
    }

    const totalTime = sets.reduce( (acc, set)=> acc + set.t * set.s, 0);

    if( totalSets>1 && totalTime )
    {
        out.push({
            label:"Total Time",
            value: <TimeValue milliseconds={totalTime}/>
        })
    }


    return out
}