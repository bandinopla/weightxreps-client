import Uname from '../uname';
import { Box, Typography } from '@material-ui/core';
import { useAlsoPostedQuery } from '../../data/generated---db-types-and-hooks';
import { AsciiSpinner } from '../ascii-spinner';
import { Alert } from '@material-ui/lab';

 

export default function({ ymd }) {

    const { loading, data, error}  = useAlsoPostedQuery({ variables:{ ymd } }); 

    if( loading )
    {
        return <AsciiSpinner label={`On ${ymd}...`}/>;
    }

    if( error )
    {
        return <Alert severity='error'>Failed to load related logs...</Alert>
    }
   
    return <> 
            <Typography gutterBottom>Logged on <strong>{ymd}</strong>...</Typography>
            { data?.alsoposted.map( u=>(<Box key={u.id} marginBottom={0.3} paddingLeft={1}><Uname url={`/journal/${u.uname}/${ymd}`} {...u}/></Box>) ) }

            { data?.alsoposted.length==20 && "... and some more."}
            { data?.alsoposted.length==0 && "... no one yet."}
          </>;

}