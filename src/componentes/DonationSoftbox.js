import { Button, LinearProgress, Typography } from "@material-ui/core";
import { SoftBox, SoftSpace } from "./SoftBox";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { useHistory } from "react-router-dom";
import { useGetActiveSupportersLazyQuery, useGetActiveSupportersQuery } from "../data/generated---db-types-and-hooks";
import { useEffect } from "react";
import { Alert } from "@material-ui/lab";
import UnameTag from "./uname";
import { useGetSession } from "../session/session-handler"; 

export const DonationSoftbox = ({ location: {pathname}})=>{

    const history                   = useHistory(); 
    const user                      = useGetSession();
    

    if( pathname=='/donate' )
    {
        return <ActiveSuportersSoftbox/>
    }

    if( user.session?.user.sok )
    {
        return <SupporterStatusSoftbox days={user.session?.user.sleft}/>
    }

    return <SoftBox title="Support us" style={{ border:"1px dotted #cc3f47"}}>
                Donate any amount to become a supporter and help us stay alive! 
                <SoftSpace/>
                <Button className="fancy" startIcon={<FavoriteBorderIcon/>} onClick={()=>history.push("/donate")}>Donate</Button>
            </SoftBox>;
}

const ActiveSuportersSoftbox = ()=>{

    const { data, loading, error }  = useGetActiveSupportersQuery();  

    // if( !loading && data?.getActiveSupporters.length===0 )
    // {
    //     return ;
    // }

    return <>
    
    <SoftBox title="We Need You!">  
                    Donations keep the site running! Any amount will help :)
                    <SoftSpace/>
                    <img src="/cats_money.jpg" style={{ maxWidth:"100%"}} className="sha"/>
                </SoftBox>

            <SoftBox title="Active Supporters">  
                { loading && <LinearProgress/> }
                { error && <Alert severity="error">{error}</Alert> }
                { data?.getActiveSupporters.length>0 && <>
                    Awesome people that donated any amount recently:
                    <SoftSpace/>
                    </>}
                { data?.getActiveSupporters.map( u=>(<UnameTag {...u.user}/>) )}
                { !data?.getActiveSupporters?.length>0 && <strong>T_T no active supporters at the moment...</strong>}
            </SoftBox></>;
}

const SupporterStatusSoftbox = ({ days })=>{
    return <SoftBox title="Thank you" Icon={<FavoriteBorderIcon/>}>
        for your <a href="/donate">last donation!</a><br/>

        <Typography variant="h4">
        <span className="rainbow1 gold">days left: <strong>{days}</strong></span>
        </Typography>
        as active supporter.
    </SoftBox>
}