import { Button, Chip, Typography } from "@material-ui/core"
import { useGetForumRolesDescriptionQuery } from "../data/generated---db-types-and-hooks";
import { OpenConfirmModal } from "../componentes/Dialog";
import { forumRole2Icon } from "./forumRole2Icon";
import { Alert } from "@material-ui/lab";
import { openDMWindow } from "../session/ui/dms-window/dm-window";

export const ForumRoleChip = ({ role }) => {

    const { data } = useGetForumRolesDescriptionQuery();

    const explainToUser = ()=>{
        OpenConfirmModal({ open:true
            , title:"Forum Roles"
            , info: <div> 
                        Certain users are assigned with a role in the forum that grants them certain permission. These are the current available roles:

                        <ul>
                            {
                                data.getForumRolesDescription.map(r=><li key={r.key}>
                                    <Typography variant="subtitle1"><strong>{r.title} {forumRole2Icon(r.key, { fontSize:"small"})}</strong></Typography>
                                    <Typography variant="body1">{r.description}</Typography>
                                    
                                    </li>)
                            }
                        </ul>

                        <Alert severity="info" action={<Button variant="outlined" className="oneline" color="inherit" onClick={()=>openDMWindow({id:1, admin:true})}>DM admin</Button>}>Do you want to moderate or be a "community noter"? DM the admin and let's talk to make sure we are all on the same page!</Alert>
                    </div>
            , verb: "Ok, got it" 
            , canCancel: false
        }); 
    }

    if(!role || !data) return "";
    return <Chip onClick={()=>explainToUser()} label={ data.getForumRolesDescription.find(r=>r.key==role || r.title==role )?.title } size="small" />
}