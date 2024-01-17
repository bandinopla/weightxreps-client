import { useEffect, useState } from "react"; 
import { Dropbox } from "dropbox";
import { AsciiSpinner } from "./ascii-spinner";
import { useGetSession } from "../session/session-handler";
import Alert from '@material-ui/lab/Alert';

const CLIENT_ID = 'g2a1ufuwx67ivex';

const getAuthenticationUrl = async () => {
    var dbx = new Dropbox({ clientId: CLIENT_ID });
        return dbx.auth.getAuthenticationUrl( window.location.origin+window.location.pathname, "dropbox" ) ;
}

const readAccessToken = ()=> {

    const regex = /access_token=([^&]+).*state=dropbox/;
    let m; 
    if ((m = regex.exec( window.location.hash )) !== null) {
        return m[1];
    }
}

const sendToDropbox = async (accessToken, filename, contents)=>{
 
    var dbx = new Dropbox({ accessToken });
    let op = await dbx.filesUpload({path: '/'+filename, contents, mode:"overwrite" });

    if( op.status==200 )
    {
        return op.result.path_display;
    }
    else 
    {
        throw new Error( op.result.error_summary );
    } 
}

export const DownloadToDropbox = ({selfFocus, txt, isFocused, close})=>{
     
    const {session}             = useGetSession();  
    const [error, setError]     = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData]       = useState(); 
    const [sent, setSent]       = useState();
    let token                   = readAccessToken();
 
    useEffect(()=>{

        if( token && !isFocused )
        {
            selfFocus(false);
        } 

    },[]); 

    const onClose = ()=>{
        setSent(null); 
        close();
    }
    

    if( loading )
    {  
        if( data===true && txt )
        {
            setLoading(false);
        }

        return <AsciiSpinner label={data===true?"Packing your logs...":loading}/>
    } 

    if( sent === false )
    {
        return <Alert severity="error" onClose={onClose}>{error}</Alert> ;
    }

    if( sent )
    {
        return <Alert onClose={onClose}>Logs uploaded to your dropbox folder named "weightxreps.net{sent}"</Alert> ;
    }

    if( isFocused )
    {    
        if( token )
        { 
            if( txt )
            {  
                setData( 
                            txt().then( 
                                logsAsText=> sendToDropbox(token, session.user.uname+"--logs.txt", logsAsText)
                            ) 

                            .then( path=>{
                                        setSent(path); 
                                    }, e=>{
                                        setSent(false);
                                        setError(e.message); 
                                    }) 

                            .finally(()=>{
                                setLoading(false); 
                                setData(null)
                            })
                        );

                setLoading("Sending to dropbox...");
            }
            else 
            {
                setData(true); //<--- flag to indicate we are waiting for the logs
                setLoading("Downloading your logs...");
                selfFocus(true); 
            } 
             
        }
        else 
        {
            // pedir token
            setLoading("Connecting to your Dropbox...");

            getAuthenticationUrl() 
                .then( url=>window.open(url,"_self") );
        }
    } 

    return null; 
};