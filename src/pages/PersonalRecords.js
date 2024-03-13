import { Box, Button, LinearProgress, makeStyles } from "@material-ui/core";
import { useGetPRsOfQuery, useGetUserInfoQuery } from "../data/generated---db-types-and-hooks";
import { PageLayout } from "../componentes/ContentPageWrapper";
import UnameTag from "../componentes/uname";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from "react-router-dom";
import { Alert, TabContext, TabPanel } from "@material-ui/lab";
import { parseError } from "../data/db";
import { RecordsWxR } from "./PersonalRecordsWxR";
import { RecordsWxToD } from "./PersonalRecordsWxToD";

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useEffect, useMemo, useState } from "react";
import { EditExerciseButton } from "../componentes/journal/exercises";

const useStyles = makeStyles( theme => ({
    ename: {
        color: theme.palette.primary.main 
    }
}) );

export default function PersonalRecordsPage({ match:{  path, url, params:{ uname, eid } } }) {

    const [tab, setTab] = useState(0);
    const history = useHistory();
    const classes = useStyles();
    const { loading:loadingUser, data:userData, error:userError} = useGetUserInfoQuery({ variables: { userInfoUname:uname } }) ;//, { variables:{ uname } }
    const { data, loading, error }  = useGetPRsOfQuery({
        variables: {
            eid 
        }
    }); 

    const hasWxDoT = useMemo(()=>data?.getPRsOf?.wxdotPRS?.erows?.length>0,[data]);

    useEffect(()=>{

        if( hasWxDoT )
        {
            setTab(1);
        }

    },[data, hasWxDoT])

    const gotoLog = ymd=>history.push(`/journal/${userData?.userInfo.user.uname}/${ymd}`);

    //history.push(`/journal/${userData?.userInfo.user.uname}`)
    const goBack = ()=>{
        history.goBack();
    }

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    if( loadingUser || loading ) {
        return <LinearProgress />
    }

    if(!data.getPRsOf || !userData?.userInfo) {
        return <Alert severity="error">{parseError(userError || error)}</Alert>
    }

//
//
    return <PageLayout title={<><EditExerciseButton owner={userData?.userInfo.user} exercise={data?.getPRsOf.exercise} style={{float:"right"}}/><Button startIcon={<KeyboardBackspaceIcon />} onClick={()=>goBack()} variant="outlined">Back</Button> PR<sub>s</sub> in <span className={classes.ename}>{data?.getPRsOf?.exercise.name}</span> by <UnameTag inline {... userData?.userInfo.user}/>  </>}>


        <TabContext value={tab}>
        <Paper square>
           
            <Tabs
                value={tab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange} 
            >
                <Tab label="Best Reps" value={0} disabled={!data?.getPRsOf?.prs?.length>0 }/>
                <Tab label="Best Distance or Time" value={1} disabled={!hasWxDoT}/> 
            </Tabs>
            </Paper>

            
            <TabPanel value={0}>
                <RecordsWxR data={data.getPRsOf} user={userData?.userInfo.user} onClickLog={gotoLog}/>
            </TabPanel>
            <TabPanel value={1}>
                <RecordsWxToD data={data.getPRsOf} user={userData?.userInfo.user} onClickLog={gotoLog}/>
            </TabPanel>
        </TabContext>
 
        
    </PageLayout>
}