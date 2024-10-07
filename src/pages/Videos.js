import { Box, Button, Grid, LinearProgress, Typography } from "@material-ui/core";
import { useGetVideosQuery } from "../data/generated---db-types-and-hooks";
import { parseJlog } from "../componentes/journal/jparser";
import UnameTag from "../componentes/uname";
import { parsedTags2render } from "../componentes/user-text-to-parsed-tags";
import { useHistory } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { LikeJournalButtonManual } from "../componentes/like-button";
import LinkIcon from '@material-ui/icons/Link';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import FetchMoreButton from "../componentes/FetchMoreButton";
import { date2timeago } from "../componentes/TimeAgoDisplay";



function VideosPage() {
    const LIMIT = 50;
	const { data, loading, error, fetchMore } = useGetVideosQuery({
        variables: {
            limit:LIMIT
        }
    });

    const history           = useHistory(); 

	if (loading) {
		return <LinearProgress />;
	}

    if( error )
    {
        return <Alert severity="error">{error.message}</Alert>
    }

	return (
		<div style={{ boxSizing:"content-box", margin:10}}>
            <Box padding={1}>
                <Alert severity="warning"><strong>Experimental section:</strong> Video links posted in journals (youtube and instagram links).</Alert>
                { data.getVideos?.length<=0 && <Alert severity="warning">No videos found in logs yet...</Alert>}
            </Box>
			<Grid container spacing={1}>
				{data.getVideos.map((vid) => {
					const tag = parseJlog(vid.link, [], [], 0, 0) ;

                    

					return (
						<Grid item xs={12} sm={6} md={4} key={vid.link}>
 
                                <Box padding={1} >
                                    <Box> 
                                        {/* <LikeJournalButtonManual jownerID={vid.user.id} logid={vid.logid} logYMD={vid.posted} style={{ float:"right"}}/> */}
                                        <UnameTag {...vid.user} inline={true} style={{backgroundColor:"white", padding:"1px 10px"}}/> on <Button startIcon={<DoubleArrowIcon/>} variant="outlined" onClick={()=>history.push(`/journal/${vid.user.uname}/${vid.posted}`)}><strong>{vid.posted}</strong> </Button>
                                        
                                    </Box>
                                    { parsedTags2render(tag) }
                                    
                                    <Typography variant="caption" style={{ marginTop:-20}} component={"div"}>
                                        log posted { date2timeago(vid.when)  }
                                    </Typography>
                                    
                                </Box> 
						</Grid>
					);
				})}
			</Grid>

            {
                data.getVideos?.length>0 && <Box textAlign={"center"} padding={2}>
                <FetchMoreButton fetchMore={ ()=>fetchMore({ variables: { olderThan: data.getVideos[data.getVideos.length-1].when } }).then( resp=>resp.data.getVideos?.length>0 ) }/>
                </Box>
            }
            
            
		</div>
	);
}

export default VideosPage;
