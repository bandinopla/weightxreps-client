import { UAvatarFromUserQL } from "../../../componentes/uavatar";
 
export default function ({ user }) { return (<UAvatarFromUserQL userQL={user} width={50} height={50} iconsScale={0.8}/>) };