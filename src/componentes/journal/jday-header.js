import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { NothingHere } from "../nothing-here-alert";

export const JDayContentHeader = ({ noData, title, titleChild, children, noDataLabel="No log on this day" })=>(<>
    <Typography variant="h4" style={{textTransform:"capitalize"}}>
        <b>{ title }</b>
        { titleChild }
    </Typography>

    <Typography variant="h6" style={{fontWeight:300 }}> 
        { !noData? children : <Box padding={2} margin={2} border="1px dotted #ccc"><NothingHere title={noDataLabel} description="Nothing was logged on this day..."/></Box> } 
    </Typography>  
    <br/> 
</>);
export const JDayHeaderSkeleton = ()=>(<div> 
    <Skeleton variant="text" style={{width:"10%", height:60, float:"right"}}/> 
    <Skeleton variant="text" style={{width:"50%", height:60}}/> 
    <Skeleton variant="text" style={{maxWidth:200, height:30}}/> 
    <br/>
    <Skeleton variant="text" /> 
    <Skeleton variant="text" /> 
    <Skeleton variant="text" width="90%" /> 
  </div>);