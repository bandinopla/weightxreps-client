import { Tooltip, Typography, useTheme } from "@material-ui/core";
import { tagTypeDesc2Description } from "./data-types";

function TagTypeChip({ type }) {

    const theme = useTheme();
    const tooltip = tagTypeDesc2Description(type);
    return <Tooltip title={tooltip} ><Typography variant="caption" style={{ ...theme.dataCell, padding:"2px 5px"}}>{type}</Typography></Tooltip>;
}

export default TagTypeChip;