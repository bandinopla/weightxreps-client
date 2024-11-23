import {
	ApolloClient,
	ApolloProvider,
	from,
	InMemoryCache,
} from "@apollo/client";

import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import { inboxTypePolicies } from "../session/inbox-manager";
import {
	getAuthorizationHeaders,
	SessionPolicies,
} from "../session/session-handler";
import { mergeObjects } from "../utils/utils";
import { BaseTypePolicies } from "./type-policies";

/**
 * Generado por el wxr3-server
 * > npm run exportschema
 * y te traes el archivo ese acá...
 */
import generatedIntrospection from "./generated---db-introspection.json";
import { ESetScalarTypePoliciy } from "./eset-scalar-parser";
import { JRangePolicy } from "./jrange-policy";
import { CommunityStatsPolicy } from "./community-stats-policy";
import { JEditorPolicy } from "./jeditor-policy";
import { SettingsTypePolicy } from "./SettingsTypePolicies";
import { trackError } from "../componentes/google-tracker";
import { UTagsPolicy } from "../componentes/journal/tags";
import { VideosCachePolicy } from "./videos-policy";
import { ForumPolicy } from "../forum/forum-policy";
import { SearchResultsPolicy } from "./search-results-policy";

const { REACT_APP_REMOTE_SERVER, NODE_ENV } = process.env;

export const $serverURI = REACT_APP_REMOTE_SERVER === "staging" 		 ? "https://staging.weightxreps.net/api/graphql"
  				 : REACT_APP_REMOTE_SERVER === "production" 			 ? "https://weightxreps.net/api/graphql"
  				 : REACT_APP_REMOTE_SERVER ?? (NODE_ENV === "production" ? "/api/graphql"
    																	 : "http://localhost:4000/graphql");

export const $nodeURI = $serverURI.replace("/graphql","");

const httpLink = createUploadLink({
	uri: $serverURI,
});

//
// pegamos el login token en cada request...
//
const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists

	// return the headers to the context so httpLink can read them

	let newHeaders = {
		...headers,
		...getAuthorizationHeaders(),
	};

	return { headers: newHeaders };
});

// const errorLink = onError(
// 	({ operation, graphQLErrors, networkError, response, forward }) => {}
// );

let typePolicies = mergeObjects([
	BaseTypePolicies,
	inboxTypePolicies,
	ESetScalarTypePoliciy,
	JRangePolicy,
	JEditorPolicy,
	CommunityStatsPolicy,
	SettingsTypePolicy,
	SessionPolicies,
    UTagsPolicy,
    VideosCachePolicy,
    ForumPolicy
	,SearchResultsPolicy
]);

const client = new ApolloClient({
	link: from([ authLink, httpLink]), //authLink.concat(httpLink),
	cache: new InMemoryCache({
		typePolicies,
		possibleTypes: generatedIntrospection.possibleTypes,

        // dataIdFromObject(responseObject) {
        //     switch (responseObject.__typename) 
        //     { 
        //       case 'UTagValue': return null; //return `UTagValue:${responseObject.tagid}:${responseObject.logid || responseObject.ymd}`;
        //       default: return defaultDataIdFromObject(responseObject);
        //     }
        //   }
	}),
});

export const DBProvider = (props) => (
	<ApolloProvider client={client}>{props.children}</ApolloProvider>
);

// para logout: client.resetStore()   - el client lo da el hook useQuery

export const parseError = (error) => {
	let message;
  
	if (typeof error === "string") {
	  message = `Oops! ${error}`;
	} else if (error.networkError) {
	  message = error.networkError.result?.errors?.[0]?.message || error.networkError.message;
	} else if (error.graphQLErrors?.length) {
	  message = error.graphQLErrors[0].message;
	} else if (typeof error.message === "string") {
	  message = error.message === "Failed to fetch" 
		? "Can't connect to the internet" 
		: error.message;
	}
  
	if (message === "NOTSOK") {
	  return (
		<>
		  Feature restricted to <strong>active supporters</strong> only. (Must have donated recently)
		</>
	  );
	}
  
	// Track error
	trackError(message);
  
	return message;
  };
