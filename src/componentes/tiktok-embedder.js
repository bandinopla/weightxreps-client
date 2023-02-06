//import React, { useEffect } from 'react';

const appendEmbedJS = ()=> {

    if( !window.tiktokEmbedLoader )
    { 
        var js          = document.createElement("script");
            js.async    = true;
            js.src      = "//www.tiktok.com/embed.js";
            document.body.appendChild(js); 
            window.tiktokEmbedLoader = js;
    }

};


export default function({ videoID, username }) {

    //useEffect( appendEmbedJS , []);

    let url = "https://www.tiktok.com/"+username+"/video/"+videoID; 
    //let url = "https://www.tiktok.com/embed/v2/"+videoID;
     
    return <a href={url} target="_blank">{url}</a>;

    /*
    return <blockquote class="tiktok-embed" 
                        cite={url} 
                        data-video-id={videoID}
                         style={{ maxWidth:605, minWidth:325 }}  >
                             <section>
                                 <a href={url} target="_blank">{url}</a> 
                             </section> 
                         </blockquote> ; */
    /*
    return <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@djmeunier/video/6986881291929128197" 
            data-video-id="6986881291929128197" 
            style={{ maxWidth:605, minWidth:325 }}  > 
                <section> 
                    <a target="_blank" title="@djmeunier" href="https://www.tiktok.com/@djmeunier">@djmeunier</a>   </section> 
                    </blockquote>  ;*/
};