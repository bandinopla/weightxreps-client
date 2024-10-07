import { Box, Button, ButtonGroup, Grid, Typography, makeStyles, withStyles } from "@material-ui/core";
import FirebaseLoginPage from "../pages/FirebaseLoginPage";
import { useRef, useState } from "react";
import TextField from '@material-ui/core/TextField';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import OperationBackdrop from "../componentes/backdrop";
import { useGetSession, useLogin } from "./session-handler";
import { useForgotMutation, useSignupMutation, useVerifySignupMutation } from "../data/generated---db-types-and-hooks";
import { AsciiSpinner } from "../componentes/ascii-spinner";
import { Alert } from "@material-ui/lab";
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { useUILoginHook } from "./onUILoginHook";

const Input = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'white',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'blue',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#ccc',
        },
        '&:hover fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white',
        },
      },
    },
  })(TextField);


const useStyles = makeStyles( theme => ({
    error: { 
        padding:10, 
        color:"red",
        marginTop:20,
        "& svg":{
            verticalAlign:"bottom"
        }
    },
    title: {
        color:"yellow !important"
    },
    options: {
        "& > button:hover": {
            background:"yellow"
        }
    },
    OR: {
        textAlign:"center",
        borderBottom:"1px dashed #ccc",
        marginBottom:20,
        height:12,

        "& > strong": {
            background: theme.palette.background.default ,
            color: theme.palette.text.primary,
            display:"inline-block",
            padding:"0px 10px",
            borderRadius:40
        }
    },
    form: {
        '& input:-internal-autofill-selected': {  
            border: '5px solid black',
          },
    }

}))

/**
 * @typedef {Object} AllInOneProps
 * @property {boolean} [disableCreateAccount] - If that functionality should be hidden
 * @property {(uid:Number)=>bool} [onUserLogin] -callback to intercept when the user has been identified and prevent the default behaviour (if return ture).
 */

/**
 * @param {AllInOneProps} props
 */
export const AllInOneAccessBox = ({ disableCreateAccount, onUserLogin })=> {
 
    const [useEmail, setUseEmail]       = useState(); 
    const [error, setError]             = useState(); 
    const [busy, setBusy]               = useState(false); 
    const classes                       = useStyles();

    const cancel = () => {
        setUseEmail(null); 
        setError(null);
    } 

    const parseError = err => { 

        console.log("PARSE",err)
         
        if( typeof err == 'string' || err?.hasOwnProperty("message") )
        {
            let msg = err.message ?? err;
            let m; 

            err = {};

            if( m = msg.match(/ERR:(?<field>\S+) (?<msg>.*)/) )
            { 
                err[m.groups.field]=m.groups.msg;
            }
            else {
                err.general = msg=="?"? "Unexpected response from the server": msg;
            } 
        }

        setError(err);  
    }
    

    if( typeof useEmail == 'boolean' )
    {
        return <><Box maxWidth={220} marginBottom={1}>
        
                    <OperationBackdrop open={ busy }/>
 

                    { 
                        /*----------------- LOGIN --------------------*/
                        useEmail && <LoginBox busyState={[busy, setBusy]} errorState={[error, parseError]}/> 
                    } 

                    { 
                        /*----------------- LOGIN --------------------*/
                        useEmail===false && <CreateAccountBox busyState={[busy, setBusy]} errorState={[error, parseError]}/> 
                    } 
                            
                    { error?.general && <div className={classes.error}><ErrorOutlineIcon/> {error?.general}</div>}
                    <br/>
                    <br/>
                    <Button disabled={busy}  variant="outlined" fullWidth onClick={()=>cancel()} startIcon={<ClearIcon/>}>cancel</Button>

                </Box>
                
                </>
    }

    return <>

        <Box maxWidth={220}>
            <FirebaseLoginPage /> 

        
            <Typography gutterBottom className={classes.OR}>
                <strong>OR</strong></Typography>
            <Button variant="contained" color="primary" fullWidth onClick={()=>setUseEmail(true)} startIcon={<VpnKeyIcon/>}>Login with email</Button>
            
            {!disableCreateAccount && <><br /><br /> 
                <Button variant="contained" className="fancy" fullWidth onClick={()=>setUseEmail(false)} startIcon={<AddIcon/>}>CREATE ACCOUNT</Button></>}
            <br /><br /> 
        </Box>
    </>;
};


/**---------------------------------**
 *          L O G I N
 **---------------------------------**/
const LoginBox = ({ busyState:[ busy, setBusy ], errorState:[ error, setError] })=>{

    
    const usernameInput     = useRef(); 
    const passwordInput     = useRef(); 
    const classes           = useStyles();
    const execLogin         = useLogin();
    const [execForgot]      = useForgotMutation();
    const [forgotSent, setForgotSent] = useState(false);
    const onLoginHook       = useUILoginHook();

    const login = ()=>{

        const username = usernameInput?.current.value;
        const password = passwordInput?.current.value;
        if( username?.length<4 ) return setError({uname:"Must be at least 4 characters"});
        if( password?.length<6 ) return setError({pass:"Must be at least 6 characters"});

        setError(null);
        setBusy(true);
        setForgotSent(false);

        execLogin(username, password, !onLoginHook ) // on resolve this will location.reload()
 
            .then( sessionToken =>{

                if( onLoginHook )
                {
                    onLoginHook( sessionToken );
                }

            })
            .catch( err=>{
                setBusy(false);
                setError(err);
            }); 
    }

    const forgot = ()=>{
        const username = usernameInput?.current.value;
        if( username?.length<4 ) return setError({uname:"Type your username or email"});

        setError(null);
        setBusy(true);
        setForgotSent(false);

        execForgot({
            variables: {
                uore:username
            }
        })
        .then( resp=>
        {
            if( resp.data.forgot === true )
            {
                setForgotSent(username);
            }
            else 
            {
                throw new Error("?");
            }
        })

        .catch( setError )
        .finally( ()=>setBusy(false) );
    }

    const onFormSubmit = ev => {
        ev.preventDefault();
        login();
    }

    return <form noValidate onSubmit={onFormSubmit} autoComplete="off" className={classes.form}> 
                    
                    <Input
                        required 
                        label="Username or Email" 
                        variant="outlined"
                        fullWidth 
                        error={!!error?.uname || !!error?.uore}
                        helperText={error?.uname || error?.uore}
                        inputRef={usernameInput}  
                        type="text"
                        id="email"
                        autoComplete="username"
                        disabled={busy}
                    />
                    <br/><br/>
                    <Input
                        required 
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        fullWidth  
                        error={!!error?.pass}
                        helperText={error?.pass} 
                        inputRef={passwordInput}  
                        disabled={busy}
                    />

                    <Box marginTop={2} marginBottom={2}>
                        <Button disabled={busy} variant="contained" color="primary" startIcon={<VpnKeyIcon/>} fullWidth type="submit">Login</Button> 
<br/>
<br/>
                        { forgotSent? 
                            <Alert severity="info">A new <strong>temporary password</strong> was created and sent to {forgotSent.indexOf("@") > 0 ? <strong>{forgotSent}</strong> : <>the email associated with <strong>{forgotSent}</strong></>}. Use that password to login.</Alert>
                        : <Button startIcon={<SentimentVeryDissatisfiedIcon/>} disabled={busy} variant="outlined" fullWidth onClick={()=>forgot()}>Forgot password</Button> }
                    </Box> 
    </form>;
}

/**---------------------------------**
 *    C R E A T E    A C C O U N T
 **---------------------------------**/
const CreateAccountBox = ({ busyState:[ busy, setBusy ], errorState:[ error, setError] })=>{

    const classes               = useStyles(); 
    const [signup, { client }]  = useSignupMutation();
    const [verifySignup]        = useVerifySignupMutation();
    const session               = useGetSession();

    const emailInput    = useRef();
    const usernameInput = useRef();
    const passwordInput = useRef();
    const codeInput     = useRef();

    const [isFemale, setIsFemale] = useState(0);
    const [useLbs, setUseLbs] = useState(0);
    const [waitingForCode, setWaitingForCode] = useState(false);

    
    const create = ()=>{

        const email = emailInput.current.value;
        const uname = usernameInput.current.value;
        const pass  = passwordInput.current.value;

        if( email.indexOf("@")<0 ) return setError({ email:"Set a valid email"});
        if( uname.length<4 ) return setError({ uname:"Should be at least 4 characters long..."});
        if( pass.length==0 ) return setError({ pass:"Set a password!"});

        setError(null);
        setBusy(true);

        signup({
            variables: {
                email, pass, uname, isf:isFemale, usekg:1-useLbs
            }
        })

        .then( done=> {

            if( done.data.signup===true )
            {
                setWaitingForCode(true);
            }
            else 
            { 
                throw new Error("?");
            }
        })

        .catch( setError )

        .finally(()=>setBusy(false));

    }

    const onCodeInput = ev =>{
        if( ev.target.value.length==6 )
        {
            verify(ev.target.value);
        }
    }

    const verify = verificationCode => {
        if( busy ) return; //<--- just in case the code input fires again....
        setBusy(true);
        setError(null);

        verifySignup({
            variables: {
                code:verificationCode
            }
        })

        .then( resp => {

            let sessionToken = resp.data.verifySignup;
            
            if( typeof sessionToken=='string' )
            {
                session.reload(sessionToken);
            }
            else 
            {
                throw new Error("?");
            }

        })

        .catch( err =>
        {
            setBusy(false);
            setError(err);
        })

    }

    if( waitingForCode )
    {
        return <form noValidate autoComplete="off" className={classes.form}>
                    <Input
                        required 
                        label="Type the code here" 
                        variant="outlined"
                        fullWidth 
                        error={!!error?.code}
                        helperText={error?.code}
                        inputRef={codeInput}  
                        type="text" 
                        disabled={busy}
                        onChange={onCodeInput}
                    />
                    <Box marginTop={2} marginBottom={2}>
                        <Button disabled={true} variant="contained" className="fancy" fullWidth>
                            <AsciiSpinner label="Waiting for code..."/>
                        </Button> 
                    </Box> 
        </form>
    }

    return <form noValidate autoComplete="off" className={classes.form}> 
                    
                    <Input
                        required 
                        label="Type your email" 
                        variant="outlined"
                        fullWidth 
                        error={!!error?.email}
                        helperText={error?.email}
                        inputRef={emailInput}  
                        type="text" 
                        disabled={busy}
                    />
                    <br/><br/>
                    <Input
                        required 
                        label="Desired Username"
                        type="text" 
                        variant="outlined"
                        fullWidth  
                        error={!!error?.uname}
                        helperText={error?.uname} 
                        inputRef={usernameInput}  
                        disabled={busy}
                    />
                    <br/><br/>
                    <Input
                        required 
                        label="Account password"
                        type="password" 
                        variant="outlined"
                        fullWidth  
                        error={!!error?.pass}
                        helperText={error?.pass} 
                        inputRef={passwordInput}  
                        disabled={busy}
                    />
                    <br/><br/>
                    <Box>
                        <ButtonGroup fullWidth> 
                            {
                                ["Male", "Female"].map((g,i)=><Button key={i} variant={isFemale==i?"contained":"outlined"} onClick={()=>setIsFemale(i)}>{g}</Button>)
                            }
                        </ButtonGroup> 
                    </Box>
                    <br/> 
                    <Box>
                        <ButtonGroup fullWidth>
                            {
                                ["Kilograms", "Pounds"].map((g,i)=><Button key={i} variant={useLbs==i?"contained":"outlined"} onClick={()=>setUseLbs(i)}>{g}</Button>)
                            }
                        </ButtonGroup> 
                    </Box>

                    <Box marginTop={2} marginBottom={2}>
                        <Button disabled={busy} variant="contained" className="fancy" fullWidth onClick={()=>create()}>Create account</Button> 
                    </Box> 
    </form>;
}