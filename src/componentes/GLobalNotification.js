import { makeVar, useReactiveVar } from "@apollo/client";
import { Paper, Toolbar, withStyles } from "@material-ui/core";
import { useEffect } from "react";

 
const value = makeVar();

const MyPaper = withStyles({
    root: {
        background:"#0081C8", color:"white",
        textAlign:"center",
        padding:10,

        "& a": {
            color:"#ccc"
        }
    }, 
})(Paper)


export function GLobalNotification() {
 
    const text = useReactiveVar(value);

    useEffect( ()=>{

        fetch("/notif.txt", { cache:"no-cache" }).then( resp=>resp.text() )
                            .then( value )


    }, [] );

    if( !text ) {
        return null;
    }

    return <MyPaper dangerouslySetInnerHTML={{__html: text}} square> 
    </MyPaper>
}
 