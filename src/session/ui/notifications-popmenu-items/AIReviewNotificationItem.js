import { NotificationItemTemplate } from "./NotificationItemTemplate";
import { Avatar, Typography, makeStyles } from "@material-ui/core";
import AndroidIcon from '@material-ui/icons/Android';
import { UserTypedText } from "../../../componentes/user-typed-text";
import { useHistory } from "react-router-dom"; 
import { useGetSession } from "../../session-handler";

export function AIReviewNotificationItem({ data, myId }){
	const history       = useHistory(); 
	const { session } = useGetSession()

	const openLink = ()=>{ 
		history.push( "/journal/"+ session.user.uname  + "/"+data.logYMD ); 
	}

	return  <NotificationItemTemplate
	itemAvatar={ <Avatar><AndroidIcon /></Avatar>}
	onClick     ={ openLink  }
	message     ={ <div><div className="userText"><UserTypedText text={data.text} short/></div></div>}> 
 		<strong>The AI</strong> reviewed your post on <strong  className="oneline what">{ data.logYMD }</strong> : 
	</NotificationItemTemplate>
}