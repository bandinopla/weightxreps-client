import { Box, Container, Grid, Typography } from "@material-ui/core";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { UnameRef } from "../componentes/uname";

export const HelpPage = ()=>{
    return <Container maxWidth="md">
 
        <Grid container >
            <Grid item md={4}>
                <Typography variant="h2">
                    <InfoOutlinedIcon/> <strong>F.A.Q.</strong></Typography>
            </Grid>
            <Grid item md={8}>
  
                <Typography variant="h4" gutterBottom><strong>F</strong>requently <strong>A</strong>sked <strong>Q</strong>uestions</Typography>
                <br/>
                <Question title="Is this free?">
                    Yes! But there are some options/features that can be unlocked by donating (hey, bills...) 
                </Question>

                <Question title="Do you collect/sell data?">
                    No! Many sites out there are doing that to get some extra cash. We do not collect your behavioural info or any other weird stuff nor we build a parallel version of you, a cyber avatar, identical to you in every digital aspect and pretend like it's not data theft because of some semantic argument.
                </Question>


                <Question title="What is this site for?">
                This site is designed to help you track your gym progress. Mainly focused to exercises that involve lifting weight for a set number of repetitions and sets. This was developed to log powerlifting workouts (i train powerlifting) but can be used for bodybuilding and weightlifting too. It is not suited for cardio workouts... we lift weights here...
                </Question>

                <Question title="Why should i log my workouts?">If you dont track or measure what you do, you might fail to progress. It is important to track each workout to help you see if you are moving forward or stalling. Depending on your goals you might want to make adjustements since the body wont respond the same to the same workouts every single time... many things change, we age, our bodyweight change, stress in life, moving, family, etc...</Question>
                <Question title="How do i log my workouts?">
                    You log in into your account, go to your journal. You will see a calendar. You click on the day you want to log and write your workout and hit save, that's it! You dont need to pre-configure your exercises or anything like that, the system will recognize some patterns in the text on the fly and act accordingly. You just write.
                    {/* <br/><br/><Button variant="outlined" size="small" onClick={ ()=>OpenTutorial() }>Read the Tutorial / Manual</Button>
                    <TutorialModal/> */}
                    </Question>
                <Question title="Do i have to log all my workouts the same way?">No. You can log whatever you want. If you follow a specific format that will allow our system to extract information from your log and give you stats. But if you dont care to log accesory exercises for example you can log whatever you want. For example you can just type: "today i did abs" and save...</Question>
                <Question title="What is EFF and INT?">EFF = Effort. In this system it refers to the highest 1RM estimated based on a set of more than 1 rep.
<br/>INT = Intensity. For us it means weight on the bar. How heavy the set was.
</Question>
                <Question title="Where my data is stored?">
                    Your data is stored in the server. You can download it if you have an active supporter status. "Active" means you donated recently...
                    </Question>



                <Question title="How do i change my body weight in the profile?">
                    The body weight shown there is taken from the most recent log. When you post a log, if you use the bodyweight tag, it will be updated.
                </Question>

                <Question title="Can i log future/planned workouts?">
                    At the moment the system doesn't handle "future" logs. Whatever you type is what you did and will affect the stats. 
                    <br/> 
                    But a clever way that <UnameRef uid={2751} uname="Bartman"/> found to achieve a similar effect is to write the log as you would normally do and then prefix an "x" in front of the "#" symbol of each exercise. That would render the block as just plain text and will not affect the stats.
                </Question>

                

                <Question title="How to record exercises using either arms/legs alternatively">
                    To log that, you just type the reps you did per limb. For example, if you did biceps curls with dumbbells x 5 reps each arm, you just type x 5. If you let's say make 5 reps with one arm and 4 with the other, just either type 4 ( the least reps of the two limbs ) or 5. But in any case, realistically, that would happen because of fatigue, it makes no sense to be so specific. 
                    <br/>
                    In cases where you have to mentally focus on one limp at a time (for example, one arm dumbbell press), just consider each limb as a complete set. And type the reps you did per "set" and mabe add in the comments "left" or "right".
                </Question>


                <Question title="Accidentally deleted an exercise?">Sorry, delete actions cant be undone. They actually delete stuff.</Question>
                <Question title="What does the numbers with the ~ mean?">They mean "estimated max" based on the weight x reps.</Question>
                <Question title="How to become a supporter?">Someone that once in a while send us money to help us pay the bills. Donating doesn't require recurrent payment, it is always a manual action executed by you.</Question>
                <Question title="How do i DELETE my account?">Go to your settings and you will see the option there...</Question>
                <Question title="More questions?">
                    DM me! <UnameRef uid={1} uname="tlast2o12dude"/> (response time is variant, depends on workload...)
                </Question> 
                 
            </Grid>
        </Grid>
    </Container>
}



const Question = ({ title, children })=>{
    return <Box marginTop={1} marginBottom={3}>
                <Typography gutterBottom variant="h6">{title}</Typography>
                <Box paddingLeft={1} color="#666">
                    {children}</Box>
            </Box>
}