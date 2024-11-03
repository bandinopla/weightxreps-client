
import OriginalSwipeableDrawer from '@material-ui/core/SwipeableDrawer';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const SwipeableDrawer = ({ children, ...props}) => {

    return <> 
            <div className={ "sidebar-handle sha "+props.anchor } >
                 
            </div>

            <OriginalSwipeableDrawer
                disableBackdropTransition={!iOS} 
                disableDiscovery={iOS} 
                swipeAreaWidth={40}
                hysteresis={.1} 
                {...props}
            >{children}</OriginalSwipeableDrawer>
            </>
}