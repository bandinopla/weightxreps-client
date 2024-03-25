import { Box, Button, Typography } from "@material-ui/core"
import SignalWifi1BarIcon from '@material-ui/icons/SignalWifi1Bar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} NothingHereParams
 * @property {string} title
 * @property {string} description
 * @property {React.ReactNode} ActionIcon
 * @property {string} actionVerb
 * @property {()=>void} action
 */

/** 
 * A display to show when a content can't be shown due to not enough data...
 * @param {NothingHereParams} param0 
 * @returns 
 */
export const NothingHere = ({ title, description, ActionIcon, actionVerb, action, children }) => {
    return <Box padding={8} textAlign="center">

                <SignalWifi1BarIcon fontSize="large"/>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Typography variant="subtitle2">{description}</Typography>
                {children}
                { action && <>
                    <br/>
                    <br/>
                    <Button variant="outlined" onClick={ ()=>action() } startIcon={ActionIcon? <ActionIcon/> : null}>{actionVerb}</Button>
                </> }
                
    </Box>
} 