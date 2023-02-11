import { Button, TextField, Typography } from "@material-ui/core";
import { useRef } from "react";
import { updateUserCachedData } from "../cache/clean-cache";
import { useSetSettingMutation } from "../data/generated---db-types-and-hooks"; 
import { OpenConfirmModal } from "./Dialog";
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import { useGetSession } from "../session/session-handler";

export const SocialLinks = ({ user, urls }) => {

    const {session}       = useGetSession();
    const inputRef      = useRef()   
    const faviconUrl    = url=>`https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`//url.replace(/(^.*\.com)\/.*/,"$1/favicon.ico")
    const [setSetting]  = useSetSettingMutation()
    const isMine        = session?.user.id==user.id;

    const openMyEditor = ()=>{

        //
        // Open the social media link editor...
        //
        OpenConfirmModal({
            title:"Social Media Links",
            info:<div>
                <Typography>Copy and Paste below the url to your social medias, one per line:</Typography>
                <TextField 
                    label="Paste one link per line below..."
                    placeholder="The URL of your social media profiles"
                    helperText="To delete, just leave it blank and hit save."
                    defaultValue={urls.join("\n")}
                    fullWidth
                    multiline
                    inputRef={inputRef}
                /></div>,
            open:true,

            //
            // send new value to server...
            //
            onConfirm: async ()=>{ 
 
                await setSetting({
                    variables: {
                        id      : "socialmedia",
                        value   : inputRef.current.value
                    },
    
                    update: (cache, {data:{setSetting}})=>{ 
                        updateUserCachedData(cache, session.user.id, { socialLinks:setSetting.links })
                    }
                })
                // onUpdateCache={ (cache, {data:{setSetting}})=>updateUserCachedData(cache, currentUser.id, { cc:setSetting.cc }) } 
            },

            canCancel: true, 
            verb:"Save changes",
            fullWidth:true
        })
    }

    if( !isMine && !urls.length ) {
        return null;
    }

    return <div> 

                <div style={{ display:"flex", borderTop:"1px dotted #ccc", justifyContent:"center", flexWrap:"wrap" }}>
                    { urls.map(url=><a style={{ margin:5 }} href={url} target="_blank">
                        <img src={faviconUrl(url)} style={{ width:30}}/>
                    </a> )}
                </div>
                { isMine && <div>
                    
                    <Button fullWidth variant="outlined" onClick={openMyEditor} startIcon={<LinkOutlinedIcon/>}>Social Media Links</Button>
                    </div>}
        </div>
}