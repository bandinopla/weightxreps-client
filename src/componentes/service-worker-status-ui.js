import { makeVar, useReactiveVar } from "@apollo/client"
import { SoftBox } from "./SoftBox"
import { AsciiSpinner } from "./ascii-spinner";
import StarIcon from '@material-ui/icons/Star';
export const ServiceWorkerStatus = makeVar("");


/**
 * The idea is to show the user a display when the service working is downloading new content and it's then ready to replace the current "old" worker.
 */
export const ServiceWorkerStatusDisplay = ()=>{

    const status = useReactiveVar(ServiceWorkerStatus);

    if( status=="installing-update" )
    {
        return <SoftBox title={<AsciiSpinner styles={{display:"inline"}} label={"Updating"}/>} style={{ border:"1px dashed #444"}}>
            Updating in the background...
        </SoftBox>
    }

    else if( status=="update-ready" )
    {
        return <SoftBox title="Update ready!" Icon={<StarIcon/>} extraClasses="fancy">
            The update is ready, you will see it the next time you open this app.
        </SoftBox>
    }   

    return "";
}