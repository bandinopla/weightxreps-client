import {
    Box, Grid,
    Paper,
    Typography
} from "@material-ui/core";
import { useState } from "react";
import { StaticLogHighlighter } from "../../codemirror/LogTextEditor";
import { getExampleUTagsLog } from "../../codemirror/tag-parsing";
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import { InfoDialog } from "../Dialog";


export const exampleLog = `2021-09-24
@ 77 bw
This is an example log. If you don't clarify the weight unit, the default unit in your settings will be used. 
    
#Squat
60, 80, 100, 140, 160 x 3 warmup sets (all sets will have 3 reps)
180 x 6, 3, 2 this means 3 sets and how many reps on each set you did
200 x 5 Just weight and reps done
200 5x7 5 sets of 7 reps...
220 x 2 x 10 @9.5 rpe that was hard!
220 x 2, 2, 2 @8, 8.5, 9 Multiple RPEs!
220 x 2 x 3 @8, 8.5, 9 Multiple RPEs!
100 x 3/5 reps/sets
500lbs Using pound plates!

#Farmer's Walk
100x60m this is weight x distance
120x30m in 45sec this is weight x distance in time
140x10m x 4 this would be 4 sets of...
140x10m /4 this would be 4 sets of...

#Static bike
01:30:00 time in HH:MM:SS format
45min x 2 

#Running
1km just distance

#Some new exercise
100 x 4

2021-09-25
78 bw
You can log multiple days at the same time!

#Chinups
BW this would be 1 rep 1 set of just BW
BW+5 x 5, 5, 4, 3 total of 4 sets...
BW+5lbs using a 5 pounds plate...
BW+5, BW+20, BW+30 x 3 working sets...

2021-09-26
I did nothing today... you dont always have to log an exercise...
that's it...

2021-09-27 
DELETE
That keyword will confirm that you want to delete the log. Saving an empty log wont be considered an agreement for a delete operation because you might want to save an empty log to track your bodyweight.


2021-09-28
Custom tags are a way to track specific arbitrary aspects of your choise in a way that you can plot their values into a line chart and see the progress/evolution in the change of it's values over time:
${ getExampleUTagsLog() }`;
 

export const TutorialContents = () => {
	const [show, setSHow] = useState(false);

	

	return (
		<div style={{ color:"black !important"}}>
			<Grid container spacing={5}>
				<Grid item sm={6}>
					<Typography variant="h3" gutterBottom>Autocomplete</Typography>
					<Typography>Use the "trigger autocomplete" <FitnessCenterIcon fontSize="small"/> button ( or CTRL+SPACE ) to triger the autocomplete of an exercise's name when you have the cursor in a new line. You can type the first few letters of an exercise's name and then trigger the autocomplete to show a list of options.</Typography>
<br/>
<br/>
					<Typography variant="h3" gutterBottom>Example</Typography>

                    <Typography variant="h5" gutterBottom>
                        Sample log showing all possible ways to log:
                        <br/>
                        <br/>
                    </Typography>
					
					<Box marginTop={1} marginBottom={5} boxSizing="content-box">
						<Paper elevation={2}>
							<StaticLogHighlighter
								initialValue={exampleLog}
								tags={["#sq", "#bp"]}
								exercises={[{ id: 1, name: "Squat", type: "sq" }]}
                                utags={[]}
                                lines={20}
							/>
						</Paper>
					</Box>
					
				</Grid>

				<Grid item sm={6}>
                    <Typography variant="h3" gutterBottom>How this works?</Typography>  
                    <Typography variant="h5" gutterBottom>
                        When you log a workout you just type text. But if portions of this text have a particular format (shown in the example) the system will be able to extract data from the text and use it to track and chart values.
                    </Typography>
                    <br/> 
                    <Typography variant="subtitle1">
                        The process is simple: when the system reads the log and detects a pattern it will know what data can be extracted. With that data, it becomes possible to create things like line charts, PRs History, calculate total volume, reps, etc...
                        <br/>
                        <a href="https://www.youtube.com/embed/T96bVtiewOY?start=53" target="_blank">Watch a video tutorial</a>
                    </Typography>
                    <br/><br/>
                    <Typography variant="h4" gutterBottom>create an exercise</Typography>  
                    <Typography variant="h5" gutterBottom>
                        They are automatically created if you type "#" on a new line and then the name of the exercise. If it's new it will be created on save.
                    </Typography>
                    <br/><br/>
                    <Typography variant="h4" gutterBottom>Delete a log</Typography>  
                    <Typography variant="h5" gutterBottom>
                        Type the word "DELETE" on a new line. This is used as a confirmation of a delete action so you dont accidentally delete something.
                    </Typography>
				</Grid>
			</Grid>
		</div>
	);
};

export const TutorialModal = ({ openState }) => {
 

	return (
		<InfoDialog
			scroll="body"
			open={ openState[0] }
			title="Tutorial / Example"
			onClose={()=>openState[1](false)}
			info={<TutorialContents />}
			fullScreen
		/>
	);
};
