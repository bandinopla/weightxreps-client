
import OriginalSwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Drawer from '@material-ui/core/Drawer';

import { useEffect, useRef } from 'react';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
const radio = 30;

export const SwipeableDrawer = ({ children, ...props}) => {

    const handlebar = useRef();
 

    useEffect(()=>{

        let startX = -1;

        const handleMenuOpen = ev => {

            const x = ev.changedTouches?.[0].clientX ?? ev.touches[0].clientX;

            if( startX<0 ) {
                startX = x;
                return;
            }

            const didSwap = props.anchor=='left'? x>startX : x<startX; 

            if( didSwap )
            {
                const diff = Math.abs( startX - handlebar.current.getBoundingClientRect().x );

                if( diff<radio && iOS && !props.open ) props.onOpen();
            } 

            startX = -1;
         
        }

        window.addEventListener("touchstart", handleMenuOpen);
        window.addEventListener("touchend", handleMenuOpen);

        return ()=>{
            window.removeEventListener("touchstart", handleMenuOpen);
            window.removeEventListener("touchend", handleMenuOpen);
        }

    },[]);

    const onDetectClose = ev => { 

        if( iOS )
        {
            const diff = Math.abs( ev.clientX - handlebar.current.getBoundingClientRect().x );

            if( diff>radio ) props.onClose()
        }
        else 
        { 
            props.onClose()
        }
        
        
    }

    return <> 
            <div ref={handlebar} className={ "sidebar-handle sha "+props.anchor } >
                 
            </div>

            <OriginalSwipeableDrawer
                        disableBackdropTransition={!iOS} 
                        disableDiscovery={iOS} 
                        disableSwipeToOpen={iOS}
                        swipeAreaWidth={40}
                        hysteresis={.1} 
                        {...props}
                        onClose={ onDetectClose }
                    >{children}</OriginalSwipeableDrawer>

            
            </>
}