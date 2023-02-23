import { Tooltip, Typography } from "@material-ui/core";
import { tagTypeDesc2Description } from "./data-types";

function TagTypeChip({ type }) {
    const tooltip = tagTypeDesc2Description(type);
    return <Tooltip title={tooltip} ><Typography variant="caption" style={{background:"#FFFFED"}}>{type}</Typography></Tooltip>;
}

export default TagTypeChip;