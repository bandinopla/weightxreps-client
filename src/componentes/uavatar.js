import React from 'react';
import Slvl from "./slvls";
import Avatar from '@material-ui/core/Avatar';



export const uid2avatarurl = (id,hash)=>{

    if( process.env.NODE_ENV=='development' )
    {
        return `https://weightxreps.net/useravatar/u_${ id }.jpg${hash?"?"+hash:""}`;
    } 

    return `/useravatar/u_${ id }.jpg${hash?"?"+hash:""}`;
}


export default function UAvatar({ uid, hash, slvl = 0, sactive=false, height, width, iconsScale=1, variant, className, cc })
{
    const noAvatar = (!hash || hash==="") ;
    const src       = noAvatar? cc && cc.toLowerCase()!=="xx"?"https://flagcdn.com/w160/"+cc.toLowerCase()+".png" : undefined : uid2avatarurl(uid, hash);
    const img       = `url( ${ src } )`; 

    if( variant=="circular")
    {
        return <Avatar src={src} className='sha'/>
    }

    return <div className={ (className || "") + " sha"} style={{position:"relative", display:"flex", justifyContent:"center", alignContent:"center", alignItems:"center", height, minWidth:50, width, backgroundImage: src? img : null, backgroundRepeat:"no-repeat", backgroundColor:"#ccc", backgroundSize:"cover", backgroundPosition:"center" }}>
                <Slvl level={slvl} isActive={sactive} scale={iconsScale}/> 
                {noAvatar && !src && <span className='pulse'>?</span>}
            </div>
}

export function UAvatarFromUserQL( { userQL, ...props } ) {

    return <UAvatar uid={userQL.id} hash={userQL.avatarhash} cc={userQL.cc} slvl={userQL.slvl} sactive={userQL.sok} {...props}/>

}

