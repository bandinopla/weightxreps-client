import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Chip,
	Divider,
	LinearProgress,
	Paper,
	TextField,
	Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { parseError } from "../../data/db";
import {
    useDeleteTweetMutation,
	useGetSessionQuery,
	useGetTwitterChallengesQuery,
    useGetTwitterChallengesStatusesQuery,
    useSetTweetMutation,
} from "../../data/generated---db-types-and-hooks";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ActionChipButton } from "../action-chip-button";
import { OpenConfirmModal } from "../Dialog";
import { useMemo, useRef } from 'react';
import { AsciiSpinner } from "../ascii-spinner";
import CloseIcon from '@material-ui/icons/Close';

function TwitterChallenges() {
	const { data } = useGetSessionQuery();
	const challenges = useGetTwitterChallengesQuery();
    const states = useGetTwitterChallengesStatusesQuery({ notifyOnNetworkStatusChange:true });
    const statesError = useMemo(()=>states.error? parseError(states.error) : null, [ states.error ]);
    const isLogged = data?.getSession?.user.id > 0;
 
    

	if (challenges.loading) {
		return <LinearProgress />;
	}

	if (challenges.error) {
		return (
			<Alert severity="error" onClose={() => challenges.refetch()}>
				{parseError(challenges.error)}
			</Alert>
		);
	}

	return (
		<>   

			{challenges.data.getTwitterChallenges.map((challenge, i) => { 

                const challengeState = states.data?.getTwitterChallengesStates?.find(state=>state.type==challenge.type);

                return <Accordion key={challenge.type} style={{ border:"5px solid #1D9BF0"}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">

                                    {
                                        !isLogged ? <Chip label="Login required" disabled /> 
                                        :
                                        states.loading ? <Chip label="Loading status..." disabled /> 
                                        : 
                                        statesError ?<Chip label="Error..." disabled /> 
                                        :
                                        !challengeState ? <Chip label="Available" variant="outlined"/> 
                                        :
                                        challengeState.granted? <Chip label="Granted" color="secondary" />
                                        :
                                        <Chip label="In progress" color="secondary" disabled/>
                                    }
 
                                    
                                    &nbsp; { challenge.title }</Typography>
                            </AccordionSummary>
                            <AccordionDetails>

                                <Typography variant="subtitle1" gutterBottom component="div">

                                <Paper elevation={1}>
                                <pre style={{ whiteSpace:"pre-line", background:"#eee", fontSize:"1.1em", padding:10}}>
                                { challenge.description }
                                </pre>
                                </Paper>

                                <div style={{ fontSize:"2em", marginTop:10}}> 

                                    {
                                        !isLogged ? <Alert severity="warning"> You have to log in to see your status on this challenge. </Alert> 
                                        : 
                                        states.loading ? <AsciiSpinner label="wait..." />
                                        :
                                        statesError ? <Alert severity="error"> {statesError} </Alert> 
                                        :
                                        !challengeState ? <ChallengeController type={ challenge.type } refetch={ states.refetch } />
                                        :
                                        <Alert severity="info">
                                            {challengeState.status} 
                                            <br/>
                                            <a href={`https://twitter.com/weightxreps/status/${ challengeState.tweet }`} target="_blank">Tweet used in this challenge</a>
                                            { !challengeState.granted && <><br/><br/><AbortChallengeButton tweet={ challengeState.tweet } refetch={ states.refetch } /></>}
                                        </Alert>
                                    }

                                    
 
                                </div>

                                </Typography>
                                
                            </AccordionDetails>
                        </Accordion>
                        })}
		</>
	);
}


function ChallengeController({ type, refetch })
{
    const ref = useRef();
    const [ setTweet ] = useSetTweetMutation();


    const ExecuteChallenge = async () => {

        return new Promise( (resolve, reject ) => {

            OpenConfirmModal({

                open:true,

                onConfirm: async () => {
                    //.... 

                    const tweetUrl = ref.current.value;
                    const tweetId = tweetUrl.match(/\/status\/(\d+)/)?.[1];
                    
                    if( !tweetId )
                    {
                        throw new Error("Invalid twit URL, it should look like this: https://twitter.com/user/status/123456789012345678");
                    }
                    else 
                    { 
                        setTweet({ variables: { type, tweetID: tweetId }})
                            .then( res => {

                                if( res.data?.setTweet )
                                {
                                    resolve(); 
                                    refetch();
                                    
                                }
                                else 
                                {
                                    reject( res.errors.map(err=>err.message).join(" ||| ") );
                                }
                                
                            })

                            .catch( reject )
                    } 
                },

                onCancel: resolve,
                title: "Paste the url to the Tweet you want to use:",
                info:<TextField inputRef={ref} placeholder="URL of a tweet" label="https://twitter.com/user/status/123456789012345678" fullWidth />,
                canCancel: true, 
                verb: "Use this tweet"

            });


        });

    } 

    return <ActionChipButton IconClass={PlayArrowIcon} label="Start Challenge" labelWhenSending="Processing..." size="medium" executeAction={ExecuteChallenge}/>
}


function AbortChallengeButton({ tweet, refetch })
{
    const [ deleteTweet ] = useDeleteTweetMutation();

    const abort = async ()=>{

        const aborted = await deleteTweet({ variables: { tweetID:tweet }});

        if( aborted )
        {
            refetch();
        }
        else 
        {
            throw new Error("Unknown error, challenge failed to cancel.")
        }

    }

    return <ActionChipButton IconClass={CloseIcon} label="Cancel Ahallenge" labelWhenSending="Processing..." size="medium" executeAction={abort}/>
}

export default TwitterChallenges;
