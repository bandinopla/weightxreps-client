import { Box, Typography } from "@material-ui/core";
import { SessionOnlyWidget } from "./SessionOnlyWidget";
import {
    useLocation
  } from "react-router-dom";
import { MENU } from "./main-menu";
import { createContext, useContext, useEffect, useState } from "react";


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

const PageLayoutContext = createContext({ setTitle:(elem)=>{} });

/** 
 * @param {ContentPageProps} param0  
 */
export const PageLayout = ({ title, Icon, Child, ...rest }) => {

    const [titleNode, setTitleNode] = useState();
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


    return <PageLayoutContext.Provider value={{ setTitle:setTitleNode }}>
            { titleNode!==false && <Box padding={2} borderBottom="1px dashed #444" >

                { titleNode? titleNode : <Typography variant="h4">{ Icon && <Icon /> } {title ?? "???"}</Typography> }
                
            </Box> }
            { Child ? <Child {...rest}/> : rest.children }
        </PageLayoutContext.Provider>
}

export const PageLayoutTitle = ({ children, none })=>{
    const ctx = useContext(PageLayoutContext);

    useEffect(()=>{
        ctx.setTitle(none? false : children);
    },[]);
    
    return "";
}