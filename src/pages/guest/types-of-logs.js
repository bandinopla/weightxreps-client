import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import { Grid } from '@material-ui/core';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import TimerIcon from '@material-ui/icons/Timer';

import typeWxr from "./img/type-wxr.jpg";
import typeWxrLog from "./img/type-wxr-log.jpg";
import typeWxrCover from "./img/type-wxr-cover.jpg";

import typeWxD from "./img/type-wxd.jpg";
import typeWxDLog from "./img/type-wxd-log.jpg";
import typeWxDCover from "./img/type-wxd-cover.jpg";

import typeWxT from "./img/type-wxt.jpg";
import typeWxTLog from "./img/type-wxt-log.jpg";
import typeWxTCover from "./img/type-wxt-cover.jpg";

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const useStyles = makeStyles( theme=>({
    root: {   
        backgroundColor: theme.palette.background.paperInvert, 
         
        "& .MuiTypography-root ": {
          
        }
    },
    media: {
      height: 140,
    },
    mediaCover: {
        height: 330,
    }
  }));
  
export const TypesOfLog = ()=>{
    
  
    return <Grid container justifyContent="space-around" spacing={2}>
        <Grid item sm={4}><TypeCard cover={typeWxrCover} see={typeWxr} log={typeWxrLog} Icon={<FitnessCenterIcon fontSize='large'/>} title="Weight x Reps" desc="Log weight for reps training like Squats, Bench press, Deadlift, etc..."/></Grid>
        <Grid item sm={4}><TypeCard cover={typeWxDCover} see={typeWxD} log={typeWxDLog}  Icon={<LinearScaleIcon fontSize='large'/>} title="Distance" desc="Move weight for distance: Yoke Walks, Farmer's Carry, Weight Over Bar..."/></Grid>
        <Grid item sm={4}><TypeCard cover={typeWxTCover} see={typeWxT} log={typeWxTLog}  Icon={<TimerIcon fontSize='large'/>} title="Time" desc="Weight for time: Run, Planks, Static holds, Static bike, Grip endurance work..."/></Grid>
    </Grid>;
}

const TypeCard = ({ title, Icon, desc, cover, see, log })=>{
    const classes = useStyles();
    return <Card className={classes.root} elevation={4}>
      
      <CardMedia
            className={classes.mediaCover+" sha"}
            image={cover}
            title={title} 
          />
          <CardContent>
          

            <Typography gutterBottom variant="h4"  >
              {Icon} {title}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p">
              {desc}
            </Typography>
            <ArrowDownwardIcon  />
            
          <CardMedia
            className={classes.media+" sha"}
            image={log}
            title={title} 
          />
          </CardContent>  

          
        {/* <CardMedia
            className={classes.media}
            image={see}
            title={title}
          /> */}
      </Card>
}
  