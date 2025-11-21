 

import styles from "./AskPage.module.css"
import { inProduction } from "../system-config"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react" 
import { useGetSession } from "../session/session-handler"
import { AsciiSpinner } from "../componentes/ascii-spinner"
import { exampleLog } from "../componentes/journal/editor-tutorial"
import { ApiKey } from "./ApiKey"
import { $openModal } from "../componentes/Dialog"
import { ClientConfigForm } from "./ClientConfigForm"
import { LinearProgress } from "@material-ui/core" 
import { Alert } from "@material-ui/lab"

const IFRAME_URL = inProduction? "https://ai.weightxreps.net":"http://localhost:5173"

/** @type {Map<string, ApiKey>} */
const akey = new Map()

const Guest = {
	id:0, uname:"guest", isGuest:true
}

let timeoutTimer;

export default function AskAIPage() {
	/** @type {ReturnType<typeof useRef<HTMLIFrameElement|null>>} */
	const iframeRef = useRef()
	const $session = useGetSession();
	const [error, setError] = useState();
	const [loaded, setLoaded] = useState(false);

	/**
	 * Reference to the currently logged user.
	 */
	const userRef = useRef()

	/**
	 * Currently logged in user.
	 */
	const user = useMemo(()=>{
 
		userRef.current = $session.notLogged? Guest : $session.session?.user;
		return userRef.current;

	}, [ $session ])

	/**
	 * This is the "api" the iframe's app will have access to call functions on.
	 */
	const $api = {

		aiAppReady: ()=>{
			clearTimeout(timeoutTimer)
			setLoaded(true)
			setError(undefined)
		},

		/**
		 * Let the AI App get a hold onto the session token so the calls are made as that user.
		 */
		getSessionToken: ()=>{ 
			return localStorage.getItem("token")
		},

		/**
		 * Returns the session object
		 */
		getUserInfo: ()=>userRef.current,

		/**
		 * Returns a string showing all possible ways to log a workout
		 */
		getExampleLog: ()=>exampleLog,

		/**
		 * The AI app is asking for an API Key, we will handle that on this side because it is a sensitive token.
		 * We will store it on the localStorage encrypted with a password chosen by the user.
		 * Everytime we have to access the API Key we will prompt the user for the password for decryption.
		 * --
		 * @param {string} id An ID to identify this AI provider
		 * @param {string} modelName Name of thre AI Brand chosen
		 * @param {string} getApiKeyUrl Hint the user on where to get an API key for this AI
		 * @returns 
		 */
		getApiKey: async (id, modelName, getApiKeyUrl)=>{ 
				
			if( !akey.has(id) )
			{
				akey.set(id, new ApiKey(id));
			}

			const apiKy = akey.get(id) ;

			return apiKy.getKey( async passwordOnly => {

				//const closeModal = ()=>$openModal({open:false});

				return new Promise((resolve, reject)=>{

					//
					// Open the model with the UI that provides the user with the fields to write the API KEY and set the password.
					//
					$openModal({
						open:true,
						title: ( passwordOnly? "Unlock the API KEY of ": "Provide an API KEY for ")+modelName,
						info: <ClientConfigForm  getApiKeyUrl={getApiKeyUrl} onlyAskForPassword={passwordOnly} onSave={(canceled, pass, apiKey)=>{

							if( canceled ) return reject("canceled");

							//
							// Ok by this point the user has given us access to the api key!! Return the data pack to the AI app.
							//
							resolve({
								pass, 
								apiKey
							})

						}} />
					});

				}) 
			});  

		},

		/**
		 * This is called by the AI ap whent the API Key is reported as invalid by the AI Provider. Which means it is useless now.
		 * @param {string} clienId 
		 */
		invalidApiKey: (clienId)=>{ 
			akey.get(clienId).clear()
		},

		/**
		 * A way for the AI App to navigate to some URL since it is running on an iframe...
		 * @param {string} url 
		 */
		goto: url => {
			window.open(url,"_self");
		}
	}

	/**
	 * Post a message to the AI app running in the Iframe
	 * @param {any} payload 
	 */
	const $callInIframe = payload => {
		iframeRef.current.contentWindow.postMessage( payload, IFRAME_URL);
	}

	useEffect(()=>{

		timeoutTimer = setTimeout(()=>{
			setError("Mmmhh... Failed to connect to the AI App. Maybe a network issue?");
		}, 5000)

		const onIframeMessage = event => { 

			if (event.origin !== IFRAME_URL) {
				
				return; // Ignore messages from unknown sources
			}

			const fn = $api[event.data.call];
			if( !fn )
			{ 
				//ignore??
				throw new Error(`Unknown function call: ${event.data.call ?? "method-not-set"}`)
			}

			if( fn.constructor.name === 'AsyncFunction' )
			{
				fn.apply(undefined, event.data.args ).then( result => {
					$callInIframe({
						id: event.data.id,
						callResult: result
					})
				})
				.catch( error => $callInIframe({
						id: event.data.id,
						callResult: { error }
					}));
			}
			else 
			{
				let result;

				try
				{
				 	result = fn.apply(undefined, event.data.args);
				}
				catch(error){
					$callInIframe({
						id: event.data.id,
						callResult: { error }
					});
					return;
				}

				$callInIframe({
						id: event.data.id,
						callResult: result
					});
				
			}
		}

		window.addEventListener("message", onIframeMessage);
		return ()=>window.removeEventListener("message", onIframeMessage);

	},[ ]);

	useEffect(()=>{

		if( $session.sessionError )
		{
			console.log("SESSION ERROR:",$session.sessionError)
			setError($session.sessionError)
		}

		else if( $session.notLogged )
		{
			setError("SIGN IN REQUIRED: You must be logged in to access this tool!")
		}

	}, [$session])

	if( error )
		return <Alert severity="error">{error}</Alert>;
  
 
	return <div className={styles.root}>
 
		{
			!loaded && <LinearProgress/>
		}

		{ !$session.loadingSession && <> 
			<iframe src={IFRAME_URL} ref={iframeRef} style={{ display:loaded? "block" : "none" }}></iframe>

		</>  }
 
	</div>
}