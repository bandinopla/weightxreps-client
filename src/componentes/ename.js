import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import WifiIcon from '@material-ui/icons/Wifi';
import { JOwnerContext } from '../pages/journal-context';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles( theme => ({
       
    isSpecial: { 
        color: theme.palette.primary.main,
        fontWeight:"bold"
    },

    link: {
      cursor:"pointer",

      "&:hover":{
        textDecoration:"underline"
      }
      
    }

  }));

export default function Ename({ type, id, name, variant, gutter, uname=null, onClick, nohash=false }) {

    const history = useHistory();
    const classes = useStyles();
    const jowner  = useContext(JOwnerContext);

    if( !uname ) {
      uname = jowner?.uname;
    }

    const canLink = uname && id;
 
    const handleClick = ()=>{
        
      if( canLink ) 
      { 
        if( onClick && onClick() )
        { 
            return;
        }

        history.push( `/journal/${uname}/personal-records--${id}`); 
      }
    }

    return <Typography onClick={handleClick} gutterBottom={gutter} variant={variant} className={ (canLink?classes.link:"")+' ename oneline '+(type && classes.isSpecial )}>
                { type? <WifiIcon style={{marginBottom:-5}} fontSize="small"/> : (nohash?"":"#")} {name}</Typography>;

};