import { Avatar } from "@material-ui/core";
import UnameTag from "../../../componentes/uname";
import { NotificationItemTemplate } from "./NotificationItemTemplate";

import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import TextQuote from "./TextQuote";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { UserTypedText } from "../../../componentes/user-typed-text";
import { useHistory } from "react-router-dom"; 

export default function EventNotificationItem({ data, myId }){
 
    const history       = useHistory(); 

    const openLink = ()=>{ 
        history.push("/journal/"+ ( data.jowner?.uname || data.by.uname) + ( data.ymd?"/"+data.ymd : "") ); 
    }

    let ItemIcon ;
    let what;
    let message;

    switch( data.__typename )
    {
        case "StartedFollowing":
            ItemIcon    = <Avatar><GroupAddIcon /></Avatar>;
            what        = "Started following you.";
            break; 

        case "LikeOnLog":
            ItemIcon = <Avatar><EventAvailableIcon/></Avatar>;
            what = <> liked your <strong className="oneline what">{data.ymd}</strong> log. </>;
             
            break;   

        case "LikeOnJComment":
            ItemIcon = <Avatar><ThumbUpAltIcon/></Avatar>;
            what = <> liked your comment on <strong className="oneline what">{ data.jowner.id!=myId?  data.jowner.uname+"'s " : " your " }</strong> <strong className="oneline what">{data.ymd}</strong> log. </>;
            message = <TextQuote><UserTypedText text={data.text} short/></TextQuote>
            break;  

        default:
            return "--???????";
    }

    return <NotificationItemTemplate 
                        itemAvatar={ItemIcon}   
                        when={data.when}  
                        message={message}
                        onClick={openLink}>

                        { data.by.id==myId? <strong>You</strong> :  <UnameTag inline {...data.by}/> } {what}

                    </NotificationItemTemplate>
}