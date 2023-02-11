import { Button, CircularProgress } from "@material-ui/core"
import { useContext, useState } from "react";
import { GetFollowersDocument, useFollowMutation, useGetFollowersQuery } from "../data/generated---db-types-and-hooks";
import { JOwnerContext } from "../pages/journal-context";
import {  useGetSession } from "../session/session-handler";

import "./follow-button.css";




export const FollowButton = ()=>{

    const jowner                    = useContext( JOwnerContext );
    const {session}                   = useGetSession();
    const canFollow                 = jowner.id != session?.user?.id;
    const { data, loading, error }  = useGetFollowersQuery({
        variables: {
            of  : jowner.id,
            has : session?.user?.id
        }
    }); 

    const [follow, {client}]    = useFollowMutation();
    const [busy, setBusy]       = useState(false);

    const toggleFollow = ()=>{

        if( !canFollow || !session || !data || busy) return;

        const currentCount = data.getFollowersCount.total;
        const startFollowing = !data.getFollowersCount.has;

        setBusy(true);

        follow({
            variables: {
                uid: jowner.id,
                not: !startFollowing
            },

            update: (cache, { data:{ follow:opSuccess }} )=> {

                if( opSuccess )
                {
                    client.writeQuery({
                        query: GetFollowersDocument,
                        data: {
                            getFollowersCount: {
                                __typename:"FollowersCount",
                                has: startFollowing,
                                total: currentCount + (startFollowing? 1 : -1)
                            }
                        },
                        variables: {
                            of: jowner.id,
                            has : session?.user?.id
                        }
                    })
                }

            }
        })

        .finally( ()=>setBusy(false) );

    }

     //
        return <>
            <Button disabled={loading || busy || !canFollow} onClick={toggleFollow} className={"FollowButton "+((!canFollow || data?.getFollowersCount.has) && "unfollow")} variant="contained" >
                { loading || busy? <CircularProgress size={25}/> : data.getFollowersCount.has? "Unfollow" : "Follow" }
            </Button> <ButtonCountLabel value={ loading ? "..." : data?.getFollowersCount.total || 0}/>
        </>;
}


const ButtonCountLabel = ({ value })=>{
    return <span className="FollowBtnCounter">{value}</span>;
}