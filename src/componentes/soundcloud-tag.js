import { Box } from "@material-ui/core";
import { useEffect } from "react";

 
export const SoundCloudType = Symbol();

export const soundCloudMatcher = [
    {
        match:/^https:\/\/soundcloud\.com\/([^\/]+)\/([\w-]+)\S+/i,
        block: m => ({
            type: SoundCloudType,
            url: m[0]
        })
    }, 
]
//https://on.soundcloud.com/DhPVXVBqLBv1Rp8F7
export const SoundCloudEmbedder = ({ tag }) => {
 
    return <Box padding={3}>
    <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src={ `https://w.soundcloud.com/player/?url=${escape(tag.url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}></iframe>
    </Box>
}