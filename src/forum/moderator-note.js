import { Box, Divider, Paper, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

const useStyle = makeStyles( theme => ({
    root: {
        border:"1px solid "+theme.palette.primary.main,
        borderRadius:10
    },
    header: { 
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
    }
}))

export const ModeratorNote = ({ note }) => {

    const classes = useStyle();

    return (
        <Box marginBottom={2}>
            <Paper className={classes.root}>
                <Alert className={classes.header} severity="info" icon={<LibraryBooksIcon/>}><strong>A moderator added context that people might want to know</strong></Alert>
                <Divider/>
                <Box padding={2}>
                    { note }
                </Box>
            </Paper>
        </Box>
    )
}