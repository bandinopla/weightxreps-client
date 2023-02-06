import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

export const DialogTitleWithCloseBtn = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props; 

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>

        <Typography variant="h6" component="div">{children}</Typography>
     
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
     
    </MuiDialogTitle>
  );
});