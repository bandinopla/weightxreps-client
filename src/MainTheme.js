import { makeVar, useReactiveVar } from "@apollo/client";
import { createTheme } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/core/styles';
import { useGetSession, useReactiveSetting } from "./session/session-handler";
import { applyPaletteColorsToTheme, useColorThemeManager } from "./styles/palettes";




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
      }
    },
  
    erowPR: {
      color:"#ffb84e !important",
      textShadow:"0px 1px 1px rgba(0,0,0,0.3)"
    },
  
    int_color:"#E63946",
    eff_color:"#457B9D",
    PR_Bar_color:"yellow", 

    notifItemBgColor:"#fefefe",
    notifItemBorderColor:"#ccc",

    userTextColor:"blue",

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

  var storage     = localStorage; 
  var v = JSON.parse(storage.getItem("darkON"));
  var darkModeCurrentValue = false;

  if( typeof v =='boolean' )
  {
      darkModeCurrentValue = v;
      
  }

const DarkModeOn = makeVar(darkModeCurrentValue);

export const ifDark = (theme, darkColor, lightColor) => theme.palette.type=='dark'? darkColor : lightColor;
export const MainTheme = BaseTheme;
export const DarkTheme = {
    ...BaseTheme

    , root: {
        "& a": {
            color:"red"
        }
    }
    , logoBgColor:"none"
    , palette: {
        ... BaseTheme.palette,
        type:"dark",
        background: {
            default:"#12181B"
        },

        primary: {
            main:"#ED6154"
        },
        secondary: {
            main:"#415A77"
        },

        text: {
            primary:"#ccc"
        }
        
    },

    notifItemBgColor:"#555",
    notifItemBorderColor:"#444",

    userTextColor:"#1C9DED",

    overrides: {
        MuiCssBaseline: {
            '@global': {
                "a": {
                    color:"#ED6154"
                }
            }
        },
        MuiAppBar: {
            colorDefault: {
              backgroundColor:"#2A2E35"
              //, borderBottom:"2px solid blue"
            }
          },

          MuiAlert: {
            standardInfo: {
                backgroundColor:"#115293"
            }
          },
 

        // MuiCssBaseline: { 
        //     "@global": { 
        //         body: {
        //             backgroundColor:"#333"
        //             , "& a": {
        //                 color:"#1B79C3"
        //             }
        //         } 
        //     }
        // }
    },

    erow: {
        bgColor: "rgba(255,255,255,0.03)",
        RepSetColor:"#00F5D4",
        weightColor:"#CAF0F8"
    },

    effIntBars: {
        bg:"#333",
        borderColor:"#222"
    },

    calendario: {
        cellM1BgColor: "rgba(255,255,255,0.2)",
        cellM0BgColor: "rgba(255,255,255,0.05)",
        hasDataColor: "#ED6154",
        cellPinned: "#34A5DD"
    },

    eff_color: "#1C9DED"

    ,supporterUcard: {
        gold: {
          border:"1px solid rgba(240,216,99,0.1)",
          background:"linear-gradient(180deg, rgba(196,181,104,1) 2%, rgba(97,84,48,1) 85%)"
        }
      },

      uname: {
        male:"#00BBF9",
        female:"#f39",
        adminColor:"#ED6154"
      },
};
 

export const ThemeSwitcher = ({ children })=>{

    const { getTheme }  = useColorThemeManager();  
    const mode          = useDarkModeOn()

 
    // const session       = useGetSession();   
    // const colors        = useReactiveSetting( session?.userSettings?.colorScheme, 'ThemeSwitcher' ); 
    // const theme         = applyPaletteColorsToTheme( colors, createTheme( MainTheme ) );

    // // //!
    // //return <div className={darkON?"dark":""}><ThemeProvider theme={theme} >{children}</ThemeProvider></div>; 
    // console.log("45656666",  currentScheme?.backgroundColor ) 

    return  <ThemeProvider theme={ getTheme(mode) }>{children}</ThemeProvider> ;  
 
}

export const useDarkModeOn = ()=>{
    const darkON = useReactiveVar(DarkModeOn); 
    return darkON; 
}

export const SetDarkMode = on => {
    
    storage.setItem("darkON", JSON.stringify(on));
    DarkModeOn(on);
}