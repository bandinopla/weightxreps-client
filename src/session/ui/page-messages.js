import { Box, Button } from "@material-ui/core";
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
                &nbsp;
                <OpenDMButton otherUser={{ id:1, admin:true }} Icon={<VerifiedUserIcon/>} label="DM Admin" color="primary"/>  
                &nbsp;
                <Button variant="outlined" onClick={()=>window.open("https://x.com/weight_x_reps","_blank")}>@x.com/weight_x_reps</Button>
            </Box>
            

            <NotificationsPopMenu type={1} />
    </>
} 