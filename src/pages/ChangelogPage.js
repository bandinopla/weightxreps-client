import { Box, Divider, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { UnameRef } from "../componentes/uname";
import TermsPageBase from "../layout/TermsPageBase";


/*
{
    title:"",
    text:""
}
*/
const data = [
    {
        title:"Acceptance of Terms",
        text:`<WXR> welcomes you. We invite you to access and use our online services (the “Services”), which are made available to you through a variety of platforms, including https://weightxreps.net (the “Website”) and through our mobile app, which is accessible through tablets, cell phones, personal digital assistants, connected televisions, and other devices (the “App”). The Website and the App are collectively referred to as the “Platform.”
        <br/>
        We are under no obligation to accept any individual as a Registered User, and may accept or reject any Registered User in our sole and complete discretion.
        
        `
    }, 
]

const uname2Tag = txt => {
    let out = [""];
    let i=0;

    while( i<txt.length )
    {
        let m = txt.substr(i).match(/^@([a-z0-9_]+)/i);

        if( m )
        {
            out.push(<UnameRef uid={m[1]} uname={m[1]}></UnameRef>);
            i += m[0].length;
        }
        else 
        {
            
            if( typeof(out[out.length-1])!='string' )
            {
                out.push( txt[i] );
            }
            else 
            {
                out[ out.length-1 ]+= txt[i];
            }

            i++;
        }

    }

    return out;
}


export default function ChangelogPage() {

    const [content, setContent] = useState("...loading");

    useEffect(async ()=>{

        try
        {
            const resp = await fetch("/changelog.txt");
            const txt = await resp.text();
            setContent( uname2Tag(txt) );
        }
        catch(e)
        {
            setContent("Failed to load the log for some reason...");
        }
        

    }, []);

    return <TermsPageBase> 
                    <Box margin={2}>
                        <Typography variant="h3" variantMapping={{h3:"h1"}} gutterBottom>Changelog</Typography>
                        <br/> 
                        <Typography>
                            This is where everything that is added, fixed or modified is writen down. Check this whenever you feel like knowing what is happening in the site!
                        </Typography>
                    </Box> 

                    <Divider/>
                    <pre style={{whiteSpace:"pre-wrap", marginTop:30}}>{ content }</pre>
                     
                </TermsPageBase>
}