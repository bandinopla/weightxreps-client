import CodeMirror from "codemirror";
import "codemirror/mode/yaml/yaml.js";
import "codemirror/lib/codemirror.css";
import { useEffect, useRef, useState, useMemo, MouseEvent } from "react";
import { Alert } from "@material-ui/lab";
import * as YAML from 'js-yaml';
import { Button, ButtonGroup, makeStyles } from "@material-ui/core"; 
import { parseError } from "../data/db";
import { useDebounce } from "../utils/useDebounce";
import { DeveloperConfigSetting, DeveloperService, useSetSettingMutation } from "../data/generated---db-types-and-hooks";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import { MustBe } from "../utils/objectSchemaValidator";
import isValidUrl from "../utils/isValidUrl";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import RestoreIcon from '@material-ui/icons/Restore';
type Props = {  
    setting:DeveloperConfigSetting
} 

type Config = DeveloperConfigSetting["config"];

//
// shape of the config... used for validation.
//
let configSchema = MustBe.Object({
    services: MustBe.Array(0,5).of([
        MustBe.Object({
            id: MustBe.String(3,80),
            name:MustBe.String(3,80),
            redirectUris:MustBe.Array(1,4).of([ 
                MustBe.String(10,500).andPass(isValidUrl)
            ]),
            url:MustBe.String(10,500).andPass(isValidUrl)
        })
    ])
}); 

const useStyles = makeStyles(()=>({
    disabled: {
        opacity:0.5,
        pointerEvents:"none" 
    }
}))


/**
 * UI For the Developer Config setting
 */
export default function SettingDeveloperApi({ setting }:Props) {
    const classes       = useStyles();
    const txt           = useRef<HTMLTextAreaElement>(null);  
    const cmRef         = useRef<any>();
    const [hasModifications, setHasModifications] = useState(false);
    const [save, { error:saveError, loading:saving, data:saveResult, client:graphqlClient, reset:resetSaveOp }] = useSetSettingMutation();

    const mustConfirm = useMemo(()=>{

        let what = (saveResult?.setSetting as DeveloperConfigSetting)?.config.confirmChanges;
        if( what )
        {
            let pendingHash = what?.hash;
            let currentHash = setting.config.confirmChanges?.hash;
            console.log("HASH", pendingHash, currentHash)
            // we have a pending hash and that hash is not equal to the current hash...
            return !!pendingHash && (currentHash!=pendingHash) ? what : undefined;
        } 

    }, [saveResult, setting]);

    const [ok, setOk] = useState(false); 

    /**
     * The text that is being typed in the editor
     */
    const [ typedCfg, setTypedCfg ] = useDebounce<string>("",300);

    /**
     * As the user types the config, we parse it to get the config as an object.
     */
    const currentCfg = useMemo<Config|{error:string}>(()=>{

        var _cfg;

        try
        {
            _cfg = YAML.load(typedCfg) as Config; 

            let schemaErrors:string[] = [];

            //
            // shape of the config...
            //
            let configSchema = MustBe.Object({
                services: MustBe.Array(0,5).of([
                    MustBe.Object({
                        id: MustBe.String(3,80),
                        dbid: MustBe.String(1,10).optional,
                        name:MustBe.String(3,80),
                        redirectUris:MustBe.Array(1,4).of([ 
                            MustBe.String(10,500).andPass(isValidUrl)
                        ]),
                        url:MustBe.String(10,500).andPass(isValidUrl)
                    })
                ])
            }); 

            console.log(_cfg)

            if(!configSchema.validate("config", _cfg, err=>schemaErrors.push(err)))
            {
                throw new Error(schemaErrors.join("\n"));
            }

        }
        catch(e:any){
            return {error:e.message}
        }   

        return _cfg;

    },[typedCfg])
 

    // initialize the config text editor (codemirror)
    useEffect(()=>{

        if( txt.current )
        {
            //txt.current.value = YAML.dump({ test:123, caca:[1,2,3,{ pepe:"burro"}]})

            var myCodeMirror = CodeMirror.fromTextArea(txt.current!,{   
                mode: "yaml", 
                readOnly :false,
                foldGutter: true, 
                lineNumbers: true,  
                autocorrect:true
            });

            //@ts-ignore
            myCodeMirror.on("change", cm=>setTypedCfg(  cm.doc.getValue() ));

            cmRef.current = myCodeMirror;
    
            return ()=>{
                myCodeMirror.toTextArea(); 
                cmRef.current = null;
            }
        }
        

    },[txt.current]);
 
    //on server config arrives...
    useEffect(()=>{

        if( cmRef.current && setting.config )
        {     
            resetCurrentChanges();
        }

    },[setting, cmRef.current]);

    //detect if the config has changed
    useEffect(()=>{

        if( currentCfg?.hasOwnProperty("error") )
        {
            setHasModifications(true);
            return;
        }

        setHasModifications( configHasChanged( setting.config, currentCfg as Config ) );
 

    },[setting, currentCfg]);

    // disable editor if must confirm save state is active.
    useEffect(()=>{

        let disableEditor = mustConfirm || saving ;

        cmRef.current.setOption("readOnly", disableEditor? "nocursor" : false );
        let cl = cmRef.current.getWrapperElement().classList;

        if( disableEditor ) cl.add(classes.disabled);
        else cl.remove(classes.disabled);

    },[mustConfirm, saving, saveError]);


    //
    // send the modificated config to the server for saving...
    //
    const saveChanges = async ()=>{

        // siempre va a haber hash para confirmar. 
        // al guardar, se recibe la setting y asi como viene la updateamos en la cache, por lo que setting ahora debería tener los nuevos valores.....
 
        let payload = currentCfg as Config;

        if( mustConfirm )
        { 
            payload.confirmChanges = {
                hash: mustConfirm.hash
            };
        }

        save({
            variables: {
                id: setting.id,
                value: payload
            }, 
        }) 
        .then( resp=>{
            if( resp.data?.setSetting )
            {
                // update cache... 
                setOk(true);
            }
        })
        .catch(e=>{});
    }

    const resetCurrentChanges = (ev?:MouseEvent) =>{

        if(ev && !confirm("Discard all changes?")) return;

        let ignoreKeys = ["__typename","confirmChanges"]; //<-- we dont want to display this data it is irrelevant to the user.

        cmRef.current.setValue( YAML.dump(setting.config, { 
            schema:YAML.JSON_SCHEMA , 
            quotingType:"\"", 
            forceQuotes:true, 
            replacer:(key,value)=>ignoreKeys.includes(key)||value===null?undefined:value 
        } ) );
    }

    return <div> 

        {
            // SINTAX ERROR
            currentCfg && typeof currentCfg=='object' && "error" in currentCfg? <Accordion>
                                                        <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />} 
                                                        >
                                                        <Alert style={{ flex:1 }} severity="error">Syntax error! (click see details)</Alert>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Alert style={{ flex:1 }} severity="error" action={<Button color="primary" variant="outlined" disabled={saving} onClick={resetCurrentChanges}> RESET </Button>}><pre>{currentCfg.error}</pre></Alert>
                                                        </AccordionDetails>
                                                    </Accordion> 

            : 
            //SAVE OP ERROR
            saveError? <Alert severity="error" action={
                <Button color="primary" variant="outlined" onClick={()=>resetSaveOp()}>
                    CLOSE
                </Button>
            }><pre>An error just happened ↓<br/>
                { parseError(saveError) }</pre></Alert>
                                                    
            :
            // MUST CONFIRM SAVE ACTION?
            !!mustConfirm? <Alert severity="warning" action={ 
                    <ButtonGroup>
                        <Button color="primary" variant="outlined" disabled={saving} onClick={()=>resetSaveOp()}>
                            CANCEL
                        </Button>
                        <Button color="primary" variant="contained" disabled={saving} onClick={saveChanges}>
                            CONFIRM
                        </Button>
                    </ButtonGroup> 
            }>
                <div style={{wordBreak:"break-word"}}>↓ Confirm changes ↓
                    <br/><pre style={{whiteSpace:"pre-line"}}>{ mustConfirm.changelog ?? "weird..." }</pre>
                </div></Alert> 

            :
            // OK + SAVE NEEDED
            hasModifications ? <Alert severity="warning" action={<>
            <DocumentationButton/> &nbsp;
                <ButtonGroup> 
                    <Button color="primary" variant="outlined" disabled={saving} onClick={resetCurrentChanges} startIcon={<RestoreIcon/>}>
                        RESET
                    </Button>
                    <Button color="primary" variant="outlined" disabled={saving} onClick={saveChanges} startIcon={<SaveIcon/>}>
                        SAVE
                    </Button>
                </ButtonGroup>
                </>
            }>Config has unsaved changes</Alert>

            : 
            // NORMAL STATE
            <Alert severity="info" action={<DocumentationButton/>}>Below you can configure your developer config <a href="https://yaml.org/" target="_blank">yaml</a>:</Alert>
        } 

        <textarea ref={txt} autoFocus value={"hola"}></textarea> 
 
    </div>
} 


/**
 * We just care to know if it has changed, not the details of the change, the server will do that work on send... 
 * Check each possible property and se if the new is diferent than the original.
 */
const configHasChanged = ( original:Config, newconfig:Config ) => {
    if( !original || !newconfig ) return false;
      

    const serviceChanged = (s1:DeveloperService, s2?:DeveloperService) => {
        if( !s1 || !s2 ) return true;
        return (s1.id != s2.id) 
                || (s1.name!=s2.name) 
                || (s1.url!=s2.url) 
                || s1.redirectUris.some( url=>!s2.redirectUris.includes(url)) 
                || s2.redirectUris.some( url=>!s1.redirectUris.includes(url)) 
    }
 

    return (original.services?.length != newconfig.services?.length)
        || !!original.services?.some(s=>serviceChanged(s, newconfig.services?.find(z=>z.id==s.id)))
        || !!newconfig.services?.some(s=>serviceChanged(s, original.services?.find(z=>z.id==s.id)))
};

const DocumentationButton = ()=><Button startIcon={<LibraryBooksIcon/>} variant="outlined" onClick={()=>window.open("https://github.com/bandinopla/weightxreps-server/blob/main/docs/OAUTH.md","_blank")}>Docs</Button>