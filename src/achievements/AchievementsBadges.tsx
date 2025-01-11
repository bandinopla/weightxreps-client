import { FunctionComponent, useContext, useMemo } from "react";

import { Chip, Grid, Typography, } from "@material-ui/core";
import DoneIcon from '@material-ui/icons/Done';
import { BrowserRouter as Router, Route, Link, useParams } from 'react-router-dom';
import { JOwnerContext } from "../pages/journal-context";
import { GetAchievementsQueryResult, GetAchievementsStateOfQuery, GetAchievementsStateOfQueryResult, useGetAchievementsQuery, useGetAchievementsStateOfQuery } from "../data/generated---db-types-and-hooks";
import { Box, LinearProgress } from "@material-ui/core";
import { todayAsYMD } from "../utils/utils";

import { $openModal, OpenConfirmModal } from "../componentes/Dialog";
import AchievementsReferenceModal from "./AchievemmentsReferenceModal"; 
import { AchievementsIcons as $icons } from "./AchievementsIcons"; 
  
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

    const showReference = ()=>{ 
        $openModal({
            open:true,
            title:<Typography variant="h3" style={{textTransform:"capitalize"}} >Achievements!</Typography>, 
            onConfirm:undefined,
            canCancel:true,
            //@ts-ignore
            onClose:()=>{ $openModal({ open:false }) },
            info: <AchievementsReferenceModal achievements={data.getAchievements}/>
        });
    }

    if(loading || loadingState)
        return <LinearProgress variant="indeterminate"/>;

    if( error || stateError ) return <div></div>

    console.log( data.getAchievements)
    return  <Box display="flex" flexWrap="wrap" gridGap={2} justifyContent="center" alignItems="center">
         {
            badges.map( badge=><AchievementBadge key={badge.uuid} data={badge}/> )
         }
         <Chip label="?" onClick={showReference}></Chip>
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