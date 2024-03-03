import { Box, Typography, makeStyles } from "@material-ui/core";
import { useGetActiveSupportersQuery } from "../data/generated---db-types-and-hooks";
import UnameTag from "./uname";

const useStyles = makeStyles( theme=>({
    list: {
        fontSize:11, 
        borderTop:"1px solid "+theme.palette.background.paper,
        borderBottom:"1px solid "+theme.palette.background.paper,
        paddingTop:15,

        "& > div": {
            display:"inline-block"
        },
        "& > div + div": {
            marginLeft:15
        }
    }
}));

export const SupportersDisplay = ()=>{
    const { data, loading, error } = useGetActiveSupportersQuery(); 
    const classes = useStyles();

    if(!data?.getActiveSupporters.length>0) {
        return null;
    }

    const plural = data.getActiveSupporters.length>1;
    const hayActives = data.getActiveSupporters.length>0;

    return <Box textAlign="center" className={classes.root}> 

        <Box marginBottom={3} marginTop={3}>
            <Typography>Special thanks to 
                <div className={classes.list}>
                { data.getActiveSupporters.map( (sup,i)=>{

                return <div key={sup.user.id}  ><UnameTag inline {...sup.user}/> </div>;

                } ) }
                </div>
            </Typography>  
        </Box> 
    </Box>
}
 