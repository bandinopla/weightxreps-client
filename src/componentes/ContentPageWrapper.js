import { Box, LinearProgress, Typography } from "@material-ui/core";
import { useGetSession } from "../session/session-handler"
import { Alert } from "@material-ui/lab";
import { SessionOnlyWidget } from "./SessionOnlyWidget";
import {
    BrowserRouter as Router,
    Switch,
    useLocation
  } from "react-router-dom";
import { MENU } from "./main-menu";


/**
 * @typedef {Object} ContentPageProps
 * @property {string} title The title of the page
 * @property {class} Icon the icon next to the title
 * @property {class} Child The class constructor of the child element 
 * @property {bool} sessionOnly If `true` it will only render children if it is logged in.
 */

/** 
 * Common Layout Helper. It is a basic layout with a Title that has an option icon next to it, followed by the contents.
 * It can optionally handle a common scenario of a content only being intended for logged in users, it will do all the logic to 
 * show only if we have a session.
 * 
 * If you don't define a `title` or `Icon` then we will use the `pathname` to find the menu item that
 * matches last, and extract the label and Icon from there.
 * 
 * @param {ContentPageProps} props 
 * @returns 
 */
export const ContentPage = (props) => {
  
    if( props.sessionOnly )
    { 
        return <SessionOnlyWidget {...props} Widget={PageLayout}/>;
    }

    return <PageLayout {...props}/>
}

/** 
 * @param {ContentPageProps} param0  
 */
const PageLayout = ({ title, Icon, Child, ...rest }) => {

    let location = useLocation(); 
    let menuItem = MENU.findLast( (m,i)=>m.goto?.length>1 && location.pathname.indexOf( m.goto )==0 );

    if( menuItem )
    {
        if( !title )
        {
            title = menuItem.label;
        }
    
        if( !Icon )
        {
            Icon = menuItem.Icon;
        }
    } 


    return <>
        <Box padding={2} borderBottom="1px dashed #444" >
            <Typography variant="h4">{ Icon && <Icon /> } {title ?? "???"}</Typography>
        </Box> 
        <Child {...rest}/>
    </>
}