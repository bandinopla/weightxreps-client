import { Box, Button, Container, Divider, Grid, makeStyles, TableFooter, Typography } from "@material-ui/core"
import { AsciiSpinner } from "../componentes/ascii-spinner";
import TimeAgoDisplay from "../componentes/TimeAgoDisplay";
import UnameTag from "../componentes/uname"
import { useGetAnnouncementsQuery, useGetSupportersQuery } from "../data/generated---db-types-and-hooks"
//----
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useState } from "react";
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
//--
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import FingerprintOutlinedIcon from '@material-ui/icons/FingerprintOutlined';
import { parseUserComment } from "../componentes/journal/jparser";
import { userTextToParsedUI } from "../componentes/user-text-to-parsed-tags";
import { Alert } from "@material-ui/lab";
import { parseError } from "../data/db";

// --- glogos
import reactLogo from "./AboutPage/reactjs-ar21.svg";
import graphqlLogo from "./AboutPage/graphql-ar21.svg";
import apolloLogo from "./AboutPage/apollographql-ar21.svg";
import nodeLogo from "./AboutPage/nodejs-ar21.svg";
import expressLogo from "./AboutPage/expressjs-ar21.svg";
import mysqlLogo from "./AboutPage/mysql-ar21.svg";
import babelLogo from "./AboutPage/babeljs-ar21.svg";
import webpackLogo from "./AboutPage/js_webpack-ar21.svg";
import dockerLogo from "./AboutPage/docker-ar21.svg";
import LoopIcon from '@material-ui/icons/Loop';
import { useHistory } from "react-router-dom";
import BuildIcon from '@material-ui/icons/Build';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import { FollowOnX, LatestTweets } from "../componentes/twitter";

const useStyles = makeStyles( theme => ({

    logos: {
        "& a": {
            display:"block",
            padding:10,
            margin:10,
            background:"#eee"
        }
    }

}));

export default function AboutPage() {

    const classes = useStyles();
    const history = useHistory();

    const { data, loading, error } = useGetSupportersQuery();
    const { data:announcements, loading:loadingAnnouncements, error:error2 } = useGetAnnouncementsQuery({
        variables: {
            limit:3
        }
    });

    return <Container >

        <Grid container spacing={4}>

        <Grid item sm={6}>
            <Box marginTop={5}>
                <Typography variant="h3" gutterBottom>
                    <FingerprintOutlinedIcon/> About
                </Typography>
                <Divider/><br/>
                <Typography> 
                    Created, Developed and Designed by <a href="mailto:pablo@weightxreps.net"><strong>Pablo Bandinopla</strong></a> ( <UnameTag inline  id={1} uname="tlast2o12dude" cc="ar"/> ) a <a href="https://github.com/bandinopla" target="_blank">Full Stack web developer</a> with a passion for <a href="https://en.wikipedia.org/wiki/Powerlifting" target="_blank">Powerlifting</a>.
                    <br/><br/>Read as "Weight For Reps". <a href="https://web.archive.org/web/20220000000000*/https://weightxreps.net" target="_blank">Running since 2011</a>. This site provides a way to log your weight training workouts ( Most suited for Powerlifting ) in which several stats and graphs are generated based on that data as to aid you in better undertsanding your progress and overall intensity to volume ratio.

                    <br/>
                    <br/>
                    Take a look at the <a href="https://www.youtube.com/watch?v=rDopX0mV3Dc" target="_blank">old version</a> &nbsp; 
                        <Typography variant="caption">(before the september 26, 2021 update)</Typography>
                </Typography>
            </Box>

            <Box marginTop={5}>
                <Typography variant="h3" gutterBottom> 
                    <ImportContactsIcon/> Open SOURCE
                </Typography>
                <Divider/><br/>
                <Typography>  
                <iframe src="https://ghbtns.com/github-btn.html?user=bandinopla&repo=weightxreps-server&type=star&count=true&size=large" frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
<br/><strong>The Backend code</strong> is open source at: <a href="https://github.com/bandinopla/weightxreps-server" alt="Backend Open Source Link" target="_blank">https://github.com/bandinopla/weightxreps-server</a>. 
                </Typography>
                <br/><Divider/><br/>
                <Typography>  
                <iframe src="https://ghbtns.com/github-btn.html?user=bandinopla&repo=weightxreps-client&type=star&count=true&size=large" frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
<br/><strong>The Frontend code</strong> is open source at: <a href="https://github.com/bandinopla/weightxreps-client" alt="Frontend Open Source Link" target="_blank">https://github.com/bandinopla/weightxreps-client</a>. 
                </Typography>

            </Box>


            <Box marginTop={5}>
                <Typography variant="h3" gutterBottom>
                    <BuildIcon/> Made with
                </Typography>
                <Divider/><br/>
                <Typography>
                    The following stack was used to develop this site:

                    <br/>
                    <br/>
                    <Grid container className={classes.logos}>

                        <Grid item xs={4}><a href="https://reactjs.org/" target="_blank"><img width="100%" src={reactLogo}/></a></Grid>
                        <Grid item xs={4}><a href="https://graphql.org/" target="_blank"><img width="100%" src={graphqlLogo}/></a></Grid>
                        <Grid item xs={4}><a href="https://www.apollographql.com/" target="_blank"><img width="100%" src={apolloLogo}/></a></Grid>

                        <Grid item xs={4}><a href="https://nodejs.org/" target="_blank"><img width="100%" src={nodeLogo}/></a></Grid>
                        <Grid item xs={4}><a href="https://expressjs.com/" target="_blank"><img width="100%" src={expressLogo}/></a></Grid>
                        <Grid item xs={4}><a href="https://www.mysql.com/" target="_blank"><img width="100%" src={mysqlLogo}/></a></Grid>

                        <Grid item xs={4}><a href="https://babeljs.io/" target="_blank"><img width="100%" src={babelLogo}/></a></Grid>
                        <Grid item xs={4}><a href="https://webpack.js.org/" target="_blank"><img width="100%" src={webpackLogo}/></a></Grid>
                        <Grid item xs={4}><a href="https://www.docker.com/" target="_blank"><img width="100%" src={dockerLogo}/></a></Grid>

                    </Grid>
                </Typography>
            </Box>

            <Box marginTop={5}>
                <Typography variant="h3" gutterBottom>
                    <FavoriteBorderIcon/> Thanks to...
                </Typography>
                <Divider/><br/>
                <Typography gutterBottom style={{marginBottom:20}}>
                    The following people have supported the site in the way of donations (non recurrent, at will) in the past and or present. Thanks to everyone who donated! We will never forget those who provided help/support. 
                </Typography>

                { loading && <AsciiSpinner label="Loading supporters list..."/> }
                { error && <Alert severity="error">{ parseError(error)}</Alert> }
                { data &&  <SupportersTable supporters={data.getSupporters}/> }
            </Box>
        </Grid>


        <Grid item sm={6}>
             <Box marginTop={5}>
                <Typography variant="h3" gutterBottom>
                    <LoopIcon/> What's new?
                </Typography>
                <Divider/><br/>
                <FollowOnX showName/>
                I post on X things related to the site.
                <br/>
                Check what has changed, fixed or was added here: <Button variant="outlined" onClick={()=>history.push("/changelog")}>See Changelog</Button>
            </Box>


            <Box marginTop={5}>
                <Typography variant="h3" gutterBottom>
                    <RssFeedIcon/> Last 3 Announcements
                </Typography>
                <Divider/><br/>
                { loadingAnnouncements && <AsciiSpinner label="Loading announcements..."/> }
                { error2 && <Alert severity="error">{ parseError(error2)}</Alert> }
                { announcements?.getAnnouncements.map( announcement =><Announcement key={announcement.id} item={announcement}/> )}
                { !announcements?.getAnnouncements?.length && <Alert severity="info">Nothing was announced yet...</Alert>}
            </Box>
        </Grid>

        </Grid>

    </Container>
}


const SupportersTable = ({ supporters })=>{

    const [page, setPage]   = useState(0);
    const itemsPerPage      = 10;

    return <>
    
                <TableContainer component={Paper}>
                <Table size="small">
                    

                    <TableHead>
                        <TableRow>
                            <TablePagination
                             
                            colSpan={3}
                            count={supporters.length}
                            rowsPerPage={itemsPerPage}
                            rowsPerPageOptions={[itemsPerPage]}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onPageChange={(event, newPage) => setPage(newPage)} 
                            ActionsComponent={TablePaginationActions}
                            />
                        </TableRow> 
                    <TableRow>
                        <TableCell width={150}>Last Support</TableCell>
                        <TableCell>Username</TableCell> 
                    </TableRow>
                    </TableHead>

                    <TableBody>
                    {supporters
                        .filter( (itm,i)=>i>=page*itemsPerPage && i<(page*itemsPerPage)+itemsPerPage )
                        .map((row) => (
                        <TableRow key={row.user.id}>

                            <TableCell>
                                <TimeAgoDisplay time={row.when} />
                            </TableCell> 

                            <TableCell component="th" scope="row">
                                <UnameTag {...row.user} inline/> 
                            </TableCell>
                            
                        </TableRow>
                    ))}
                    </TableBody>

                    

                </Table>
                </TableContainer>
    
    </>
}


const Announcement = ({ item }) => {

    return  <Paper elevation={1} style={{marginTop:10}}> 

                    <Alert severity="info">
                    
                        <Typography variant="body2" style={{wordBreak:"break-word",
                                                            whiteSpace: "pre-wrap"}}>
                              
                            { userTextToParsedUI(item.text) }

                        </Typography>
                        <div >
                    — <Typography variant="caption"><TimeAgoDisplay time={item.when}/></Typography>
                    </div>
                    </Alert>


                    {/* { userTextToParsedUI( item.text ) } */}
                    
                  
            </Paper>
    
}