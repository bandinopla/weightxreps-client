
/* 
    data={ data }
    itemAvatar={<Avatar className={classes.typeIcon}><TodayIcon/></Avatar>} 
    count={data.count}
    by={ data.by }
    when={data.when} 
={ data.text }/> */

import { Avatar, makeStyles } from "@material-ui/core";
import UnameTag from "../../../componentes/uname";
import { NotificationItemTemplate } from "./NotificationItemTemplate";
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ForumIcon from '@material-ui/icons/Forum';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import { UserTypedText } from '../../../componentes/user-typed-text';
import { useHistory } from "react-router-dom"; 

const useStyles = makeStyles((theme) => ({  
        onWhichLog: {
            color:"#000", 
        } 
}));


export default function ({ data, myId }) {

    const classes = useStyles(); 
    const history       = useHistory(); 

    const openLink = ()=>{ 
        history.push( "/journal/"+ data.jowner.uname  + "/"+data.ymd ); 
    }

 

    let whenExtra = <>  
                        { data.jowner.id!=myId? 
                            data.jowner.id==data.by.id? data.by.isf?"her ":"his "  :
                            <strong className="oneline what"> <UnameTag inline {...data.jowner}/>'s </strong>:" your "}
                        <strong  className="oneline what">{ data.ymd }</strong> Log</>;

                        
 
    let Icon        = ChatBubbleOutlineIcon; //isMention? ChatBubbleOutlineIcon : TodayIcon;
    let verb        = "commented";
    let type        = "comment";
 
    if( data.inResponseTo == data.to.id ) 
    {
        Icon = ForumIcon;
        verb = "replied to you ";
    }
    else if( data.jowner.id != myId ) 
    {
        Icon = AlternateEmailIcon;
        verb = "mentioned you ";
    }
 
 
    return <NotificationItemTemplate 
                    itemAvatar  ={ <Avatar><Icon /></Avatar>}  
                    by          ={ data.by   }
                    when        ={ data.when } 
                    onClick     ={ openLink  }
                    message     ={ <div className="userText"><UserTypedText text={data.text} short/></div> }> 

                    <UnameTag inline {...data.by}/> {verb} on {whenExtra}: 

            </NotificationItemTemplate> 
}