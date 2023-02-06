import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';


export default function ConfirmationPrompt({ title, children, confirmActionVerb, actionExecutioner, onEntered, nomenu=false }) { 
  
    const execute = () => {
        actionExecutioner(true);
    };
  
    const handleClose = () => {
        nomenu || actionExecutioner(false); //si pasamos "no menu" significa que otro se encarga del dismiss
    };
  
    return ( 
        <Dialog
          open={ actionExecutioner!=null }
          onClose={ handleClose } 
          maxWidth="sm" 
          scroll="body"
          fullWidth
          TransitionProps={{
            onEntered
          }}
          style={{zIndex:9999}}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {children}
            </DialogContentText>
          </DialogContent>


          {!nomenu && <DialogActions>
            <Button onClick={handleClose} >
              cancel
            </Button>
            <Button onClick={execute} variant="contained" color="primary" autoFocus>
              {confirmActionVerb}
            </Button>
          </DialogActions> }
        </Dialog> 
    );
  }