import { makeVar, useReactiveVar } from "@apollo/client";
import { useMediaQuery } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/core/styles';
import { useColorThemeManager } from "./styles/palettes";




const PINK_COLOR = "#FE007E";
const GREEN_COLOR = "#00E597";
const RED_COLOR = "#DF0019";

export const BaseTheme = {

    PINK_COLOR,
    GREEN_COLOR,
    RED_COLOR,

    typography: {
      fontFamily: [
        //'-apple-system',
        //'BlinkMacSystemFont',
        //'"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),

      h2: {
        fontFamily: ["Bebas Neue"]
      },
      h3: {
        fontFamily: ["Bebas Neue"]
      },
      h4: {
        fontFamily: ["Bebas Neue"]
      }
    },

    logoBgColor:"none",
  
    uname: {
      male:"#08c",
      female:"#f39",
      adminColor:"#d62828"
    },

    ename: {
        officialColor: "#D18040" 
    },
  
    supporterUcard: {
      gold: {
        border:"1px solid #dbc26f",
        background:"linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(227,228,182,1) 100%)",
        color:"#333 !important"
      }
    },

    successBackdropColor:"#0EAD69",
  
    overrides: {
      MuiAppBar: {
        colorDefault: {
          backgroundColor:"#fff"
          //, borderBottom:"2px solid blue"
        }
      },
      MuiCssBaseline: { 
        // "@global": { 
        //     body: {
        //         backgroundColor:"#FAFAFA"
        //         , "& a": {
        //             color:"blue"
        //         }
        //     }
             
        // }
      },
      MuiButton: {
        containedPrimary: { 
            "&:hover": {
                //color:"#444"
            } 
        }
      }
    },
  
    erowPR: {
      color:"#ffb84e !important",
      textShadow:"0px 1px 1px rgba(0,0,0,0.3)"
    },
  
    int_color:"#E63946",
    eff_color:"#457B9D",
    PR_Bar_color:"yellow", 

    // notifItemBgColor:"#fefefe",
    // notifItemBorderColor:"#ccc", 
    // userTextColor:"blue",

    calendario: {
        cellM1BgColor: "#DBDDE0",
        cellM0BgColor: "#EBEDF0",
        hasDataColor: "#666666",
        cellPinned: "#FF6600"
    },

    erow: {
        bgColor: "#F5F5F5",
        RepSetColor:"#093",
        weightColor:"#333"
    },

    effIntBars: {
        bg:"#ccc",
        borderColor:"#eee"
    },


    palette: {
        //type: 'dark',
        type:"light",
        primary: {
            main:"#22333B"
        },
        secondary: {
            main:"#415A77"
        }
    } 
  };

  var storage               = localStorage; 
  var v                     = JSON.parse(storage.getItem("darkON"));
  var darkModeCurrentValue ;

  if( typeof v =='boolean' ) // if it is defined by the user
  {
      darkModeCurrentValue = v;
  }

const DarkModeOn = makeVar(darkModeCurrentValue);

export const ifDark = (theme, darkColor, lightColor) => theme.palette.type=='dark'? darkColor : lightColor;
export const MainTheme = BaseTheme; 
 

export const ThemeSwitcher = ({ children })=>{

    const { getTheme }  = useColorThemeManager();  
    const mode          = useDarkModeOn();
    const theme         = getTheme(mode);

    return  <ThemeProvider theme={ theme }>{children}</ThemeProvider> ;  
 
}

export const useDarkModeOn = ()=>{

    const darkON = useReactiveVar(DarkModeOn); 
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    if( darkON == undefined ) // no value defined by the user.
    { 
        return prefersDarkMode; // use system preference
    }

    return darkON; 
}

export const SetDarkMode = on => {
    
    storage.setItem("darkON", JSON.stringify(on));
    DarkModeOn(on);
}