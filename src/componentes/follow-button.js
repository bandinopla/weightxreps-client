import { Grid, Typography } from "@material-ui/core";
import { useContext, useMemo } from "react";
import { useFollowMutation, useGetFollowInfoQuery } from "../data/generated---db-types-and-hooks";
import { JOwnerContext } from "../pages/journal-context";
import { useGetSession } from "../session/session-handler";

import "./follow-button.css";
import { AsciiSpinner } from "./ascii-spinner";
import { Alert } from "@material-ui/lab";
import { parseError } from "../data/db";
import { ActionButton } from "./action-button";
import { OpenConfirmModal } from "./Dialog";
import UAvatar from "./uavatar";
import UnameTag from "./uname";
import ErrorSnackbar from "./ErrorSnackbar";


export const FollowButton = ()=>{
    const user      = useGetSession();
    const jowner    = useContext( JOwnerContext );
    const canFollow = user.session && (jowner.id != user.session.user.id);

    const { data, loading, error, refetch } = useGetFollowInfoQuery({
        variables: {
            uid: jowner.id
        }
    });

    const isFollowing = useMemo(()=>data?.getFollowers?.some(u=>u.id==user.session?.user.id),[data, user.session]);

    const [follow, { error:execError }]    = useFollowMutation();

    const execFollow = async ()=>{

        try {  
            var { data, errors } = await follow({
                variables: {
                    uid: jowner.id,
                    not: isFollowing
                }
            }); 
        }
        catch(err) { 
            return;
        }

        if( data?.follow )
        { 
            await refetch();
        } 
    }

    const showUsers = followers => ev => {
        ev.preventDefault();

        const list = (followers? data.getFollowers : data.getFollowing );

        OpenConfirmModal({
            title: <><UnameTag {...jowner} inline style={{marginLeft:10}}/> {followers?"is followed by:":"is following:"}</>
            , open:true
            , fullWidth:true
            , info: <Grid container spacing={1}>
                { list.map( user=>
                    (<Grid item key={user.id} xs={12} md={6} style={{ display:"flex", alignItems:"center"}}>
                        <UAvatar uid={user.id} cc={user.cc} hash={user.avatarhash} variant="circular" /> &nbsp;<UnameTag {...user} style={{marginLeft:10}}/>
                    </Grid>)) 
                }
                { list.length==0 && <Grid item xs={12}><Alert severity="info">{followers?"No followers":"No following"} yet...</Alert></Grid> }
            </Grid>
            , verb:"close"
            , canCancel: false
            , onConfirm: ()=>{
                //foo
            }
        });
    }

    if( loading )
    {
        return <AsciiSpinner label={"Loading followers..."}/>
    }

    if(error )
    {
        return <Alert severity="error">{parseError(error)}</Alert>
    }

    return <Typography className="oneline" variant="body2">

            <ErrorSnackbar trigger={ execError?.message } horizontal="center" vertical="bottom"/>

            <a href="#" onClick={showUsers(false)}>
            <strong >{data?.getFollowing?.length}</strong> Following
            </a>

            <a href="#" onClick={showUsers(true)}>
                <strong style={{marginLeft:10}}>{data?.getFollowers?.length}</strong> Followers
            </a>
            {canFollow && <ActionButton className={"FollowButton"+(isFollowing?" unfollow":"")} style={{marginLeft:20}} execAction={execFollow}>
                { isFollowing?"Unfollow":"Follow"}
            </ActionButton>}
            

            </Typography>
    ;
}

// export const FollowButton22 = ()=>{

//     const jowner                    = useContext( JOwnerContext );
//     const {session}                   = useGetSession();
//     const canFollow                 = jowner.id != session?.user?.id;
//     const { data, loading, error }  = useGetFollowersQuery({
//         variables: {
//             of  : jowner.id,
//             has : session?.user?.id
//         }
//     }); 

//     const [follow, {client}]    = useFollowMutation();
//     const [busy, setBusy]       = useState(false);

//     const toggleFollow = ()=>{

//         if( !canFollow || !session || !data || busy) return;

//         const currentCount = data.getFollowersCount.total;
//         const startFollowing = !data.getFollowersCount.has;

//         setBusy(true);

//         follow({
//             variables: {
//                 uid: jowner.id,
//                 not: !startFollowing
//             },

//             update: (cache, { data:{ follow:opSuccess }} )=> {

//                 if( opSuccess )
//                 {
//                     client.writeQuery({
//                         query: GetFollowersDocument,
//                         data: {
//                             getFollowersCount: {
//                                 __typename:"FollowersCount",
//                                 has: startFollowing,
//                                 total: currentCount + (startFollowing? 1 : -1)
//                             }
//                         },
//                         variables: {
//                             of: jowner.id,
//                             has : session?.user?.id
//                         }
//                     })
//                 }

//             }
//         })

//         .finally( ()=>setBusy(false) );

//     }

//      //
//         return <>
//             <Button disabled={loading || busy || !canFollow} onClick={toggleFollow} className={"FollowButton "+((!canFollow || data?.getFollowersCount.has) && "unfollow")} variant="contained" >
//                 { loading || busy? <CircularProgress size={25}/> : data.getFollowersCount.has? "Unfollow" : "Follow" }
//             </Button> <ButtonCountLabel value={ loading ? "..." : data?.getFollowersCount.total || 0}/>
//         </>;
// }


// const ButtonCountLabel = ({ value })=>{
//     return <span className="FollowBtnCounter">{value}</span>;
// }