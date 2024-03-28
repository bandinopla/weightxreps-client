import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ReplyIcon from '@material-ui/icons/Reply';
import { Box, LinearProgress, makeStyles } from '@material-ui/core';
import { GetThreadMessagesDocument, useDeleteForumMessageMutation, useDislikeForumMessageMutation, useLikeForumMessageMutation, usePostForumMessageMutation, useSetForumMessageNoteMutation } from '../data/generated---db-types-and-hooks';
import TextField from '@material-ui/core/TextField';
import { gql, makeVar, useReactiveVar } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { useGetSession } from '../session/session-handler';
import { AsciiSpinner } from '../componentes/ascii-spinner';
import { Alert } from '@material-ui/lab';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ErrorSnackbar from '../componentes/ErrorSnackbar';
import { openDMWindow } from '../session/ui/dms-window/dm-window';
import SendIcon from '@material-ui/icons/Send';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';

/**
 * @type {import("../data/generated---db-types-and-hooks").ForumMessage}
 */
const $commentOn = makeVar();

const useStyles = makeStyles( theme=>({

    likes: {
        color:"green"
    }, 
    dislikes: {
        color:"red"
    }, 
    likeLabel: {
        paddingLeft:15,
        paddingRight:15
    }
    
}))

/**
 * @typedef {Object} MessageActionButtonsParam
 * @property {import("../data/generated---db-types-and-hooks").ForumMessage} message
 */

/** 
 * @param {MessageActionButtonsParam} param0 
 * @returns 
 */
export const MessageActionButtons = ({ message, ...rest }) => { 

    const user = useGetSession();
    const myId = user.session?.user.id;

    /**
     * @type {import("../data/generated---db-types-and-hooks").ForumMessage?}
     */
    const commentingOn = useReactiveVar($commentOn);
    const [isReplying, setIsReplying] = useState(false);

    const [deleteMessage, { loading:isDeleting, error:deleteError}] = useDeleteForumMessageMutation({ variables: { id:message.id } });
    const [addNote, {loading:isAddingNote, error:addNoteError}] = useSetForumMessageNoteMutation({ variables: { messageId:message.id } });

    const isDeleted     = message.message=="";
    const disable       = isDeleted || isDeleting || isReplying || isAddingNote;

    const canDelete     = !isDeleted && (message.user.id==myId || user.session?.forum?.role?.all || user.session?.forum?.role?.can?.indexOf("delete")>-1 );
    const canAddNote    = !isDeleted && (user.session?.forum?.role?.all || user.session?.forum?.role?.can?.indexOf("note")>-1);
    
    useEffect(() => {

        if( commentingOn?.id==message.id)           setIsReplying(true);
        else if( commentingOn?.id=="x"+message.id)  setIsReplying(false);
        
    }, [commentingOn])

    const reply = () => $commentOn(message);
    const execDelete = ()=>{
        if( window.confirm("Are you sure you want to delete this message?") )
        {
            let reason = "";

            if( message.user.id!=myId )
            {
                reason = prompt("Provide a reason for deleting this message!" );

                if(!reason)
                {
                    alert("You must provide a reason when deleting this message!"); 
                    return;
                }
            }

            deleteMessage({
                variables: {
                    why: reason
                },
                update: (cache, { data }) => {

                    if( data.deleteForumMessage )
                        cache.modify({ 
                            id: cache.identify(message) ,
                            fields: {
                                message: _=>"",
                                note: currentNote=>reason!=""? reason : ""
                            }
                        });
                }
            })
            .catch(e=>{});
        } 
    }

    const execAddNote = ()=>{  

            const noteCanBeDeleted = message.note && message.note!="";

            let note = prompt("Write the clarification or note you want to add to this message."+(noteCanBeDeleted? "\nType \"x\" to delete/remove the note." : ""), message.note ?? "" );

            if( note && note.trim()!="" )
            {
                if( note=="x" )
                {
                    if( noteCanBeDeleted )
                    {
                        if( !window.confirm("Are you sure you want to remove the note?") )
                        {
                            return;
                        }
                    }
                    else 
                    {
                        alert("(ㆆ _ ㆆ) There's no note to delete...");
                        return;
                    }
                    
                }

                addNote({
                    variables: {
                        note
                    },
                    update: (cache, { data }) => {

                        if( typeof data.setForumPostNote == 'boolean' )
                            cache.modify({ 
                                id: cache.identify(message) ,
                                fields: {
                                    note: _=> data.setForumPostNote? note : ""
                                }
                            });
                    }
                })
                .catch(e=>{})
            } 
    }

    const dmAuthor = ()=>{
        openDMWindow(message.user);
    }

    return <div {...rest}>
                <ErrorSnackbar trigger={ deleteError } horizontal="center" vertical="bottom"/>
                <ErrorSnackbar trigger={ addNoteError } horizontal="center" vertical="bottom"/>
                <LikeDislikeButtons message={message} disabled={isDeleted}/>
                &nbsp;
                { user.session && <ButtonGroup size="small">
                    <Button startIcon={<ReplyIcon/>} disabled={ disable } onClick={()=>reply()}>Reply</Button>
 
                    { message.user.id!=myId && <Button startIcon={<MailOutlineIcon/>} onClick={dmAuthor}>Private</Button> }
                    { canDelete && <Button startIcon={<DeleteForeverIcon/>} disabled={ disable } onClick={execDelete}>Delete</Button> }
                    { canAddNote && <Button startIcon={<ErrorOutlineOutlinedIcon/>} onClick={ execAddNote }>{ message.note?"Edit":"Add"} Note</Button> }
               
                </ButtonGroup> }
            </div>
}

/** 
 * The UI that holds the Like and Dislike buttons
 * @param {MessageActionButtonsParam} param0  
 */
const LikeDislikeButtons = ({ message, disabled }) => { 

    const classes = useStyles();
    const user = useGetSession();
    const [ like, { loading:busy } ]        = useLikeForumMessageMutation({ variables: { target: message.id } });
    const [ dislike, { loading:busy2 } ]    = useDislikeForumMessageMutation({ variables: { target: message.id } });

    //
    // execute like/dislike and update the cache counter for each...
    //
    const execLike = isLike => {
        if( !user.session ) return;
        
        const action = isLike? like : dislike;
        action({
            update: (cache, { data }) => {
                const result = (isLike? data.likeForumMessage : data.dislikeForumMessage );
                const success = result != "";
                const substractOpposite = result.indexOf("-")==0; // server will prefix "-" to the ID of the like if the "opposite" type was deleted.
                const removedCurrent = result == "deleted!" ; 

                if( success )
                    cache.modify({
                        id: cache.identify(message),
                        fields: {
                            likes: likes => likes+ (removedCurrent? isLike?-1:0 : (isLike?1:substractOpposite?-1:0) ) ,
                            dislikes: dislikes => dislikes+( removedCurrent? isLike? 0:-1 : (isLike?substractOpposite?-1:0:1)),
                        }
                    })
            }
        })
    }

    return <ButtonGroup size="small" variant='text' disabled={ disabled || busy || busy2}>
                <Button classes={{text:classes.likeLabel}} startIcon={<ThumbUpAltIcon/>} className={classes.likes} onClick={()=>execLike(true)}>{ message.likes }</Button>
                <Button classes={{text:classes.likeLabel}} startIcon={<ThumbDownIcon/>} className={classes.dislikes} onClick={()=>execLike(false)}>{ message.dislikes }</Button>
            </ButtonGroup>
}

/**
 * @typedef {Object} MessageReplyBoxParams
 * @property {(parentMessage:import("../data/generated---db-types-and-hooks").ForumMessage, insertId:string, comment:string)=>{}} onCommentPosted the ID of the thread
 * @property {boolean?} initShow
 * @property {()=>void?} onClose
 * @property {string?} verb
 */

/** 
 * This UI is the text box used to post a message.
 * @param {MessageActionButtonsParam & MessageReplyBoxParams} param0  
 */
export const MessageReplyBox = ({ initShow, message, verb, onCommentPosted, onClose })=>{

    const user              = useGetSession();
    const classes           = useStyles();
    const txtRef            = useRef();
    const [show, setShow]   = useState(initShow);
    const [post, { loading, error, client }] = usePostForumMessageMutation({ variables: { sectionId:message.sectionId, parentId:message.id } });
    const [ok, setOk]       = useState(false);

    /**
     * @type {import("../data/generated---db-types-and-hooks").ForumMessage?}
     */
    const commentingOn = useReactiveVar($commentOn);

    //
    // handle show/hide
    //
    useEffect(() => { 
         
        if( commentingOn?.id == message.id )            setShow(true);
        else if( commentingOn?.id == "x"+message.id )   setShow(false);

    }, [commentingOn?.id]);

    //
    // handle display success message & timeout to close
    //
    useEffect(()=>{

        if( ok )
        {
            setTimeout( ()=>{ 
                setOk(false);
                closeEditor();
            }, 2000 ); //autoclose in 2 seconds...
        }
        
    }, [ok])

    const closeEditor = ()=> {
        if( onClose )
        {
            onClose();
        }
        else 
        {
            $commentOn({ id:"x"+message.id });
        } 
    }

    const postComment = ()=>{
        const comment = txtRef.current.value.trim(); 

        post({
            variables: {
                message : comment,
            },

            //
            // update apollo's cache
            //
            update: (cache, { data }) => {
                const msgid = data.postForumMessage;

                onCommentPosted && onCommentPosted(message, msgid, comment); 
            }
        })
        .then( resp=>{
            if( !resp.errors )
            {
                setOk(true);
            }
        })
        .catch(err=>{});
    };

    if(!show) return "";

    if( ok )
    {
        return <Box margin={1}>
            <Alert severity='success'>Comment posted!</Alert>
        </Box>
    } 

    return <Box margin={1}>
                <TextField 
                    label="Type your comment"
                    multiline
                    maxRows={4} 
                    variant="filled"
                    fullWidth 
                    inputRef={txtRef}
                    style={{marginBottom:5}}
                    disabled={loading}
                    error={error!=null}
                    helperText={error?.message}
                    autoFocus
                />
                <br/>
                <ButtonGroup disabled={loading}>
                    <Button variant='contained' color='primary' onClick={()=>postComment()} startIcon={<SendIcon/>}>
                        { loading? <AsciiSpinner label={"Posting..."}/> : verb ?? "Post comment"}
                    </Button>
                    <Button variant='outlined' onClick={closeEditor}>cancel</Button>
                </ButtonGroup>
            </Box>
}