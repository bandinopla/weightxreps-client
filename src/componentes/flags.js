import flags_img_src from "./flags.png";
import "./flags.css";


export default function({ cc }) {

    return <i className={"flag flag-"+ (cc?.toLowerCase()||"xx")} style={{ backgroundImage:"url("+flags_img_src+")" }}>{cc && cc.toLowerCase()!="xx"?"":"?"}</i>
}