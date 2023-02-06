import Uname from '../uname';
import { Box, Typography } from '@material-ui/core';
import { useAlsoPostedQuery } from '../../data/generated---db-types-and-hooks';

 

export default function({ ymd }) {

    const { loading, data, error}  = useAlsoPostedQuery({ variables:{ ymd } }); 
  
    // TODO: loader and handle error....
    return <> 
            <Typography gutterBottom>Also posted on this day...</Typography>
            { data?.alsoposted.map( u=>(<Box key={u.id} marginBottom={0.3} paddingLeft={1}><Uname url={`/journal/${u.uname}/${ymd}`} {...u}/></Box>) ) }

            { data?.alsoposted.length==20 && "... and some more."}
            { data?.alsoposted.length==0 && "... no one yet."}
          </>;

}