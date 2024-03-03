import { Chip, Grid, LinearProgress, Typography } from "@material-ui/core";
import { useGetAchievementsQuery, useGetAchievementsStateOfQuery } from "../data/generated---db-types-and-hooks";
import { OpenConfirmModal } from "../componentes/Dialog";
import { JOwnerContext } from "../pages/journal-context";
import { dateToYMD } from "../utils/utils";
import { useContext, createContext } from 'react';
import DoneIcon from '@material-ui/icons/Done';

const AchievementsContext = createContext({
    available:[],
    state:null
});

export default function() {

    const jowner                                = useContext(JOwnerContext);
    const { loading, data, error}               = useGetAchievementsQuery();
    const { loading:loadingState, data:stateData, error:stateError}               = useGetAchievementsStateOfQuery({ variables:{ uid: jowner.id, asOfThisYmd: dateToYMD(new Date()).replace(/-/g,"") }})

    if( loading )
    {
        return <LinearProgress/>;
    }

    return <AchievementsContext.Provider value={{ available:data.getAchievements, state:stateData?.getAchievementsStateOf }}>
    
        <div style={{padding:10,  margin:5}}>

        <Typography variant="h3" style={{textTransform:"capitalize"}}>Squat #sq</Typography>
        <Typography variant="subtitle2"  gutterBottom>Exercises with the tag "#sq" in their name will be recognized for these badges.</Typography>
        <br/>
        <Grid container spacing={3} justifyContent="flex-start">
            <Grid item xs={4} md={2}><Achievement id="CAN-SQ-1plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-SQ-2plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-SQ-3plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-SQ-4plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-SQ-5plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-SQ-6plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-SQ-7plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="SQ-MISSION"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="SQ-INSANE"/></Grid>
        </Grid>

        <br/>
        <Typography variant="h3" style={{textTransform:"capitalize"}}>Bench #bp</Typography>
        <Typography variant="subtitle2"  gutterBottom>Exercises with the tag "#bp" in their name will be recognized for these badges.</Typography>
        <br/>

        <Grid container spacing={3} justifyContent="flex-start">
            <Grid item xs={4} md={2}><Achievement id="CAN-BP-1plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-BP-2plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-BP-3plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-BP-4plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-BP-5plate"/></Grid> 
            <Grid item xs={4} md={2}><Achievement id="BP-MISSION"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="BP-INSANE"/></Grid>
        </Grid>

        <br/>
        <Typography variant="h3" style={{textTransform:"capitalize"}}>Deadlift #dl</Typography>
        <Typography variant="subtitle2"  gutterBottom>Exercises with the tag "#dl" in their name will be recognized for these badges.</Typography>
        <br/>

        <Grid container spacing={3} justifyContent="flex-start">
            <Grid item xs={4} md={2}><Achievement id="CAN-DL-1plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-DL-2plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-DL-3plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-DL-4plate"/></Grid>
            <Grid item xs={4} md={2}><Achievement id="CAN-DL-5plate"/></Grid>  
            <Grid item xs={4} md={2}><Achievement id="CAN-DL-6plate"/></Grid>  
            <Grid item xs={4} md={2}><Achievement id="CAN-DL-7plate"/></Grid>  
            <Grid item xs={4} md={2}><Achievement id="DL-MISSION"/></Grid>  
        </Grid>

        <br/>
        <Typography variant="h3" style={{textTransform:"capitalize"}}>Overhead Press #ohp</Typography>
        <Typography variant="subtitle2"  gutterBottom>Exercises with the tag "#ohp" in their name will be recognized for these badges.</Typography>
        <br/>

        <Grid container spacing={3} justifyContent="flex-start">
            <Grid item xs={4} md={2}><Achievement id="CAN-OHP-1plate"/></Grid>  
            <Grid item xs={4} md={2}><Achievement id="CAN-OHP-2plate"/></Grid>  
            <Grid item xs={4} md={2}><Achievement id="CAN-OHP-3plate"/></Grid>  
            <Grid item xs={4} md={2}><Achievement id="OHP-MISSION"/></Grid>  
        </Grid>
 
        <Typography style={{marginTop:20}} variant="subtitle1">[!] More achievements will be added soon... if you have any suggestion send me a message (admin)</Typography>


    </div>
    </AchievementsContext.Provider>
}

function Achievement({ id, data }) { 

    const context = useContext(AchievementsContext);
    const mydata = context.available.find(itm=>itm.id==id);
    const myState = context.state?.find(itm=>itm.aid==id);

    const openDetails = ()=>OpenConfirmModal({
        //title:mydata.name,
        info:<div>
            
            <div style={{marginTop:20, fontWeight:"bold"}}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <img src={process.env.PUBLIC_URL+"/achievements/"+id+".png"} style={{maxWidth:"100%" }}/>
                    </Grid>
                    <Grid item xs={8}>

                        <Typography variant="h3" style={{textTransform:"capitalize"}} gutterBottom>{mydata.name}</Typography>
                    
                        <Typography>{mydata.description}</Typography>
                        {myState?.gotit && <Chip variant="outlined" color="primary" icon={<DoneIcon />} label={ "Achieved!! "+ myState.note }/> }
                    </Grid>
                </Grid>  
            </div>
        </div>,
        open:true,

        //
        // send new value to server...
        //
        onConfirm: async ()=>{ 
            //
        },

        canCancel: false, 
        verb:"Understood!",
        fullWidth:true
    })
    return <img onClick={openDetails} src={process.env.PUBLIC_URL+"/achievements/"+id+".png"} style={{maxWidth:"100%", opacity:myState?.gotit?1: 0.1, cursor:"pointer"}}/>
}