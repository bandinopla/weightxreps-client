import React from 'react';
import { ReactComponent as LogoSVG } from '../logo.svg';
import { makeStyles, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import TipoNavidad from "../banners/red-guy-navidad.png";
import Tipo from "../banners/red-guy.png";
import TipoNewYear from "../banners/red-guy-newyear.png";

const useStyles = makeStyles( theme=>({
    root: {
        maxWidth:"100% !important",
        backgroundColor: theme.palette.type=="dark"? "white" : "inherit",
        padding:"20px 0px",
        borderTopLeftRadius:50,
        borderBottomRightRadius:50,
        width:200, 
        marginTop:20,
        display:"block",
        position:"relative",
        margin:"0 auto",
        "& g":{
            fill: "black"//theme.palette.text.primary
        }

        ,"& img, & svg": {
            maxWidth:"100%"
        }
    },
    miniLogo: {
        width:40, height:40,
        position:"absolute",
        left:33,
        top:20, 
        "&.nv": {
            "& g": {
                fill:"red"
            }
        },
        "&.ny": {
            "& g": {
                fill:"orange"
            }
        },
        "& g": {
            fill: theme.palette.primary.main
        }
    }, 
}))



const now = new Date();
const isChristmasSeason = now.getMonth() === 11; // December only 
const isNewYearEve = (now.getMonth() === 11 && now.getDate() === 31) ||  (now.getMonth() === 0 && now.getDate() === 1);
/**
 * A functional component that renders the Logo SVG.
 * 
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional class name(s) to append to the default styles.
 * @returns {JSX.Element} The rendered Logo SVG component.
 */
export default function Logo({ className }) {
    const styles = useStyles();
    const theme = useTheme();
    //return ;
    return <div  className={`${styles.root} ${className}`}>
                <LogoSVG className={`${styles.miniLogo} ${ isNewYearEve? "ny" : isChristmasSeason? "nv" : "" }`} />
                <img src={ isNewYearEve? TipoNewYear : isChristmasSeason? TipoNavidad : Tipo} style={{ filter: theme.palette.type=='dark'? "drop-shadow(0 0 2em rgba(0, 0,233, 0.2))":"none" }}/>
        </div>;
}

Logo.propTypes = {
    className: PropTypes.string,
};