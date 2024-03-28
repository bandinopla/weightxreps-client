
 

import { Avatar, Typography, makeStyles } from "@material-ui/core";
import UnameTag from "../../../componentes/uname";
import { NotificationItemTemplate } from "./NotificationItemTemplate";
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'; 
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import { UserTypedText } from '../../../componentes/user-typed-text';
import { useHistory } from "react-router-dom";  
import ForumIcon from '@material-ui/icons/ForumOutlined';

const useStyles = makeStyles((theme) => ({  
        onWhichLog: {
            color:"#000", 
        } 
}));


export default function ({ data, myId }) {

    const classes       = useStyles(); 
    const history       = useHistory(); 
    const typeLike      = data.hasOwnProperty("dislike");

    const openLink = ()=>{ 
        history.push( `/forum/${data.forumSlug}/${data.threadId}/${data.threadSlug}/locate--${data.id}` ); 
    } 

    let whenExtra = <>  
                        { data.jowner.id!=myId? 
                                data.jowner.id==data.by.id? data.by.isf?"her ":"his "  :
                                <strong className="oneline what"> <UnameTag inline {...data.jowner}/>'s </strong>:" your "}
                        forum's thread</>; 
                        
 
    let Icon        = ChatBubbleOutlineIcon; 
    let verb        = "commented"; 
 
    if( data.isMention )
    {
        Icon = AlternateEmailIcon;
        verb = "mentioned you ";
    }
    else if( data.to.id == myId ) 
    {
        Icon = ForumIcon;
        verb = "replied to you ";
    }
    else if( data.jowner.id == myId ) 
    {
        Icon = AlternateEmailIcon;
        verb = "posted ";
    }
 
 
    return <NotificationItemTemplate 
                    itemAvatar  ={ <Avatar><Icon /></Avatar>}  
                    by          ={ data.by   }
                    when        ={ data.when } 
                    onClick     ={ openLink  }
                    message     ={ <div>
                        <div className="userText"><UserTypedText text={data.text} short/></div>
                        <Typography variant="caption" gutterBottom>
                            <strong>{ data.forumSlug }</strong> / {data.threadSlug}
                        </Typography>
                        </div> }> 

                    <UnameTag inline {...data.by}/> {verb} on {whenExtra}: 

            </NotificationItemTemplate> 
}