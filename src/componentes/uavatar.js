import React from 'react';
import Slvl from "./slvls";
import Avatar from '@material-ui/core/Avatar';
import { useUpdatedAvatarHash } from '../utils/useUpdatedAvatarHash';



export const uid2avatarurl = (id,hash)=>{

    if( process.env.NODE_ENV=='development' )
    {
        return `https://weightxreps.net/useravatar/u_${ id }.jpg${hash?"?"+hash:""}`;
    } 

    return `/useravatar/u_${ id }.jpg${hash?"?"+hash:""}`;
}


export default function UAvatar({ uid, hash, slvl = 0, sactive=false, height, width, iconsScale=1, variant, className })
{
    const newHash   = useUpdatedAvatarHash(uid);
    const src       = uid2avatarurl(uid, newHash || hash);
    const img       = `url( ${ src } )`; 

    if( variant=="circular")
    {
        return <Avatar src={src} />
    }

    return <div className={ (className || "") + " sha"} style={{position:"relative", height, minWidth:50, width, backgroundImage:img, backgroundRepeat:"no-repeat", backgroundColor:"#ccc", backgroundSize:"cover", backgroundPosition:"center" }}>
                <Slvl level={slvl} isActive={sactive} scale={iconsScale}/> 
            </div>
}

export function UAvatarFromUserQL( { userQL, ...props } ) {

    return <UAvatar uid={userQL.id} hash={userQL.avatarhash} slvl={userQL.slvl} sactive={userQL.sok} {...props}/>

}

