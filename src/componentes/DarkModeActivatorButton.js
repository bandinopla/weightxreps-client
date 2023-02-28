import { Button } from "@material-ui/core";
import { useState } from "react";
import { SetDarkMode, useDarkModeOn } from "../MainTheme";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EmojiObjectsRoundedIcon from '@material-ui/icons/EmojiObjectsRounded';
import FlareRoundedIcon from '@material-ui/icons/FlareRounded';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from "react-router-dom";

export const DarkModeActivatorButton = ({ ...rest })=>{ 
     
    const history   = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const mode = modeIndex => () => {
        SetDarkMode(modeIndex);
        handleClose();
    }

    return <>  
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={ handleClick }  >
                    <InvertColorsIcon/>
                </Button> 
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={mode(0)} >
                        <FlareRoundedIcon/>&nbsp;&nbsp;Light 
                    </MenuItem>
                    <MenuItem onClick={mode(1)}>
                        <EmojiObjectsRoundedIcon/>&nbsp;&nbsp;Dark 
                    </MenuItem>
                    <MenuItem onClick={()=>{ history.push("/color"); handleClose() }}>
                        <SettingsIcon/> &nbsp;&nbsp;Customize 
                    </MenuItem>
                </Menu>
    </>;
}