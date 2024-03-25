import { Box, Divider, Paper, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyle = makeStyles( theme => ({
    root: {
        border:"3px solid "+theme.palette.primary.main,
        borderRadius:10
    },
    header: {
        background:"rgba(0,0,0,0.1)",
        borderTopRightRadius:10,
    }
}))

export const ModeratorNote = ({ note }) => {

    const classes = useStyle();

    return (
        <Box margin={2}>
            <Paper className={classes.root}>
                <Alert severity="info"><strong>A moderator added context that people might want to know</strong></Alert>
                <Divider/>
                <Box padding={2}>
                    { note }
                </Box>
            </Paper>
        </Box>
    )
}