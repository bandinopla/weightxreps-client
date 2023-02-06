import { Box, Button, Grid, LinearProgress } from "@material-ui/core";
import { useGetVideosQuery } from "../data/generated---db-types-and-hooks";
import { parseJlog } from "../componentes/journal/jparser";
import UnameTag from "../componentes/uname";
import { parsedTags2render } from "../componentes/user-text-to-parsed-tags";
import { useHistory } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { LikeJournalButtonManual } from "../componentes/like-button";


function VideosPage() {
	const { data, loading, error } = useGetVideosQuery();
    const history           = useHistory(); 

	if (loading) {
		return <LinearProgress />;
	}

	return (
		<div style={{ boxSizing:"content-box", margin:20}}>
            <Box padding={2}>
                <Alert severity="info">Videos posted in logs. The first video link found in a log is used as representative of that day. Youtube and Instagram links are currently recognized.</Alert>
                { data.getVideos?.length<=0 && <Alert severity="warning">No videos found in logs yet...</Alert>}
            </Box>
			<Grid container spacing={1}>
				{data.getVideos.map((vid) => {
					const tag = parseJlog(vid.link, [], [], 0, 0) ;

                    

					return (
						<Grid item xs={12} sm={6} md={4} key={vid.link}>
 
                                <Box padding={1} >
                                    <Box> 
                                        <LikeJournalButtonManual jownerID={vid.user.id} logid={vid.logid} logYMD={vid.posted} style={{ float:"right"}}/>
                                        <UnameTag {...vid.user} inline={true} style={{backgroundColor:"white", padding:"1px 10px"}}/> posted on <Button variant="outlined" onClick={()=>history.push(`/journal/${vid.user.uname}/${vid.posted}`)}><strong>{vid.posted}</strong> </Button>
                                        
                                    </Box>
                                    { parsedTags2render(tag) }
                                </Box> 
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
}

export default VideosPage;
