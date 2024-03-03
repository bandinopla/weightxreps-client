import { Grid, Paper, makeStyles } from "@material-ui/core"
import { WeightUnitVisualPreference } from "./weight-unit-visual-preference-switcher"
import Divider from '@material-ui/core/Divider';
import { ThemeModeSwitcher } from "../styles/theme-mode-switcher";


const useStyles = makeStyles((theme) => ({
    paper: {
      display: 'flex',
      border: `1px solid ${theme.palette.divider}`,
      flexWrap: 'nowrap',
      justifyContent:"space-between",
      "& .MuiToggleButtonGroup-grouped": {
        border:"none"
      }
    },
    divider: {
      margin: theme.spacing(1, 0.5),
    },
  }));


export const VisualPreferencesSwitcher = ()=>{
    const classes = useStyles();

    return <Paper className={classes.paper} color="primary">
        <WeightUnitVisualPreference/>
        <ThemeModeSwitcher/>
    </Paper>
}