import { Accordion, AccordionSummary, AccordionDetails, Container, createTheme, Grid, ThemeProvider, Button, Box } from "@material-ui/core";
import MockSiteSkeleton from "../componentes/color/MockSiteSketeton";
import { MainTheme, SetDarkMode, useDarkModeOn } from "../MainTheme";
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useState, useRef, useEffect, useMemo } from "react";
import { applyPaletteColorsToTheme, ColorSchemes, defaultPaletteColors, useColorThemeManager } from "../styles/palettes";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DoneIcon from '@material-ui/icons/Done';
import "./ColorThemePage.css";
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import ReplayIcon from '@material-ui/icons/Replay';
import { useGetSession } from "../session/session-handler";
import { Alert } from "@material-ui/lab";

const styleProps = Object.keys( defaultPaletteColors ).filter( prop=>prop.indexOf("OnTop")<0);

const theme = createTheme( MainTheme );

function ColorThemePage() {

    const session                           = useGetSession();
    const colorScheme                       = useColorThemeManager();
    const darkModeON                        = useDarkModeOn();
    const [ colors, setColors ]             = useState();
    const [ editMode, setEditMode ]         = useState(0);
    const pendings                          = useRef(new Map()); 

    //
    // current color palette being edited is currently apllied
    //
    const colorsState                       = useMemo(()=>
    {
        const currentColors     = JSON.stringify( colors ); 
        const currentCustom     = JSON.stringify( colorScheme.getColorPalette(editMode) ); 
        const original          = JSON.stringify( colorScheme.getColorPalette(editMode, true) ); 
        const currentInUse      = JSON.stringify( colorScheme.getColorPalette(darkModeON) ); //<-- la actualmente en uso
 

        return {
            isApplied: currentColors == currentInUse,
            hasChanged: currentColors != currentCustom,
            isCustom: currentColors!=original,
            editModeEqualsDarkMode: Number(darkModeON) == editMode
        }
    }, 
    [colors, editMode, darkModeON]); 

    useEffect( ()=>{

        if( !colors )
        {
            setColors( Object.assign({}, colorScheme.getColorPalette(editMode) ) );
        }
        

    }, [ colorScheme , editMode, colors ])


    const setColor = ( prop, color) => {

        const map = pendings.current;
        let pending = map.get( prop );

        if( pending )
        {
            clearTimeout( pending);
        }
 
        map.set( prop, setTimeout( ()=>setColors({
                                            ...colors,
                                            [prop]: color
                                        }), 300 ));                      
    } 

    const saveAndApply = (save, apply) => ()=>{ 

        if( save )
        {
            
            colorScheme.saveScheme( colors, editMode  ); 
            setColors(null);
        } 

        if( apply )
        {
            SetDarkMode(Boolean(editMode))
        } 
    } 

    const reset = ()=>{
        
        //colorScheme.saveScheme( null, editMode );
        setColors( colorScheme.getColorPalette(editMode, true) );
    }

    if( !colors )
    {
        return "";
    } 

    return  <div>
                    <div className="rainbowBG" style={{ height:3, marginBottom:20 }}></div>

                    <Box padding={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h2">Palette</Typography>
                            <Typography variant="body1">
                                You can set custom colors for both the light anb dark mode. 
                                <Alert severity="info"><strong>This setting is stored in the local storage of this browser.</strong></Alert>
                            </Typography>
                             
                            <Grid container spacing={2}>
                                { ColorSchemes.map( (scheme, i)=>{
                                    scheme = colorScheme.getColorPalette(i);
                                    return <Grid item xs={4} key={i}>
                                        
                                        <Typography variant="subtitle1" gutterBottom><strong>"{['Light','Dark'][i]}"</strong> mode</Typography>

                                        <div style={{border: editMode==i? "3px solid yellow" :  "1px solid #ccc", cursor:"pointer"}} 
                                             className={ editMode==i?"pulse sha":""} 
                                             onClick={ ()=>{

                                                setEditMode(i)
                                                setColors( Object.assign({  }, colorScheme.getColorPalette(i)) );
                                                
                                                } }
                                             >
                                            
                                            { Object.keys(scheme).map(hex=><div style={{ height:10, backgroundColor:scheme[hex] }}></div>) }
                                        </div>
                                    </Grid> 
                                } )}
                            </Grid>
                            <br/><br/>
                            <Typography variant="h4" gutterBottom>Customize</Typography>
                            { styleProps.map(prop=><Accordion key={prop}>
                                                    <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />} 
                                                    >
                                                    <Typography style={{ textTransform:"capitalize", fontWeight:"bold"}}>{ prop.replace(/([a-z])([A-Z])/g, '$1 $2') }</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <ColorSetter prop={prop} colors={colors} setColor={ setColor }/>
                                                    </AccordionDetails>
                                                </Accordion>) }
                        </Grid>
                        <Grid item>

                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                <Typography variant="h2" >Preview</Typography>

                                <div>

                                { colorsState.isCustom && <Button size="large" variant="outlined" startIcon={<ReplayIcon/>} onClick={ reset }>Reset</Button> }
                                &nbsp;
                                { !colorsState.isApplied && colorsState.hasChanged && !colorsState.editModeEqualsDarkMode && <Button size="large" variant="contained" color="secondary" startIcon={<SaveAltIcon/>} onClick={ saveAndApply(true, false) }>Save</Button> }
                                
                                &nbsp;

                                {
                                    colorsState.isApplied? <Button size="large" variant="outlined" color="default" disabled startIcon={<DoneIcon/>}>In Use</Button>
                                    :  
                                    colorsState.hasChanged?
                                        <Button size="large" variant="contained" color="Primary" startIcon={<FormatColorFillIcon/>} onClick={  saveAndApply(true, true) }>Save & Apply</Button> 
                                        :
                                        <Button size="large" variant="contained" color="Primary" startIcon={<FormatColorFillIcon/>} onClick={  saveAndApply(false, true) }>Apply</Button>  
                                } 
                                </div>

                            </div>

                            <ThemeProvider theme={ applyPaletteColorsToTheme(darkModeON, colors, theme) } >
                                <MockSiteSkeleton/>
                            </ThemeProvider>
                        </Grid>
                    </Grid>
                    </Box>
                </div>
           ;
}

function ColorSetter({ prop, colors, setColor })
{

    return <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography>Color</Typography> 
                    <ColorPicker prop={prop} colors={colors} setColor={setColor}/>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Color on top</Typography>
                    <ColorPicker prop={prop+"OnTop"} colors={colors} setColor={setColor}/>
                </Grid>
            </Grid>
}

function ColorPicker({ prop, colors, setColor })
{
    const onChange = (prop, color) => setColor(prop, color);

    return <><HexColorPicker style={{ maxWidth:"100%"}} color={colors[prop]} onChange={ c=>onChange(prop, c) } />
             <HexColorInput color={colors[prop]} onChange={ c=>onChange(prop, c)} style={{ fontSize:17, width:"100%", marginTop:10}}/> 
            </>   
}
 

export default ColorThemePage;