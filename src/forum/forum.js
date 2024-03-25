import { Box, Button, Chip, Divider, LinearProgress, Typography } from "@material-ui/core";
import { GetForumMessagesDocument, GetForumSectionsDocument, useGetForumMessagesQuery, useGetForumSectionsQuery, useGetThreadMessagesQuery } from "../data/generated---db-types-and-hooks"
import UnameTag from "../componentes/uname";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { date2NiceString } from "../utils/utils";
import { date2timeago } from "../componentes/TimeAgoDisplay";
import { Link  } from "react-router-dom"; 
import { slugify } from "../utils/slugify";
import FetchMoreButton from "../componentes/FetchMoreButton";
import { PageLayoutTitle } from "../componentes/ContentPageWrapper";
import { ForumBreadcrumb } from "./forum-breadcrumb";
import { NothingHere } from "../componentes/nothing-here-alert";
import { Alert } from "@material-ui/lab";
import { useGetSession } from "../session/session-handler";
import AddIcon from '@material-ui/icons/Add';
import { useState } from "react";
import { MessageReplyBox } from "./MessageActionButtons";
import { useApolloClient } from "@apollo/client";
import { AsciiSpinner } from "../componentes/ascii-spinner";

export const Forum = ({ match, location })=>{

    const user      = useGetSession();
    const sectionId = match.params.slug;
    const by        = match.params.username;

    const sections  = useGetForumSectionsQuery();

    const { data, loading, error, fetchMore } = useGetForumMessagesQuery({ variables: { 
        sectionId: sectionId || ("by--"+by), 
        limit: 10 
    } });//, pollInterval: 1000

    /**
     * Cargar items más antiguos
     * @returns {Promise}
     */
    const loadMoreItems = ()=>{    
        
        let olderThan = data.getForumMessages?.messages.slice(-1)[0].when ;  
         
        return fetchMore({ 
            variables   : { olderThan }  
        }) 
        .then( res=>{ 
            return res.data.getForumMessages?.messages.length>0  ;
        })
        ;   
    };

    if( loading )  return <LinearProgress/>;

    if( error ) return <Alert severity="error">{error.message}</Alert>;
 

    return <Box paddingBottom={1}>

            <ForumBreadcrumb slug={by? "by--"+by : match.params.slug}/>

            { data?.getForumMessages?.messages.length==0 ? <EmptyForum sectionId={sectionId}/> 
            : <>
                <TableContainer component={Paper}>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" className="oneline" width={100}>Replies ↴</TableCell>
                                <TableCell align="center">

                                    { user.session && <PostNewThreadAction sectionId={sectionId}/> }
                                    { !user.session && "..."}
                                    
                                </TableCell>
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.getForumMessages.messages.map( msg => {
                            
                            const section = sections.data?.getForumSections.find(s=>s.id==msg.sectionId || s.slug==msg.sectionId);
                            const sectionSlug = section?.slug;

                            return <TableRow key={msg.id}>

                                <TableCell align="center">
                                    <Typography variant="h4" style={{ opacity:msg.replies>0?1:0.3 }}>{ msg.replies }</Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="subtitle1">

                                        { msg.message=="" && <Alert severity="warning">{msg.threadId==0?"Thread":"Comment"} deleted</Alert>}
                                        { msg.message!="" && sectionSlug && <Link to={"/forum/"+sectionSlug+"/"+(msg.threadId>0 ? msg.threadId : msg.id)+"/"+slugify( msg.message.substring(0,80))+(msg.threadId>0? "/locate--"+msg.id:"") }>
                                                                                { by && msg.threadId==0 && <Chip label="Thread" size="small" color="primary"/>}
                                                                                { by && msg.threadId>0 && <Chip label="Reply" size="small" variant="outlined"/>}
                                                                                { (msg.message.substring(0,150)+"...")} 
                                                                                </Link>}
                                         { msg.message!="" && !sectionSlug && <i style={{textDecoration:"line-through"}}>{(msg.message.substring(0,150)+"...")}</i> }
                                        
                                        </Typography>

                                        { by && <Typography variant="caption">
                                            { !sections.data && <AsciiSpinner label={"Resolving..."}/>}
                                            { sections.data && <div> in <LinkToForum section={section}/></div> }
                                            </Typography>}
                                        

                                    <Typography variant="caption">by</Typography> <UnameTag inline {...msg.user}/> -- <Typography variant="caption">{ date2timeago(new Date(msg.when))} / <i>{msg.when}</i></Typography>
                                
                                </TableCell>
                                
                            </TableRow>} )}
                        </TableBody>
                        
                    </Table >
                </TableContainer>
                <Box textAlign={"center"} padding={5}>
                    <FetchMoreButton fetchMore={loadMoreItems}/>
                </Box>
            </>}

            
        </Box>
}

const EmptyForum = ({ sectionId })=>{ 
 

    if( !sectionId )
    {
        return <NothingHere title="No posts done yet..."/>;
    }

    return <NothingHere title="No threads here yet... be the first!">
        <PostNewThreadAction sectionId={sectionId}/> 
    </NothingHere>
}

const LinkToForum = ({ section })=>{
    if(!section) return <strong style={{color:"red"}}>--unknown forum--</strong>
    return <Link to={"/forum/"+section.slug}>{section.name}</Link>
}

const PostNewThreadAction = ({ sectionId })=>{
    const user = useGetSession();
    const [show, setShow] = useState(false);
    const client = useApolloClient();

    const onNewThreadPosted = (_,threadId, message) => {

        const cache = client.cache;

        const newCommentRef = {
            id: threadId,
            when: new Date().toUTCString(),
            user:user.session.user.id,
            sectionId,
            parentId: 0,
            threadId: 0,
            message,
            replies: 0,
            note:"",
            likes: 0, 
            dislikes:0,
            __typename: "ForumMessage"
        }; 

        // add it to the list...
        cache.writeQuery({ 
            query: GetForumMessagesDocument,
            variables: {
                sectionId,
                limit:1
            },
            data: {
                getForumMessages: {
                    messages: [newCommentRef],
                    users : [
                        cache.identify({ id:user.session.user.id, __typename:"User" })
                    ]
                }
            }
        });

        //update count...
        const { getForumSections } = cache.readQuery({
            query: GetForumSectionsDocument 
        }); 

        if( getForumSections )
        {
            const section = getForumSections.find( s => s.id==sectionId || s.slug==sectionId );

            if( section )
            {
                cache.modify({
                    id: cache.identify(section),
                    fields: {
                        threads: threads => threads+1
                    }
                })
            }
        }

    }

    if( show )
    {
        return <MessageReplyBox message={{ sectionId, id:0 }} 
                                initShow={true} 
                                onClose={()=>setShow(false) } 
                                verb="Post new thread"
                                onCommentPosted={onNewThreadPosted}
                                />
    }

    return <Button startIcon={<AddIcon/>} color="primary" variant="contained" onClick={()=>setShow(true)}>New Thread</Button>
}