import {
    gql
} from "@apollo/client";
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Ucard from '../../componentes/ucard';
import { useReactiveVar } from '@apollo/client';
import { useHistory } from "react-router-dom";
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import EventIcon from '@material-ui/icons/Event';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Button, ButtonGroup, Typography } from "@material-ui/core";
import { NotificationsBadge } from "../inbox-manager";
import Hidden from '@material-ui/core/Hidden';
import { useSubmenuListener } from "../../componentes/boton-con-submenu";


// user: es un objeto que vino del server...
export const UserSessionSubmenu = ({ user, userSettings, logout })=>{

    const history = useHistory();
    const wunit = (opposite)=>user.usekg==opposite? "KG" : "LB";
    const userRoot = "/journal/"+user.uname;
 
    const close = useSubmenuListener();

    const execLogout = ()=>{
        logout();
        close();
    }

    return <div style={{width:300, padding:"0px 8px"}}>
                <Ucard data={{user}} minimal>
 
                    <List style={{padding:0}}> 
                        <Divider />
                        <ListItem> 
                            {/* <ListItemText primary={ <span>Display <b>{wunit(0)}</b> as <b>{wunit(1)}</b></span>} />
                            <ListItemSecondaryAction>
                                <UnitConverterSwitch reactVar={ userSettings.convertDisplayUnits }/>
                            </ListItemSecondaryAction> */}
                             
                            <UnitConverterSwitch reactVar={ userSettings.convertDisplayUnits } currentUseKg={user.usekg}/>
                        </ListItem>
                        <Divider />

                        <Hidden mdUp>
                            <ListItem button> 
                                <ListItemIcon>
                                    <NotificationsBadge>
                                        <NotificationsIcon/>
                                    </NotificationsBadge>
                                </ListItemIcon>
                                <ListItemText>Inbox</ListItemText>
                            </ListItem>
                            <Divider />
                        </Hidden>

                        {/*<ListItem disabled>
                            <ListItemIcon><DashboardIcon/></ListItemIcon>
                            <ListItemText>Dashboard (soon...)</ListItemText>
                        </ListItem>*/}
                        <ListItem button onClick={ ()=>history.push(userRoot) || close() }>
                            <ListItemIcon><EventIcon/></ListItemIcon>
                            <ListItemText>My Journal</ListItemText>
                        </ListItem>
                        <ListItem button onClick={ ()=>history.push("/following") || close() }>
                            <ListItemIcon><BookmarksIcon/></ListItemIcon>
                            <ListItemText>Following</ListItemText>
                        </ListItem>
                        <ListItem button onClick={ ()=>history.push("/settings") || close() }>
                            <ListItemIcon><SettingsIcon/></ListItemIcon>
                            <ListItemText>Settings</ListItemText>
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={ execLogout }>
                            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </ListItem>
                    </List>

                </Ucard>
                </div>;
}


const CURRENT_UNIT_DISPLAY_SETTING = gql`
    query CurrentUnitsValue {
        getCurrentDisplayUnitSetting @client #boolean...
    }
`;

// const UnitConverterSwitch = ({ reactVar })=> {
//     const convertUnits = useReactiveVar( reactVar );

//     //reactVar es el setting....
 

//     return <Switch
//                 edge="end"
//                 onChange={()=>reactVar( !convertUnits ) }
//                 checked={ convertUnits } 
//             />;
// }


/**
 * 0: no convertion
 * 1: to user's unit
 * 2: to user's opposite unit 
 */
const UnitConverterSwitch = ({ reactVar, currentUseKg })=> {
    const convertUnits = useReactiveVar( reactVar );
    const cval = Number(convertUnits); // 0  1  2

    //reactVar es el setting....
    const options = ["ANY", currentUseKg?"KG":"LB", currentUseKg?"LB":"KG" ];
 

    return <ListItemText>
                <Typography variant="caption" gutterBottom>Display units as...</Typography>
                    <div>
                        <ButtonGroup fullWidth> 
                            { options.map( (type, i)=><Button key={i} onClick={ ()=>reactVar(i) } variant={i==cval?"contained":"outlined"} color={i==cval?"primary":"default"}>{type}</Button> ) }
                        </ButtonGroup>
                    </div>
            </ListItemText>;
}