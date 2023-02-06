import { makeVar, useReactiveVar } from "@apollo/client"
import { Box, Button, Chip, Divider, Paper, Typography } from "@material-ui/core";
import { useState } from "react";
import { StaticLogHighlighter } from "../../codemirror/LogTextEditor";
import { InfoDialog } from "../Dialog";

const $openTutorial = makeVar(false);

export const OpenTutorial = ()=>{

    console.log("OPEN TUTORIAL")
    $openTutorial(true);
}


export const TutorialContents = ()=>{
    const [show, setSHow] = useState(false);

    const exampleLog = `2021-09-24
@ 77 bw
This is an example log. The default unit here is "kg" so i dont have to type "kg" next to the weights... but i would have to type "lbs" if i decided to log Pounds.
    
#Squat
60, 80, 100, 140, 160 x 3 warmup sets
180 x 3, 3, 2 failed a 3rd rep on the 3rd set...
200 x 5 felt alright
200 5x7 5 sets of 7 reps...
220 x 2 x 10 @9.5 rpe that was hard!
220 x 2, 2, 2 @8, 8.5, 9 Multiple RPEs!
220 x 2 x 3 @8, 8.5, 9 Multiple RPEs!
500lbs Using pound plates!

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

DELETE

2021-09-26
I did nothing today... you dont always have to log an exercise...
that's it...`;

    return <div>

<iframe width="560" height="315" src="https://www.youtube.com/embed/T96bVtiewOY?start=53" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

            <Typography variant="h6" gutterBottom>Quick reference</Typography>
            
            Example log using all variations. This is how a log typically looks like: 

            <Box marginTop={1} marginBottom={5}>
                <Paper elevation={2}>
                    <StaticLogHighlighter initialValue={exampleLog} tags={["#sq","#bp"]} exercises={[ { id:1, name:"Squat", type:"sq"} ]}/>
                </Paper>
            </Box>

            <Typography variant="h6" gutterBottom>Detailed description: <Button variant={show?"outlined":"contained"} onClick={ ()=>setSHow(!show) }>{ show?"Hide":"Show"}</Button></Typography>

            { show && <div> 
            Typing your log consists of just writing in a particular format that the system recognizes. There are 6 types of "patterns" that will be recognized:
            <ul>
                <li>
                    
                    <strong>DAY</strong>: Optional (if not provided it will be assumed is "today"). to specify in which date you will be logging, on a new line, you must type the date of the day in one of the following formats:
                    
                    <ul>
                        <li><Chip size="small" label="YYYY-MM-DD" variant="outlined" /> Year - Month - Day</li>
                        <li><Chip size="small" label="Month Date" variant="outlined" /> Month's name (or 3 first letter), a space, the date. (will assume current year)</li>
                        <li><Chip size="small" label="Day Date" variant="outlined" /> Day's name (or 3 first letter), a space, the date. (will assume current year and month)</li>
                    </ul>
                </li>
            </ul>
            <Divider/>
            <ul>
                <li>
                    <strong>BODYWEIGHT</strong>: to specify how much you weigh on the day, on a new line, type one of the patters below that suits your style better:
                    <ul>
                        <li><Chip size="small" label="@ # BW" variant="outlined" /> "at" symbol, then a number and the keyword "BW"</li>
                        <li><Chip size="small" label="# BW" variant="outlined" /> Number then the keyword "BW"</li> 
                    </ul>
                </li> 
            </ul>

            <Divider/>
            <ul>
                <li>
                    <strong>EXERCISE</strong>: To log an exercise, you type the "#" symbol and write it's name. If it doesn't exists, it will be created, if it does, it will be used. To trigger the <strong>autocomplete</strong> you must hit CTRL+SPACE keys.
                    <ul>
                        <li><Chip size="small" label="#Name" variant="outlined" /> "#" symbol and the name of the exercise</li> 
                    </ul>
                </li> 
            </ul>

            <Divider/>
            <ul>
                <li>
                    <strong>a SET</strong>: To log a set you have several options:
                    <ul>
                        <li><Chip size="small" label="W x R x S" variant="outlined" /> The classic... <strong>Weight</strong> x <strong>Reps</strong> x <strong>Sets</strong>. you can omit sets if you only did 1. Also if you only did 1 rep and 1 set you can omit both.</li> 
                        <li><Chip size="small" label="W,W,W x R" variant="outlined" /> If you did many sets of same rep but diferent weight: you can type the weight of each set, separated by a comma and then x reps.</li> 
                        <li><Chip size="small" label="W x R,R,R" variant="outlined" /> Case were you do many sets with the same weight but diferent rep per set...</li> 
                        <li><Chip size="small" label="W S x R" variant="outlined" /> <strong>Weight</strong> then the <strong>sets</strong> x the <strong>reps</strong></li> 
                    </ul>
                </li> 
            </ul>

            <Divider/>
            <ul>
                <li>
                    <strong>RPE</strong>: To log the RPE of a set, right after the set, type in one of the following formats:
                    <ul>
                        <li><Chip size="small" label="@ # RPE" variant="outlined" /> "at" symbol followed by the RPE number and the keyword "RPE"</li> 
                        <li><Chip size="small" label="# RPE" variant="outlined" /> same as above but just number and keyword...</li> 
                        <li><Chip size="small" label="RPE #" variant="outlined" /> same as above but in reverse...</li>  
                    </ul>
                </li> 
            </ul>


            <Divider/>
            <ul>
                <li>
                    <strong>DELETE</strong>: To delete the contents of a day, type this keyword:
                    <ul>
                        <li><Chip size="small" label="DELETE" variant="outlined" /> It will delete everthing on that day, including comments and likes.</li>  
                    </ul>
                </li> 
            </ul>
                </div>}

            </div>;
}


export const TutorialModal = ()=>{
    const open = useReactiveVar($openTutorial);

    const handleClose = ()=>{
        $openTutorial(false);
    }
 

    return <InfoDialog scroll="body" open={open} title="Tutorial" onClose={handleClose} info={<TutorialContents/>}/>
            ;
}