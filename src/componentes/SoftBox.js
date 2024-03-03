import { Box, Button, ButtonGroup, Paper, Typography, makeStyles } from "@material-ui/core"

const useStyles = makeStyles( theme=>({
    box: {
        backgroundColor: theme.palette.background.paperInvert, 
        margin:"10px 0",
        padding:20,
        borderRadius:20
    }
}))

export const SoftBox = ({ title, Icon, children })=>{
    const classes = useStyles();
    return <Paper className={classes.box} elevation={2}>
        <Typography variant="h4">{Icon} {title}</Typography>
        {children}
    </Paper>
}

export const SoftSpace = ()=><Box marginTop={1}></Box>

export const SoftBoxTabs = ({ labels, selected, onSelected, disabled }) => {
    return <ButtonGroup fullWidth disabled={disabled}>
            { labels.map( (label,i)=>(<Button key={i} variant={i==selected?"contained":"outlined"} color="secondary" onClick={()=>onSelected(i)}>{label}</Button>) )}
        </ButtonGroup>
}