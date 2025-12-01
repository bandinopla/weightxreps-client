import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ChatIcon from '@material-ui/icons/Chat';
import { useGetAiReviewQuery } from '../../data/generated---db-types-and-hooks';
import { Alert } from '@material-ui/lab';
import { LinearProgress } from '@material-ui/core';
import { parseError } from '../../data/db';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
	backgroundColor:"#333",
	border:"3px solid #222",
	color:"white", 
	[theme.breakpoints.down("sm")]: { flexDirection:"column"}
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: "45%",
	borderRadius:12,
	[theme.breakpoints.down("sm")]: { width:"100%", height:300}
  }, 
  Typography: {
	color:"white"
  },
  aiText: {
	whiteSpace:"pre-line",
	fontSize:"1.3em",
	marginTop:10,
	color:"cyan",
	fontFamily:"monospace"
  },
  acl :{
	borderTop:"1px dashed yellow",
	marginTop:14,
	fontSize:"1.1em",
	color:"yellow",
  }
}));

export function AIReview({ logid }){
  const classes = useStyles();
  const theme = useTheme();
  const {data, loading, error} = useGetAiReviewQuery({
	variables:{
		logid
	}
  })
 

  if( error ) return <Alert severity="error"><strong>AI Bot Error:</strong> {parseError(error)}</Alert>;

  if( loading ) return <LinearProgress/>;
  if( !data.getAiReview ) return "";

  return (
    <Card className={classes.root} elevation={5}>

		<CardMedia
        className={classes.cover} 
        title="Live from space album cover"
		image='/ai-bot.webp'
      	>
			 
		</CardMedia>

      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography variant='title'>
            <strong><ChatIcon/> </strong>
          </Typography>
          <div className={classes.aiText}>
            {data.getAiReview?.text ?? "???"}
          </div> 
		  <div className={classes.acl}>
			This is an experimental feature. We let an AI analyze this log based on your recent workouts (~4 weeks)
		  </div>
        </CardContent> 
      </div>
      
    </Card>
  );
}	