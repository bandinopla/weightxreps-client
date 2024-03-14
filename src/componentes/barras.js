import flags_img_src from "./barras.png";
import "./barras.css";
import FireIcon from "../codemirror/fire.png";
import { CanvasBar } from "./barra-canvas";

function BarraOld({ weight, reps }) {

    var n = Math.round( (weight - 20) / 2.5 );

    if( weight>500 )
    {
        return <><img src={FireIcon} style={{maxWidth:12}}/> <strong>A LOT</strong> <img src={FireIcon}style={{maxWidth:12}}/></>;
    }

    return <i className={"bar i"+n} style={{ backgroundImage:"url("+flags_img_src+")", opacity:weight<20?0.5:1 }}>
        { reps && <b style={{backgroundColor:"rgba(0,0,0,0.5)", color:"white", padding:4}}>x{reps}</b>}</i>
}  
 

export default function Barra({ weight, reps }) { 

    return <CanvasBar weight={weight} reps={reps} FallbackTo={BarraOld} > 
    </CanvasBar>
}