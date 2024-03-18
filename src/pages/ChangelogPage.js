import { Box, Divider, LinearProgress, Typography } from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { UnameRef } from "../componentes/uname";
import { useChangelog } from "../utils/useChangelog";
import { Alert } from "@material-ui/lab";


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

    const { changelog, loading, error } = useChangelog(); 

    const content = useMemo(() => {

        if( changelog )
        {
            return uname2Tag(changelog);
        }
        
    }, [changelog])

    return <>
        <Box margin={2}>
            <Typography gutterBottom>
                This is where everything that is added, fixed or modified is writen down. Check this whenever you feel like knowing what is happening in the site!
            </Typography>

            <Typography>
                You can also take a look at the <a href="https://github.com/bandinopla/weightxreps-client/commits/main/" target="_blank">client commits</a> and <a href="https://github.com/bandinopla/weightxreps-server/commits/main/" target="_blank">server commits</a>
                <br /><br /></Typography>

            <Divider />
            { loading && <LinearProgress/>}
            { error && <Alert severity="error">{error}</Alert>}
            <pre style={{ whiteSpace: "pre-wrap", marginTop: 30 }}>{content}</pre>
        </Box>



    </>
}