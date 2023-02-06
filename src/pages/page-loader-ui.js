import { Button, LinearProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { parseError } from "../data/db";




export const PageLoadIndicator = ({ isLoading, error, onRetry })=> {
    if( isLoading ) 
        return <LinearProgress />;

    if( error )
    { 
        return <Alert severity="error" action={ onRetry? <Button onClick={onRetry}>Retry</Button> : null } >{ parseError(error) }</Alert>;
    } 

    return "";
}