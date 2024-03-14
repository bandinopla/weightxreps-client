const conversionFactors = {
    'cm': 1,
    'm': 100,
    'km': 100000,
    'in': 2.54,
    'ft': 30.48,
    'yd': 91.44,
    'mi': 160934.4
};

export function toCentimeters(length, unit) {  

    // // Check if the value exceeds the maximum allowed for DECIMAL(10,2) in MySQL
    // const maxDecimalValue = 999999.99; // Maximum allowed value for DECIMAL(10,2)
    // if (centimeters > maxDecimalValue) {
    //     throw new Error('Converted value exceeds the maximum allowed value for DECIMAL(10,2) in MySQL.');
    // }

    return length * conversionFactors[unit];
}

export function cmToOriginalUnit(centimeters, unit) {
    return centimeters / conversionFactors[unit];
}