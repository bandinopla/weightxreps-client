 
import { QuickRangeOverview } from "./quick-range-overview";
import { DonationSoftbox } from "./DonationSoftbox";
import { useGetSession } from "../session/session-handler";




export const SessionHomeSidebar = ()=>{ 

    const user = useGetSession();

    if(!user.session)
    {
        return "";
    }

    return <> 
            <QuickRangeOverview/>
        </>
}

