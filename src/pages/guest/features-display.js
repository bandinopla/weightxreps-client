import { Box, Grid, Typography, withStyles } from "@material-ui/core"
import calendarFeatureUrl from './img/features/calendar.png'
import zoomUrl from './img/features/zoom.jpg'
import logUrl from './img/features/log.jpg' 
import prsUrl from './img/features/prs.jpg' 
import sbdUrl from './img/features/sbd.jpg' 
import jeditorUrl from './img/features/jeditor.jpg' 
import cstatsUrl from './img/features/communitystats.jpg' 

import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { useEffect, useRef, useState } from "react";
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GolfCourseIcon from '@material-ui/icons/GolfCourse';
import CreateIcon from '@material-ui/icons/Create';


export const FeaturesDisplay = ()=>{
    const featuresRef = useRef();

    return <div> 
                <DivStepper targetRef={featuresRef}/>
                
                <div ref={featuresRef}>

                <FeatureBox thumbnail={jeditorUrl}>
                            <Typography variant="h2">
                                <CreateIcon fontSize="large"/> Simple Editor
                            </Typography>
                            
                            <Box paddingTop={1}>
                                <Typography variant="h5" gutterBottom>Log your workouts just typing text</Typography> 
                                <Typography> 
                                    <ul>
                                        <li>If you follow a particular format it will be tracked</li> 
                                        <li>You can type whatever you want otherwise</li>
                                        <li>You can log multiple days at the same time too!</li>
                                    </ul>
                                </Typography>
                            </Box>
                        </FeatureBox> 

                <FeatureBox thumbnail={logUrl}>
                            <Typography variant="h2">
                                <VisibilityIcon fontSize="large"/> Rich Visualization
                            </Typography>
                            
                            <Box paddingTop={1}>
                                <Typography variant="h5" gutterBottom>Visually enriched logs!</Typography> 
                                <Typography> 
                                    <ul>
                                        <li>Sprinkled with some sweet stats!</li> 
                                        <li>Set scoring system based on data from <a href="https://www.openpowerlifting.org/" target="_blank">openpowerlifting.org</a></li>
                                        <li>Performance bars based on your best past self</li>
                                    </ul>
                                </Typography>
                            </Box>
                        </FeatureBox> 


                        <FeatureBox thumbnail={calendarFeatureUrl}>
                            <Typography variant="h2">
                                <InsertInvitationIcon fontSize="large"/> Calendar overview
                            </Typography>
                            
                            <Box paddingTop={1}>
                                <Typography variant="h5" gutterBottom>Easy to see and navigate calendar, with a clear overview of what's been done.</Typography>
                                <Typography>
                                    <ul>
                                        <li>Year overview to see how the year is going in terms of frecuency.</li> 
                                        <li>Easily see what you did the same day on a diferent year. </li>
                                        <li>"Zoom out" to see an overview of what you did in that period.</li>
                                    </ul>
                                </Typography>
                            </Box>
                        </FeatureBox>  
                    <FeatureBox thumbnail={zoomUrl}>
                            <Typography variant="h2">
                                <TrendingUpIcon fontSize="large"/> Weekly stats
                            </Typography>
                            
                            <Box paddingTop={1}>
                                <Typography variant="h5" gutterBottom>
                                    You can "zoom out" and see an overview of the cumulative work done in a period of weeks.
                                </Typography>
                                <Typography> 
                                    <ul>
                                        <li>Line chart to visually see volume, max weight and max ~1RM evolution</li> 
                                        <li>Table with all the exercises done and relevant cumulative data. </li>
                                        <li>Sort and filter the data you want</li>
                                    </ul>
                                </Typography>
                            </Box>
                        </FeatureBox>    

                    <FeatureBox thumbnail={prsUrl}>
                            <Typography variant="h2">
                                <GolfCourseIcon fontSize="large"/> Personal Records
                            </Typography>
                            
                            <Box paddingTop={1}>
                                <Typography variant="h5" gutterBottom>History log of your best lifts</Typography> 
                                <Typography> 
                                    <ul>
                                        <li>Numbers with a ~ symbol are "estimated"</li> 
                                        <li>Timeline from most recent to oldest</li>
                                        <li>Click on the date jumps to that log</li>
                                    </ul>
                                </Typography>
                            </Box>
                        </FeatureBox>  

                        <FeatureBox thumbnail={sbdUrl}>
                            <Typography variant="h2">
                                <GolfCourseIcon fontSize="large"/> SBD Scores
                            </Typography>
                            
                            <Box paddingTop={1}>
                                <Typography variant="h5" gutterBottom>Compare your lifts against more than <strong>2.000.000 lifts</strong> done by powerlifting athletes from arround the world</Typography> 
                                <Typography> 
                                    <ul>
                                        <li>Data from <a href="https://www.openpowerlifting.org/" target="_blank">openpowerlifting.org</a></li> 
                                        <li>See how you measure against athletes</li>
                                        <li>Keep yourself grounded</li>
                                    </ul>
                                </Typography>
                            </Box>
                        </FeatureBox>  

                        <FeatureBox thumbnail={cstatsUrl}>
                            <Typography variant="h2">
                                <GolfCourseIcon fontSize="large"/> Community stats
                            </Typography>
                            
                            <Box paddingTop={1}>
                                <Typography variant="h5" gutterBottom>See how you stack up against our community!</Typography> 
                                <Typography> 
                                    <ul>
                                        <li>Each month we generate community stats</li> 
                                        <li>Heat Map to see what the mayority is lifting</li>
                                        <li>Indicator showing where you at!</li>
                                    </ul>
                                </Typography>
                            </Box>
                        </FeatureBox>  

                        
                </div>
        </div>
}




const useStyles = makeStyles({
    root: {
      maxWidth: 400,
      flexGrow: 1,
      margin:"0 auto"
    },
  });


/**************************************************************
 * 
 *  DivStepper: as reference, expects a HTMLDivElement, it will scan it's `childNodes` to figure out total childs.
 *  It will turn the target into a grid layout, and childs will ocupy all the column 0 row 0 (stacked) and opacity will determine what item is seen.
 * 
 * *************************************************************
*/
export default function DivStepper({ targetRef }) {
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(()=>{

        if( targetRef.current )
        {
            const s = targetRef.current.style;
            s.display = "grid";
            s.gridTemplateColumns = "1fr";
            s.gridAutoRows = "min-content";
            setTotal( targetRef.current?.childNodes.length );
        }

        

    },[ targetRef.current ]);

    useEffect(()=>{

        /**
         * @type {HTMLDivElement[]}
         */
        const children = targetRef.current?.childNodes;

        for (var i = 0; i < children.length; i++) 
        {
            const child = children[i]; 
            const active = i==activeStep;

            child.style.opacity = Number(active);
            child.style.gridColumn = "1"
            child.style.gridRow = "1"
            child.style.pointerEvents = active? "all":"none";

            // if( active )
            // {
            //     targetRef.current.style.height = child.offsetHeight+"px";
            // }
        }

    }, [activeStep, total])

  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

  
    return (
      <MobileStepper
        variant="dots"
        steps={total}
        position="static"
        activeStep={activeStep}
        className={classes.root}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep+1 === total}>
            Next 
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back 
          </Button>
        }
        on="true"
      />
    );
  }



/*-------------------------------

       Just the feature Box ui

---------------------------------*/
const FeatureBox = withStyles(theme =>({
    root: {
        background: "linear-gradient(83deg, rgba(41,39,39,1) 0%, rgba(18, 92, 104) 82%);", 
        overflow:"hidden",
        borderRadius:30,   
        margin:20,  
        transition:"opacity 0.3s ease-in",
        maxWidth:"100%",

        "& > div": {
            flexGrow:1,
            overflow:"hidden", 
            height:"100%"
        }, 

        "& .MuiTypography-root": {
            color:"#eee", 
        }
    },
    thumbnail: {   
        borderTopLeftRadius:20, 
        transform:"rotate(-3deg)",  
        maxWidth:"100%",
        marginRight:"-20%",
        marginBottom:-20
    }, 
})) 
(({ title, thumbnail, children, classes }) => {
    return <div className={classes.root+" sha"}> 
 
             <Grid container  >
                <Grid item sm={12} md={6}>
                    <Box padding={5} textAlign={"left"}>
                        <Typography>{children}</Typography>
                    </Box>
                </Grid>
                <Grid item sm={12} md={6} container direction="column" justifyContent="flex-end">
                    <Grid item={12}>
                        <img src={thumbnail} className={ classes.thumbnail+" fatSha" }/>  
                    </Grid> 
                </Grid>
                 
                 
            </Grid> 
        </div>
});