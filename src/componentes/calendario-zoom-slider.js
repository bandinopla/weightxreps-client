import { useContext, useEffect, useMemo, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';

import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { JOwnerContext } from '../pages/journal-context'; 
import { useGetSession } from '../session/session-handler';


const marks = [
    {
      value: 0,
      label: 'Day',
    },
    {
      value: 3,
      label: '3 weeks',
    },
    {
      value: 6,
      label: '6',
    }, 
    {
        value: 8,
        label: '8',
      }, 
      {
        value: 12,
        label: '12',
      },
      {
        value: 16,
        label: '16',
      },  
  ];


export default function CalendarioZoomSlider({ currentSelection, onSelect }) {

    const [value, setValue] = useState( 0 );
    const jowner = useContext(JOwnerContext);
    const { session:current } = useGetSession();
    
    const myMarks = useMemo( ()=>{

      return jowner.jranges && current?.user.id==jowner.id? [...marks, ...jowner.jranges.map(n=>({ value:n, label:n.toString() })) ] : marks;

    },[jowner]);
    
    /*[
      ...marks,
      
      //...[18, 20, 32].map(n=>({ value:n, label:n.toString() }))

    ];*/


    useEffect( ()=>{

        if(  (value!=Number(currentSelection)) )
        { 
            setValue(Number(currentSelection))
        }

    }, [currentSelection]);

    return ( 
          <Grid container spacing={2} >
            <Grid item>
              <ZoomInIcon />
            </Grid>
            <Grid item xs>
                
              <Slider value={value} 
                      step={1} 
                      onChangeCommitted={(_,v)=>onSelect(v)} 
                      onChange={(_,nv)=>setValue(nv)} 
                      marks={myMarks} 
                      min={0} 
                      max={ myMarks.slice(-1)[0].value } valueLabelDisplay="auto" />
            </Grid>
            <Grid item>
              <ZoomOutIcon />
            </Grid>
          </Grid>  
      );
}