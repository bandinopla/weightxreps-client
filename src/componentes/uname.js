import Flag from "./flags";
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LockIcon from '@material-ui/icons/Lock';
import {
    Link
} from "react-router-dom";
import { useGetUserInfoQuery } from '../data/generated---db-types-and-hooks';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

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
        color:"#eee", //"#2CA8DF"

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

/**
 * Rendea un username tag.
 * @param {string} ymd Si viene, al hacer click manda al journal en ese dia.
 * 
 */
function UnameTag( { inline=false, nolink=false, id, uname, cc, isf, slvl, sok, url, ymd, style, prefix="", noflag=false, ...rest } ) {

    const classes   = useStyles();
    const Icon      = id==1? VerifiedUserIcon : slvl>0? sok? CheckCircleIcon : CheckIcon  : null;

    // poner "xx country_unknown" al no saber CC...
    const Wrapper = nolink? Foo : Link;
     
    return <Wrapper to={ url || `/journal/${uname}${ymd? "/"+ymd : ""}`} className={"oneline "+classes.unameLink+(id==1?" "+classes.admin:"")} style={{ display: inline?"inline":"block", ...style }}>
                {!noflag && <Flag cc={cc}/>}
                <b className={ isf>-1? isf==0? classes.m : classes.f : classes.x }> {prefix}{ uname || "????"}</b>
                { Icon!=null && <Icon className={classes.icon + " "+ (sok && "ok")} fontSize="small"/> }
                {rest.private ? <LockIcon style={{fontSize:"1em"}}/>:""}
            </Wrapper>
}

const Foo = props=><span {...props}>{props.children}</span>;

export default UnameTag;

export const UnameRef = ({ uid, uname })=>{

    const {data, loading, error} = useGetUserInfoQuery({ variables:{
        userInfoUname: String(uid)
    }})

    return data? <UnameTag inline {...data.userInfo.user}/> : uname;
}
 