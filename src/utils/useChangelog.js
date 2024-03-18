import { useEffect, useState } from "react";

var changeLogText;

export const useChangelog = ()=>{

    const [changelog, setContent] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(async () => {

        try {
            if( !changeLogText )
            {
                changeLogText = fetch("/changelog.txt").then( resp=>resp.text());
            } 

            const txt = await changeLogText;

            setLoading(false);
            setContent(txt);
        }
        catch (e) {
            setError("Failed to load the log for some reason...");
        } 

    }, []);

    return {
        changelog, error, loading
    }

}