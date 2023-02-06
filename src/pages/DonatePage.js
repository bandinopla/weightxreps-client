import { Box, Container, Divider, Grid, makeStyles, Paper, Typography } from "@material-ui/core"
import { useCurrentSession } from "../session/session-handler";

const useStyles = makeStyles( theme=>({

    logo: { 
        //transform: "rotate(-3deg)"
    }

}));

export const DonatePage = ()=>{
    const classes = useStyles();
    const session = useCurrentSession();

    return <Container style={{ minHeight:"80vh"}} maxWidth="sm">


                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    style={{ minHeight:"80vh"}}
                >

                    <Grid item>
                        <Paper elevation={2} >
                            <Box padding={1}>
                            <Grid container >
                                <Grid xs={12} item style={{textAlign:"center"}}>
                                    <img className={classes.logo} src="/donate.png"/>
                                </Grid>

                                <Grid item  xs={12} >

                                    <Box padding={2} textAlign="center"> 
                                    <form name="_xclick" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                                        <input type="hidden" name="cmd" value="_xclick" />
                                        <input type="hidden" name="business" value="pablo@weightxreps.net" />
                                        <input type="hidden" name="currency_code" value="USD" />
                                        <input type="hidden" name="item_name" value={"Donation to Weightxreps.net"+(session?" by "+session.user.uname : "")} />
                                        <input type="hidden" name="item_number" value={"by_"+(session?.user.uname || "Unknown")}/>
  
                                        <input type="image" src="https://weightxreps.net/img/paypal-support.jpg" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"/>
                                    </form>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider/>
                            <Box padding={2}>
                                <Typography variant="h4" gutterBottom>Become a <strong>supporter</strong>!</Typography>

                                <Typography gutterBottom>Donations keeps the site alive!</Typography>
                                <Typography>
                                    By donating you become a "supporter". That means "someone who at some poin in time sent some monetary support". This is always manual, non recurrent nor automatic, so dont worry, this site wont leach your wallet. 
                                </Typography>
                                <br/>
                                <Typography>
                                    At the moment only PayPal is available.
                                </Typography>
                                <br/>
                                <Typography variant="h6">What do i get?</Typography>
                                <Typography gutterBottom>Well, a donation is not a monetary transaction, no goods are exchanged. But, as a token of appreciation, you will be granted with some virtual goodies:

                                    <ul>
                                        <li>Calendar zoom increased up to <strong>32 weeks</strong></li>
                                        {/*<li>Unlocks <strong>Download</strong> in settings (while active*)</li>*/}
                                        <li>Unlocks <strong>Private mode</strong> (while active*, but stays ON if you dont turn it off)</li>
                                        <li><strong>Blue ribbon</strong> (while active*) Next to your username.</li>
                                        <li><strong>Supporter badge</strong> (permanent) to let everyone know you helped the site stay alive!</li>
                                    </ul> 
                                </Typography>

                                <Typography variant="caption">
                                    *"active" means you donated recently. For example, after some period of time, depending on how much you donate, you will lose the "active supporter" status but will retain the "supporter" badge forever.
                                </Typography>
                            </Box>
                            </Box>
                        </Paper> 
                    </Grid>

                </Grid>

        
    </Container>;
}