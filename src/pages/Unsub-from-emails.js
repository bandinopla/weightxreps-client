import { Box, Container, Paper, Typography } from "@material-ui/core";

import { useHistory, use } from "react-router-dom";
import { AsciiSpinner } from "../componentes/ascii-spinner";
import { parseError } from "../data/db";
import { useUnsubFromEmailsMutation } from "../data/generated---db-types-and-hooks";
import {useEffect} from 'react';

function UnsubFromEmails({ location }) {
	// const { data, loading, error } = useGetVideosQuery();
    
    const key = location.search.match(/key=([^&]+)/);
    const [unsub, { data, loading, error }] = useUnsubFromEmailsMutation({ variables: { token: key?.[1] }} )

    

	// if (loading) {
	// 	return <LinearProgress />;
	// }

    useEffect(()=>unsub().catch(e=>{}), []);

	return (
		<div style={{ boxSizing:"content-box", margin:20}}>
            <Container>
            <Paper elevation={3}>
                <Box padding={4}>
                
                    {
                        loading? <>
                                    <Typography variant="h5">
                                        <AsciiSpinner label={"Unsubscribing"}/>
                                    </Typography> 
                                  </>

                        :error? <>
                                    <Typography variant="h3">
                                        Oops!
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        { parseError(error ) }
                                    </Typography></>

                        : <>
                            <Typography variant="h3">
                                Unsubscribed 
                            </Typography>
                            <Typography variant="subtitle1">
                                Unsubscribed from email notifications, you won't recieve more emails from this site.
                                <br/>You can re-enable this at any time by going to your settings.
                            </Typography>
                            <br/>
                            <a href="/">Ok, great!</a>
                            </> 
                    }
                    
                
                </Box>
                </Paper>
            </Container>
             
		</div>
	);
}

export default UnsubFromEmails;
