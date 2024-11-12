//import { makeStyles } from "@material-ui/styles"
//import { useRive, Layout, Fit, Alignment, EventType } from "@rive-app/react-canvas";
import Rive from '@rive-app/react-canvas';
//import { useEffect, useState } from "react";

// const useStyles = makeStyles({
//     root: {
//         background:"white",
//         display:"flex",
//         justifyContent:"center",
//         alignItems:"center",
//         zIndex:9999,
//         position:"fixed",
//         width:"100vw",
//         height:"100vh",
//         color:"white",
//         filter:"invert(1)"
//     }
// })
 

// export const SplashScreenIntro = ()=>{
//     const style = useStyles();
//     const [done, setDone] = useState(false);

//     const { rive, RiveComponent } = useRive({
//         src: "/wxr-logo.riv",
//         stateMachines: "State Machine 1",
//         autoplay: true, 
        
//     });

//     useEffect(()=>{

//         if( rive )
//         { 
//             const onAnimEnds = (event) => {
//                 setDone(true);
//             };

//             // Listen for when an animation ends
//             rive.on(EventType.RiveEvent, onAnimEnds);
//             return ()=>{
//                 rive.off(EventType.RiveEvent, onAnimEnds);
//             }
//         }

//     }, [rive]);

//     if( done ) return;

//     return <div className={ style.root }>
//        <RiveComponent 
//             style={{ width:200, height: 200}}
//         />
//     </div>
// }
export const AnimatedLogoIntro = ({ style })=>{
    return <Rive src="/wxr-logo.riv" stateMachines={"State Machine 1"} style={{ width:150, height: 150, filter:"invert(1)", ...style}}/>
}
 