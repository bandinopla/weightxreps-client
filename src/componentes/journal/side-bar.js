
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom"; 
import { todayAsYMD } from "../../utils/utils";
import AlsoPosted from "./AlsoPosted";
 
const TODAY_AS_YMD              = todayAsYMD();

/**
 * This is the content that appears on the side bar when you are looking at a journal...
 */
export default function JournalSideBar({ location: { pathname }}) {

    const loc = useLocation();
    let ymd = pathname.match(/(?<ymd>\d{4}-\d{2}-\d{2})/) 

    if( ymd )
    {
        ymd = ymd.groups.ymd;
    }
    else 
    {
        ymd = TODAY_AS_YMD;
    }

    return <>
            <AlsoPosted ymd={ymd}/>
            </>
}