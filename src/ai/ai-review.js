import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ChatIcon from '@material-ui/icons/Chat';
import { useGetAiReviewQuery } from '../data/generated---db-types-and-hooks';
import { Alert } from '@material-ui/lab';
import { Button, LinearProgress } from '@material-ui/core';
import { parseError } from '../data/db';
import { useContext, useEffect, useState } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { JOwnerContext } from '../pages/journal-context';
import { useGetSession } from '../session/session-handler';
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

let $profiles;

 

export function AIReview({ logid }){

  const { session } = useGetSession()
  const jowner = useContext(JOwnerContext);
  const classes = useStyles();
  const theme = useTheme();
  const {data, loading, error} = useGetAiReviewQuery({
	variables:{
		logid
	}
  }); 
  const [profiles, setProfiles] = useState();
  const [aiImage, setAiImage] = useState();
  const [aiName, setAiName] = useState();
  const [aiError, setAiError] = useState();
  const errorMessage = error || aiError;
  const isLoading = loading || !profiles;
 
 

  useEffect(()=>{

	setAiImage(null);
	setAiName(null);

	if( data?.getAiReview )
	{
		if(!$profiles)
		{
			$profiles = fetch( process.env.REACT_APP_AIHOST+"/aiprofile/types.json" ).then( res=>res.json() );
		}  

		let unmounted = false;

		$profiles.then( list => {
			if(unmounted) return;

			setProfiles(list);
			if( data.getAiReview.aiprofile )
			{
				const profile = list.find(p=>p.index==data.getAiReview.aiprofile );
				if( profile )
				{
					setAiImage( process.env.REACT_APP_AIHOST+profile.imageUrl );
					setAiName( profile.realName );
				}
			}
		}, err => {
			if(unmounted) return;
			setAiError("Failed to load AI review due to: "+err.toString())
		}) ;

		return ()=>{
			unmounted = true;
		}

	}

  }, [ data ]);
 

  if( errorMessage ) return <Alert elevation={5} severity="error"><strong>Oops! Error:</strong> {parseError(errorMessage)}</Alert>;

  if( isLoading ) return <LinearProgress/>;
  if( !data.getAiReview ) return "";

  return (
    <Card className={classes.root} elevation={5}>

		<CardMedia
        className={classes.cover} 
        title="Live from space album cover"
		image={ aiImage ?? "/ai-bot.webp" }
      	>   
		</CardMedia>

      <div className={classes.details}> 
        <CardContent className={classes.content}>
          <Typography variant='h3' style={{ color:"#999"}}>
            <strong><ChatIcon/> <span style={{ color:"yellow"}}>{aiName ?? "Generic Ai Bot"}</span>'s review: </strong>
          </Typography>
          <div className={classes.aiText+" mb20"}>
            {data.getAiReview?.text ?? "???"}
          </div> 
		  {!aiName && (session?.user?.id==jowner.id)  && <Alert severity='info' action={<Button onClick={()=>window.open("/ask-ai","_self")} variant='outlined' startIcon={<SettingsIcon/>}>Configure personality</Button>}>
			Using the <strong>Generic AI</strong>. Pick a <strong>Personality</strong> →→
			</Alert>}
		  <hr/>
		  <Alert severity='warning' elevation={5}
		  >This is an experimental feature. We let an AI analyze this log based on your recent workouts (~4 weeks). The style used is the one you chose in the <a href="/ask-ai" target='_self'>ASK THE AI</a> section.</Alert>
        </CardContent> 
      </div>
      
    </Card>
  );
}	