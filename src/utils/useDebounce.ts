import { debounce } from '@material-ui/core';
import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number):[T, (newValue:T)=>void] {

    const valRef = useRef(0);
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup the timeout if value or delay changes
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    const debounce = (value:T)=>{
        clearTimeout(valRef.current);

        //@ts-ignore
        valRef.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay)
    }

    return [ debouncedValue, debounce ];
}