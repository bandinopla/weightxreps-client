import { Box, Button, Container, Dialog, Grid, makeStyles, Typography, useTheme } from "@material-ui/core";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Typewriter from 'typewriter-effect';
import { useCurrentSession } from "../../session/session-handler";
import FeatureCard from "./FeatureCard";

//
import FeatureCalendarImg from "./img/feature-cal.jpg";
import ErowsImg from "./img/erows.jpg";
import ZoomImg from "./img/zoom-stats.jpg";
import PRsImg from "./img/prs.jpg";
import SinceBadgeSrc from "../../banners/since-badge.png";

const useStyles = makeStyles( theme=>({

    root: {
        //background: theme.palette.type=="dark"?"none": "linear-gradient(180deg, #fafafa 1%, rgba(0,0,0,0.03) 45%, #fafafa 86%)"
    },

    calloutLine: {
        backgroundColor:"#00BBF9",
        textAlign:"center",
        padding:"0 10px",
        "& *": { color:"#fefefe0", fontWeight:"bold" }
    },

    typewritterBanner: {
        display:"inline",
        textShadow: "2px 2px 2px #A5A5A5",
        "& strong": {
            color:"#df0019"
        }
    },

    subtitle: {
        margin:"30px 0",
        color:"#7d7c83",
        
        "& strong": {
            color: "#000"
        }
    },

    SecondSection: { 
        //background:"radial-gradient(circle, rgba(255,255,255,1) 1%, rgba(234,239,244,1) 50%, rgba(255,255,255,1) 100%)",
        //paddingTop:theme.spacing(5),
        paddingBottom:theme.spacing(5),
        "& a > strong": { 
        }, 
    }

}));// //theme.palette.type=="dark"? "#444" : "#444",


export const SectionTitle = ({ line1, line2, color }) => {

    const theme = useTheme();

    return      <><div className="line" style={{ width:80, borderTop:"3px solid black", marginBottom:5 }}></div>
                 <Typography  style={{color}}><strong>{line1}</strong></Typography> 
                <Typography variant="h2" gutterBottom>  <strong>{line2}</strong></Typography>
                </>;
}


export const GuestLandingPage = ()=>{

    const session = useCurrentSession();
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();

    if( session ) 
    {
        return null;
    }

    return <Box className={classes.root}>

  


        <div className={ classes.SecondSection } style={{ marginTop:theme.spacing(5)}}> 

            <Container >
            <Grid container spacing={3}>
                <Grid item sm={6}>

                <img src={SinceBadgeSrc} alt="Since 2011 Badge" style={{float:"right"}} />

                <SectionTitle line1="WELCOME TO" line2="WEIGHT X REPS" color={theme.PINK_COLOR}/>
 
 
                            <Typography variant="h6" className={classes.subtitle} >
                            <strong>Weight (x)For Reps</strong>, is an <strong>Open Source</strong> ( <a href="https://github.com/bandinopla/weightxreps-client" target="_blank">Frontend</a> & <a href="https://github.com/bandinopla/weightxreps-server" target="_blank">Backend</a> )  online training journal system (web & mobile*) that will allow you to keep your training data organized and tracked.
Several charts and graphs will aid you in better undertsanding your training.

                            <br/>
                            <br/>
                            <a href="https://web.archive.org/web/20110901000000*/https://weightxreps.net" target="_blank">Born in 2011</a>, before us, fitness used to be logged on a simple forum post. No specific tool existed online to such task. After we went online, slowly a bunch of sites and tools started to emerge showing similar functionality (coincidence?). We started it all.
                            </Typography> 
 

                            <div style={{ marginTop: theme.spacing(3)}}>
                *Also it is available for Android<br/>
                <a  href='https://play.google.com/store/apps/details?id=net.weightxreps.app&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                    <img  width="200" alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/>
                </a>
            </div>

                </Grid>
                <Grid item sm={6}> 
 

                            <SectionTitle line1="BUT WAIT" line2="¿What's the point?" color={theme.GREEN_COLOR}/>


                            <Typography variant="h6" className={classes.subtitle} >
                                It is very easy too see days, weeks and even months just pass you by without paying right of passage in the form of personal records! ;)
                                
                                Work, family &amp; life in general will offer you several pathways to gradually steer away from holding onto a somewhat decent fitness level. Take action!
                                &nbsp;<br/><br/><Link to="/signup"><strong>Developing the habit of logging your workouts will help you stay on track and keep your fitness awareness alive!</strong></Link>
                            </Typography> 
                            <Button size="large" onClick={()=>history.push("/signup")} color="primary" variant="contained" endIcon={<ArrowForwardIcon/>}>START NOW</Button>
                     
                    </Grid>
            </Grid>
            </Container>
        </div>

 
        <SectionSeparator>Features</SectionSeparator> 


        <Box textAlign="center" >
 
        <Container > 
                <Grid container spacing={3}  >
                    <Grid item sm={3}>
                        <FeatureCard
                            title="Intuitive Navigation"
                            img={FeatureCalendarImg}
                            >
                                Navigate your logs using your journal's calendar. 
                                <br/>This is how you navigate from workout to workout and it also allows you to 'zoom out' and see the compressed stats of a block of weeks. 
                            </FeatureCard>
                    </Grid>
                    <Grid item sm={3}>
                        <FeatureCard
                            title="Workout stats"
                            img={ErowsImg}
                            >
                                Each exercise has it's own stats:
                                <ul>
                                    <li>Volume/Reps/Sets in total</li>
                                    <li>Estimated ~1RM per set</li>
                                    <li>EFF (blue) bar: how the estimated 1RM of each set compares to your all time best estimated 1RM.</li>
                                    <li>INT (red) bar: how the weight on the bar of each set compares to your all time best heavyest weight lifted.</li>
                                    </ul>
                            </FeatureCard>
                    </Grid>
                    <Grid item sm={3}>
                            <FeatureCard
                            title="Week Stats!"
                            img={ZoomImg}
                            >
                                See how you did on a timespan of 3, 6, 9, etc.. weeks! 
                                <br/>Evaluate how a training block is performing. Focus on a single exercise or overlap them and see how they interact.
                            </FeatureCard>
                    </Grid>
                    <Grid item sm={3}>
                            <FeatureCard
                            title="Personal Records "
                            img={PRsImg}
                            >
                                Each exercise has it's own records page were we keep track of all your PRs.
                                <br/>Also, we show in which rep range you spent more of your efforts.
                            </FeatureCard>
                    </Grid>
                </Grid> 
                </Container>
        </Box>


        <br/>
        <SectionSeparator>PEOPLE ARE TRAINING!</SectionSeparator>

    </Box>
}



const SectionSeparator = ({ children })=>{
    return <Box marginTop={8} marginBottom={5}><Typography variant="h3" display="block"><div className="app-section-separator">{children}</div></Typography> </Box>;
}


const CallOutLine = ({ children })=>{
    const classes = useStyles();
    return <div className={classes.calloutLine }>
        <Typography variant="subtitle1">{children}</Typography>
        </div>;
}


const TypeWritterText = ()=>{
    const classes = useStyles();
    return <div className={ classes.typewritterBanner}><Typewriter 
                    options={{
                        strings: [ "Track your <strong>progress</strong>", 
                                    'Evaluate your <strong>overall volume</strong>',
                                    "Log your <strong>workouts</strong>"],
                        autoStart: true,
                        loop: true,
                    }}
            /></div>;
}


const OpenTutorialVideo = ({ children, ...rest }) => {

    const [open, setOpen] = useState(false);
 
    const handleClose = ()=>{
        setOpen(false);
    }


    return <>
        <Button variant="outlined" {...rest} onClick={ ()=>setOpen(true) } startIcon={<VideoLibraryIcon/>}  >Watch in action!</Button>
        <Dialog open={open} onClose={ handleClose } maxWidth="lg">
 
                <iframe style={{width:1280, height:720}}  src="https://www.youtube-nocookie.com/embed/T96bVtiewOY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              
        </Dialog>
    </>;
}