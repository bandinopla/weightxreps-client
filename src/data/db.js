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

//   const httpLink = createHttpLink({
//     uri:"http://localhost:4000/graphql",
//   });

var $serverURI = "http://localhost:4000/graphql";

if (process.env.REACT_APP_REMOTE_SERVER == "staging") {
	$serverURI = "https://staging.weightxreps.net/wxr-server-2/graphql";
} else if (process.env.REACT_APP_REMOTE_SERVER == "production") {
	$serverURI = "https://weightxreps.net/wxr-server-2/graphql";
} else if (process.env.NODE_ENV == "production") {
	$serverURI = "/wxr-server-2/graphql";
}

const httpLink = createUploadLink({
	//TODO: endoint
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
    UTagsPolicy
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
	var rtrn;

	if (typeof error == "string") {
		rtrn = "Oops! " + error;
	} else if (error.networkError) {
		let m =
			error.networkError.result?.errors[0].message ||
			error.networkError.message;

		rtrn = m; //m.substr( m.indexOf("#") );
	} else if (error.graphQLErrors) {
		let e = error.graphQLErrors[0];

		// console.log( e )

		// if( e?.extensions?.code=='INTERNAL_SERVER_ERROR')
		// {
		//     return "Something went wrong on the server :/";
		// }
		rtrn = error.graphQLErrors[0].message;
	} else if (typeof error.message == "string") {
		if (error.message == "Failed to fetch") {
			rtrn = "Can't connect to the internet";
		} else {
			rtrn = error.message;
		}
	}

	if (rtrn == "NOTSOK") {
		return (
			<>
				Feature restricted to <strong>active supporters</strong> only. (Must
				have donated recently)
			</>
		);
	}

	//
	// track error...
	//
	trackError(rtrn);

	return rtrn;
};
