import { ListItem, Typography, withStyles } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import Alert from "@material-ui/lab/Alert";
import { useState } from "react";
import { date2timeago } from "../../../componentes/TimeAgoDisplay";
import { userTextToParsedUI } from "../../../componentes/user-text-to-parsed-tags";
import { UserTypedText } from "../../../componentes/user-typed-text";
import { SystemNotification } from "../../../data/generated---db-types-and-hooks";

const SystemListItem = withStyles( theme=>({ 
    root: {
        width:"100%",
        display:"block", 
    },
    gutters: {
         paddingRight:0,
         paddingLeft:0
    } 
}))(ListItem);


/**
 * @typedef {Object} Props 
 * @property {SystemNotification} data
 * 
 * @param {Props} param0 
 * @returns 
 */
export default function({ data }){

    const [open, setOpen] = useState(false);
    const close = ()=>setOpen(false)
    let title={
        error       :"READ ME!!"
        , warning   :"Warning!"
        , info      : "News"
    }[data.variant];


    
    return <><SystemListItem button onClick={()=>setOpen(true)} alignItems="flex-start">
             <Alert severity={data.variant}>
                <Typography variant="body2">
                    <UserTypedText text={data.text} short/>    
                </Typography> — <Typography variant="caption">{ date2timeago(data.when) }</Typography>
             </Alert>
           </SystemListItem>
           
           <Dialog
                open={open}
                onClose={close}
                scroll="body" 
                maxWidth="sm"
                fullWidth
            > 
                <DialogActions>
                    <Button onClick={close} color="primary">
                        <CloseIcon/>
                    </Button> 
                </DialogActions>
  
                    <Alert severity={data.variant}>
                        <Typography variant="body2">
                              
                            { userTextToParsedUI(data.text) }

                        </Typography> — <Typography variant="caption">{ date2timeago(data.when) }</Typography>
                    </Alert>
 
                
            </Dialog>
            
           </>;    
}