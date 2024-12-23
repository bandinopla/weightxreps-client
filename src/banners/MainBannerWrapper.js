import { useEffect, useState } from "react";

export const MainBannerWrapper = ({ children })=> {
    const [img, setImg] = useState();
    const [href, setHref] = useState();

    useEffect(()=>{

        window.onBanners?.push( (info, isValid)=>{
            if( isValid( info.mainFixed ) )
            {
                setImg( info.mainFixed.src )
                setHref( info.mainFixed.href )
            }
        })

    }, []);

    if( img ) {
        return <a href={href} target="_blank"><img className="sha" fetchpriority="high" src={img} style={{ maxWidth: "100%", maxHeight:283, transform:"" }} /></a>
    }

    return children;
}