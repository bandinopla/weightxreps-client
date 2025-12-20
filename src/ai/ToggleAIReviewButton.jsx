import { ActionButton } from "../componentes/action-button";
import { useEffect, useState } from "react";
import WifiOffIcon from '@material-ui/icons/WifiOff';
import WifiIcon from '@material-ui/icons/Wifi';
import { radia } from "./radia"; 

export function ToggleAIReviewButton({ style, onEnabled }) {
	const [enabled, setEnabled] = useState(-1)
	
	useEffect(()=>{
		let unmounted = false;

		radia.get("ai-reviews").then( setting => {
			if( unmounted ) return;
			setEnabled( setting.enabled )
			
		})

		return ()=>{
			unmounted = true;
		}

	}, [])

	async function execEnabled( currentValue )
	{
		const newValue = currentValue? 0 : 1;

		return radia.post("ai-reviews", { enabled:newValue })
 
		.then( res => {
			if( res.ok )
			{
				setEnabled( newValue )
				if( newValue && onEnabled ) onEnabled()
			}
		})
	}

	if( enabled<0 ) return "";
 

	return <ActionButton style={{ ...style,  backgroundColor:!enabled? "#FCB9B7":"#DFF2D8" }} execAction={execEnabled.bind(null,enabled)} variant="error" startIcon={!enabled? <WifiOffIcon/> : <WifiIcon/>}>
		Reviews: <strong>{ !enabled? "Disabled" : "Enabled"}</strong>
	</ActionButton>
}
