import { makeVar, useReactiveVar } from "@apollo/client";
import { Grid, Paper, TextField } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { parseError } from "../data/db";
import { useLoginWithGoogleMutation } from "../data/generated---db-types-and-hooks";
import { OneOf } from "../pages/SignupAndLogin";
import { setSessionToken } from "../session/session-handler";
import OperationBackdrop from "./backdrop";
import { OpenConfirmModal } from "./Dialog";
import ErrorSnackbar from "./ErrorSnackbar";
import { trackLoginWith } from "./google-tracker";

var initialized = false;
const $onGoogleCredential = makeVar();


function handleCredentialResponse(response) {
    //console.log("Encoded JWT ID token: " , response.credential );
    $onGoogleCredential(response.credential)
  }
 

export const LoginWithGoogle = function() {

    const ref                       = useRef(); 
    const getAccSetupValues         = useRef();
    const hayCredential             = useReactiveVar($onGoogleCredential);
    const [opError, setOpError]     = useState();

    const [login, { data, loading, error, client  }] = useLoginWithGoogleMutation();
    
    useEffect(()=>{
  
            var google = window.google;

            if( !initialized )
            {
                google.accounts.id.initialize({ 
                    client_id: "642401608663-g6iink4oi76gpnvflrm8uvrfjjk39eag.apps.googleusercontent.com",
                    callback: handleCredentialResponse
                });

                initialized = true;
            }
            
 
            google.accounts.id.renderButton(
                ref.current,
                { 
                    scope: 'profile email',
                    theme: "outline", 
                    size: "large",
                    //text:"$ {button.text}",
                    width:"100%",
                    //'longtitle': true 
                
                }  // customization attributes
            );
            //google.accounts.id.prompt(); // also display the One Tap dialog  

    },[]);  


    const callLogin = accSetupValues => {

        login({
            variables: {
                jwt: hayCredential,
                ...accSetupValues
            }
        })

        .then( (resp) => {
 
            trackLoginWith("Google");
            setSessionToken( resp.data.loginWithGoogle ,client );

        })
        
        .catch(e=>{
    
            var errorCode = parseError(e) ; 
    
            if( errorCode.indexOf('PICK-UNAME')==0 )
            {
                var errorDetail = errorCode.split("|")[1];
    
                OpenConfirmModal({
                    title       : "First timer! Setup your account:",
                    info        : <AccountSetupForm error={errorDetail} getValues={getAccSetupValues} firstTime={accSetupValues==null}/>,
                    open        : true,
                    canCancel   : true,
                    onCancel    : ()=>{
                        $onGoogleCredential(null);
                    },
                    onConfirm   : () => {
                        //alert( unameRef.current.value )
                        callLogin( getAccSetupValues.current() );
                    }, 
                    verb:"Create Account",
                    fullWidth:true
                });
            }
            else 
            {
                // alert error....
                setOpError(errorCode);
            } 
    
    
        })
    }
 
    //
    // si hay credencial, call login...
    //
    useEffect(()=>hayCredential && callLogin(), [hayCredential]);
 

    

    return <Paper elevation={2} square style={{padding:10}}>
            <OperationBackdrop open={ loading }/> 
            <ErrorSnackbar trigger={opError} vertical="bottom" horizontal="center" onClose={()=>setOpError(null)}/>
            
            <div style={{ textAlign:"right", width:"100%" }} ref={ref}></div>  
        </Paper>;
}



var lastWUnitSelected   = 0;
var lastGender          = 0;

const AccountSetupForm = ({ error, getValues, firstTime })=> {

    const unameRef          = useRef();
    const genderOption      = useRef();
    const wunitOption       = useRef();


    getValues.current = ()=>{

        lastWUnitSelected   = wunitOption.current;
        lastGender          = genderOption.current;

        return {
            isf: genderOption.current,
            usekg: wunitOption.current==0?1:0,
            uname: unameRef.current.value
        }
    }

    return <div>
                Define your username, gender and default weight unit:
                <form noValidate autoComplete="off">
                    <TextField error={error!=null} helperText={error} inputRef={unameRef} label="Username" fullWidth/>
                </form>

                <Grid container style={{paddingTop:20, textAlign:"center"}} justifyContent="center"
  alignItems="center">
                    <Grid item md={6}>
                        <OneOf options={["Male","Female"]} oref={genderOption} initialValue={firstTime? 0 : lastGender}/>
                    </Grid>
                    <Grid item md={6}>
                        <OneOf options={["Kilos","Pounds"]} oref={wunitOption} initialValue={firstTime? 0 : lastWUnitSelected}/>
                    </Grid>
                </Grid>
                
            </div>
}