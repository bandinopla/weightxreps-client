import ForumIcon from '@material-ui/icons/Forum';
import { useGetForumPostIndexQuery, useGetForumSectionsQuery } from '../data/generated---db-types-and-hooks';
import { Box, LinearProgress, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'; 
import { Link, BrowserRouter as Router,
                useHistory,
                Switch,
                Route, } from "react-router-dom"; 
import { Forum } from './forum';
import { Thread, ThreadMessagesPerPage } from './thread';
import { PageLayoutTitle } from '../componentes/ContentPageWrapper';
import { Alert } from '@material-ui/lab';
import { useEffect } from 'react';

export default function ForumPage ({ match }) { 

        return (
            <Switch>
                <Route path={match.path} exact component={SectionsOfTheForum} />  
                <Route path={match.path+"/:slug/:thread/:title/locate--:postid"} exact component={FindPostAndGo} />  
                <Route path={match.path+"/:slug/:thread/:title"} exact component={Thread} />  
                <Route path={match.path+"/:slug/:thread/:title/:page"} exact component={Thread} />  
                <Route path={match.path+"/by--:username"} exact component={Forum} />  
                <Route path={match.path+"/:slug"} exact component={Forum} />  
            </Switch>
            
          );
}

const SectionsOfTheForum = ()=>{
    const { data, loading, error } = useGetForumSectionsQuery();

    if( loading )
        return <LinearProgress/>

    return <>
            <PageLayoutTitle none/>
            <Box>
                <img src="/forum-banner.jpg" alt="Forum Banner" className='banner-fullrow'/>
            </Box>
            <TableContainer component={Paper}>
                <Table >
                <TableHead>
                    <TableRow>
                    <TableCell>
                        <Alert severity='info'><strong>Forum Rules</strong> : use <a href="https://en.wikipedia.org/wiki/Common_sense" target='_blank'>common sense</a>, you are a grown up (˵ ͡° ͜ʖ ͡°˵)</Alert>
                    </TableCell>
                    <TableCell align="center">Threads</TableCell> 
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.getForumSections?.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                            <Box paddingLeft={2} paddingRight={2}>
                                <Typography variant='h4'><Link to={`/forum/${row.slug}`}>{row.name}</Link></Typography>
                                <Typography variant='h6'>{row.description}</Typography>
                            </Box>
                        </TableCell>
                        <TableCell align="center">{row.threads}</TableCell> 
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </>
}

const FindPostAndGo = ({ match, location })=>{

    const history = useHistory();
    const { data, loading, error } = useGetForumPostIndexQuery({
        variables: {
            postId: match.params.postid
        }
    }); 

    useEffect( ()=>{

        if( data )
        {
            const index = data.getForumPostIndex;
            const page = Math.ceil( (index+1) / ThreadMessagesPerPage);
 
            history.replace( location.pathname.replace("/locate--"+match.params.postid, `/${page}`) );
        }
       
    }, [data]);

    if( error )
    {
        return <Alert severity='error'>{error.message}</Alert>
    }

    return <LinearProgress/>
}