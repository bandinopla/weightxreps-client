import Alert from '@material-ui/lab/Alert';
import { Button } from '@material-ui/core';
import { Grid } from '@material-ui/core';

export default function({ title, errorMessage, retry }) {

    return <Grid container>

                <Grid item xs={12} md={6}>
                    <Alert severity="error" action={<Button color="inherit" size="small" onClick={()=>retry()}>
                        Retry
                    </Button> }>
                    {errorMessage}</Alert>
                </Grid>
            </Grid>;

}