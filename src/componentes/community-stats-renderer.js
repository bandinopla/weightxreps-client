import { Box, Grid, Typography } from "@material-ui/core";
import Barra from "./barras";
import WeightValue from "./weight-value";
import UnameTag from "./uname";

const RankPosition = ({ pos })=>(<sup style={{float:"left"}}><strong>{pos}. </strong> </sup>);

export const _weightRenderer = item => {
  
    const w         = item.w.v; //item.originalw?.v || item.w.v;
    const xBW       = item.bw.v? (w/item.bw.v) : 0;

     
    const onFire    = xBW>0 && xBW >= item.officialExercise.coolxbw;

    return <Box key={item.e.id} margin="10px 0" >
                
                    <Grid container> 
                    
                    <Grid item xs={5}> 
                        <Barra weight={w} reps={!item.originalw? item.reps : null }/>   
                        <RankPosition pos={item.rank}/>
                        <Box textAlign="center">
                            <strong>{item.originalw?"~":""}<WeightValue round={item.originalw!=null} value={w} inkg={!item.w.lb}/></strong>
                        </Box>
                    </Grid> 

                    <Grid item xs={7}>
                        <UnameTag {...item.by} ymd={item.ymd}/>
                        <Typography variant="caption" component="div" noWrap>{ item.e.name }</Typography>
                        { item.bw?.v>0 && <Typography noWrap variant="button">
                            @ <WeightValue value={item.bw.v} inkg={!item.bw.lb}/> 
                            {xBW && <>(<span style={{fontSize:10}}>x</span>{xBW.toFixed(2)}) {onFire && <>🔥</>}</>}
                        </Typography>}
                    </Grid>
                    
                </Grid>
            </Box> ;
}
 


export const _volumeRenderer = item => {
    return <Box key={item.e.id} margin="10px 0">
                    <div>
                             <UnameTag {...item.by}/>
                            <Box paddingRight={1} marginBottom={2}>
                                <RankPosition pos={item.rank}/> &nbsp;&nbsp;
                                <strong><WeightValue round value={item.w.v} inkg={!item.w.lb}/></strong>
                                  &nbsp;in <strong>{ item.totalReps }</strong> reps 
                                </Box>
                    </div>
                    {/* <Grid container> 
                
                        <Grid item xs={3}>
                            <RankPosition pos={item.rank}/>
                            <Box width={90} textAlign="right" paddingRight={1}>
                                <strong><WeightValue round value={item.w.v} inkg={!item.w.lb}/></strong>
                                <Typography variant="caption" component="div">in <strong>{ item.totalReps }</strong> reps</Typography>
                                </Box>
                        </Grid>


                        <Grid item xs={9}>
                            <UnameTag {...item.by}/>
                            <Typography variant="caption" component="div" noWrap>{ item.e.name }</Typography>
                            { item.bw?.v>0 && <Typography noWrap variant="button">
                                @ <WeightValue value={item.bw.v} inkg={!item.bw.lb}/> 
                            </Typography>}
                        </Grid>
                        
                    </Grid> */}
                </Box>
             ;
}