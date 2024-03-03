import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useGetSession, useReactiveSetting } from '../session/session-handler';
import { useReactiveVar } from '@apollo/client';

export const WeightUnitVisualPreference = ()=>{
    const user          = useGetSession();
    const convertUnits  = useReactiveSetting( user.userSettings?.convertDisplayUnits )
    const cval          = Number(convertUnits); // 0  1  2 
    const currentUseKg  = user.session?.user.usekg ?? true;
    const options       = ["ANY", currentUseKg?"KG":"LB", currentUseKg?"LB":"KG" ];

    const setNewPreference = (ev, newi)=>{
        user.userSettings?.convertDisplayUnits (newi);
    } 

    return (
        <ToggleButtonGroup
          value={cval}
          exclusive
          onChange={setNewPreference} 
        >
          { options.map( (o,i)=>(<ToggleButton key={i} value={i}>
            {o}
          </ToggleButton>))}

        </ToggleButtonGroup>
      );
}