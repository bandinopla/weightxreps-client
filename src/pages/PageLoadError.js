import Alert from '@material-ui/lab/Alert';
import { Box, Button } from '@material-ui/core';
import { Grid } from '@material-ui/core';

export default function({ title, errorMessage, retry }) {

    return <Box padding={1}>
                    <Alert severity="error" action={<Button color="inherit" size="small" onClick={()=>retry()}>
                        Retry
                    </Button> }>
                    {errorMessage}</Alert>
                    </Box>;

}