import { Backdrop, Box, Button, ButtonGroup, Container, FormControl, Grid, Input, InputLabel, makeStyles, Paper, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import FormHelperText from '@material-ui/core/FormHelperText';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
//--------------------------------------
import Stepper from '@material-ui/core/Stepper';
import { Alert } from "@material-ui/lab";
import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { MainBanner2 } from "../banners/SideBanners";
import { ActionButton } from "../componentes/action-button";
import { trackLoginWith } from "../componentes/google-tracker";
import { PasswordInput } from "../componentes/PasswordInput";
import { parseError } from "../data/db";
import { useForgotMutation, useSignupMutation, useVerifySignupMutation } from "../data/generated---db-types-and-hooks";
import {  useGetSession, useLogin } from "../session/session-handler";
import { isEmail } from "../utils/utils";
import FirebaseLoginPage from "./FirebaseLoginPage";
import { SectionTitle } from "./guest/GuestLandingPage"; 

const useStyles = makeStyles((theme) => ({
    root: {  
        marginTop:20,
        '& .MuiFormControl-root': {
            //margin: theme.spacing(1) 
        },
        "& > div": {
            //marginBottom: theme.spacing(2) ,
        }
    },

    optionsDiv: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },

    actionsDiv: {
        textAlign: "right",
        marginTop: 30,
        "& hr": {
            marginBottom: theme.spacing(3),
        }
    }
}));

const parseAndSetError = e => {
    var err = parseError(e);
    var m;

    if (m = err.match(/^ERR:(\S+)\s(.*)/)) {
        return { id: m[1], error: m[2] };
    }
    else {
        return { id: "op", error: err };
    }
}


export const SignupPage = () => {

    
    const { reload } = useGetSession();
    const classes = useStyles();
    const [error, setError] = useState();
    const [busy, setBusy] = useState();
    const unameInput = useRef();
    const emailInput = useRef();
    const passInput = useRef();
    const genderOption = useRef();
    const wunitOption = useRef();
    const codeRef = useRef();
    const [waiting, setWaiting] = useState();
    const [verifying, setVerifying] = useState();
    const disableInputs = busy || waiting || verifying;
    const [signup, { client }] = useSignupMutation();
    const [verifySignup] = useVerifySignupMutation();
    const [success, setSuccess] = useState(false);
    const userURL = useRef();
    const theme = useTheme();

    const abortEverything = () => {
        setWaiting(false);
        setError(null);

        //unameInput.current.value="";
        //emailInput.current.value="";
        //passInput.current.value="";
    }


    /**
     * Guarda los datos temporalmente. El success de esta op singifica que el sistema esta esperando un 
     * código de verificación...
     */
    const createAccount = async () => {

        //#region BUILD PAYLOAD
        //
        // validate username
        //
        const uname = unameInput.current.value.trim();

        if (uname.length == "") {
            return setError({ id: "uname", error: "Type your desired username!" });
        }
        else if (!uname.match(/^[a-z0-9_]{4,80}$/i)) {
            return setError({ id: "uname", error: "Invalid username, either too short or too long..." });
        }

        //
        // email...
        //
        const email = emailInput.current.value.trim();

        if (!email.length) {
            return setError({ id: "email", error: "What's your email?" });
        }
        else if (!isEmail(email)) {
            return setError({ id: "email", error: "Invalid email..." });
        }

        //
        // password
        //
        const pass = passInput.current.value.trim();

        if (pass.length < 6) {
            return setError({ id: "pass", error: "Password must be AT LEAST 6 characters long..." });
        }
        //#endregion

        //
        // payyload
        //
        const payload = {
            uname, email, pass, isf: genderOption.current ? 1 : 0, usekg: wunitOption.current ? 0 : 1
        }

        //...
        setError(null);
        setBusy(true);
        /////setWaiting(true);

        try {
            var waiting = await signup({ variables: payload });

            userURL.current = "/journal" + uname;
            setWaiting(true);
        }
        catch (e) {
            setError(parseAndSetError(e));
        }

        setBusy(false);

    }

    const verifyCode = async () => {

        const code = codeRef.current.value.trim();

        if (code.length < 6) {
            return setError({ id: "code", error: "Code must be 6 characters long..." });
        }

        //setError({ id:"code", error:"Invalid code"});

        //si sale bien.... ir al home...
        //setSessionToken()
        setVerifying(true);

        try {
            var token = await verifySignup({
                variables: {
                    code
                }
            });
        }
        catch (e) {
            setError(parseAndSetError(e));
        }

        setVerifying(false);

        //
        // success?
        //
        if (token) 
        { 
            await reload(token.data.verifySignup);

            trackLoginWith("WxR");
            setSuccess(true); 
        }

    }

    const gotoUserJournal = () => {
        //history.push( userURL.current );
    }

    return <PageLayout>
        <SuccessBackdrop open={success} then={gotoUserJournal} label="Welcome to weightxreps!" />

 


        <SectionTitle line1="FIRST TIME?" line2="CREATE ACCOUNT" color={ theme.GREEN_COLOR}/>


        {/* <LoginWithGoogle/>  
            
                 <ORdivider/> */}

        <Stepper activeStep={waiting ? 1 : 0} orientation="vertical" elevation={1}>
            <Step>
                <StepLabel>Basic info</StepLabel>
                <StepContent>
                    <form noValidate autoComplete="off">
                        <div>
                            <FormControlWithError error={error} errid="uname">
                                <InputLabel>Desired Username</InputLabel>
                                <Input disabled={disableInputs} inputRef={unameInput} />
                            </FormControlWithError>
                        </div>
                        <div>
                            <FormControlWithError error={error} errid="email" helperText="Used for password recovery and confirmation of some actions.">
                                <InputLabel>Your Email</InputLabel>
                                <Input disabled={disableInputs} inputRef={emailInput} />
                            </FormControlWithError>
                        </div>
                        <div>
                            <FormControlWithError error={error} errid="pass" >
                                <InputLabel>Account Password</InputLabel>
                                <PasswordInput
                                    label="Password"
                                    placeholder="New password..."
                                    inputRef={passInput}
                                    disabled={disableInputs}
                                />
                            </FormControlWithError>
                        </div>
                        <div className={classes.optionsDiv}>
                            <Grid container>
                                <Grid item xs={12} md={6}>
                                    <OneOf disabled={disableInputs} options={["Male", "Female"]} oref={genderOption} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <OneOf disabled={disableInputs} options={["Kilos", "Pounds"]} oref={wunitOption} />
                                </Grid>
                            </Grid>
                        </div>
                    </form>
                </StepContent>
            </Step>
            <Step>
                <StepLabel>Verification (type code sent to your email)</StepLabel>
                <StepContent>
                    <form>
                        <div>
                            <FormControlWithError error={error} errid="code" helperText="Check your email, we sent you a code!">
                                <InputLabel>Type the verification code</InputLabel>
                                <Input inputRef={codeRef} disabled={verifying} />
                            </FormControlWithError>
                        </div>
                    </form>
                </StepContent>
            </Step>
        </Stepper>


        <form className={classes.root} noValidate autoComplete="off">
            {/* <div>
                    <FormControlWithError error={error} errid="uname">
                        <InputLabel>Desired Username</InputLabel>
                        <Input disabled={disableInputs} inputRef={unameInput}/>
                    </FormControlWithError>
                </div> 
                <div>
                    <FormControlWithError  error={error} errid="email" helperText="Used for password recovery and confirmation of some actions.">
                        <InputLabel>Your Email</InputLabel>
                        <Input  disabled={disableInputs} inputRef={emailInput}/> 
                    </FormControlWithError>
                </div>  
                <div>  
                    <FormControlWithError  error={error} errid="pass" >
                        <InputLabel>Account Password</InputLabel>
                        <PasswordInput  
                                label="Password"  
                                placeholder="New password..." 
                                inputRef={passInput}
                                disabled={disableInputs} 
                        />
                    </FormControlWithError> 
                </div>
                <div className={classes.optionsDiv}>
                    <Grid container>
                        <Grid item xs={6}>
                            <OneOf disabled={disableInputs}  options={["Male","Female"]} oref={genderOption}/>
                        </Grid>
                        <Grid item xs={6}>
                            <OneOf disabled={disableInputs}  options={["Kilograms","Pounds"]} oref={wunitOption}/>
                        </Grid>
                    </Grid>
                </div> */}
            <div className={classes.actionsDiv}>


                {error?.id == "op" && <Box marginBottom={1}><FormControl error>
                    <FormHelperText>{error.error}</FormHelperText>
                </FormControl></Box>}

                {!waiting && <ActionButton execAction={createAccount} color="primary" variant="contained">Create Account</ActionButton>}
                {waiting && <Box>
                    {/* <FormControlWithError  error={error} errid="code" helperText="Check your email, we sent you a code!">
                                            <InputLabel>Type the verification code</InputLabel>
                                            <Input inputRef={codeRef} disabled={verifying}/> 
                                        </FormControlWithError>  */}

                    <ButtonGroup>
                        <ActionButton execAction={verifyCode} disabled={verifying} color="primary" variant="contained">Verify Code</ActionButton>
                        <Button onClick={abortEverything} disabled={verifying}>cancel</Button>
                    </ButtonGroup>
                </Box>}

                <br /><br />
                <Typography variant="caption">
                    Already a member? <Link to="/login">Login</Link>
                </Typography>
                <br /><br />

            </div>
        </form>
    </PageLayout>;
}


const SuccessBackdrop = ({ open, label, then }) => {
    const theme = useTheme();

    useEffect(() => {

        if (open) {
            setTimeout(then, 2000);
        }

    }, [open]);

    return <Backdrop open={open} style={{ zIndex: theme.zIndex.drawer + 1, color: "white", backgroundColor: theme.successBackdropColor }}>
        <Typography variant="h5">{label}</Typography>
    </Backdrop>
}


export const LoginPage = () => {

    const { session } = useGetSession();
    const classes = useStyles();
    const [error, setError] = useState();
    const [busy, setBusy] = useState();
    const unameInput = useRef();
    const passInput = useRef();
    const disableInputs = busy;
    const login = useLogin();
    const [forgot] = useForgotMutation();
    const [tempPass, setTempPass] = useState();
    const theme = useTheme()

    const execForgot = async () => {


        var u = unameInput.current.value.trim();
        if (u.length == 0) {
            setError({ id: "uname", error: "Type your username OR email!" });
            return;
        }

        if (passInput.current.value != "") {
            setError({ id: "pass", error: "Leave this field empty! To avoid confusion: You clicked forgot password, so this must be empty." });
            return;
        }

        setError(null);
        setBusy(true);

        try {
            var ok = await forgot({
                variables: {
                    uore: u
                }
            });

            setTempPass(u);
            passInput.current.value = "";
        }
        catch (e) {
            setError(parseAndSetError(e));
        }

        setBusy(false);
    }

    const execLogin = async () => {

        var u = unameInput.current.value.trim();
        var p = passInput.current.value; 


        if (u.length == 0) {
            setError({ id: "uname", error: "Type your username or email!" });
        }
        else if (p.length == 0) {
            setError({ id: "pass", error: "What's your password?" });
        }
        else 
        {
            setBusy(true);
            setError(null);

            trackLoginWith("WxR");

            try 
            {
                await login(u, p);
            }
            catch (e) 
            {
                setError(parseAndSetError(e)); 
            }

            setBusy(false);
        }
    }
 
    return <PageLayout>
 

            <SectionTitle line1="CLASSIC" line2="SIGN IN" color={theme.GREEN_COLOR}/>

        

        <form noValidate autoComplete="off">

            <Paper>
                <Box padding={5}>
                    <div>
                        <FormControlWithError error={error} errid="uname|uore">
                            <InputLabel>Username or Email</InputLabel>
                            <Input disabled={disableInputs} inputRef={unameInput} />
                        </FormControlWithError>
                    </div>
                    <div>
                        <FormControlWithError error={error} errid="pass" >
                            <InputLabel>Password</InputLabel>
                            <PasswordInput
                                label="Password"
                                placeholder="New password..."
                                inputRef={passInput}
                                disabled={disableInputs}
                            />
                        </FormControlWithError>
                    </div>
                </Box></Paper>
            <div className={classes.actionsDiv}>

                {error?.id == "op" && <Box marginBottom={1}><FormControl error>
                    <FormHelperText>{error.error}</FormHelperText>
                </FormControl></Box>}

                <ButtonGroup>
                    <ActionButton execAction={execForgot} disabled={disableInputs}>Forgot my password!</ActionButton>
                    <ActionButton execAction={execLogin} color="primary" disabled={disableInputs} variant="contained">Sign In</ActionButton>
                </ButtonGroup>

                {tempPass != null && <Alert severity="info">A new <strong>temporary password</strong> was created and sent to {tempPass.indexOf("@") > 0 ? <strong>{tempPass}</strong> : <>the email associated with <strong>{tempPass}</strong></>}. Use that password to login.</Alert>}

                <br /><br />
                <Typography variant="caption">
                    New here? <Link to="/signup">Signup</Link>
                </Typography>
                <br /><br />

            </div>
        </form>

    </PageLayout>;
}

const ORdivider = () => {
    return <Box padding={1} textAlign="center"> <b>OR</b></Box>;
}



export const OneOf = ({ options, oref, disabled, initialValue }) => {
    const [i, seti] = useState(initialValue);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    //console.log( "ONE OF OPTIONS:", options, oref )
    oref.current = i;

    return <ButtonGroup disabled={disabled}
        style={{ marginTop: isSmallScreen ? 13 : 0 }}
        fullWidth={isSmallScreen}>
        {options.map((opt, j) => <Button key={j} variant={i == j ? "contained" : "outlined"} onClick={() => seti(j)}>{opt}</Button>)}
    </ButtonGroup>
}


const FormControlWithError = ({ error, errid, helperText, children }) => {

    var errs = errid.split("|");
    var efound = errs.find(eid => eid == error?.id) != null;

    return <FormControl fullWidth error={efound}>
        {children}
        <FormHelperText>{efound ? error.error : helperText || ""}</FormHelperText>
    </FormControl>
}


// const ActionButton = ({ children, execAction, ...rest })=>{
//     const [busy, setBusy] = useState();
//     const callAction = async ()=>{
//         setBusy(true);
//         await execAction();
//         setBusy(false);
//     }

//     return <Button disabled={busy} onClick={ ()=>callAction() } {...rest}>
//                 { busy? <CircularProgress size={25}/> : children}
//            </Button>;
// }



const PageLayout = ({ children }) => {

    const classes = useStyles();
    const history = useHistory();
    const { session:currentSession} = useGetSession();
    const theme = useTheme();

    useEffect(() => {

        if (currentSession?.user.id > 0) {
            history.push("/");  
        }

    }, [currentSession]);

    // style={{ height: "80vh" }}
    return <div>

        <MainBanner2/>
    
    <Container maxWidth="md" className={classes.root}>
 
        <Grid
            container
            direction="row"
            justifyContent="center"

            
            spacing={4}
        >
            <Grid item md={6}>
             

                <SectionTitle line1="QUICK ACCESS!" line2="ENTER USING..." color={ theme.PINK_COLOR }/>

                <FirebaseLoginPage />
            
            </Grid>

            <Grid item md={6}>
                {children}
            </Grid>

        </Grid>

    </Container>
    </div>;
}