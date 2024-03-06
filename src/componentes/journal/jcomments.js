import { useContext, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Box, Button, Grid } from "@material-ui/core";
import Uname from "../uname";
import { Typography } from "@material-ui/core";
import UAvatar from "../uavatar";
import { Paper } from "@material-ui/core";
import TimeAgoDisplay from "../TimeAgoDisplay";
import { userTextToParsedUI } from "../user-text-to-parsed-tags";
import { useGetLogInboxQuery } from "../../data/generated---db-types-and-hooks";
import CircularProgress from '@material-ui/core/CircularProgress';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { Alert } from "@material-ui/lab";
import { parseError } from "../../data/db";
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import CloseIcon from '@material-ui/icons/Close';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import UnameTag from "../uname";
import { LikeThisButton } from "../like-button";
import { DeleteMyMessage } from "../delete-message-button"; 
import CommentBox from "../comment-box";
import { ReplyToMessage } from "../reply-to-message";
import { JOwnerContext } from '../../pages/journal-context';


import "./jcomments.css";
import { useGetSession } from "../../session/session-handler";

const useStyles = makeStyles((theme) => ({
    root: {
        borderTop:"3px solid #333"
        , marginTop: theme.spacing(2)
        , paddingTop: theme.spacing(2)
    },

    comment: {
        marginBottom: theme.spacing(1)

        , "& > div": {
            paddingRight:5
        }
    },

    icon: {
        width:50,
        height:50,
        backgroundColor:"white",
        color:"#666"
    }
}));


/**
 * Recorrer la cadena de "inResponseToMsg" hasta encontrar el top comment que inicio todo.
 */
const findTopicStarter = ( notif, arr, justFirstParent ) => {
    const parent = arr.find( itm=>itm.__typename=='JComment' && itm.msgid==notif.inResponseToMsg );  

    if( justFirstParent )
    {
        return parent;
    }

    //TODO puede pasar que parent sea null si el backend no devuelve todos los items y hace un LIMIT. Por eso hice que no haga LIMIT a los queries.
    return parent.inResponseToMsg? findTopicStarter(parent, arr) : parent;
}


export default function JComments({ logid }) {

    const classes = useStyles();
    const {session} = useGetSession();
    const jowner = useContext (JOwnerContext);
    const imTheJowner = session?.user.id == jowner.id;

    const {data, error, loading} = useGetLogInboxQuery({ variables: { logid } });
    


    if( loading)
        return <><CircularProgress size={20}/> <ChatBubbleOutlineIcon/></>;

    if( error )
        return <Alert severity="error">{ parseError(error) }</Alert>;
 

    //
    // filtrar las notificaciones...
    // +agrega array "replies" a un item si contiene replies.
    // 
    const notifications = data?.getLogInbox.notifications .map( c=>({
                                ...c
                                //, text : c.__typename=='JComment' && parseUserComment(c.text)
                            }))
                            
                            //
                            // quitamos los likes a comments, y los acumulamos en un a propiedad "likes" en el comment referenciado...
                            //
                            .filter( (notif, i, arr)=>{

                                if( notif.__typename=='LikeOnJComment')
                                {
                                    const msgid = notif.msgid;
                                    const liked = arr.find(n=>n.msgid==msgid && n.__typename=='JComment');

                                    if( liked ) 
                                    { 
                                        liked.likes = liked.likes || [];
                                        liked.likes.push( notif );
                                    }

                                    return false;
                                }

                                else if( notif.__typename=='JComment' && notif.inResponseToMsg )
                                {
                                    //es un reply....
                                    const topicStarter = findTopicStarter(notif, arr, true);

                                    if( !topicStarter.replies ) {
                                        topicStarter.replies = []; //<--- acá vamos a coleccionar todas las respuestas. 
                                    }

                                    topicStarter.replies.push(notif); 

                                    return false;
                                }

                                return true;
                            }) 
                            ;
                            

                            
     console.log(session)
//
//{ parsedTags2render(c.comment) }
    return <div className={classes.root}>

        {!imTheJowner && session?.user.id>0 && <><CommentBox verb="Comment" placeholder="Add a comment..."/><br/></> }
        
             
        { !notifications && <Typography variant="caption">No comments...</Typography>}

        { notifications?.map( c=>(<Box key={c.id} marginBottom={3}>
        
            {
            //
            // ------ EL COMMENT
            //
            }
            <JComment key={c.id} comment={c}/>  
        
        </Box>) ) }

    </div> 
}

const JComment = ({ comment:c })=>{
    const classes       = useStyles();
    const {session}       = useGetSession();
    const isComment     = c.__typename=='JComment';
    const isNew         = isComment && c.by.id==session?.user.id && (new Date() - c.when<60000);

    return <div>
                <Grid className={classes.comment + (isNew? " NEW":"")} container direction="row" alignItems={isComment?"flex-start":"center"} wrap="nowrap">

                    <Grid>

                        { isComment && <Paper><UAvatar uid={c.by.id} cc={c.by.cc} hash={c.by.avatarhash} slvl={  c.by.slvl  } height={40} width={40} iconsScale={0.5}/></Paper> }
                        { !isComment && <Avatar className={classes.icon}><ThumbUpOutlinedIcon/></Avatar>}
                    </Grid>

                    <Grid> 
                        <div style={{paddingLeft:5}}> 
                        
                            <Uname {...c.by} inline/> { !isComment && <JCommentWhenAndActions msg={c}/> }

                            { isComment && <><br/> {c.inResponseTo && <UnameTag inline prefix="@" noflag {...c.inResponseTo} />} {userTextToParsedUI(c.text)}</> }

                            { isComment && <div><JCommentWhenAndActions msg={c}/></div> }
                        </div>   
                        
                    </Grid>  

                </Grid>

                { 
                //
                // ----- LOS LIKES DEL COMMENT
                //
                c.likes?.map(n=>(<Box key={n.id} paddingLeft={10}>
                                    <SubdirectoryArrowRightIcon  fontSize="small" style={{color:"#ccc"}}/> <Uname {...n.by} inline/> 
                                    &nbsp;<ThumbUpOutlinedIcon fontSize="small"/> <LikeThisButton unlike msg={n}/>
                                </Box>)) }

                {   
                //
                // ----- LOS REPLIES 
                //
                c.replies && <CommentReplies replies={c.replies}/> }
            
            </div>;
}

const JCommentWhenAndActions = ({ msg:c })=>{
    
    const {session}       = useGetSession();
    const yaLeDimosLike = c.likes?.find(itm=>itm.by.id==session.user.id);    

    return <>&nbsp;— <TimeAgoDisplay time={c.when}/> &nbsp;&nbsp;
            {!yaLeDimosLike && <LikeThisButton msg={c}/>} 
            <DeleteMyMessage msg={c}/>
            <ReplyToMessage msg={c}/>
            </>
}

const CommentReplies = ({ replies })=>{

    const valueOfFresh                          = replies[0].when.valueOf();
    const freshOne                              = new Date() - valueOfFresh < 60000;
    const [open, setOpen]                       = useState(false);
    const [lastFreshWhen, setLastFreshWhen]     = useState();

    //
    // abrir si hay alguno posteado recientemente...
    //
    const toggle = ()=>{ 
        setLastFreshWhen( valueOfFresh );
        setOpen(!open);
    }

    if( !open && freshOne && (lastFreshWhen!=valueOfFresh) ) 
    { 
        setOpen(true);
    }

    return <><Box paddingLeft={8} marginBottom={2}>
                 
                <Button startIcon={ open? <CloseIcon fontSize="small"/>: <QuestionAnswerOutlinedIcon fontSize="small"/>} onClick={toggle}>
                    { open?"hide replies":`show (${replies.length}) replies`}
                </Button>


                { open && replies.map(c=>(<JComment key={c.id} comment={c}/>)) }
            </Box> 
            </>; 
}