import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 9999,
    color: '#fff',
  },
}));

export default function OperationBackdrop({ open }) {
  const classes = useStyles(); 
  return (
    <div> 
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}