import { Box, Container, Paper } from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';


export default function TermsPageBase({ children }) {

    const theme     = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));


    return <Container>
        <Box margin={smallScreen?0:5}>
            <Paper>
                <Box padding={smallScreen?0:5}>
                    {children}
                </Box> 
            </Paper>
        </Box>
    </Container>
}