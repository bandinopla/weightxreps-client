import { Box, Divider, LinearProgress, Typography, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { GetThreadMessagesDocument, useGetThreadMessagesLazyQuery, useGetThreadMessagesQuery } from "../data/generated---db-types-and-hooks"
import UnameTag from "../componentes/uname";
import { date2timeago } from "../componentes/TimeAgoDisplay";
import { userTextToParsedUI } from "../componentes/user-text-to-parsed-tags";
import { useEffect, useMemo, useState } from "react";
import { ForumBreadcrumb } from "./forum-breadcrumb";
import { Alert } from "@material-ui/lab";
import { MessageActionButtons, MessageReplyBox } from "./MessageActionButtons";
import Pagination from '@material-ui/lab/Pagination';
import { useHistory  } from "react-router-dom"; 
import { NothingHere } from "../componentes/nothing-here-alert";
import { useGetSession } from "../session/session-handler";
import NotificationItemUserAvatar from "../session/ui/notifications-popmenu-items/NotificationItemUserAvatar";
import { ForumRoleChip } from "./roles";
import { ModeratorNote } from "./moderator-note";

export const ThreadMessagesPerPage = 10;

const useStyles = makeStyles( theme=>({

    mainPost: {
        fontSize:"1.1em",
        border:"3px solid #333",
        margin:14,
        borderRadius:10
    },

    post: {
        fontSize:"0.8rem",
        border:"1px solid rgba(0,0,0,0.1)",
        margin:14,
        borderRadius:10
    },
    ucard: {
        display:"flex",
        alignItems:"center",
        "& > div": {
            marginRight:10
        }
    },
    childComment: {
        padding:10
    },
    pagination: {
        justifyContent:"center"
    }
    
}))

export const Thread = ({ match, location })=> {

    const user    = useGetSession();
    const history = useHistory();
    const classes = useStyles();
    const threadId = match.params.thread;
    const page = parseInt(match.params.page) || 1;
    const perPage = ThreadMessagesPerPage;
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [totalPages, setTotalPages] = useState(-1); //-1 = unknown...
    const [totalMessages, setTotalMessages] = useState(-1); //-1 = unknown...

    const { data, loading, error, fetchMore, client } = useGetThreadMessagesQuery({ variables: { messageId: threadId, offset: (page-1)*perPage, limit: perPage } });
    const [ loadThread, {data:threadData, called} ] = useGetThreadMessagesLazyQuery({ variables: { messageId: threadId, offset:0, limit: 1 } });
 

    const messages = useMemo(()=>{

        if(!data) return; 
        return data?.getThreadMessages?.messages;

    },[data]);

    const handlePagination = (event, page)=>{
        let pathname = location.pathname;
        let m = pathname.match(/(\/\d+)$/g);
        if( m )
        {
            history.push(pathname.replace(/(\/\d+)$/, `/${page}`));
        }
        else 
        {
            history.push(`${pathname}/${page}`);
        }  
    }

    //
    // check if we have data to know how much the total number of items is, else, load it...
    //
    useEffect(()=>{
 
        let _totalMessages = 0; 

        if( page==1 )
        {
            if( data?.getThreadMessages) 
            {
                _totalMessages = 1 + ( data.getThreadMessages?.messages[0].replies ?? 0 ); // thread + replies 
            }
                
        }
        else if( !called ) 
        {
            //needs to load it!
            loadThread();
            return;
        }
        else if( threadData )
        {  
            _totalMessages = 1 + (threadData.getThreadMessages?.messages?.[0].replies ?? 0); // thread + replies 
        }

        if( _totalMessages )
        {
            setTotalPages( Math.ceil( _totalMessages/perPage ) );
            setTotalMessages( _totalMessages )
        }
        
        
    }, [data, page, called, threadData]);

 
    const onCommentPosted = (parentMessage, insertId, comment)=>{

        const cache = client.cache;

        const newCommentRef = {
            id: insertId,
            when: new Date().toUTCString(),
            user:user.session.user.id,
            sectionId: parentMessage.sectionId,
            parentId: parentMessage.id,
            threadId: parentMessage.threadId,
            message: comment,
            note:"",
            replies: 0,
            likes: 0, 
            dislikes:0,
            __typename: "ForumMessage"
        }; 

        //#region increase replies count
        cache.modify({
            id: cache.identify(messages[0]),
            fields: {
                replies: replies => replies+1
            }
        });
        //#endregion

        //#region update the query that gets the messages
        cache.writeQuery({ 
            query: GetThreadMessagesDocument,
            variables: {
                messageId: threadId,
                offset: totalMessages,
                limit: 1
            },
            data: {  
                getThreadMessages: { 

                    //
                    // add the new message
                    //
                    messages : [newCommentRef],
                    users: [
                        cache.identify({ id:user.session.user.id, __typename:"User" })
                    ]
                }

               }
            });
        //#endregion

    };


    if( loading )  return <LinearProgress/>;

    if( error ) return <Alert severity="error">{error.message}</Alert>


    return <> 
            <ForumBreadcrumb slug={match.params.slug}/> 
 
            {messages?.map( msg => <Box key={msg.id} className={ msg.parentId==0? classes.mainPost : classes.post}>
  
            <Box padding={2} paddingLeft={6} paddingRight={6} paddingBottom={msg.parentId==0?3:0}> 

            <div style={{marginBottom:10}}>
                {/* { msg.parentId>0 && msg.parentId!=messages[0].id && <InReplyTo parentid={msg.parentId} messages={messages}/> } */}
                { msg.message=="" ? <Alert severity="warning">This message was deleted { msg.note ? <>by a moderator. <strong> -- Reason: </strong>{msg.note}</> : "by the author" }</Alert> : userTextToParsedUI(msg.message, false, true) }
            </div>
            </Box> 

            {  msg.parentId==0 && <Divider/> }

            <Box padding={2} paddingLeft={6} paddingRight={6}> 

            { msg.note && !msg.message=="" && <ModeratorNote note={msg.note}/>}

            <MessageActionButtons message={msg} style={{float: smallScreen? "none" : "right", marginBottom: smallScreen? 20 : 0}}/>

            <div className={classes.ucard}>
                {/* <UAvatar uid={msg.user.id} cc={msg.user.cc} hash={msg.user.avatarhash} variant="circular" /> */}
                <NotificationItemUserAvatar user={msg.user} />
                <div>
                    <UnameTag inline {...msg.user}/> <ForumRoleChip role={msg.user.forumRole}/>
                    <br/>
                    <Typography variant="caption">posted {date2timeago(new Date(msg.when)) }, on { new Date(msg.when).toLocaleString()}</Typography> 
                    
                </div>
            </div>

            <MessageReplyBox message={msg} threadId={threadId} onCommentPosted={onCommentPosted}/>  

            </Box> 
            
            <Divider/>

        </Box> ) }

        {
            totalPages>0 && page>totalPages && <NothingHere title={`Page ${page} doesn't exist`} description={`It seems that you are trying to access a page that goes beyond the current total pages of ${totalPages}`}/>
        }

        { totalPages>0 && <Box padding={5} >
            <Pagination
                page={page}
                count={totalPages } 
                showFirstButton 
                showLastButton
                classes={{ ul: classes.pagination }}
                onChange={handlePagination}
                size="large"
                />
        </Box>}
        
    
    </>;
} 
 

