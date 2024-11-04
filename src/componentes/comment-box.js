import { Box, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Alert } from '@material-ui/lab';
import { useContext, useEffect, useRef, useState } from 'react';
import { parseError } from '../data/db';
import { useSendMessageMutation } from '../data/generated---db-types-and-hooks';
import { ifDark } from '../MainTheme';
import { JOwnerContext } from '../pages/journal-context';
import { updateCachedNotificationsArray } from '../session/inbox-manager';
import {  useGetSession } from '../session/session-handler';
import ErrorSnackbar from './ErrorSnackbar';
import { JDayContext } from './journal/jday-context';


const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(1),
    //   '& .MuiTextField-root': { 
    //     width           : '100%', 
    //     marginBottom: theme.spacing(1),
    //   },
    },

    txtarea: {
        width           : '100%', 
        marginBottom: theme.spacing(1), 
        padding:20,
        color: ifDark(theme, theme.palette.primary.main ,"blue") , 
        fontSize:"20px",
        maxWidth:"100%",
        minWidth:"100%",
        backgroundColor: ifDark(theme, "#333","white"),
        borderRadius:8
    },

    outlined: { 
        borderWidth:"4px",
        borderStyle:"solid",
        borderColor: ifDark(theme, "black","#ccc"),
        padding:20
    }
  }));



/**
 * Comment box
 */ 
export default function CommentBox({ dmWith, outlined, replyingToThisMsg, verb="Send Message", placeholder="Type message here...", onCancel, onPosted, actionsAlwaysVisible, focusOnMount }) 
{
    const {session}                       = useGetSession();
    const jowner                        = useContext(JOwnerContext);
    const jdayContext                   = useContext(JDayContext);
    const classes                       = useStyles();
    const [showEditor, setShowEditor]   = useState(false);
    const [busy, setBusy]               = useState(false);
    const [error, setError]             = useState();
    const [postMessage]                 = useSendMessageMutation();//{ errorPolicy:"all"}
    const txtRef                        = useRef();

    //
    // auto-focus on mount
    //
    useEffect( ()=>{
  
        focusOnMount && txtRef.current.focus()

    },[]);

    //
    // si no estamos logueados 
    //
    if( !session ) 
        return ""; 

    //
    // por default, asumimos es un DM
    //
    var $opType           = "DM";
    var $opTarget         = dmWith;
    var $cacheID          = "getInbox"; 
    var notificationType    = { 
        __typename      :"DM",
        inResponseTo    : null,
        inResponseToMsg : null,
        by              : session.user.id,
        to              : dmWith,
        isGlobal        : false
    }

    //
    // es un global
    //
    if ( $opTarget=="0" )
    {
        $opType = "GLOBAL";
        notificationType = {
            __typename:"SystemNotification",
            type:"info", 
        }
    }

    //
    // es un journal
    //
    if( jdayContext?.id ) //hay un logid (estamos en un journal)
    {
        $opType     = "JCOMMENT";
        $opTarget   = jdayContext.id; //logid 
        $cacheID    = "getLogInbox:"+JSON.stringify({ logid:jdayContext.id });

        notificationType = {
            ...notificationType,
            __typename  :"JComment",
            to          : jowner.id,
            jowner      : jowner.id,
            ymd         : jdayContext.ymd
        };
    }

    //
    // es un reply
    //
    if( replyingToThisMsg )
    {
        $opType     = "REPLY";
        $opTarget   = replyingToThisMsg.msgid;
        notificationType = {
            ...notificationType,

            inResponseTo    : replyingToThisMsg.by.id,
            inResponseToMsg : $opTarget,
            to: replyingToThisMsg.by.id 
        }
    }


    const _onCancel = ()=>{
        txtRef.current.value="";
        setError(null);
        setShowEditor(false);
        onCancel && onCancel();
    }

    const onClick = ()=>{
  
        setBusy(true);
        setError(null); 

        /**
         * on new DM
         *      - update getInbox query
         * on new JComment
         *  - update getJInbox
         * 
         * on reply:
         *  - averiguar que tipo de mensaje es, y actualizar el pertinente.
         */

        const message = txtRef.current.value;

        postMessage({
            variables: { 
                message ,
                type        : $opType,
                targetID    : $opTarget
            },


            update: updateCachedNotificationsArray( ({ sendMessage })=>{

                txtRef.current.value = ""; 
                setShowEditor(false);

                const mfields = {
                    id              : sendMessage.id,
                    when            : sendMessage.when , 
                    text            : message,
                    ...notificationType
                }

                if(  $opType !="GLOBAL" )
                {
                    mfields.msgid = sendMessage.msgid;
                }  

                return {
                    [$cacheID]: mfields
                }

            })
             
        })  
            .then(()=>onPosted && onPosted())
            .catch(e=>setError( parseError( e ) ))
            .finally( ()=>setBusy(false) )
    };

    return     <form className={classes.root} noValidate autoComplete="off">
                    <div> 
                    

                        <TextareaAutosize disabled={busy} 
                                            onFocus={()=>setShowEditor(true)} 
                                            className={classes.txtarea + " "+ (outlined? classes.outlined:"")} 
                                            ref={txtRef} 
                                            placeholder={placeholder}
                                            />

                        {/* <ErrorSnackbar trigger={error} horizontal="center"/> */}
                        { error && <Alert severity='error'>{error}</Alert>}

                        { (actionsAlwaysVisible || showEditor) && <Box textAlign="right">

                            <Button disabled={busy} onClick={_onCancel}>cancel</Button>&nbsp;
                            <Button disabled={busy} variant="contained" color="primary" onClick={onClick}>
                                { busy? <CircularProgress size={20}/> : verb}
                            </Button>
                        </Box> }
                    </div> 
                </form>;
}

/*<TextField
                        id="outlined-multiline-static"
                        label="New Message:"
                        multiline
                        rows={2}
                        placeholder="Type new message here..."
                        variant="outlined"
                        onFocus={ ev=>setShowEditor(true) } 
                        disabled={busy}
                        error={error!=null}
                        helperText={error}
                        inputRef={txtRef}
                    /> */