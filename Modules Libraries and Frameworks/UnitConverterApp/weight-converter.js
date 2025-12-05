// Weight converter module
// Supports: mg, g, kg, t, lb, oz

// Conversion factors to grams (base unit)
const CONVERSION_TO_GRAMS = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  t: 1000000,
  lb: 453.592,
  oz: 28.3495
};

/**
 * Get array of supported weight units
 * @returns {string[]} Array of supported unit names
 */
export function unitsSupported() {
  return Object.keys(CONVERSION_TO_GRAMS).slice();
}

/**
 * Convert between weight units
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
  
  // Convert to grams first, then to target unit
  const valueInGrams = value * CONVERSION_TO_GRAMS[fromUnit];
  const convertedValue = valueInGrams / CONVERSION_TO_GRAMS[toUnit];
  
  return convertedValue;
}
