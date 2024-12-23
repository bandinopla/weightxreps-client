
import { 
  useLocation,
  useRouteMatch
} from "react-router-dom";
import { useGetSession } from "../session/session-handler";

export const SideVideoBanner = ()=>{
  const location = useLocation();
  const $session = useGetSession();
  let match = useRouteMatch("/journal/:username");

  //if( location.pathname=="/") return "";
  if( location.pathname=="/") {
    if( !$session.session ) return "";
  } 

  if( $session.session && match?.params?.username.toLowerCase()===$session.session.user.uname.toLowerCase()) return "";
  
    return  <div style={{ position:"relative", width:"100%", paddingBottom:"177.78%" }}>
            <iframe title="banner" src="https://www.youtube.com/embed/HVW5AjECvV8?autoplay=1&controls=0&loop=1&mute=1&playlist=HVW5AjECvV8" 
              style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" }}
              frameborder="0" 
              allow="autoplay; loop; muted">
            </iframe>
          </div>
} 