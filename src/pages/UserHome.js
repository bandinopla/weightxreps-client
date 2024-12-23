import { LinearProgress } from "@material-ui/core";
import { useGetSession } from "../session/session-handler"
import { ActivityFeed } from "./Home"
import { GuestHome } from "./GuestHome";
import { MainBannerWrapper } from "../banners/MainBannerWrapper";
 
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
   <MainBannerWrapper>
        <img fetchpriority="high" src="/session-banner.jpg" className='banner-fullrow sha'/>
    </MainBannerWrapper> 
                <ActivityFeed type="following" />
                </>
}