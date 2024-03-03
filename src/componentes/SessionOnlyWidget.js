import { Box, Button, LinearProgress } from "@material-ui/core";
import { useGetSession } from "../session/session-handler";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useHistory, useLocation } from "react-router-dom";
import FingerprintIcon from '@material-ui/icons/Fingerprint';


/**
 * @typedef {Object} SessionOnlyWidgetProps
 * @property {class} Widget constructor of this child widget to build if we are logged.
 * any other prop is passes to the Widget child.
 */

/** 
 * Renders `Widget` **only** if we are logged in. Else, it will display a message.
 * @param {SessionOnlyWidgetProps} props 
 * @returns 
 */
export const SessionOnlyWidget = ( { Widget, ...rest } )=>{

    const user          = useGetSession();
    const history       = useHistory();

    if( user.loadingSession )
    {
        return <LinearProgress/>
    }

    if( !user.session || user.sessionError ) 
    {
        return <Alert severity="warning" action={
                                        <Button startIcon={<FingerprintIcon/>} color="inherit" variant="outlined" onClick={()=>history.push("/")}>
                                        Sign In
                                        </Button>
                                    }>
                <AlertTitle>You must sign in!</AlertTitle>
                This area is for registered users only.
            </Alert>;
    }

    return <Widget {...rest}/>;
}