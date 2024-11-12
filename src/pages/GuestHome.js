import { Box, Button, Container, Grid, IconButton, Typography, lighten, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import FlashOnIcon from '@material-ui/icons/FlashOn'; 
import { AllInOneAccessBox } from "../session/all-in-one-access-box-ui";
import { GuestLandingPage } from "./guest/GuestLandingPage";
import { ReactComponent as Logo } from '../logo.svg'; 
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CloseIcon from '@material-ui/icons/Close';
import { StartTodayBanner } from "../componentes/start-today-banner";
import { AnimatedLogoIntro } from "../componentes/SplashScreenIntro";


const useStyles = makeStyles( theme =>({
    firstBlock: {
        //background:"linear-gradient(83deg, rgba(0,0,0,1) 70%, rgba(0,19,22,1) 100%)",
        "& h2, & h3" :{ color:"white !important" },
        minHeight:"90vh",
        display:"flex", 
        position:"relative",

        "& .MuiGrid-container": {
             
        },

        // "& .MuiTypography-root": {
        //     color:"#fefefe !important",
        //     "& strong": {
        //         color:"white"
        //     }
        // }
    },
    logoArea: { 
        display:"flex", 
        flexGrow:1,
        justifyContent:"space-around",

        "& path ": {
            fill:"white !important" 
        },
        "& svg": {
            maxWidth:"100%",
            height:500,
            padding:50
        }
    },
    since: {
        color: theme.palette.primary.main +" !important",
        textDecoration:"underline"
    }, 
    accessArea: {
        padding:30,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        textAlign:"center"
    },
    bars: {
        height:300,
        [theme.breakpoints.up("sm")]: {
            height:500
        }, 
    },
    AccessNowBtn: {
        position:"absolute",
        bottom:40, 
        marginLeft:40,
        padding:"20px 30px !important",   
        borderRadius:20,
        border:"5px solid #B8B744",
        animation:"pulsate-fwd 0.5s ease-in-out infinite both",
        background: "#3B3F9Daa" ,
        color:"white",
        "& .MuiTypography-root": {
            fontSize:40,
            color:"white",
        },
        "&:hover": {
            background:"#3B3F9D",
            animation:"none"
        },

        [theme.breakpoints.up("lg")]: { 
            padding:"20px 50px !important",  
       
            "& .MuiTypography-root": {
                fontSize:50,
            },
        }
    },
    AccessNowWidget: {
        display:"flex",
        justifyContent:"space-around",
        position:"relative",
        "& img": {
            maxWidth:"100%"
        }
    },

    closeAccessBtn: {
        position:"absolute",
        right:5,
        top:5,
        color:"white"
    },

    [theme.breakpoints.up("lg")] : {
        accessArea: {
            alignItems:"flex-start", 
            textAlign:"left"
        },
        bars: {
            display:"block"
        },
        logoArea: { 
            "& svg": {
                padding:3
            }
        }
    }
}));

export const GuestHome = ()=>{
    

    // useEffect(()=>{

    //     document.body.classList.add("main-layout-no-sidebar");
    //     return ()=>{
    //         document.body.classList.remove("main-layout-no-sidebar");
    //     }

    // },[]);

    return <div>
        <AccessWidget/>
        <GuestLandingPage/>
        
        
    </div>
};


const AccessWidget = ()=>{

    const [showAccess, setShowAccess] = useState(false);
    const cls = useStyles();

    useEffect(()=>{

        if( window.skinLoginCover )
        {
            window.skinLoginCover = false;
            setShowAccess(true);
        }

        window.quickAccessLogin = ()=>{
            setShowAccess(true);
            window.scrollTo(0,0);
        }

        setTimeout(()=>window.scrollTo(0,0), 0);

        return ()=>window.quickAccessLogin = null

    },[])

    if( !showAccess )
    {
        return <Box className={ cls.AccessNowWidget }>
                    
                    {/* <div>
                        <Button onClick={()=>setShowAccess(true)} variant="contained" className={ cls.AccessNowBtn+" fancy " } endIcon={<ExitToAppIcon style={{ fontSize: 40 }}/>} size="large">
                            <Typography variant="h2">Sign In</Typography>
                        </Button>
                        <img src="/banner-starttoday.jpg" className="sha"/>
                    </div> */}
                    <StartTodayBanner onClickStart={()=>setShowAccess(true)}/>
                </Box>
    }

    return <div className={cls.firstBlock+" coolSpaceIshBg"}>  
                <IconButton className={ cls.closeAccessBtn+"  " } onClick={()=>setShowAccess(false)}><CloseIcon style={{ fontSize: 60 }}/></IconButton>

                {/* <img src="/bars.png" style={{ position:"absolute", bottom:0, right:0, maxHeight:"80%" }} className={cls.bars}/> */}
                <Grid container alignItems="center" flexDirection="column" justifyContent="center">
                    <Grid item md={12} lg={6} className={ cls.logoArea }>
                        {/* <Logo alt="Logo" className={ " animated-wxr-logo"}/> */}
                        <AnimatedLogoIntro style={{ width:300, height:300 }}/>
                    </Grid>
                    <Grid item md={12} lg={6} style={{ minHeight:500}} className={cls.accessArea}>
                        <Typography variant="h2"><strong>Your Training Journal </strong></Typography>
                        <Typography variant="h3" gutterBottom><FlashOnIcon fontSize="large"/>Online <a href="https://web.archive.org/web/20220000000000*/https://weightxreps.net" target="_blank" className={cls.since}>since 2011</a></Typography>

                        <AllInOneAccessBox/> 
                    </Grid> 
                </Grid> 
            </div>
}