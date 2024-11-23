import { useRef, useState } from 'react';
import { Button, Paper, IconButton, InputBase, makeStyles, Divider, LinearProgress, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useSearchLazyQuery } from '../data/generated---db-types-and-hooks';
import { Alert } from '@material-ui/lab';
import UnameTag from './uname';
import WeightValue from './weight-value';
import CloseIcon from '@material-ui/icons/Close';
import FetchMoreButton from './FetchMoreButton';
import { parseError } from '../data/db';
import HelpIcon from '@material-ui/icons/Help';
import { OpenConfirmModal } from './Dialog';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center', 
      border:"2px solid #ccc",
      borderRadius:45
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1, 
      color: theme.palette.type=='dark'? "white" : "blue",
      fontWeight:"bold"
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    searchResult: {
        margin:11,
        padding:12,
        fontSize:"1.2em"
        , "& + div": {
            borderTop:"1px dotted #ccc"
        }
    },
    ename: {
        marginLeft:10
    }
  }));


export const SearchBox = ({ children }) => {
    const classes = useStyles();
    const inputRef = useRef(); 
    const [nomore, setNomore] = useState(false);
    const [active, setActive] = useState(false);
    const [search, { loading, data, error, fetchMore, refetch }] = useSearchLazyQuery();

    const callSearch = ()=>{

        setActive(true);
        setNomore(false); 

        search({
            variables: {
                query: inputRef.current.value
            }
        })
        .then( res => {   
            setNomore( !(res.data?.search?.results?.length>0)  )
        })
        .catch( console.error )

    } 

    const loadMore = ()=>{ 

        return fetchMore({
            variables: {
                page: data.search?.page+1
            }
        }).then( res => {

            let thereAreMore = res.data.search?.results?.length>0;
            setNomore( !thereAreMore  );
            return thereAreMore;

        });
    } 

    const cancelSearch = ()=>{
        inputRef.current.value = "";
        setActive(false);
    }

    const onClickHelp = ()=>{
        OpenConfirmModal({
            title: "¿How to search?",
            open: true,
            verb: "Got it!",
            canCancel: false,
            info: <div>
                <Typography>The search expects some or all of the following elements:</Typography>
                <ul>
                    <li><strong>DATE</strong> In the form of YYYY-MM-DD but you can just write YYYY-MM or just YYYY. A range can be specified using the ~ symbol between 2 dates. Use a space to separate diferent dates.</li>
                    <li><strong>EXERCISE</strong> The name of an exercise. Use comma to separate optional names...</li>
                    <li><strong>SET</strong> Weight for Reps (and optionally the sets) In W x R x S format.</li>
                    <li><strong>USERNAME</strong> prefixed with @, the name of a user. Use comma to separate optional usernames or just type the @ again to name another exercise.</li>
                </ul>
                <Typography>Examples...</Typography>
                <ul>
                    <li><strong>"squat 140kg x 10"</strong></li>
                    <li><strong>"2020-10-01 bench 140 x 4"</strong></li>
                    <li><strong>"2020-12 2021-01 bench, squat, deadlift"</strong></li>
                    <li><strong>"2020-10-01 @UserName bench 140 x 4"</strong></li>
                    <li><strong>"2020-10-01 @UserName,AnotherUser bench 140 x 4"</strong></li>
                    <li><strong>"2020-10-01~2020-11-03 deadlift 225lb x 5"</strong></li>
                    
                </ul>
            </div>
        })
    }

    return <>
        <div style={{ display:"flex", maxWidth:500, flexDirection:"column", padding:"0 20px", alignContent:"stretch", margin:"20px auto"}}>
        <Paper className={classes.root} elevation={5}> 
            <InputBase 
                className={classes.input}
                placeholder="Search: 2020-10-01 squat 140x5x5"
                inputProps={{ 'aria-label': 'search google maps' }}
                inputRef={inputRef}
                onKeyDown={ev=>ev.code=='Enter' && callSearch()}
            />

            {active && 
            <IconButton type="button" aria-label="search" className={classes.iconButton} onClick={cancelSearch}>
                <CloseIcon />
            </IconButton> }

            <IconButton type="button" aria-label="search" className={classes.iconButton} onClick={onClickHelp}>
                <HelpIcon />
            </IconButton> 

            <IconButton type="button" aria-label="search" className={classes.iconButton} onClick={callSearch}>
                <SearchIcon />
            </IconButton> 
            </Paper>
        </div>
        <Divider/>
        {/* <LinearProgress/> */}
        
        {

            error? <Alert severity='error' action={ <Button>Close</Button> }>{ parseError(error) }</Alert>
            : loading? <LinearProgress/> 
            : active && data?.search? <>{ data.search.results.map( (result,i) => <div key={i} className={ classes.searchResult }>
                <a href={`/journal/${result.user.uname}/${result.ymd}`} target='_blank'><strong>{result.ymd}</strong></a> → <WeightValue value={result.weight} inkg={!result.inlbs}/> x <strong>{ result.reps}</strong>
                <strong className={classes.ename}>#{ result.exercise.name }</strong> by <UnameTag {...result.user} inline/>
            </div> ) } 

            <div style={{ textAlign:"center", padding:"40px 0px"}}>
                {/* nomore? "..." : <Button onClick={loadMore}>Load more</Button> */}
                <FetchMoreButton fetchMore={loadMore} nomore={nomore}/>
            </div>
            </>
            : children
        }
        </>
} 