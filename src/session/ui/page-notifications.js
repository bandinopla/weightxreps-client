import { SessionOnlyWidget } from "../../componentes/SessionOnlyWidget";
import { OpenDMButton } from "./dms-window/dm-window";
import NotificationsPopMenu from "./notifications-popmenu";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { ContentPage } from "../../componentes/ContentPageWrapper";

// export default function PageNotifications() {
//     return <SessionOnlyWidget>
//                 { ()=><> 
//                     <NotificationsPopMenu type={2} />
//                     </> }
//             </SessionOnlyWidget>
// } 

export default function PageNotifications(props) {
    return <>  
            <NotificationsPopMenu type={2} />
    </>
} 