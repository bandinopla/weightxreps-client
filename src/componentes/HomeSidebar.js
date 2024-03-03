import { Button } from "@material-ui/core"
import { SoftBox, SoftSpace } from "./SoftBox" 


import { ComunityStatsTopLiftersWidget } from "./ComunityStatsTopLiftersWidget";
import RssFeedIcon from '@material-ui/icons/RssFeed';
import { DonationSoftbox } from "./DonationSoftbox";

export const HomeSidebar = ()=>{
     

    return <>
        
        <SoftBox title={`Top 3`} Icon={<RssFeedIcon/>}>
            <ComunityStatsTopLiftersWidget/>
        </SoftBox></>
}