// Metric/Length converter module
// Supports: mm, cm, m, km, inch, foot, yard, mile

// Conversion factors to meters (base unit)
const CONVERSION_TO_METERS = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.34
};

/**
 * Get array of supported metric units
 * @returns {string[]} Array of supported unit names
 */
export function unitsSupported() {
  return Object.keys(CONVERSION_TO_METERS).slice();
}

/**
 * Convert between metric/length units
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
  
  // Convert to meters first, then to target unit
  const valueInMeters = value * CONVERSION_TO_METERS[fromUnit];
  const convertedValue = valueInMeters / CONVERSION_TO_METERS[toUnit];
  
  return convertedValue;
}
