import React, { useEffect, useRef, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Alert } from "@material-ui/lab"
import { Button, ButtonGroup, LinearProgress } from '@material-ui/core';
import { $openModal } from '../componentes/Dialog';

/**
 * 
 * @param {{ instructions?:JSX.Element, onlyAskForPassword:boolean, getApiKeyUrl:string, onSave:( canceled:boolean, password:string, apiKey?:string)=>void }} param0 
 * @returns 
 */
export function ClientConfigForm({ instructions, onlyAskForPassword, getApiKeyUrl, onSave }) {
	const [values, setValues] = React.useState({
		apikey: '',
		apikeyPass: '',
		showApiKey: false,
		showApiKeyPass: false,
	});

	const [passwordOnly, setPasswordOnly] = React.useState( onlyAskForPassword )

	const [busy, setBusy] = useState(false)
	const apiKeyRef = useRef();
	const passRef = useRef();

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleClickShow = (prop) => () => {
		setValues({ ...values, [prop]: !values[prop] });
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const submit = ()=>{

		$openModal(null)
		onSave(false, values.apikeyPass, values.apikey || undefined )
		

	}

	const close = ()=>{
		$openModal(null)
		onSave(true)
	};

	const forgot = ()=>{
		if( confirm("Delete the api key from this browser and start all over again?") )
		{
			setPasswordOnly(false)
		}
	}

	useEffect(()=>{

		if( passwordOnly )
		{
			passRef.current.focus()
		}
		else 
		{
			apiKeyRef.current.focus()
		}

	},[passwordOnly])

	return <div>
 
		

	{!passwordOnly && <>
	
		{ instructions && <Alert severity="warning">{instructions}</Alert> }
		<Alert severity="info">The API KEY will be stored locally in this browser encrypted with a password.
			Get an API KEY here: <a href={getApiKeyUrl} target='_blank'>{getApiKeyUrl}</a>
		</Alert>

		<FormControl fullWidth margin='dense'>
			<InputLabel htmlFor="apikey">API KEY...</InputLabel>
			<Input
				id="apikey"
				type={values.showApiKey ? 'text' : 'password'}
				autoComplete={false}
				value={values.apikey}
				inputRef={apiKeyRef}
				onChange={handleChange('apikey')}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle visibility"
							onClick={handleClickShow("showApiKey")}
							onMouseDown={handleMouseDownPassword}
						>
							{values.showApiKey ? <Visibility /> : <VisibilityOff />}
						</IconButton>
					</InputAdornment>
				}
				 disabled={busy}
			/>

		</FormControl>
		</>}
		
		{ passwordOnly && <Alert severity="warning">An API KEY <strong>was found</strong> in this browser, but it is encrypted with a password! 
		 
		</Alert>}

		<FormControl fullWidth margin='dense'>
			<InputLabel htmlFor="apikeyPass">Password to unlock the API KEY</InputLabel>
			<Input
				id="apikeyPass"
				type={values.showApiKeyPass ? 'text' : 'password'}
				autoComplete={false}
				value={values.apikeyPass}
				onChange={handleChange('apikeyPass')}
				inputRef={passRef}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle visibility"
							onClick={handleClickShow("showApiKeyPass")}
							onMouseDown={handleMouseDownPassword}
						>
							{values.showApiKeyPass ? <Visibility /> : <VisibilityOff />}
						</IconButton>
					</InputAdornment>
				}
				 disabled={busy}
			/>
			<FormHelperText>{passwordOnly? "Type the password to decrypt the api key stored in this browser." : "Create a password to encrypt the api key in this browser"}</FormHelperText>

		</FormControl>


		<FormControl fullWidth margin='normal' >
			{ busy && <LinearProgress />}
			<ButtonGroup size="large" fullWidth>

				<Button variant='outlined' color='primary' disabled={busy} onClick={close}>⨯ Close</Button>
				

				{
					passwordOnly && <Button variant='outlined' color='secondary' onClick={forgot} disabled={busy}>FORGOT?</Button>
				}
				<Button variant='contained' color='primary' onClick={submit} disabled={busy}>{passwordOnly?"UNLOCK":"SAVE"}</Button>
				
			</ButtonGroup>
		</FormControl>
	</div>
}