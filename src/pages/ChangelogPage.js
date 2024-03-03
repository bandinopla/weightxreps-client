import { Box, Divider, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { UnameRef } from "../componentes/uname";


const uname2Tag = txt => {
    let out = [""];
    let i = 0;

    while (i < txt.length) {
        let m = txt.substr(i).match(/^@([a-z0-9_]+)/i);

        if (m) {
            out.push(<UnameRef uid={m[1]} uname={m[1]}></UnameRef>);
            i += m[0].length;
        }
        else {

            if (typeof (out[out.length - 1]) != 'string') {
                out.push(txt[i]);
            }
            else {
                out[out.length - 1] += txt[i];
            }

            i++;
        }

    }

    return out;
}


export default function ChangelogPage() {

    const [content, setContent] = useState("...loading");

    useEffect(async () => {

        try {
            const resp = await fetch("/changelog.txt");
            const txt = await resp.text();
            setContent(uname2Tag(txt));
        }
        catch (e) {
            setContent("Failed to load the log for some reason...");
        }


    }, []);

    return <>
        <Box margin={2}>
            <Typography gutterBottom>
                This is where everything that is added, fixed or modified is writen down. Check this whenever you feel like knowing what is happening in the site!
            </Typography>

            <Typography>
                You can also take a look at the <a href="https://github.com/bandinopla/weightxreps-client/commits/main/" target="_blank">client commits</a> and <a href="https://github.com/bandinopla/weightxreps-server/commits/main/" target="_blank">server commits</a>
                <br /><br /></Typography>

            <Divider />
            <pre style={{ whiteSpace: "pre-wrap", marginTop: 30 }}>{content}</pre>
        </Box>



    </>
}