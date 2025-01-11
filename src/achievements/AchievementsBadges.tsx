import { FunctionComponent, useContext, useMemo } from "react";

import { Chip, Grid, Typography, } from "@material-ui/core";
import DoneIcon from '@material-ui/icons/Done';
import { BrowserRouter as Router, Route, Link, useParams } from 'react-router-dom';
import { JOwnerContext } from "../pages/journal-context";
import { GetAchievementsQueryResult, GetAchievementsStateOfQuery, GetAchievementsStateOfQueryResult, useGetAchievementsQuery, useGetAchievementsStateOfQuery } from "../data/generated---db-types-and-hooks";
import { Box, LinearProgress } from "@material-ui/core";
import { todayAsYMD } from "../utils/utils";
import BP_INSANE from './resized-icons/BP-INSANE.png';
import BP_MISSION from './resized-icons/BP-MISSION.png';
import CAN_BP_1plate from './resized-icons/CAN-BP-1plate.png';
import CAN_BP_2plate from './resized-icons/CAN-BP-2plate.png';
import CAN_BP_3plate from './resized-icons/CAN-BP-3plate.png';
import CAN_BP_4plate from './resized-icons/CAN-BP-4plate.png';
import CAN_BP_5plate from './resized-icons/CAN-BP-5plate.png';
import CAN_DL_1plate from './resized-icons/CAN-DL-1plate.png';
import CAN_DL_3plate from './resized-icons/CAN-DL-3plate.png';
import CAN_DL_4plate from './resized-icons/CAN-DL-4plate.png';
import CAN_DL_5plate from './resized-icons/CAN-DL-5plate.png';
import CAN_DL_6plate from './resized-icons/CAN-DL-6plate.png';
import CAN_DL_7plate from './resized-icons/CAN-DL-7plate.png';
import CAN_OHP_1plate from './resized-icons/CAN-OHP-1plate.png';
import CAN_OHP_2plate from './resized-icons/CAN-OHP-2plate.png';
import CAN_OHP_3plate from './resized-icons/CAN-OHP-3plate.png';
import CAN_SQ_1plate from './resized-icons/CAN-SQ-1plate.png';
import CAN_SQ_2plate from './resized-icons/CAN-SQ-2plate.png';
import CAN_SQ_3plate from './resized-icons/CAN-SQ-3plate.png';
import CAN_SQ_4plate from './resized-icons/CAN-SQ-4plate.png';
import CAN_SQ_5plate from './resized-icons/CAN-SQ-5plate.png';
import CAN_SQ_6plate from './resized-icons/CAN-SQ-6plate.png';
import CAN_SQ_7plate from './resized-icons/CAN-SQ-7plate.png';
import DL_MISSION from './resized-icons/DL-MISSION.png';
import OHP_MISSION from './resized-icons/OHP-MISSION.png';
import SQ_INSANE from './resized-icons/SQ-INSANE.png';
import SQ_MISSION from './resized-icons/SQ-MISSION.png';
import { $openModal, OpenConfirmModal } from "../componentes/Dialog";

const $icons = {
    "BP-INSANE": BP_INSANE,
    "BP-MISSION": BP_MISSION,
    "CAN-BP-1plate": CAN_BP_1plate,
    "CAN-BP-2plate": CAN_BP_2plate,
    "CAN-BP-3plate": CAN_BP_3plate,
    "CAN-BP-4plate": CAN_BP_4plate,
    "CAN-BP-5plate": CAN_BP_5plate,
    "CAN-DL-1plate": CAN_DL_1plate,
    "CAN-DL-3plate": CAN_DL_3plate,
    "CAN-DL-4plate": CAN_DL_4plate,
    "CAN-DL-5plate": CAN_DL_5plate,
    "CAN-DL-6plate": CAN_DL_6plate,
    "CAN-DL-7plate": CAN_DL_7plate,
    "CAN-OHP-1plate": CAN_OHP_1plate,
    "CAN-OHP-2plate": CAN_OHP_2plate,
    "CAN-OHP-3plate": CAN_OHP_3plate,
    "CAN-SQ-1plate": CAN_SQ_1plate,
    "CAN-SQ-2plate": CAN_SQ_2plate,
    "CAN-SQ-3plate": CAN_SQ_3plate,
    "CAN-SQ-4plate": CAN_SQ_4plate,
    "CAN-SQ-5plate": CAN_SQ_5plate,
    "CAN-SQ-6plate": CAN_SQ_6plate,
    "CAN-SQ-7plate": CAN_SQ_7plate,
    "DL-MISSION": DL_MISSION,
    "OHP-MISSION": OHP_MISSION,
    "SQ-INSANE": SQ_INSANE,
    "SQ-MISSION": SQ_MISSION,
  };

  
interface AchievementsBadgesProps {
   
}

interface Achievement {
    lvl:number 
    uuid:string
    icon:string
    info: GetAchievementsQueryResult["data"]["getAchievements"][0],
    status: GetAchievementsStateOfQueryResult["data"]["getAchievementsStateOf"][0]
}
 
const AchievementsBadges: FunctionComponent<AchievementsBadgesProps> = ({   }) => {
 
    let { ymd }                                 = useParams();
    //@ts-ignore
    const jowner                                = useContext<any>(JOwnerContext);

    const { loading, data, error}               = useGetAchievementsQuery();
    const { loading:loadingState, data:stateData, error:stateError} = useGetAchievementsStateOfQuery({ variables:{ uid:jowner.id, asOfThisYmd: (ymd ?? todayAsYMD()).replaceAll("-","") }})
    
    const badges = useMemo(()=>{

        if( !stateData || !data ) return;

        const uniques = data.getAchievements?.map( ach=>({
            ...ach,
            uuid: ach.id.replace(/\d+/,""),
            lvl: parseInt( ach.id.match(/\d+/)?.[0] ?? "0" )
        }))

        return stateData.getAchievementsStateOf?.reduce<Achievement[]>((out, itm)=>{

            const uuid = itm.aid.replace(/\d+/,"");
            const badge : Achievement = {
                icon: $icons[ itm.aid ],
                uuid ,
                lvl: parseInt( itm.aid.match(/\d+/)?.[0] ?? "0" ),
                info: uniques.find(a=>a.id==itm.aid),
                status: itm
            };  

            if( itm.gotit )
            {
                const otheri = out.findIndex(o=>o.uuid===badge.uuid);

                if(otheri>=0) {
                    const other = out[ otheri ];
                    if( other.lvl<badge.lvl ) {
                        out.splice(otheri,1,badge);
                    }
                } else 
                {
                    out.push(badge);
                }
            }
            

            return out;

        },[])

    }, [ data, stateData ]);

    if(loading || loadingState)
        return <LinearProgress variant="indeterminate"/>;

    if( error || stateError ) return <div></div>

    console.log( data.getAchievements)
    return  <Box display="flex" flexWrap="wrap" gridGap={2} justifyContent="center">
         {
            badges.map( badge=><AchievementBadge key={badge.uuid} data={badge}/> )
         }
    </Box>;
}
 
export default AchievementsBadges;


function AchievementBadge({ data }:{ data:Achievement }) { 
 
    const mydata = data.info;
    const myState = data.status;

    
    const openDetails = ()=>{
        $openModal({
            open:true,
            title:<Typography variant="h3" style={{textTransform:"capitalize"}} >{mydata.name}</Typography>, 
            onConfirm:undefined,
            canCancel:true,
            //@ts-ignore
            onClose:()=>{ $openModal({ open:false }) },
            info: <div> 
                        <div style={{ fontWeight:"bold"}}>
                            <Grid container spacing={3}>
                                <Grid item xs={4}>
                                    <img src={ data.icon } style={{maxWidth:"100%" }}/>
                                </Grid>
                                <Grid item xs={8}> 
                                    <div className="user-text">{mydata.description}</div><br/>
                                    {myState?.gotit && <Chip variant="outlined" color="primary" icon={<DoneIcon />} label={ "Achieved!! "+ myState.note }/> }
                                </Grid>
                            </Grid>  
                        </div>
                    </div>
        })

    }
    return <img src={ data.icon } style={{ width:"20%", opacity:myState?.gotit?1: 0.1, cursor:"pointer"}} onClick={openDetails}/>
}