import { LinearProgress } from "@material-ui/core";
import { useGetSession } from "../session/session-handler"
import { ActivityFeed } from "./Home"
import { GuestHome } from "./GuestHome";
 
export const UserHome = ()=>{
    const user = useGetSession();

    if( user.loadingSession )
    {
        return <LinearProgress/>
    }

    if(!user.session )
    {
        return <GuestHome/>
    }

    return <> 
    <img fetchpriority="high" src="/session-banner.jpg" className='banner-fullrow sha'/>
                <ActivityFeed type="following" />
                </>
}