import { IconButton, Input, InputAdornment } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useState } from "react";




export const PasswordInput = (props)=>{
    const [show, setShow]           = useState(false);

    return <Input 
                type={ show ? 'text' : 'password'}  
                {...props}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton 
                        onClick={()=>setShow(!show)} 
                    >
                    { show ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
                }
            />
}