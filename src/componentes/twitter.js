//<a class="twitter-timeline" href="https://twitter.com/weight_x_reps?ref_src=twsrc%5Etfw">Tweets by weight_x_reps</a>  

import { useEffect, useRef } from "react";

function onTwitterReady( f )
{
    window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
          t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
      
        t._e = [];
        t.ready = function(f) {
          t._e.push(f);
        };
      
        return t;
      }(document, "script", "twitter-wjs"));

      window.twttr.ready( f );
} 

const XWidget = ({ children })=>{

    const me = useRef();
    const mounted = useRef(false);

    useEffect(()=>{

        mounted.current = true;

        onTwitterReady(()=>{

            if( mounted.current )
                window.twttr.widgets.load( me.current );

        });

        return ()=>{
            mounted.current = false;
        }

    },[]);

    return <div ref={me}>{children}</div>
}

export const LatestTweets = ()=>{ 
    return <XWidget>
        <a className="twitter-timeline" data-tweet-limit="3" href="https://twitter.com/weight_x_reps?ref_src=twsrc%5Etfw">Loading latest tweets...</a>  
    </XWidget>
}

export const FollowOnX = ()=>{
    return <XWidget>
            <a className="twitter-follow-button"
                href="https://twitter.com/weight_x_reps"
                data-show-screen-name="false"
                data-size="large"
                >
                Follow @weight_x_reps
                </a>
    </XWidget>
}

