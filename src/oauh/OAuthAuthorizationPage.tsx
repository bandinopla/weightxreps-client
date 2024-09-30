import { useEffect, useMemo, useState } from "react";
import { Avatar, Button, ButtonGroup, Card, CardActions, CardContent, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
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
import { $serverURI } from "../data/db";
import { Alert } from "@material-ui/lab";
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
        marginBottom: 10
    }
}));


/**
 * OAuth landing page... 3rd party apps that want to connect to weightxreps will land here to request user permission.
 */
export default function OAuthAuthorizationPage() {
    const styles = useStyles();
    const { session } = useGetSession();
    const { getTheme } = useColorThemeManager();
    const theme = useMemo(() => getTheme(0), [getTheme]);
    const [getSession, getSessionStatus] = useGetSessionLazyQuery({ fetchPolicy:"network-only" });
 

    const onUserLogged = ( sessionToken:string ) => { 
        getSession();
    }

    return <ThemeProvider theme={theme}>

        <UILoginContext hook={onUserLogged}>
        
        <div className={styles.page}> 
        {session ? <AuthorizePage /> : 
            <Card>
                <CardContent>
                    {
                          getSessionStatus.loading? "Loading..."
                        : getSessionStatus.error? "Error..."
                        : <AllInOneAccessBox disableCreateAccount={true}/>
                    } 
                </CardContent>
            </Card> } 
        </div>

        </UILoginContext>
    </ThemeProvider>
}

/**
 * Once the user is logged in weightxreps and we have a session, here we will ask the user for authoriation to let the client app 
 * access the resources granted based on the scope.
 */
function AuthorizePage() {
    const styles = useStyles();
    const [scopes, setScopes] = useState({ read: "Read your journals", write: "Write on your journals" });
    const { data } = useGetSessionQuery();
    const user = data!.getSession!.user!;
    const [ callAuth, authState ] = useFetch();

    //
    // on authorization response...
    //
    useEffect(()=>{

        let response = authState?.data;

        if( response )
        {
            if (response.status === 302 || response.status === 301) {
                const redirectUrl = response.headers.get('Location');
                console.log('Redirect detected to:', redirectUrl); 
                return;
            }

            console.log("Response was...", response)
        }

    },[authState?.data])

    //
    // user accepts or decline to grant access...
    //
    const ok = (accepts:boolean) => { 

        const currentUrl    = window.location.href; 
        const url           = new URL(currentUrl); 
        const queryParams   = new URLSearchParams(url.search);  
        const paramsObject  = Object.fromEntries(queryParams.entries());
        const redirectTo    = queryParams.get("redirect_uri") ?? "http://weightxreps.net";

        if(!accepts)
        {
            window.open( redirectTo ,"_self");
            return;
        }   

        //
        // convert querystring to form data...
        //
        const formData = new FormData();
        Object.keys(paramsObject).forEach(key => {
            formData.append(key, paramsObject[key]);
        });

        //
        // Authorize and get authorization code....
        //
        callAuth( $serverURI.replace("graphql","oauth/authorize"), undefined, {
            headers: {
                ...getAuthorizationHeaders()
            },
            method: 'POST',
            body: formData,
            redirect: 'manual'
        } );
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
            <Typography variant="h5" component="h1" gutterBottom>Allow <a href="#">App name</a> to...</Typography>

            {scopes && <List component="nav" aria-label="main mailbox folders" dense={true}>
                {Object.entries(scopes).map(entrie => <ListItem button key={entrie[0]}>
                    <ListItemIcon>
                        <CheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={entrie[1]} />
                </ListItem>)}
            </List>}

            <Typography variant="subtitle1" component="h1" gutterBottom>... on your <strong>{user.uname}</strong> account?</Typography>

            {
                !authState.loading && authState.error && <Alert severity="error">{authState.error}</Alert>
            }

        </CardContent>

        <CardActions>
            <ButtonGroup size="large" variant="outlined" disabled={authState?.loading}>
                <Button color="primary" onClick={()=>ok(false)}>
                    NO
                </Button>
                <Button color="primary" variant="contained" onClick={()=>ok(true)}>
                    YES
                </Button>
            </ButtonGroup>
        </CardActions>
    </Card>
}