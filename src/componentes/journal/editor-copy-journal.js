import { makeVar, useReactiveVar } from "@apollo/client";
import { Button, ButtonGroup, Typography } from "@material-ui/core";
import { useContext, useEffect, useMemo } from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { AsciiSpinner } from "../ascii-spinner";
import Calendario from "../calendario";
import { JDayContext } from '../journal/jday-context';
import { JOwnerContext } from '../../pages/journal-context';
import { dateToYMD } from "../../utils/utils";
import { useGetSession } from "../../session/session-handler";
import { useGetJEditorDataLazyQuery } from "../../data/generated---db-types-and-hooks";
import { Alert } from "@material-ui/lab";
import { parseError } from "../../data/db";
import CloseIcon from '@material-ui/icons/Close';

const $openModal = makeVar(false);
 

export const LoadCopyOfWorkoutModal = ({ openState }) => {
 
 
    return (
        <Dialog fullScreen open={ openState[0] }>
          <DialogContent style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}> 
            <ModalContents onClose={ ()=>openState[1](false) }/>
          </DialogContent>
        </Dialog>
      );
}; 

function ModalContents({ onClose }) {

    const jdayContext = useContext(JDayContext);
    const session = useGetSession();
    const [ getEditorData, { data, error, loading, variables } ] = useGetJEditorDataLazyQuery({
        notifyOnNetworkStatusChange: true
    });

    const editorYMD = useMemo( ()=>jdayContext?.ymd ?? dateToYMD(new Date()),[ jdayContext ])

    //return <AsciiSpinner label={"Initializing, please wait..."}/>

    useEffect(()=>{

        if( data?.jeditor )
        { 
            //data.jeditor.did[0].on = editorYMD; 
           // create a new custom event
            const jeditorDataEvent = new CustomEvent('jeditor:data', {
                detail: {
                    jeditor: {
                        ...data.jeditor,
                        did: data.jeditor.did.map( what=>{
                            if( what.on ) {
                                return {
                                    ...what,
                                    on: editorYMD
                                }
                            }
                            return what;
                        } )
                    }
                }
            });
             
            setTimeout( ()=>window.dispatchEvent(jeditorDataEvent), 0 );
    
            close(); 
        }

    }, [data]);

    const close = ()=>onClose();

    const gotoYMD = function (ymd, hasData){
        if( hasData )
        { 
            getEditorData({
                variables: {
                    ymd
                } 
            });
        }
    } 
 
    if( error )
        return <Alert severity="error" onClose={ close }>{ parseError(error)}</Alert>

    if( loading || data )
        return <>
                <Typography variant="h4" gutterBottom><AsciiSpinner label={`Loading as template...`}/></Typography>
                <Typography variant="subtitle2" gutterBottom> Will use <strong>{variables.ymd}</strong> as template for day <strong>{editorYMD}</strong>...`</Typography>
        </>;
        

    

    return <JOwnerContext.Provider value={{ id:session.session?.user?.id }}> 
                <Typography variant="subtitle2" gutterBottom>Use another log as a template</Typography> 
                <Typography variant="h2">Copy from...</Typography> 
                
                <Calendario ymd={ editorYMD } widthInWeeks={5} onClickDay={gotoYMD}/>
                <br/>
                <ButtonGroup>
                <Button variant="outlined" disabled={loading} onClick={close} startIcon={<CloseIcon/>}>Cancel</Button>
                <Button variant="contained" color="primary" disabled>
                    <AsciiSpinner label={ loading? "Loading log..." : "Waiting your selection..."}/>
                </Button>
                </ButtonGroup>
            </JOwnerContext.Provider>
}


export default LoadCopyOfWorkoutModal;