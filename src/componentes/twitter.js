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

    //IDK why the embeded timeline doesn't work anymore... it is a twitter thing...
    useEffect(()=>{

        mounted.current = true;

        onTwitterReady(()=>{

            if( mounted.current ){ 
                  window.twttr.widgets.load( me.current ); 
            }
            

        });

        return ()=>{
            mounted.current = false;
        }

    },[]);

    return <div ref={me}>{children}</div>
}

export const LatestTweets = ()=>{ 
    return <XWidget>
        <a href="https://twitter.com/intent/tweet?button_hashtag=weight_x_reps&ref_src=twsrc%5Etfw" class="twitter-hashtag-button" data-show-count="false">Follow us on X @weight_x_reps</a>
    </XWidget>
} 

export const FollowOnX = ({ showName })=>{
    return <XWidget>
            <a className="twitter-follow-button"
                href="https://twitter.com/weight_x_reps"
                data-show-screen-name={ showName ?? "false" }
                data-size="large"
                >
                Follow @weight_x_reps
                </a>
    </XWidget>
}

