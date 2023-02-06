import WifiIcon from '@material-ui/icons/Wifi';
import LanguageIcon from '@material-ui/icons/Language';
export const MainMenu = [
    { lbl:"Explore!", linkto:"/" },
    { lbl:"Community Stats", linkto:"/community-stats", Icon:WifiIcon, ename:true },
    //{ lbl:"Videos", linkto:"/videos", Icon:VideoLibraryIcon,},
    { lbl:"SBD Rank", linkto:"/sbd-stats", Icon:LanguageIcon },
    { lbl:"Donate", linkto:"/donate" },
    { lbl:"F.A.Q.", linkto:"/faq" },
    { lbl:"About", linkto:"/about" },
];