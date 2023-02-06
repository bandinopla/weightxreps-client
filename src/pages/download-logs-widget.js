import { Alert } from "@material-ui/lab";
import GetAppIcon from '@material-ui/icons/GetApp';
import { ActionButton } from "../componentes/action-button";
import { useDownloadLogsLazyQuery } from "../data/generated---db-types-and-hooks";
import { dateToYMD } from "../utils/utils";
import ErrorSnackbar from "../componentes/ErrorSnackbar";
import { useEffect } from "react";
import OperationBackdrop from "../componentes/backdrop";


export const DownloadWidget = ({ user })=>{

    const [ download, { data, error, loading } ] = useDownloadLogsLazyQuery({ fetchPolicy:"network-only" });


    useEffect( async ()=>{

        if(!data?.downloadLogs ) return;

        const {convertJEditorData2Text} = await import(/* webpackChunkName: "jeditor2" */'../componentes/journal/editor');
        var c = document.createElement("a");
        c.download = "my-logs-up-to--"+ dateToYMD( new Date() ) +".txt"; 
        var text    = convertJEditorData2Text( data.downloadLogs.did, user.usekg );

        var t = new Blob([ text ], { type: "text/plain" });
        c.href = window.URL.createObjectURL(t);
        c.click();

    }, [data] );



    if( !user?.id>0 )
    {
        return null;
    }

    const execDownload = ()=> {

        download() 
 
    }



    return <div>
        {/* !user.sok && <><Alert severity="warning">Yaaou must be an <strong>active supporter</strong> to unlock this feature.</Alert><br/></> */}
 
        <ErrorSnackbar trigger={error}/>
        <OperationBackdrop open={loading}/>

        <ActionButton disabled={false} startIcon={<GetAppIcon/>} execAction={execDownload} variant="outlined">Download my logs (*.txt)</ActionButton>
<br/><br/>
        <Alert severity="info">This will trigger an automatic download. Some browsers might block it (usually you will see an icon somewhere on the sides of the address bar showing an X or something like that indication a block), check on your blocker settings in case nothing happens when you click download.</Alert>
    </div>
}