import {
	Box,
	Container,
	Divider,
	Grid,
	makeStyles,
	Paper,
	Typography,
} from "@material-ui/core";
import TwitterChallenges from "../componentes/twitter-to-donate/TwitterChallenges"; 
import { useGetSession } from "../session/session-handler";
import slvlsUrl from "../componentes/slvls.png";

const useStyles = makeStyles((theme) => ({
	logo: {
		//transform: "rotate(-3deg)"
	},
}));

export default function DonatePage() {
	const classes = useStyles();
	const { session } = useGetSession();

	return (
		<Container style={{ minHeight: "80vh" }}>
			<Grid
				container
				direction="row"
				justifyContent="center"
				style={{ minHeight: "80vh" }}
				spacing={5}
			>
				<Grid item md={6}> 
							<Grid container>
								<Grid item xs={12}>
									<Box padding={2}>
										<Typography variant="h4" gutterBottom>
											Become a <strong>Supporter</strong>
										</Typography>
									</Box>
								</Grid>
							</Grid>
							<Divider />
							<Box padding={2}>
								<Typography gutterBottom>
									Donations keeps the site alive!
								</Typography>
								<Typography>
									By donating you become a "supporter". That means "someone who
									at some poin in time sent some monetary support". This is
									always manual, non recurrent nor automatic, so dont worry,
									this site wont leach your wallet.
								</Typography>
								<br />
								<Typography>At the moment only PayPal is available.</Typography>
								<br />
								<Typography variant="h6">What do i get?</Typography>
								<Typography gutterBottom>
									Well, a donation is not a monetary transaction, no goods are
									exchanged. But, as a token of appreciation, you will be
									granted with some virtual goodies:
									<ul>
										<li>
											Calendar zoom increased up to <strong>32 weeks</strong>
										</li>
										{/*<li>Unlocks <strong>Download</strong> in settings (while active*)</li>*/}
										<li>
											Unlocks <strong>Private mode</strong> (while active*, but
											stays ON if you dont turn it off)
										</li>
										<li>
											<strong>Blue ribbon</strong> (while active*) Next to your
											username.
										</li>
										<li>
											<strong>Supporter badge</strong> (permanent) to let
											everyone know you helped the site stay alive!
                                            
										</li>
									</ul>
								</Typography>

								<Typography variant="caption">
									*"active" means you donated recently. For example, after some
									period of time, depending on how much you donate, you will
									lose the "active supporter" status but will retain the
									"supporter" badge forever.

                                    
								</Typography>

								<Box padding={1}>
									<img src={slvlsUrl} className="banner-fullrow"/>
									<Typography component={"div"} variant="caption">↳ Supporter ribbons based on amount of support over time. Placed on top of your avatar.</Typography>
								</Box>
							</Box> 
				</Grid>

				<Grid item md={6}>
					<Paper elevation={0}>
						<Box padding={0}>
							<Grid container>
								<Grid item xs={12}>
									<Box padding={2}>
										<Typography variant="h4" gutterBottom>
											Donate with <strong>Paypal</strong> ↓
										</Typography>
										
									</Box>
								</Grid>

								<Grid item xs={12}>
								<Divider />
									<Box padding={2} textAlign="center">
										<form
											name="_xclick"
											action="https://www.paypal.com/cgi-bin/webscr"
											method="post"
											target="_blank"
											class="pulsate"
										>
											<input type="hidden" name="cmd" value="_xclick" />
											<input
												type="hidden"
												name="business"
												value="pablo@weightxreps.net"
											/>
											<input type="hidden" name="currency_code" value="USD" />
											<input
												type="hidden"
												name="item_name"
												value={
													"Donation to Weightxreps.net" +
													(session ? " by " + session.user.uname : "")
												}
											/>
											<input
												type="hidden"
												name="item_number"
												value={"by_" + (session?.user.uname || "Unknown")}
											/>

											<input
												type="image"
												src="https://weightxreps.net/img/paypal-support.jpg"
												border="0"
												name="submit"
												alt="PayPal - The safer, easier way to pay online!"
											/>
										</form>
									</Box>
								</Grid>
 
							</Grid>
						</Box>
					</Paper>
					<br />
					<Paper elevation={2}>
						<Box padding={1}>
							<Grid container>
								<Grid item xs={12}>
									<Box padding={2}>
										<Typography variant="h4" gutterBottom>
											Donate with <strong>TWITTER</strong>
										</Typography>

                                        <Typography>
                                            This method consists on posting a tweet with a specific text for a specific amount of time and then you will be rewarded with supporter status <strong>AFTER that period of time has passed (a script will check it automatically everyday)</strong>. These are the current available options you have (you can pick any):
                                        </Typography> 
                                        
									</Box>

									<br/>
                    <TwitterChallenges/>
                                    
								</Grid>
 
							</Grid>
						</Box>
					</Paper>
                    
				</Grid> 
			</Grid>
		</Container>
	);
};
