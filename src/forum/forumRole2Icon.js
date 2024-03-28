
import MODEATOR_ICON from '@material-ui/icons/GavelOutlined'; 
import NOTER_ICON from '@material-ui/icons/AssistantPhotoOutlined';
import ADMIN_ICON from '@material-ui/icons/SupervisorAccountOutlined';

const role2icon = {
    ADMIN: ADMIN_ICON,
    MODERATOR: MODEATOR_ICON,
    NOTER: NOTER_ICON
}
export const forumRole2Icon = (role, iconProps) => {
    var Icon = role2icon[role];
    if( Icon )
    {
        return <Icon {...iconProps}/>
    }
    return;
}