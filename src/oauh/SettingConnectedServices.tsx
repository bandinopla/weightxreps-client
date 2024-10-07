import { ConnectedServicesSetting, useSetSettingMutation } from "../data/generated---db-types-and-hooks"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { useEffect, useState } from "react";
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import LaunchIcon from '@material-ui/icons/Launch';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar'; 
import CloseIcon from '@material-ui/icons/Close';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import OperationBackdrop from "../componentes/backdrop";
import { parseError } from "../data/db";
import { Alert } from "@material-ui/lab";

type Props = {
    setting:ConnectedServicesSetting
}

/**
 * UI for the connected services user setting
 */
export default function SettingConnectedServices({ setting }:Props) {

    const [checked, setChecked] = useState<string[]>([]);  
    const [error, setError] = useState<string>();
    const [ok, setOk] = useState(false);
    const [save, { error:saveError, loading:saving, data:saveResult }] = useSetSettingMutation();

    //update error
    useEffect(()=>{

        if( saveError )
        {
            setError( parseError(saveError));
        }

    }, [saveError]);

    //
    // if setting change, uncheck all.
    //
    useEffect(()=>{
        setChecked([])
    },[setting]);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setChecked(newChecked);
      };

    const revoke = ()=>{
        if(!confirm("Are you sure you want to do this?\nThe servies will stop working on your account unless you grant them access again in the future.")) {
            setChecked([]);
            return;
        };

        save({
            variables: {
                id: setting.id,
                value: {
                    revoke: checked
                }
            }
        }) 
        .then( resp=>{
            if( resp.data?.setSetting )
            {
                setOk(true);
            }
        })
        .catch(e=>{});
    }

    return <> 

    <OperationBackdrop open={saving}/>

    <Snackbar 
        open={checked.length>0} 
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
        message={`${checked.length} selected`}
        action={
          <>
            <Button color="primary" variant="contained" onClick={()=>revoke()} startIcon={<LinkOffIcon/>}>
              REVOKE ACCESS
            </Button>
            <IconButton size="medium" aria-label="close" color="inherit" onClick={()=>setChecked([])}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </>
        }
      />

    <Snackbar 
        open={!!error} 
        onClose={()=>setError(undefined)}
        
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
        autoHideDuration={3000} 
        ContentProps={{
            style: { background:"red" }
        }}
      >
        <Alert severity="error"onClose={()=>setError(undefined)}>{error}</Alert>
    </Snackbar>

    <Snackbar 
        open={ok} 
        onClose={()=>setOk(false)}
        
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
        autoHideDuration={3000}  
      >
        <Alert severity="success" onClose={()=>setOk(false)}>Service/s revoked!</Alert>
    </Snackbar>

    {
        !setting.connections?.length ? <Alert severity="info">Services that you allow access to this account will be listed here.</Alert>
        : <Alert severity="info">To revoke access (to remove the service's authorization to access your account) select the service or services and click "revoke acces"</Alert>
    }
    
    <List >
        { setting.connections?.map(c=><ListItem key={c.id} dense button onClick={handleToggle(c.id)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(c.id) !== -1}
                tabIndex={-1}
                disableRipple 
              />
            </ListItemIcon>
            <ListItemText
                    primary={c.name}
                    secondary={c.url}
                  /> 
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={()=>window.open(c.url,"_blank")}>
                <LaunchIcon />
              </IconButton>
            </ListItemSecondaryAction>

        </ListItem>)}
    </List>
    </>
}