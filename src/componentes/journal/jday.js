import { Divider, Paper, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
//------
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import { Alert } from '@material-ui/lab';
import { useContext, useMemo } from 'react';
import { parseError } from '../../data/db';
import { useJDayQuery } from '../../data/generated---db-types-and-hooks';
import { JOwnerContext } from '../../pages/journal-context';
import { date2NiceString, ymd2date } from '../../utils/utils';
import { LikeJournalButton } from '../like-button';
import { parsedTags2render } from '../user-text-to-parsed-tags';
import WeightValue from '../weight-value';
import { JEditorButton } from "./editor-button";
import JComments from './jcomments';
import { parseJlog } from './jparser';


import { useParams } from "react-router-dom";
import { JDayContext } from "./jday-context";
import { JDayContentHeader, JDayHeaderSkeleton } from "./jday-header";
import { Custom1RMFactorChip } from "./custom-1rm-factor-chip";
import { JDayStats } from './jday-stats';
 


const useStyles = makeStyles((theme) => ({
    media: {
        //background:"#eee"
        // textAlign:"center" 
          margin:"10px 0" 
          , display:"inline"

          , "&.isLink": {
              background:"#eee" 
              , padding:10
              , display:"block"
          }
    }
}));
 
 


export const JDay = ()=>{

    // ymd={props.match.params.ymd}
    let { ymd }                                 = useParams();
    const jowner                                = useContext(JOwnerContext);
    const uname = jowner.uname;
    const classes                               = useStyles();
    const { loading, data, error}               = useJDayQuery({ variables:{ uid:jowner.id, ymd } }) //useQuery( GET_JDAY, { variables:{ uname, ymd } });
    const date                                  = ymd2date (ymd);

    const log = useMemo ( 
        ()=> data?.jday && parseJlog( data.jday.log, data.jday.eblocks, data.jday.exercises, data.jday.bw, jowner.usekg, data.jday.utags, data.jday.utagsValues )
        ,  [ data?.jday ] )


    if( loading )
    {
      return <JDayHeaderSkeleton/>;
    }

    if( error ) { 
      return <Alert severity="error">{parseError(error)}</Alert>;
    }


   
 
    return <JDayContext.Provider value={{...data.jday, ymd}}> 


            <JDayContentHeader noData={!data.jday} title={<>{date2NiceString(date)} <JDayStats data={data}/></>} titleChild={ <div style={{float:"right", marginLeft:15}}>

                                                                                                        <JEditorButton ymd={ymd} wouldBeNewLog={!data.jday} variant="contained" color="primary" size="large" style={{marginRight:5}}/>
                                                                                                        { log && <LikeJournalButton  variant="outlined" size="large"/> }

                                                                                                    </div>}>
              { data?.jday?.bw>0 && <>-- Bodyweight: <strong><WeightValue value={data?.jday?.bw} inkg={jowner.usekg}/></strong></> }
              
              { jowner.custom1RM>0 && <Custom1RMFactorChip factor={jowner.custom1RM}/> } 

              { data?.jday?.fromMobile && <Chip onClick={ ()=>window.open("https://play.google.com/store/apps/details?id=net.weightxreps.app","_blank") } style={{marginLeft:10}} icon={<SmartphoneIcon/>} variant="outlined" label="logged from mobile"/>}
            </JDayContentHeader>
                 
        
            <div>
                { log?.length>0 && parsedTags2render(log) }
                { log && log.length==0 && <Paper elevation={3}><Box padding={1}><Typography variant='subtitle2'>⊂(◉‿◉)つ <i>Blank log!</i></Typography></Box></Paper> }
            </div>



            { data.jday!=null && <Box marginTop={5} marginBottom={5}><JComments logid={data.jday.id}/></Box> }
 
        </JDayContext.Provider>
}; 

/****************** VISUALS ***********************/
const ErowDivider   = ()=>(<Divider light style={{marginTop:20, marginBottom:10}}/>);  

 




   