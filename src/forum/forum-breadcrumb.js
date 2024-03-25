import { useGetForumSectionsQuery } from "../data/generated---db-types-and-hooks";

import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs'; 
import { PageLayoutTitle } from "../componentes/ContentPageWrapper";
import { Link  } from "react-router-dom"; 
import { useMemo } from "react";
import { UnameRef } from "../componentes/uname";

export const ForumBreadcrumb = ({ slug })=>{
    const { data, loading, error } = useGetForumSectionsQuery();
    const forumName = useMemo(()=>{

        if( slug.indexOf("by--") == 0 )
        {
            const uname = slug.split("by--")[1];

            return <> posts by <UnameRef uid={uname} uname={uname}/></>;
        }

        if( data )
        {
            return data.getForumSections.find( f => f.slug == slug ).name;
        }
    }, [data])

    if(!data) return "";

    return <PageLayoutTitle>
                
                <Breadcrumbs separator="›">
                    <Link to="/forum">
                    <Typography variant="h4">Forum</Typography>
                    </Link>
                    <Link to={`/forum/${slug}`}>
                    <Typography variant="h4">{ forumName ?? "..." }</Typography>
                    </Link> 
                </Breadcrumbs> 
        </PageLayoutTitle>;
}