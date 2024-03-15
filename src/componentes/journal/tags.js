import { Box, Chip, Tooltip } from "@material-ui/core";
import { UTagValue } from "../../user-tags/UTagValue";
import { TYPE } from "./jparser";
import { TAG_PREFIX } from "../../user-tags/data-types"; 
 

export const JournalTagValue = ({ value:utagValue, utag })=>{

    if( !utag || utagValue==undefined ) //<-- probably a broken reference to a deleted tag
    {
        return "";
    }  

    const Icon = utagValue.$type.icon;
   
  
        return <Box marginTop={1} marginBottom={1}>
                <Tooltip title={ `( ${ utagValue.$type.dataTypeDesc } ) ${utagValue.$type.description}` }>
                <Chip 
                    label={ <> {utag.name} : <div style={{display:"inline", verticalAlign:"middle", color:"blue", fontWeight:"bold"}}>{ utagValue.toView() }</div></> } 
                    variant="outlined"
                    style={{ background:"white", maxWidth:"100%", fontSize:"1.3em"}}
                    color="primary"
                    icon={<Icon style={{color:"#666"}}/>}
                    size="large"
                    className="sha"
                />
                </Tooltip>
                </Box> ;
}



 

export const TagTokenMatcher = ( userTags, utagsValues ) => { 
     
    let values = utagsValues?.slice(0)
                            .map( tval=>new UTagValue(tval) );  




    return { 
            match:/^UTAG:(\d+)\s*/, 
            block: m=>{

                    const tval = values?.find( tval=>tval.id==m[1] );
        
                    return {    type      : TYPE.TAG, // token type
                                utag    : tval? userTags.find(utag=>utag.id==tval.tagid) : null,
                                value   : tval
                            } 
                }
            }
}

export const jEditorTagTokenToString = ({ tagid, type, value }, utags) => {

    const utag = utags.find(t=>t.id==tagid);
    const tagValue = new UTagValue({ type, value });

    // GraphQL Tag type
    return `${ TAG_PREFIX } ${ utag.name }: ${ tagValue.toEditor() }`;

}


export const UTagsPolicy = { 
} 