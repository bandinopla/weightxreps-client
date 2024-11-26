import { Chip, useTheme } from "@material-ui/core";
import { useMemo } from "react";

/**
 * 
 * @param {{ data:import("../../data/generated---db-types-and-hooks").JDayQuery }}} param0 
 * @returns 
 */
export const JDayStats = ({ data })=> {
    const theme = useTheme();

    const stats = useMemo(()=>{

        if( !data || !data.jday ) return ;

        let reps = 0;
        let sets = 0;

        data.jday.eblocks.flatMap( eblock=>eblock.sets ).forEach( set => {
            if( set.r>0 ) {
                reps += set.r;
                sets += set.s ?? 1;
            }
        });

        return { reps, sets }

    }, [data])

    if(!stats || stats.reps<=0) return ""; 

    return <span style={{ 
        padding:"0px 10px",
        display:"inline-block"
    }}>   
    <Stat label="Set" value={stats.sets} color="primary"/>
    <Stat label="Rep" value={stats.reps} color="secondary"/>
    </span>
}

const Stat = ({ label, value, color }) => {
    const theme = useTheme();

    return <span style={{ fontWeight:"normal", margin:"0px 5px", padding:"0px 10px", backgroundColor:theme.palette[color].main, color:theme.palette[color].contrastText }}>{value} <small>{label+(value>1?"s":"")}</small></span>
}