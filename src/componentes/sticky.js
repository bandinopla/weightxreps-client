import { useLayoutEffect, useRef } from "react" 



/**
 * Wraps a content with known height to make it sticky.
 * If `siblingIsSticky` is present, it will take it's height into account.
 */
export const Sticky = ({ children, siblingIsSticky })=>{

    const ref   = useRef();
    const lastY = useRef(0);  
    const wheelInterval = useRef(); 
    const initialWidth = useRef();

    useLayoutEffect(()=>{   
  
        window.addEventListener('wheel', onScroll);
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onScroll); 

        return ()=>{
            window.removeEventListener('wheel', onScroll)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        };

    },[]);

    const onScroll = (ev, execWheelEvent)=>{  

        clearInterval(wheelInterval.current);

        if( ev instanceof WheelEvent)
        {
            if(!execWheelEvent)
            { 
                wheelInterval.current = setTimeout(onScroll, 10,ev, true);
                return;
            }
        }
 
        var rect = ref.current.getBoundingClientRect();
        var H = ref.current.offsetHeight + (siblingIsSticky? ref.current.nextSibling?.offsetHeight ?? 0 : 0);
        var VH = window.innerHeight;
        var s = ref.current.style;
        var sy = window.scrollY;
        var deltaY = (sy - lastY.current) ; //ev.deltaY
 

        if(!initialWidth.current)
        {
            initialWidth.current = rect.width;
        }
         
        if( execWheelEvent )
        {
            deltaY = ev.deltaY/2; 
        }

        var y = rect.top - deltaY;  


        if(H<VH) {
            y=0;
        }
        else if( y+H < VH )
        {
            y += VH - (y+H);
        }
        else if( y>0 )
        {
            y=0;
        }

        //y = Math.round(y)

        s.position="fixed";
        s.top = y + "px";
        s.alignSelf = "start"; 
        //s.width = initialWidth.current + "px";

        lastY.current = sy; 
    }

    return <div ref={ref}>{children}</div>;
}