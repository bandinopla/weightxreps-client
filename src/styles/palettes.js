import { createTheme } from '@material-ui/core';
import { darken, alpha, lighten, emphasize } from '@material-ui/core/styles/colorManipulator';
import { MainTheme } from '../MainTheme';
import { useGetSession, useReactiveSetting } from '../session/session-handler';


/**
 * Colors
 */
export const defaultPaletteColors = {
    backgroundColor:"#0f0",
    backgroundColorOnTop: "#0f0",
    mainColor: "#0f0",
    mainColorOnTop: "#0f0",

    secondaryColor: "#0f0",
    secondaryColorOnTop: "#0f0",

    dataCellColor: "#0f0",
    dataCellColorOnTop: "#0f0" 
}


//
// 0 LIGHT MODE
// 1 DARK MODE
//
 export const ColorSchemes =  [{"backgroundColor":"#FAFAFA","backgroundColorOnTop":"#6a798b","mainColor":"#3574a5","mainColorOnTop":"#e3edf2","secondaryColor":"#68a9bd","secondaryColorOnTop":"#ffffff","dataCellColor":"#3b434d","dataCellColorOnTop":"#d6dadf","undefined":"#d2b3b3"},{"backgroundColor":"#2a2a2b","backgroundColorOnTop":"#b3b3bb","mainColor":"#035699","mainColorOnTop":"#bec9cf","secondaryColor":"#7f93a1","secondaryColorOnTop":"#0d0f0d","dataCellColor":"#000000","dataCellColorOnTop":"#899091","undefined":"#d2b3b3"}]
//[
//     {"backgroundColor":"#f1f7f7","backgroundColorOnTop":"#1a314e","mainColor":"#6c786c","mainColorOnTop":"#ffffff","secondaryColor":"#ff00ca","secondaryColorOnTop":"#e3eee3","dataCellColor":"#000000","dataCellColorOnTop":"#f7f7f7","undefined":"#d2b3b3"},
//     {"backgroundColor":"#000000","backgroundColorOnTop":"#ffffff","mainColor":"#6c786c","mainColorOnTop":"#ffffff","secondaryColor":"#ff00ca","secondaryColorOnTop":"#e3eee3","dataCellColor":"#000000","dataCellColorOnTop":"#f7f7f7","undefined":"#d2b3b3"}
//];
 

export const applyPaletteColorsToTheme = ( colors, theme )=> {
 
    if(!colors) return theme;

    const ntheme = { ...theme }

    ntheme.referenceLineColor = alpha(colors.backgroundColorOnTop, 0.2)  ;
    ntheme.ucardBgColor = alpha("#fff", 0.1)//lighten(colors.backgroundColor, 0.3)

    ntheme.palette.background = {
        default: colors.backgroundColor,
        paper: lighten(colors.backgroundColor, 0.01) //colors.backgroundColor,
    }; 
    ntheme.palette.text.primary = colors.backgroundColorOnTop;
    
    ntheme.palette.primary = {
        main: colors.mainColor,
        contrastText: colors.mainColorOnTop
    };
    ntheme.palette.secondary = {
        main: colors.secondaryColor,
        contrastText: colors.secondaryColorOnTop
    };

    ntheme.overrides.MuiFormHelperText = {
        root: {
            color: colors.backgroundColorOnTop
        }
    }

    ntheme.overrides.MuiInput = {
        underline: {
            "&:after": {
                borderBottom: "2px solid "+ntheme.referenceLineColor 
            },
            "&:before": {
                borderBottom: "2px solid "+ntheme.referenceLineColor 
            }
            
        }
    }
    ntheme.overrides.MuiSelect = {
        icon: {
            color: colors.backgroundColorOnTop
        }
    }

    ntheme.overrides.MuiFormLabel = {
        root: {
            color: colors.backgroundColorOnTop
        }
    }

    ntheme.overrides.MuiAppBar.colorDefault.backgroundColor = colors.backgroundColor;

    const H12345 = {
        color: darken( colors.backgroundColorOnTop, 0.3)
    }
    ntheme.overrides.MuiTypography =  {
        h1: H12345,
        h2: H12345,
        h3: H12345,
        h4: H12345,
        h5: H12345,
        root: {
            "& a": {
                color: colors.mainColor
            },
            "& strong": {
                color: emphasize( colors.backgroundColorOnTop, 0.2 )
            }
        }
    };

    ntheme.overrides.MuiTypography.h2 = {
        color: darken( colors.backgroundColorOnTop, 0.3)
    }

    // ntheme.overrides.MuiSvgIcon = {
    //     root: { color: colors.backgroundColorOnTop  }
    // }

    ntheme.dataCell = { 
            background: colors.dataCellColor,
            color: colors.dataCellColorOnTop 
    }

    ntheme.overrides.MuiTable = {
        root: {
            backgroundColor: ntheme.ucardBgColor //theme.palette.background.default, 
        }
    }

    ntheme.overrides.MuiTableCell = {
        root: {
            borderBottom: "1px solid "+ ntheme.referenceLineColor,  
        }
    }

    ntheme.overrides.MuiDivider = {
        root: {
            backgroundColor: ntheme.referenceLineColor
        }
    }

    ntheme.overrides.MuiButton = {
        root: {
            "&.Mui-disabled":{
                color: ntheme.referenceLineColor
            }
        },
        outlined: {
            borderColor:colors.backgroundColorOnTop,
            "&.Mui-disabled":{
                borderColor: ntheme.referenceLineColor
            }
        }
    }

    return ntheme

}
 
export const useColorThemeManager = ( id )=>{

    const session                   = useGetSession();    
    const customs                   = useReactiveSetting( session?.userSettings?.colorScheme ); 
    
    const getColorPalette         = (mode, original)=> {
        let m = Number(mode);

        if( original )
            return ColorSchemes[m];

        return customs?.[m] ?? ColorSchemes[m];
    }

    return { 
        customs, //<--- custom palette for each scheme.

        saveScheme: (newScheme, mode) => {
 
            const _customs = customs ?? [ null, null ];

            _customs[mode] = newScheme; 

            session?.userSettings?.colorScheme( _customs.slice(0) )
        
        },

        getTheme: mode=> applyPaletteColorsToTheme(  getColorPalette(mode) , createTheme( MainTheme ) ), 

        getColorPalette, 
    }
} 