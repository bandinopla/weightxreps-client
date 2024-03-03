import { Box } from "@material-ui/core";
import { OpenDMButton } from "./dms-window/dm-window";
import NotificationsPopMenu from "./notifications-popmenu";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { useGetSession } from "../session-handler";
import RssFeedIcon from '@material-ui/icons/RssFeed';

export default function PageMessages() {

    const user = useGetSession();


    return <> 
            <Box textAlign={"center"} margin={1}>
                { user.session?.user.id==1 && <OpenDMButton otherUser={{id:"0"}} Icon={<RssFeedIcon/>} label="Global Message" />  }

                <OpenDMButton otherUser={{ id:1, admin:true }} Icon={<VerifiedUserIcon/>} label="DM Admin" color="primary"/>  
            </Box>
            

            <NotificationsPopMenu type={1} />
    </>
} 