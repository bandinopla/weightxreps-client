import Flag from "./flags";
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import LockIcon from '@material-ui/icons/Lock';
import {
    Link
} from "react-router-dom";
import { useGetUserBasicInfoLazyQuery } from '../data/generated---db-types-and-hooks';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { useHasGivenFeedback } from "../utils/useHasGivenFeedback";
import { useEffect, useMemo } from "react";
import StarOutlineRoundedIcon from '@material-ui/icons/StarOutlineRounded';
import { makeVar, useReactiveVar } from "@apollo/client";
import { forumRole2Icon } from "../forum/forumRole2Icon";

const useStyles = makeStyles( theme => ({

    m: {
        color: theme.uname.male //"#08c"
    },
    f: {
        color: theme.uname.female
    },
    x: {
        color:"#333"
    },
    oneline: {
        whiteSpace:"nowrap",
        overflow:"hidden",
        textOverflow:"ellipsis"
    },
    icon: {
        marginBottom:-3,
        fontSize:"1.2em",
        //color:"#ccc", //"#2CA8DF"

        "&.ok": {
            color:"#1C9DED"
        }
    },

    unameLink: {
        textDecoration:"none"
        ,"&:hover": {
            textDecoration:"underline"
        }
    },

    admin: {
        position:"relative",

        "& *": {
            color: theme.uname.adminColor+" !important",
            fontWeight:"bold"
        },

        // "&::after": {
        //     content:`"admin"`,
        //     backgroundColor: theme.uname.adminColor,
        //     color:"white",
        //     fontSize:10,
        //     padding:"0 3px",
        //     //position:"absolute",
        //     marginLeft:4
        // }
    }
      
}));

const BlueSeal = ({ className }) => <svg viewBox="0 0 22 22" role="img" className={"MuiSvgIcon-root makeStyles-icon-421 ok MuiSvgIcon-fontSizeSmall "+className }><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></g></svg>;

/**
 * Rendea un username tag.
 * @param {string} ymd Si viene, al hacer click manda al journal en ese dia.
 * 
 */
function UnameTag( { inline=false, nolink=false, id, uname, cc, isf, slvl, sok, url, ymd, style, prefix="", noflag=false, forumRole, ...rest } ) {

    const classes   = useStyles();
    const Icon      = id==1? VerifiedUserIcon : slvl>0? sok? BlueSeal : CheckIcon  : null;
    const collabs   = useHasGivenFeedback();
    const userCollabs = useMemo(()=>{

        return collabs && collabs(uname);

    },[collabs])

    // poner "xx country_unknown" al no saber CC...
    const Wrapper = nolink? Foo : Link;
     
    return <Wrapper to={ url || `/journal/${uname}${ymd? "/"+ymd : ""}`} className={"oneline "+classes.unameLink+(id==1?" "+classes.admin:"")} style={{ display: inline?"inline":"block", ...style }}>
                {!noflag && <Flag cc={cc}/>}
                <b className={ isf>-1? isf==0? classes.m : classes.f : classes.x }> {prefix}{ uname || "????"}</b>
                { Icon!=null && <Icon className={classes.icon + " "+ (sok && "ok")} fontSize="small"/> }
                {rest.private ? <LockIcon style={{fontSize:"1em"}}/>:""}
                { userCollabs?.length>0 && <><StarOutlineRoundedIcon style={{fontSize:"1em"}}/>{userCollabs?.length>1 && <sup>{userCollabs?.length}</sup> }</> }
                { forumRole2Icon(forumRole, { fontSize:"small", className:classes.icon }) }
            </Wrapper>
}

const Foo = props=><span {...props}>{props.children}</span>;

export default UnameTag;



const $userLocator2User     = new Map();
const pendingUnknown        = [];
const $unknownRefsUpdated   = makeVar();

/**
 * we use this to be able to generate a uname tag with the info of the user when we only have the uid or uname, and this will "collect" all the "unknown" utags and fetch the info in a bulk.
 */
export const UnameRef = ({ uid, uname, prefix="" })=>{

    const [fetchUnknowns, { data } ] = useGetUserBasicInfoLazyQuery();
    const map = useReactiveVar($unknownRefsUpdated);
    const loc = typeof uid=='string' ? uid.toLowerCase() : uid;

    useEffect(()=>{

        pendingUnknown.push( loc );

        var intrvl = setTimeout(()=>{

            if( pendingUnknown.length )
            {

                fetchUnknowns({
                    variables: {
                        ofThese: pendingUnknown.slice(0)
                    }
                });

                pendingUnknown.length = 0;
            }

        },0); // wait till next frame render to catch all the bulk...

        return ()=>clearInterval(intrvl);
        
    }, []);

    //
    // when data arrives, notify listeners...
    //
    useEffect(()=>{

        if( data )
        {
            data.userBasicInfo?.forEach( user => { 

                $userLocator2User.set( user.id, user );
                $userLocator2User.set( user.uname.toLowerCase(), user );

            });   

            $unknownRefsUpdated($userLocator2User);
        }
        
    }, [data]);

    if( map && map.has(loc) )
    {
        return <UnameTag inline {...map.get(loc)} prefix={prefix}/>
    }
    //return data? <UnameTag inline {...data.userInfo.user} prefix={prefix}/> : prefix + uname;
    return prefix + uname;
}
 