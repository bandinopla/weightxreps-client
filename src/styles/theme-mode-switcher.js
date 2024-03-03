import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import ColorizeIcon from '@material-ui/icons/Colorize';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { SetDarkMode, useDarkModeOn } from '../MainTheme';

export const ThemeModeSwitcher = ()=>{ 

    const useDark = useDarkModeOn();
    
    return <ToggleButtonGroup
                value={useDark}
                exclusive 
                onChange={ (e,v)=>SetDarkMode(v) }
            >
                <ToggleButton value={false}>
                    <WbSunnyIcon/>
                </ToggleButton>
                <ToggleButton value={true}>
                    <Brightness3Icon/>
                </ToggleButton>
                

            </ToggleButtonGroup>
}