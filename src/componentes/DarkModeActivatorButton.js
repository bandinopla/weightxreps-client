import { Button } from "@material-ui/core";
import Brightness4OutlinedIcon from '@material-ui/icons/Brightness4Outlined';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { useEffect } from "react";
import { SetDarkMode, useDarkModeOn } from "../MainTheme"; 




export const DarkModeActivatorButton = ({ ...rest })=>{

    
    const darkON    = useDarkModeOn();

    // useEffect( ()=>{

    //     if( darkON==null )
    //     {
    //         var v = JSON.parse(storage.getItem("darkON"));

    //         if( typeof v =='boolean' )
    //         {
    //             SetDarkMode(v);
    //             return;
    //         }
    //     }

    //     storage.setItem("darkON", JSON.stringify(darkON));

    // }, [darkON]);



    return <Button {...rest} onClick={ ()=>SetDarkMode(!darkON) } >
        { !darkON? <Brightness4OutlinedIcon/> : <Brightness7Icon/> }
    </Button>;
}