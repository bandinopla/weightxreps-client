import React from 'react';
import { ReactComponent as LogoSVG } from '../logo.svg';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles( theme=>({
    root: {
        maxWidth:"100% !important",
        width:90,
        height:90,
        display:"block",
        margin:"0 auto",
        "& g":{
            fill: theme.palette.text.primary
        }
    }
}))



/**
 * A functional component that renders the Logo SVG.
 * 
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional class name(s) to append to the default styles.
 * @returns {JSX.Element} The rendered Logo SVG component.
 */
export default function Logo({ className }) {
    const styles = useStyles();
    return <LogoSVG className={`${styles.root} ${className}`} />;
}

Logo.propTypes = {
    className: PropTypes.string,
};