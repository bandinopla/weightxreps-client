import { useEffect, useState } from "react";

export const useChangelog = ()=>{

    const [changelog, setContent] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(async () => {

        try {
            const resp = await fetch("/changelog.txt");
            const txt = await resp.text();
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