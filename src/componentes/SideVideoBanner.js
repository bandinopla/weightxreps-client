
import { 
  useLocation
} from "react-router-dom";

export const SideVideoBanner = ()=>{
  const location = useLocation();
  if( location.pathname=="/") return "";
    return  <div style={{ position:"relative", width:"100%", paddingBottom:"177.78%" }}>
            <iframe title="banner" src="https://www.youtube.com/embed/HVW5AjECvV8?autoplay=1&controls=0&loop=1&mute=1&playlist=HVW5AjECvV8" 
              style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" }}
              frameborder="0" 
              allow="autoplay; loop; muted">
            </iframe>
          </div>
} 