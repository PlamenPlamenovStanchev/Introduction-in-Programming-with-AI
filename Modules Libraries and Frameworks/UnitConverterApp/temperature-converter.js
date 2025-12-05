// Temperature converter module
// Supports: cel (Celsius), fah (Fahrenheit), kel (Kelvin)

const SUPPORTED_UNITS = ['cel', 'fah', 'kel'];

/**
 * Get array of supported temperature units
 * @returns {string[]} Array of supported unit names
 */
export function unitsSupported() {
  return SUPPORTED_UNITS.slice();
}

/**
 * Convert between temperature units
 * @param {number} value - The value to convert
 * @param {string} fromUnit - The unit to convert from
 * @param {string} toUnit - The unit to convert to
 * @returns {number} The converted value
 * @throws {Error} If the unit is not supported
 */
export default function convertUnits(value, fromUnit, toUnit) {
  const supportedUnits = unitsSupported();
  
  if (!supportedUnits.includes(fromUnit)) {
    throw new Error(`Unit '${fromUnit}' is not supported. Supported units: ${supportedUnits.join(', ')}`);
  }
  
  if (!supportedUnits.includes(toUnit)) {
    throw new Error(`Unit '${toUnit}' is not supported. Supported units: ${supportedUnits.join(', ')}`);
  }
  
  // If converting to the same unit, return the value as-is
  if (fromUnit === toUnit) {
    return value;
  }
  
  // Convert to Celsius first (intermediate unit)
  let valueInCelsius;
  
  switch (fromUnit) {
    case 'cel':
      valueInCelsius = value;
      break;
    case 'fah':
      valueInCelsius = (value - 32) * 5 / 9;
      break;
    case 'kel':
      valueInCelsius = value - 273.15;
      break;
    default:
      throw new Error(`Unit '${fromUnit}' is not supported.`);
  }
  
  // Convert from Celsius to target unit
  let convertedValue;
  
  switch (toUnit) {
    case 'cel':
      convertedValue = valueInCelsius;
      break;
    case 'fah':
      convertedValue = valueInCelsius * 9 / 5 + 32;
      break;
    case 'kel':
      convertedValue = valueInCelsius + 273.15;
      break;
    default:
      throw new Error(`Unit '${toUnit}' is not supported.`);
  }
  
  return convertedValue;
}
