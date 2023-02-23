import { JOwnerContext } from "../../pages/journal-context";
import {useContext} from 'react';
import WeightValue from "../../componentes/weight-value";

/**
 * Shows the value, which is assumed to be a bodyweight, using the default weight unit that the current jorunal owner uses.
 */
export function TagBW({ value }) {
    const jowner  = useContext (JOwnerContext);

    return <WeightValue value={ value } inkg={jowner.usekg}/>;
}