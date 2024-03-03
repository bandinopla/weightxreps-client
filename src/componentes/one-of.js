import { Button, ButtonGroup, useMediaQuery, useTheme } from "@material-ui/core";
import { useState } from "react";

export const OneOf = ({ options, oref, disabled, initialValue }) => {
    const [i, seti] = useState(initialValue);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    //console.log( "ONE OF OPTIONS:", options, oref )
    oref.current = i;

    return <ButtonGroup disabled={disabled}
        style={{ marginTop: isSmallScreen ? 13 : 0 }}
        fullWidth={isSmallScreen}>
        {options.map((opt, j) => <Button key={j} variant={i == j ? "contained" : "outlined"} onClick={() => seti(j)}>{opt}</Button>)}
    </ButtonGroup>
}