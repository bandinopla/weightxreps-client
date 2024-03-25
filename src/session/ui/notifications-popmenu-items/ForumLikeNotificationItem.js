
/* 
    data={ data }
    itemAvatar={<Avatar className={classes.typeIcon}><TodayIcon/></Avatar>} 
    count={data.count}
    by={ data.by }
    when={data.when} 
={ data.text }/> */

import { Avatar, Typography, makeStyles } from "@material-ui/core";
import UnameTag from "../../../componentes/uname";
import { NotificationItemTemplate } from "./NotificationItemTemplate";
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ForumIcon from '@material-ui/icons/Forum';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import { UserTypedText } from '../../../componentes/user-typed-text';
import { useHistory } from "react-router-dom"; 

import LikeIcon from '@material-ui/icons/ThumbUpAlt';
import DislikeIcon from '@material-ui/icons/ThumbDownAlt';

const useStyles = makeStyles((theme) => ({  
        onWhichLog: {
            color:"#000", 
        } 
}));


export default function ({ data, myId }) {

    const classes       = useStyles(); 
    const history       = useHistory();  

    const openLink = ()=>{ 
        history.push( `/forum/${data.forumSlug}/${data.threadId}/${data.threadSlug}/locate--${data.postId}` ); 
    }                    
 
    let Icon        = data.dislike? DislikeIcon : LikeIcon ;
    let verb        = "commented";  
 
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

                    <UnameTag inline {...data.by}/> { data.dislike? "disliked" : "liked"} your { data.jowner.id==myId? "thread" : "comment"}: 

            </NotificationItemTemplate> 
}