import { getAuthorizationHeaders } from "../session/session-handler";

const endpoint = process.env.REACT_APP_MCP_SERVER+"/radia/";

async function get(url, payload) {
	const params = new URLSearchParams(payload).toString();
	return await fetch(endpoint+url+( payload?"?"+params : ""), {
		headers: {
			...getAuthorizationHeaders()
		},
		
	}).then( res=>res.json() )
}

async function post( url, payload )
{
	return fetch(endpoint+url, {
			method:"post",
			headers: {
				...getAuthorizationHeaders(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		}).then( res=>res.json() )
}

export const radia = {
	get, post 
}