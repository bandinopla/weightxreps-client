import { useEffect, useMemo, useState } from "react";
import { Avatar, Button, ButtonGroup, Card, CardActions, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import AdbIcon from '@material-ui/icons/Adb';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import CheckIcon from '@material-ui/icons/Check';
import { getAuthorizationHeaders, useGetSession } from "../session/session-handler";
import { AllInOneAccessBox } from "../session/all-in-one-access-box-ui";
import { useColorThemeManager } from "../styles/palettes";
import { UILoginContext } from "../session/onUILoginHook";
import { useGetSessionLazyQuery, useGetSessionQuery } from "../data/generated---db-types-and-hooks"; 
import useFetch from "../utils/useFetch";
import { $nodeURI, $serverURI } from "../data/db";
import { Alert } from "@material-ui/lab";
import OperationBackdrop from "../componentes/backdrop";
import Logo from "../componentes/Logo";
import useGetOAuthClientInfo, { ClientInfoHookReturn } from "./useGetOAuthClientInfo";
import { queryParams } from "../utils/querystring";


const useStyles = makeStyles((theme) => ({
    page: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#444"
        //   '& > *': {
        //     margin: theme.spacing(1),
        //   },
    },
    pink: {
        color: theme.palette.getContrastText(pink[500]),
        backgroundColor: pink[500],
    },
    black: {
        color: '#fff',
        backgroundColor: "black",
    },
    icons: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        margin:"20px auto"
    }
}));

const doRedirect = url => {

    if( url.indexOf("state=")<0 ) {
        url += "&state=" + queryParams.get("state");
    }

    window.opener ?
        [ window.opener.postMessage({ weightxrepsOnOAuthResult: Object.fromEntries(new URLSearchParams(new URL(url).search)) }, queryParams.get("redirect_uri")), window.close() ]
        :
        window.open( url ,"_self")
        ;
}


/**
 * OAuth landing page... 3rd party apps that want to connect to weightxreps will land here to request user permission.
 * This is the place were the user login and grant access to 3rd party apps using OAuth2
 */
export default function OAuthAuthorizationPage() {
    const styles = useStyles();
    const { session, loadingSession, sessionError } = useGetSession();
    const { getTheme } = useColorThemeManager();
    const theme = useMemo(() => getTheme(0), [getTheme]);
    const [getSession, getSessionStatus] = useGetSessionLazyQuery({ fetchPolicy:"network-only" });
    
    const clientInfo = useGetOAuthClientInfo( queryParams.get("client_id")??"", queryParams.get("scope")??"" )
    const showBusy = clientInfo.status.loading || loadingSession || getSessionStatus?.loading; 
    const sysError = !clientInfo.clientId? "Incomplete url, check for typos"
                     : sessionError || getSessionStatus.error ? "Error loading your session :("
                     : clientInfo.status.error? clientInfo.status.error 
                     : undefined; 
  

    const onUserLogged = ( sessionToken:string ) => { 
        getSession();
    }



    useEffect(()=>{

        if( sysError )
        {
            doRedirect( queryParams.get("redirect_uri")+"?state="+(queryParams.get("state")??"")+"&error="+encodeURIComponent(sysError)  );
        }

    }, [sysError])

    return <ThemeProvider theme={theme}>

        <UILoginContext hook={onUserLogged}>
        
        <div className={styles.page}> 
        <OperationBackdrop open={showBusy}/>

        {
            !showBusy && (
                            sysError? <Alert severity="error">{sysError}</Alert> :  
                            session ? <AuthorizePage {...clientInfo }/> : 
                            <Card>
                                <CardContent>
                                    <Logo className="mb20"/>
                                    <AllInOneAccessBox disableCreateAccount={true}/>
                                </CardContent>
                            </Card> 
                        )
        }
 
        </div>

        </UILoginContext>
    </ThemeProvider>
}

/**
 * Once the user is logged in weightxreps and we have a session, here we will ask the user for authoriation to let the client app 
 * access the resources granted based on the scope.
 */
function AuthorizePage({ clientId, status }:ClientInfoHookReturn ) {
    const styles = useStyles();
    const scopes = status.data?.availableScopes;
    const { data } = useGetSessionQuery();
    const user = data!.getSession!.user!;
    const [ callAuth, authState ] = useFetch();



    //
    // 
    //
    useEffect(()=>{
 
        if( window.opener ) //we are a popup
        { 
            const beforeUnloadHandler = event => {
                window.opener.postMessage({ weightxrepsOnOAuthResult: { error:"user_canceled", state:queryParams.get("state"), code:false } }, queryParams.get("redirect_uri"))
            }

            window.addEventListener("beforeunload", beforeUnloadHandler);

            return ()=>window.removeEventListener("beforeunload", beforeUnloadHandler);
        }

    },[]);
 
    //
    // on authorization response...
    //
    useEffect(()=>{

        let response = authState?.data;
        const isPopup = window.opener && window !== window.top;

        if( response )
        {  
            doRedirect( response.redirectTo ); 
        }

    },[authState?.data])

    //
    // user accepts or decline to grant access...
    //
    const ok = (accepts:boolean) => {  
         
        if( !accepts )
        {  
            doRedirect( (queryParams.get("redirect_uri") ?? status.data?.url)+"?error=user_declined" );
            return;
        }    

        requestAuthorizationCode();
    } 

    const requestAuthorizationCode = ()=>{
        const urlEncodedData = queryParams.toString(); 
        //
        // Authorize and get authorization code....
        //
        callAuth( $nodeURI + "/auth/authorize", undefined, {
            headers: {
                ...getAuthorizationHeaders(),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: urlEncodedData ,
            responseParser: async response => { 

                if( response.url.indexOf("?code=")>-1 )
                { 
                    return {
                        redirectTo: response.url + "&token-endpoint=" + encodeURIComponent( $nodeURI + "/oauth/token" )
                    }
                } 

                return await response.json();
            }
        });
    }

    return <Card elevation={4}>

        <CardContent>

            <div className={styles.icons}>
                <Avatar className={styles.pink}>
                    <AdbIcon />
                </Avatar>
                <SettingsEthernetIcon />
                <Avatar className={styles.black}>
                    <FitnessCenterIcon />
                </Avatar>
            </div>
            <Typography variant="h5" gutterBottom>
                Hey <strong>{user.uname}</strong>!
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                <a href={status.data?.url} target="_blank">{status.data?.name}</a> wants to access your <strong>weightxreps</strong> account.
                </Typography>
                <Divider/>

            {scopes && <List component="nav" aria-label="main mailbox folders" dense={true}>
                {Object.entries(scopes).map(entrie => <ListItem button key={entrie[0]}>
                    <ListItemIcon>
                        <CheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={entrie[1]} />
                </ListItem>)}
            </List>}

            <Divider/>
            <Alert severity="info">
                <Typography variant="caption">
                You can revoke access later at any time by going to your settings.
                </Typography>
            </Alert>
 
            {
                !authState.loading && authState.error && <Alert severity="error">{authState.error}</Alert>
            }

        </CardContent>

        <CardActions >
            <ButtonGroup size="large" variant="outlined" disabled={authState?.loading}>
                <Button color="primary" onClick={()=>ok(false)}>
                    Deny
                </Button>
                <Button color="primary" variant="contained" onClick={()=>ok(true)}>
                    Allow
                </Button>
            </ButtonGroup>
        </CardActions>
    </Card>
}