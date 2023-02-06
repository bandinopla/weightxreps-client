import { Grid, Paper, TextField, Typography } from "@material-ui/core";
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//import { EmailAuthProvider, FacebookAuthProvider, GoogleAuthProvider, GithubAuthProvider, PhoneAuthProvider } from "@firebase/compat/auth";

import firebase from "firebase/compat/app";
import "firebase/compat/auth"; 
import * as firebaseui from "firebaseui";

import "firebaseui/dist/firebaseui.css";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import OperationBackdrop from "../componentes/backdrop";
import { OpenConfirmModal } from "../componentes/Dialog";
import ErrorSnackbar from "../componentes/ErrorSnackbar";
import { trackLoginWith } from "../componentes/google-tracker";
import { parseError } from "../data/db";
import { useLoginWithFirebaseMutation } from "../data/generated---db-types-and-hooks";
import { setSessionToken } from "../session/session-handler";
import { OneOf } from "./SignupAndLogin";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBLT6B3R4bs7N_t2NW2Vbnv0cCmVSjzcRg",
    authDomain: "weight-for-reps.firebaseapp.com",
    projectId: "weight-for-reps",
    storageBucket: "weight-for-reps.appspot.com",
    messagingSenderId: "995540830128",
    appId: "1:995540830128:web:a2af6f8f150a70a20e7875",
    measurementId: "G-CMKG2KBH88"
  };
 

  console.log("INIT FIREBASE")
// Initialize Firebase
const app   = firebase.initializeApp(firebaseConfig);
const auth  = app.auth(); //getAuth(app);

// Promise that resolves unless the FirebaseUI instance is currently being deleted.
let firebaseUiDeletion = Promise.resolve();


export default function FirebaseLoginPage() {
    const ref                   = useRef();
    const [token, setToken]     = useState();
    const [login, { data, loading, error, client }] = useLoginWithFirebaseMutation();
    const [opError, setOpError] = useState();
    const getAccSetupValues     = useRef();
    const history               = useHistory();

    //
    // Firebase UI setup
    //
    useEffect(async () => {  

        // Wait in case the firebase UI instance is being deleted.
        // This can happen if you unmount/remount the element quickly.
        await firebaseUiDeletion;

        const ui    = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
        console.log("CREATE LOGIN UI")

        ui.reset(); //ig signin flow = popup
 


        const unsub = auth.onAuthStateChanged( user => {
            console.log("AUTH STATE CHANGE: ", user)
            if( !user && token )// 
            {
                ui.reset();
            }

            if( user && !token ) 
            { //is logged...
                auth.currentUser.getIdToken(false).then( token => {  
                    setToken(token);
                });
            }
        });



        ui.start(ref.current, {
            signInOptions: [
            //     {
            //         provider: EmailAuthProvider.PROVIDER_ID,
            //         // Whether the display name should be displayed in the Sign Up page.
            //         requireDisplayName: false, 
            //     },  
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    scopes:["email"]
                },
                firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                {
                    provider:firebase.auth.GithubAuthProvider.PROVIDER_ID,
                    scopes:["read:user","user:email"]
                },
                {
                    provider:firebase.auth.PhoneAuthProvider.PROVIDER_ID,  
                    recaptchaParameters: {
                        size:"normal"
                    }
                }
            ],

            autoUpgradeAnonymousUsers:true,
            callbacks: {
                uiShown: function () {
                    //... se mostro el UI
                },

                signInSuccessWithAuthResult: function (authResult, redirectUrl) {

                    console.log("LOGIN SUCCESS:", authResult)
                    var user = authResult.user;
                    var credential = authResult.credential;
                    var isNewUser = authResult.additionalUserInfo.isNewUser;
                    var providerId = authResult.additionalUserInfo.providerId;
                    var operationType = authResult.operationType;
                    var idToken = authResult.user.accessToken;

                    
                    

                    // auth.currentUser.getIdToken(false).then( token => { 
                    //     console.log("AUTH RESULT", authResult)
                    //     setToken(token);
                    // });

                    

                    // Do something with the returned AuthResult.
                    // Return type determines whether we continue the redirect
                    // automatically or whether we leave that to developer to handle.
                    //console.log("Chequear que el login sea correcto ---->", idToken)

                    // login({variables:{ token:idToken} }).then( res => {
                    //     console.log("LOGIN RESULT: "+res.data.loginWithFirebase);
                    // }, err=>console.error(error));

                    return false;// Avoid redirects after sign-in.
                },

                signInFailure: (error) => {

                    console.log("ERROR",error)
                    setOpError(error.message)
                } 


            },


            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: "popup",
            //signInSuccessUrl:"/",

            // Terms of service url.
            tosUrl: '/terms-of-service',
            // Privacy policy url.
            privacyPolicyUrl: '/privacy-policy'
        });


 

        return async () => {

            await firebaseUiDeletion;
            unsub(); 
            firebaseUiDeletion = ui.delete();
            await firebaseUiDeletion;
            console.log("DELETE LOGIN UI");
        }

    }, [token]);



    const logoutFromFirebase = async () => {

        console.log("LOGOUT FROM FIREBASE ", token);
        try{
            await auth.currentUser.delete(); //delete the user
        }
        catch(e) {
            //shh....
        }
        
        setToken(null);
    }


    const callLogin = accSetupValues => {

        login({ variables: { token, ...accSetupValues } })

            //.then(res=>auth.signOut.then(res)) //LOGOUT de firebase

            .then(res => {

                console.log("LOGIN")
                return logoutFromFirebase().then(()=>{

                    console.log("LOGIN RESULT: " + res.data.loginWithFirebase);
                    trackLoginWith("Firebase");
                    setSessionToken(res.data.loginWithFirebase, client);
                    history.push("/"); 
                });
                
                //logoutFromFirebase();
            })

            .catch(e => {

                console.log("ERROR", { elError:e })
                var errorCode = parseError(e);

                if (errorCode.indexOf('PICK-UNAME') == 0) 
                {
                    var errorDetail = errorCode.split("|")[1];
    
                    OpenConfirmModal({
                        title       : "First time! Setup your account:",
                        info        : <AccountSetupForm error={errorDetail} getValues={getAccSetupValues} firstTime={accSetupValues==null}/>,
                        open        : true,
                        canCancel   : true,
                        onCancel    : ()=>{
                            //setToken(null);
                            logoutFromFirebase();
                        },
                        onConfirm   : () => { 
                            callLogin( getAccSetupValues.current() );
                        }, 
                        verb:"Create Account",
                        fullWidth:true
                    });
                }
                else 
                { 
                    console.error(e)
                    logoutFromFirebase();
                    setOpError(errorCode);
                }
            })
            ;

    }

    //
    // si hay credencial, call login...
    //
    useEffect(() => token && callLogin(), [token]);

    //useEffect(()=>opError && auth.currentUser.delete(),[opError]);


    return <Paper elevation={2} square style={{ padding: 30 }}>
                <OperationBackdrop open={loading} />
                <ErrorSnackbar trigger={ opError } vertical="bottom" horizontal="center" onClose={() => setOpError(null)} />
 
                <div style={{ textAlign: "right", width: "100%" }} ref={ref}></div> 
 
            </Paper>;

}



//
// Account Setup Form
//
var lastWUnitSelected = 0;
var lastGender = 0;

const AccountSetupForm = ({ error, getValues, firstTime }) => {

    const unameRef          = useRef();
    const genderOption      = useRef();
    const wunitOption       = useRef();
    const [unamePreview, setUnamePreview]   = useState("");
    const [innerError, setInnerError]       = useState(error);

    const calcPreview = ()=>{
        const val = unameRef.current.value.trim();
        const clean = val.replace(/[^a-z0-9_]+/gi,"");

        setUnamePreview("~~INVALID!~~");

        if( clean.length!=val.length )
        {
            setInnerError("Invalid username. Only letters, numbers and underscore allowed!")
        }
        else if( clean.length<4 )
        {
            setInnerError("Username should be at least 4 characters long!");
        }
        else if( clean.length>40 )
        {
            setInnerError("Username is way too long!")
        }
        else 
        {
            setInnerError(null);
            setUnamePreview(clean);
        }
    }


    getValues.current = () => {

        lastWUnitSelected = wunitOption.current;
        lastGender = genderOption.current;

        return {
            isf: genderOption.current,
            usekg: wunitOption.current == 0 ? 1 : 0,
            uname: unameRef.current.value.trim()
        }
    }

    return <div>
        Since this is the first time you enter the site, we need this info:<br/>
        <form noValidate autoComplete="off">
            <TextField error={innerError != null} helperText={innerError} inputRef={unameRef} label="Desired Username" fullWidth onKeyUp={(ev)=>calcPreview()}/>
            <Typography variant="caption" noWrap>
                Your journal url will be <strong>weightxreps.net/journal/{unamePreview}</strong>
            </Typography>
        </form>

        <Grid container style={{ paddingTop: 20, textAlign: "center" }} justifyContent="center"
            alignItems="center">
            <Grid item md={6}>
                <OneOf options={["Male", "Female"]} oref={genderOption} initialValue={firstTime ? 0 : lastGender} />
            </Grid>
            <Grid item md={6}>
                <OneOf options={["Kilos", "Pounds"]} oref={wunitOption} initialValue={firstTime ? 0 : lastWUnitSelected} />
            </Grid>
        </Grid>

    </div>
}