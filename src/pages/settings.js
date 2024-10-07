import { Box, Button, ButtonGroup, CircularProgress, Container, FormControl, FormHelperText, Grid, Input, LinearProgress, makeStyles, Paper, Snackbar, Typography } from '@material-ui/core';
import { useEffect, useRef, useState, createContext, useContext } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { UAvatarFromUserQL } from '../componentes/uavatar';
import { ImageUploadButton } from '../image-uploader/image-uploader';
import { useGetSettingsQuery, useSendVerificatonCodeMutation, useSetSettingMutation } from '../data/generated---db-types-and-hooks';
import { AsciiSpinner } from '../componentes/ascii-spinner';
import TextField from '@material-ui/core/TextField';
import { parseError } from '../data/db';
import MuiAlert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Flag from "../componentes/flags";
import { Alert } from '@material-ui/lab';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
//--
import { dateToYMD, isEmail, ymd2date } from '../utils/utils';
import { RPETableWidget } from './setting-rpetable';

//---
import { clearJdayAndJRangeOf, updateUserCachedData } from '../cache/clean-cache';
import { useHistory, Redirect } from "react-router-dom";
import { PasswordInput } from '../componentes/PasswordInput';
import { DownloadWidget } from './download-logs-widget';
import { useGetSession } from '../session/session-handler';
import { SettingDiv } from '../componentes/setting-div';
import { ImportFromWidget } from './settings-import-from';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EditIcon from '@material-ui/icons/Edit';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import WcIcon from '@material-ui/icons/Wc';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PregnantWomanIcon from '@material-ui/icons/PregnantWoman';
import LockIcon from '@material-ui/icons/Lock';
import CakeIcon from '@material-ui/icons/Cake';
import FlagIcon from '@material-ui/icons/Flag';
import BlockIcon from '@material-ui/icons/Block';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import GridOnIcon from '@material-ui/icons/GridOn';
import FunctionsIcon from '@material-ui/icons/Functions';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { ContentPage } from '../componentes/ContentPageWrapper';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import ColorThemePage from './ColorThemePage';
import LinkIcon from '@material-ui/icons/Link';
import SettingConnectedServices from '../oauh/SettingConnectedServices';
import CodeIcon from '@material-ui/icons/Code';
import SettingDeveloperApi from '../oauh/SettingDeveloperApi';

export const useSettingsStyles = makeStyles( theme=>({
    input: {
        color: theme.userTextColor,
        fontWeight:"bold",
        paddingLeft:5
    },

    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
        fontWeight:"bold"
      },

    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

export const CurrentUserContext = createContext({ id:0 });

export default function SettingsPage() {
     
    const {session}                  = useGetSession(); 
    const [expanded, setExpanded]   = useState(false);
    const { data:settings, loading, error } = useGetSettingsQuery();

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    
    if( !session )
    {
        //history.push("/");
        //return "-- no hay session";
        return <Box padding={2} textAlign="center"><AsciiSpinner label="Active session not found, waiting for one... (log in if you haven't done so)"/></Box>;
         
    }

    if( error )
    {
        return <Alert severity="error">{ parseError(error) }</Alert>
    } 
 
 
    return <CurrentUserContext.Provider value={session.user}> 

                            { loading && <LinearProgress/>}

                { settings && <>

                            <SettingDiv title="Change colors" desc="Customize light and dark mode..." Icon={<FormatColorFillIcon/>}>
                                <ColorThemePage/>
                            </SettingDiv>


                            <SettingDiv title="Download logs" desc="Download all your logs..." Icon={<GetAppIcon/>}> 
                                <DownloadWidget user={session?.user}/>
                            </SettingDiv>
                            <SettingDiv title="Import Workouts" desc="Import workout data from a backup..." Icon={<PublishIcon/>}>
                                <ImportFromWidget user={session?.user}/>
                            </SettingDiv>

                            <SettingDiv title="Change profile picture" desc="Change your avatar..." Icon={<AccountBoxIcon/>}>
                                <Grid container>
                                    <Grid item md={3}> 
                                        <UAvatarFromUserQL userQL={session.user} width={155} height={67} className="rounded" />
                                    </Grid>
                                    <Grid item md={9}> 
                                        <Alert severity='info'>If you dont pick a profile picture, the flag of your country will be used as one (if available)</Alert>
                                        <Box padding={1} margin={1}> 
                                            <ImageUploadButton/>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </SettingDiv>

                            <SettingDiv title="Change Username" desc="Change your username" Icon={<EditIcon/>}>
                                <MustBeSOK user={session?.user}/>
                                <ChangeUsernameWidget setting={ settings.getUserSettings.find(s=>s.id=='username')}/>
                            </SettingDiv>

                            <SettingDiv title="Change Email" desc="How to contact you in case the agency needs you... j/k " Icon={<AlternateEmailIcon/>}>
                                <EmailChangeWidget setting={ settings.getUserSettings.find(s=>s.id=='email')}/>
                            </SettingDiv>

                            <SettingDiv title="Allow Emails" desc="Do you allow recieving emails in your inbox?" Icon={<RssFeedIcon/>}>
                                <OptionsWidget successMessage="Emails notifications setting applied" hint="Do you want to recieve emails when/if someone sends you a message or comment?" 
                                                setting={ settings.getUserSettings.find(s=>s.id=='emails-allowed')} 
                                                />
                            </SettingDiv> 


                            <SettingDiv title="Change Password" desc="Change it once in a while just to stay somewhat safe..." Icon={<VpnKeyIcon/>}>
                                <PasswordChangeWidget setting={ settings.getUserSettings.find(s=>s.id=='password')}/>
                            </SettingDiv>

                            <SettingDiv title="Change Gender" desc="Color of your username and stats category" Icon={<WcIcon/>}>
                                <OptionsWidget successMessage="Gender changed!" hint="Sets color of your username and is used to filter on the comunity stats users with your same gender." 
                                                setting={ settings.getUserSettings.find(s=>s.id=='gender')}
                                                onUpdateCache={ (cache, {data:{setSetting}})=>updateUserCachedData(cache, session.user.id, { isf:setSetting.i }) }
                                                />
                            </SettingDiv> 
                            

                            <SettingDiv title="Supporter Status" desc="Info about your status..." Icon={<FavoriteIcon/>}>
                                <SupporterStatusWidget setting={ settings.getUserSettings.find(s=>s.id=='supstatus')}/>
                            </SettingDiv>


                            <SettingDiv title="Hide Bodyweight" desc="Idk is this is usefull..." Icon={<PregnantWomanIcon/>}>
                                <OptionsWidget successMessage="Done!" hint="Hiding the bodyweight will mean only you will be able to see it. NOTE: in the community stats it might take a while to update this new value (Until the next calculation)" setting={ settings.getUserSettings.find(s=>s.id=='hidebw')}/>
                            </SettingDiv>

                            

                            <SettingDiv title="Private mode" desc="Ninja mode... secret agent training?" Icon={<LockIcon/>}>
                                <MustBeSOK user={session?.user} extra="This is required only to turn it ON. If you turn it ON and you stop being an active supporter it will remain ON until you turn it OFF (if you ever do)"/>
                                <OptionsWidget  successMessage="Private mode changed!" 
                                                hint="Private means no one will be able to see your logs, only you." 
                                                setting={ settings.getUserSettings.find(s=>s.id=='private')}
                                                onUpdateCache={ (cache, {data:{setSetting}})=>updateUserCachedData(cache, session.user.id, { private:setSetting.i }) }
                                                />
                            </SettingDiv> 
                            

                            <SettingDiv title="Set Birthday" desc="Used to display your age, the date is not shown." Icon={<CakeIcon/>}>
                                <BirthdayWidget setting={ settings.getUserSettings.find(s=>s.id=='dob')}/>
                            </SettingDiv>

                            <SettingDiv title="Country" desc="Used to show a flag next to your username..." Icon={<FlagIcon/>}>
                                <CountryCodeWidget setting={ settings.getUserSettings.find(s=>s.id=='cc')}/>
                            </SettingDiv>

                            <SettingDiv title="Block Users" desc="Usernames to block..." Icon={<BlockIcon/>}>
                                <BlockedUsersWidget setting={ settings.getUserSettings.find(s=>s.id=='block')}/>
                            </SettingDiv>

                            <SettingDiv title="Default weight unit" desc="Kilograms or Pounds?" Icon={<FitnessCenterIcon/>}>
                                <OptionsWidget  successMessage="Unit set!" 
                                                hint="Weight unit to assume if you dont explicitly type it next to a weight. For example, if you type: 100x5, it should be 100lbs or 100kg?" 
                                                setting={ settings.getUserSettings.find(s=>s.id=='uselbs')}
                                                onUpdateCache={ (cache, {data:{setSetting}})=>updateUserCachedData(cache, session.user.id, { usekg:1-setSetting.i }) }
                                                />
                            </SettingDiv>

                            <SettingDiv title="RPE Table" desc="Set a custom % for a given RPE and REP..." Icon={<GridOnIcon/>}>
                                <RPETableWidget setting={ settings.getUserSettings.find(s=>s.id=='rpe')}/>
                            </SettingDiv>


                            <SettingDiv title="Custom 1RM Factor" desc="Set a custom factor for the 1RM Formula..." Icon={<FunctionsIcon/>}>
                                <Custom1RMFactorWidget setting={ settings.getUserSettings.find(s=>s.id=='custom1rm')}/>
                            </SettingDiv>

                            <SettingDiv title="Connected Services" desc="Check what applications are connected to your account" Icon={<LinkIcon/>}>
                                <SettingConnectedServices setting={settings.getUserSettings.find(s=>s.id=='connected-services') }/>
                            </SettingDiv>

                            <SettingDiv title="Developer API" desc="Make new apps for our users!" Icon={<CodeIcon/>}>
                                <SettingDeveloperApi setting={settings.getUserSettings.find(s=>s.id=='oauth-dev-config') }/>
                            </SettingDiv>
                            


                            <SettingDiv title="Delete Account" desc="Delete all data and destroy account!" Icon={<DeleteForeverIcon/>}>
                                <DeleteAccountWidget setting={ settings.getUserSettings.find(s=>s.id=='del-acc')}/>
                            </SettingDiv>

                            <br/>
                            <br/>
                            </> }
 
    
            </CurrentUserContext.Provider>;
}
 

const MustBeSOK = ({ user, extra="" })=>{
    return !user.sok && <><Alert severity="warning">You must be an <strong>active supporter</strong> to unlock this feature. {extra}</Alert><br/></>;
}


// const SettingDiv = ({title, children})=>{
//     return <Box marginTop={3} position="relative">
//                 <Divider />
//                 <Typography style={{marginTop:8}} variant="h6" gutterBottom>{title}</Typography>
//                 { children}
//             </Box>
// }

// const $settingsPanelOpen = makeVar(false);

// const SettingDiv = ({title, desc, children})=>{

//     const expanded  = useReactiveVar($settingsPanelOpen);
//     const classes   = useSettingsStyles();

//     return <Accordion expanded={expanded === title} onChange={ (event, isExpanded)=>$settingsPanelOpen(isExpanded? title : null) }>
//                 <AccordionSummary
//                 expandIcon={<ExpandMoreIcon />} 
//                 >
//                 <Typography className={classes.heading}>{ title }</Typography>
//                 <Typography className={classes.secondaryHeading}>{ desc || "..." }</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails style={{ flexDirection:"column"}}>
//                     {children}
//                 </AccordionDetails>
//             </Accordion>
// }



const SupporterStatusWidget = ({setting}) => {

    const history = useHistory();

    return <>
        <Button onClick={ ()=>history.push("/donate") } variant="outlined" startIcon={<FavoriteBorderRoundedIcon/>} style={{ position:"absolute", top:5, right:50}}>Donate</Button>
    <Grid container>
        <Grid item xs={4}>
            <Typography variant="h6">{setting.slvl}</Typography>
            <Typography variant="subtitle1">Supporter level</Typography>
        </Grid>
        <Grid item xs={4}>
            <Typography variant="h6">{setting.daysLeftAsActive>0? "YES" : "NO"}</Typography>
            <Typography variant="subtitle1">Active Supporter</Typography>
        </Grid>
        <Grid item xs={4}>
            <Typography variant="h6">{setting.daysLeftAsActive || "---"}</Typography>
            <Typography variant="subtitle1">Days left as Active</Typography>
        </Grid>
    </Grid></>;
}


 
const OptionsWidget = ({ setting, onUpdateCache, successMessage, hint }) => {

    const [error, setError]     = useState();
    const [success, setSuccess] = useState();
    const [tmpValue, setTmpValue] = useState(null);
    const [busy, setBusy]       = useState(false);
    const selValue              = useRef(); 
    const [setSetting]          = useSetSettingMutation();

    const setOption = async i => {

        setBusy(true);
        setError(null);
        setSuccess(null);


        try 
        {
            setTmpValue(i); //<--- para mostrar un feedback mas rapido al usuario...
            
            await setSetting({
                variables: {
                    id      : setting.id,
                    value   : i
                },

                update: (cache, result)=>{ 
                    onUpdateCache && onUpdateCache(cache, result);
                }
            });

            setSuccess(true);
        }
        catch( e )
        {
            setError( parseError(e) );
        }

        setTmpValue(null);
        setBusy(false);

    }

    return <FormControl error={error!=null} >
 

                <SettingSuccessSnackbar open={success} onClose={()=>setSuccess(false)} text={ successMessage }/>

                <ButtonGroup disabled={busy} color="primary">
                    { setting.options.map( opt=>(<Button key={opt.i} onClick={ ()=>setOption(opt.i) } variant={ (tmpValue==null && setting.i==opt.i) || opt.i==tmpValue?"contained" : "outlined" }>{opt.name}</Button>) ) }
                    
                    { busy && <Button>
                        <CircularProgress size={20}/>
                    </Button> }
                </ButtonGroup>
                 

                <FormHelperText>{ error || hint }</FormHelperText>

            </FormControl> 
            ;
}

/*
// Country names object using 2-letter country codes to reference country name
// ISO 3166 Alpha-2 Format: [2 letter Country Code]: [Country Name]
// Sorted alphabetical by country name (special characters on bottom)
*/
const CountryCodeWidget = ({setting}) => {

    const currentUser                   = useContext(CurrentUserContext);

    return <ComboWidget setting={setting} 
                        options={setting.ccs} 
                        getOptionLabel={ option => option.name } 
                        getOptionValue={ option=>option.cc }
                        value={ setting.cc }
                        label="Country"
                        hint={ <><Flag cc={setting.cc}/> Will be used to display a flag...</> }
                        verb="Set Country"
                        placeholder={"Select your country"}
                        successMsg="Country set!"
                        renderOption={(option) => (
                            <div>
                              <Flag cc={option.cc}/>&nbsp; {option.name} 
                            </div>
                          )} 

                        onUpdateCache={ (cache, {data:{setSetting}})=>updateUserCachedData(cache, currentUser.id, { cc:setSetting.cc }) }
                        />
}

const ComboWidget = ({setting, options, hint, getOptionLabel, getOptionValue, value, placeholder,successMsg, verb, renderOption, onUpdateCache }) => {
    
    const [error, setError]     = useState();
    const [busy, setBusy]       = useState(false);
    const selValue              = useRef(); 

    const onChange = async newCC => 
    { 
        selValue.current = newCC?.cc; 
    }

    const onGetValue = async ()=> {
        return selValue.current || "xx";
    }

    return <SettingChangeWidget successMessage={successMsg}
                                getValue={onGetValue} 
                                setting={setting}
                                onBusy={setBusy}
                                onError={setError}
                                onUpdateCache={onUpdateCache}
                                verb={ verb }>
 
            <FormControl error={error!=null} style={{width:300}}>

            <Autocomplete 
                options={options}
                getOptionLabel={ getOptionLabel }  
                onChange={ (_,va)=>onChange(va) }
                value = { value? options.find( o=>getOptionValue(o)==value ) : null } 
                disabled={ busy }  
                renderOption={renderOption}  
                renderInput={(params) => <TextField {...params} placeholder={placeholder}/>}
                />
                <FormHelperText>{ error || hint }</FormHelperText>
                </FormControl> 
                
                </SettingChangeWidget>
}


const BirthdayWidget = ({setting}) => {

    const currentUser                   = useContext(CurrentUserContext);
    const onGetValue = async txt => {
        var m;

        if( txt==setting.dob )
        {
            return;
        }

        if( m=txt.match(/^\s*(\d{4}-\d{2}-\d{2})\s*$/) )
        {
            let ymd     = m[1];
            let d       = ymd2date(ymd);
            let ymd2    = dateToYMD(d,true);

            if( ymd==ymd2 )
            {
                return ymd;
            }
        }

        throw new Error("Invalid date. Must be in format: YYYY-MM-DD")
    }

    const ymd2age = ymd => { 
        return ymd? Math.floor( (new Date().valueOf()- ymd2date(ymd).valueOf()) / 31557600000 ) : 0;
    }

    return <SettingChangeWidget successMessage="Birthday set!" 
                                getValue={onGetValue} 
                                setting={setting} 
                                placeholder={"YYYY-MM-DD"} 
                                defaultValue={setting.dob} 
                                helperText="Your birthday (used to display your age)" 
                                verb="Set Birthday"
                                onUpdateCache={ (cache, {data:{setSetting}})=>updateUserCachedData(cache, currentUser.id, { age:ymd2age(setSetting.dob) }) }
                                />
} 

const BlockedUsersWidget = ({setting}) => {

    const onGetValue = async txt => {
        var unames = txt.split(",");

        //
        // validemos cada uname...
        //
        for (let i = 0; i < unames.length; i++) 
        {
            const uname = unames[i].trim();

            //
            // debe ser entre 4 y 80 chars...
            //
            if( !uname.match(/^[a-z0-9_]{4,80}$/i) )
            {
                throw new Error("Username ["+ uname+"] is invalid...");
            }
        }

        return unames;
    }

    return <SettingChangeWidget successMessage="Users blocked!" 
                                getValue={onGetValue} 
                                setting={setting} 
                                placeholder={"Username, Username, Username, ..."} 
                                defaultValue={setting.unames.join(",")} 
                                helperText="Type the usernames to block separated by a comma..." 
                                verb="Block Users"/>
}

const DeleteAccountWidget = ({setting}) => {

    const history           = useHistory();
    const { session, logout }    = useGetSession();
    
    const onGetValue = async txt => {
        if( txt!=setting.signature )
        {
            throw new Error("Invalid signature! You must type ---> "+ setting.signature );
        }

        return txt;
    }

    if( setting.signature=='deleted' )
    {
        alert("bye bye! T_T");

        logout();
        return "bye bye!";
    }

    return <SettingChangeWidget successMessage="Bye bye!" 
                    getValue={onGetValue} 
                    setting={setting} 
                    placeholder={ "Type: "+ setting.signature }  
                    helperText= { "Type this text --> "+ setting.signature } verb="Delete my account"/>
}


const ChangeUsernameWidget = ({setting})=>{

    const currentUser                   = useContext(CurrentUserContext);
     
    const onGetValue = async txt => {
        if( txt==setting.uname)
        {
            throw new Error("Username hasn't changed...");
        }

        if( txt.length<4 ) 
            throw new Error("Username is too short!");

        if( txt.length>20)
        {
            throw new Error("Username is too long! (max is 20 chars)");
        }

        if( txt.match(/[^a-z0-9_]+/gi) )
        {
            throw new Error("Invalid characters detected. Only letters, numbers and underscore allowed.");
        }

        return txt;
    }

    return <SettingChangeWidget successMessage="Username changed!"  
                                setting={setting} 
                                getValue={onGetValue} 
                                placeholder={"Your new username..."} 
                                defaultValue={setting.uname} 
                                helperText="Only letters, numbers and underscore..." 
                                verb="Change username"
                                onUpdateCache={ (cache, {data:{setSetting}})=>updateUserCachedData(cache, currentUser.id, { uname:setSetting.uname }) }
                                />
}


const PasswordChangeWidget = ({setting}) => {

    const [busy, setBusy]           = useState();
    const [error, setError]         = useState(); 
    //const [show, setShow]           = useState(false);
    const newPass                   = useRef();
    const txtInput                  = useRef();

    const onInputChange = e => {
        if( e.target.value=="" )
        {
            newPass.current = null; 
            setError(null);
        }
    }

    const onGetValue = async () => {

        var pass = txtInput.current.value;

        if( !pass.trim().length )
        { 
            if( newPass.current )
            {
                newPass.current = null;
                return;
            }

            throw new Error( "Password is empty");
        } 

        if( pass.length<6 )
        {
            throw new Error("Password is too short, at least 6 characters long is needed...");
        }

        if( !newPass.current )
        {
            newPass.current = pass;
            txtInput.current.value = "";
            throw new Error("Step 2: Type it a second time to make sure you got it right! OR click change again with the field empty to reset...");
        }
        else 
        { 
            if( newPass.current != pass )
            { 
                newPass.current = null;
                txtInput.current.value = "";

                throw new Error("Passwords doesn't match! Retry all over again...");
            }
        }

        return pass;
    }

    return <SettingChangeWidget successMessage="Password changed!" password onError={setError} onBusy={setBusy} getValue={onGetValue} setting={setting} verb="Change password">
        

        <FormControl error={error!=null} style={{width:300}}>
            
            <PasswordInput  
                inputRef={txtInput}   
                placeholder="New password..."
                disabled={busy} 
                onChange={ onInputChange } 
            />
            <FormHelperText>{ error || "Type new password..." }</FormHelperText>
        </FormControl>
            {/* <TextField 
                error={ error!=null } 
                helperText={ error || "Type new password" } 
                style={{width:300}}
                placeholder="Type new password..."
                disabled={busy} 
                inputRef={txtInput}
                inputProps={{ type:true?"password":"text" }}
                onChange={ onInputChange }

                endAdornment={
                    <InputAdornment position="end">
                      <IconButton>
                        { false ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }

                /> */}

        </SettingChangeWidget>
}

const Custom1RMFactorWidget = ({setting}) => {
 
    const currentUser                   = useContext(CurrentUserContext);
    const classes                       = useSettingsStyles();
    const [preview1rm, setPreview1RM]   = useState();
    const W             = useRef();
    const R             = useRef();
    const factorRef     = useRef( setting.factor );

    const onGetValue = async txt=>{
        const v = Number(txt);

        if( isNaN( v ) )
        {
            throw new Error("Factor must be numeric!");
        }

        if( v>10000 )
        {
            throw new Error("Factor is too big and probably unnecesary at this point...");
        }

        return v;
    }

    const calculatePreview = ()=> {
        var w       = parseInt( W.current.value );
        var r       = parseInt( R.current.value );
        var factor  = parseInt( factorRef.current );

        if( isNaN(factor) || factor<=0 )
        {
            setPreview1RM("Invalid Factor")
        }
        else if( isNaN(w) )
        {
            setPreview1RM("Invalid Weight")
        }
        else if( isNaN(r) )
        {
            setPreview1RM("Invalid Reps")
        } 
        else 
        {
            var v = eval( setting.formula );

            if( v==0 )
            {
                v = "Reps above 10 give unaccurate results...";
            }

            setPreview1RM( "~" + v.toFixed(1) );
        }
    }

    const onUpdateCache = cache => {
        clearJdayAndJRangeOf( cache, currentUser.id ); 
    }

    useEffect( ()=>{

        calculatePreview( setting.factor );

    }, [setting]);

    return <>
                        <div style={{flex:1}}>
                        <SettingChangeWidget successMessage="Factor changed!" 
                                getValue={onGetValue} 
                                setting={setting}  
                                placeholder="Type formula FACTOR's value..."
                                defaultValue={ setting.factor }
                                helperText="WEIGHT * ( FACTOR / ( (FACTOR+1) - REPS ) ) = ~1RM" 
                                verb="Save Factor" 
                                onChange={ val=>(factorRef.current=val) && calculatePreview() }
                                onUpdateCache={ onUpdateCache }
                                />  
                                </div>
                                
                      <div> 

                            { setting.factor!=setting.default && 
                            <FormHelperText> 
                                Default value is <strong>{setting.default}</strong>. Current value is <strong>{setting.factor}</strong>
                            </FormHelperText> }

                            <Paper elevation={1}>
                                <Box padding={1}>
                                    <strong>Test it out:</strong> &nbsp;&nbsp; 
                                    <Input inputRef={W} placeholder="Weight" onChange={calculatePreview} className={classes.input} inputProps={{maxlength:4, size:4}} /> x 
                                    <Input inputRef={R} placeholder="Reps" onChange={calculatePreview} className={classes.input} inputProps={{maxlength:4, size:4}} /> = <strong className={classes.input}>{preview1rm}</strong>   
                                </Box>
                            </Paper>
                      </div> 
            </>
}

const EmailChangeWidget = ({setting}) => { 

    const onGetValue = async (txt) => {

        if( txt.trim().length==0 )
        {
            throw new Error("Nothing to change...");
        }

        //if( !txt.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
        if( !isEmail(txt) )
        {
            throw new Error("Invalid email format");
        }

        if( txt==setting.currentEmail )
        {
            throw new Error("That's the same email currently in use...")
        }

        return txt;
    }

    return <SettingChangeWidget successMessage="Email changed!" getValue={onGetValue} setting={setting} placeholder={setting.currentEmail} defaultValue={setting.currentEmail} helperText="Current email" verb="Change email"/>
} 

/**
 * Un widget the contiene (por default) un input, luego al cliquear enviar se llama a executioner con el valor del input.
 * Si el setting require code verification, muestra el ui de ingreso del codigo y se encarga de ese aspecto.
 */
const SettingChangeWidget = ({ setting, successMessage, password, getValue, placeholder, defaultValue, helperText, verb, children, onError, onBusy, onChange, onUpdateCache }) => {

    const classes           = useSettingsStyles();
    const txtInput          = useRef();
    const codeInput         = useRef();
    const [busy, setBusy]   = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [setSetting]      = useSetSettingMutation();
    const [sendCode]        = useSendVerificatonCodeMutation();
 
 
    const callExec = async codeMode => {

        setBusy(true); onBusy && onBusy(true);
        setError(null); onError && onError(null);

        try 
        {
            if( codeMode==null )
            {   
                var value = getValue? await getValue( txtInput.current?.value ) : txtInput.current?.value;
            

                if( value )
                {   
                    var resp = await setSetting({
                        variables: {
                            id: setting.id,
                            value
                        },

                        update: (cache, response)=> {
                            onUpdateCache && onUpdateCache( cache, response );
                        }
                    });  

                    if( !resp.data.setSetting.waitingCodeToChange )
                    {
                        setSuccess(true);
                    }
                    else 
                    {
                        setSuccess("Check your email to get the confirmation code!");
                    }
                }  
    
            }
            else
            {
                var code = codeInput.current.value; 
    
                if( codeMode==true && (!code || code.length!=6) )
                {
                    throw new Error("Code must be 6 characters long...");
                }

                var codeResp = await sendCode({
                    variables: {
                        id: setting.id,
                        code: codeMode==false? "!" : code
                    }
                });
                
                codeMode && setSuccess(true);
            }
        }catch(e)
        {
            e = parseError(e);
                setError( e );
                onError && onError(e);
        }
        

        setBusy(false);
        onBusy && onBusy(false);

        // setTimeout( ()=>{
        //     setBusy(false);
        //     setError("Some weird error");
        // }, 2000 );
    };

    const onFieldLoseFocus = ev => {
        if( ev.target.value=="" )
        {
            ev.target.value = defaultValue || "";
        }
    }

    //console.log("SETTING CHANGED::::", setting)
    return <form noValidate autoComplete="off">

          
        <SettingSuccessSnackbar open={success} onClose={()=>setSuccess(false)} text={ success==true? successMessage : success }/>


        { setting.waitingCodeToChange && <>
            <TextField 
                error={ error!=null }
                helperText={ error || "Check your email, we sent you a code." }
                placeholder="Type code here..." 
                disabled={busy}
                inputRef={codeInput} 
                classes={{ input:classes.input }}
                />
                &nbsp;
                { !busy && <ButtonGroup>
                    <Button variant="contained" color="primary" onClick={()=>callExec(true) }>Verify Code</Button>
                    <Button variant="outlined" onClick={()=>callExec(false) }>cancel</Button>
                </ButtonGroup> }
                { busy && <CircularProgress/> }
        </> }


        { !setting.waitingCodeToChange && <>

            { children }
            { !children && <TextField 
                                    error={ error!=null }
                                    defaultValue={ defaultValue || "" }
                                    helperText={ error || helperText }
                                    placeholder={ placeholder || "" }
                                    style={{width:300}}
                                    disabled={busy} 
                                    onBlur={ onFieldLoseFocus }
                                    inputRef={txtInput} 
                                    onChange={ ev=>onChange && onChange(ev.target.value) }
                                    inputProps={{ type:password?"password":"text", className:classes.input  }}
                                    /> }
                &nbsp;{ !busy && <Button variant="outlined" onClick={()=>callExec()}>{verb}</Button> }
                { busy && <CircularProgress/> }
        </> }

        
    </form>;
}


/**
 * Success snackbar cuando se guarda bien un setting!
 */
export const SettingSuccessSnackbar = ({ text, open, onClose }) => <Snackbar open={open} autoHideDuration={4000} onClose={onClose}> 
                                            <MuiAlert elevation={6} variant="filled" onClose={onClose} severity="success">
                                                { text }
                                            </MuiAlert>
                                        </Snackbar>

