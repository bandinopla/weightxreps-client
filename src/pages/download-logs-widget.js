import { Alert } from "@material-ui/lab";
import { useDownloadLogsLazyQuery } from "../data/generated---db-types-and-hooks";
import { useContext, useEffect, useMemo, useState } from "react";
import { ActiveSettingContext } from "../componentes/setting-div";
import { Box, Button, ButtonGroup, Paper } from "@material-ui/core";
import { DownloadToDropbox } from "../componentes/download-to-dropbox";
import { NetworkStatus } from "@apollo/client";
import { AsciiSpinner } from "../componentes/ascii-spinner";
import { dateToYMD } from "../utils/utils";
import { useGetSession } from "../session/session-handler";
import RefreshIcon from '@material-ui/icons/Refresh';
import { DownloadToGDrive } from "../componentes/download-to-gdrive";

 

export const DownloadWidget = ({ user })=>{

    const [ download, { data, error, loading, refetch, networkStatus  } ] = useDownloadLogsLazyQuery({ fetchPolicy:"network-only", notifyOnNetworkStatusChange:true });
    const openThisSettingUI = useContext(ActiveSettingContext);
    const [tab, setTab] = useState(0);
    const isLoading = loading || networkStatus==NetworkStatus.refetch;

    

    const logs = useMemo(()=>{ 

        if( !data?.downloadLogs ) return;    

        return async ()=>{
 
            const {convertJEditorData2Text} = await import(/* webpackChunkName: "jeditor2" */'../componentes/journal/editor'); 
            
            return convertJEditorData2Text( data.downloadLogs.did, user.usekg, data.downloadLogs.utags ); 
        }

    }, [data]) ;
 

    const focusOn = (n, callDownload)=>{ 

        openThisSettingUI();
        setTab(n);
        
        if( callDownload )
        {
            download();
        }
    }

    const close = ()=>focusOn(0); 


    if( !user?.id>0 )
    {
        return null;
    }
 
 

    if( error ) 
    { 
        return <Alert action={
                <Button color="inherit" size="small" onClick={()=>refetch()}>
                RETRY
                </Button>
            } severity="error">
            {error.message || "Unexpected error"} {networkStatus}
            </Alert>;
    }


    return <div> 

        { tab==0 && 
        <ButtonGroup color="primary">
            <Button onClick={()=>setTab(1)}><img src={process.env.PUBLIC_URL + '/txt.webp'} alt="Text File Icon"/>To Text File</Button>
            <Button onClick={()=>setTab(2)}><img src={process.env.PUBLIC_URL + '/dropbox.webp'} alt="Dropbox Icon"/>To DropBox</Button>
            <Button onClick={()=>setTab(3)}><img src={process.env.PUBLIC_URL + '/gdrive.webp'} alt="Google Drive Icon"/> To Google Drive</Button>
        </ButtonGroup> }

        
        
            <Box display={isLoading || tab==0?'none':'block'} >
                <Paper> 
                    <Box padding={1}>
                        <Box display={tab==1?'block':'none'}>  
                            <DownloadToTXT isFocused={tab==1} close={close} txt={logs} requestTxt={download} /> 
                        </Box> 

                        <Box display={tab==2?'block':'none'}>  
                            <DownloadToDropbox selfFocus={(start)=>focusOn(2, start)} txt={logs} isFocused={tab==2} close={close}/> 
                        </Box> 

                        <Box display={tab==3?'block':'none'}>  
                            <DownloadToGDrive selfFocus={(start)=>focusOn(3, start)} txt={logs} isFocused={tab==3} close={close}/> 
                        </Box> 
 
                    </Box>
                </Paper> 
            </Box>

            {isLoading && <Box padding={1}><AsciiSpinner label={"Downloading logs..."} /></Box>} 
 
    </div>
}





const DownloadToTXT = ({ isFocused, requestTxt, txt, close }) => { 

    const {session}             = useGetSession();  

    useEffect(()=>{

        if( isFocused )
        { 
            if( !txt )
            { 
                requestTxt();
            } 
            else 
            {
                triggerDownload();
            }
        }

    }, [txt, isFocused]);

    const triggerDownload = ()=>{
        txt().then( data => {

            var c = document.createElement("a");
                c.download = session.user.uname+"--logs-up-to--"+ dateToYMD( new Date() ) +".txt";  

                var t = new Blob([ data ], { type: "text/plain" });
                c.href = window.URL.createObjectURL(t);
                c.click(); 

        });
    } 

    return <>
            
            <Alert severity="info">This will trigger an automatic download. Some browsers might block it (usually you will see an icon somewhere on the sides of the address bar showing an X or something like that indication a block), check on your blocker settings in case nothing happens when you click download.</Alert>
            
            <ButtonGroup variant="outlined">
                <Button startIcon={<RefreshIcon/>} variant="contained" onClick={triggerDownload}>Retry</Button>
                <Button onClick={close}>Close</Button>
            </ButtonGroup>
        </>
}