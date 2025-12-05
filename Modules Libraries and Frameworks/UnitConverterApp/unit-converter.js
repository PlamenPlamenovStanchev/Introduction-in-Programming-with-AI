// Unified unit converter module
// Combines metric, weight, and temperature converters

import metricConverter, { unitsSupported as metricUnitsSupported } from './metric-converter.js';
import weightConverter, { unitsSupported as weightUnitsSupported } from './weight-converter.js';
import temperatureConverter, { unitsSupported as temperatureUnitsSupported } from './temperature-converter.js';

// Map of all supported units to their converter functions
const unitConverterMap = {
  // Metric/Length units
  mm: metricConverter,
  cm: metricConverter,
  m: metricConverter,
  km: metricConverter,
  inch: metricConverter,
  foot: metricConverter,
  yard: metricConverter,
  mile: metricConverter,
  
  // Weight units
  mg: weightConverter,
  g: weightConverter,
  kg: weightConverter,
  t: weightConverter,
  lb: weightConverter,
  oz: weightConverter,
  
  // Temperature units
  cel: temperatureConverter,
  fah: temperatureConverter,
  kel: temperatureConverter
};

/**
 * Get array of all supported units combined from all converters
 * @returns {string[]} Array of all supported unit names (copy)
 */
export function unitsSupported() {
  const allUnits = [
    ...metricUnitsSupported(),
    ...weightUnitsSupported(),
    ...temperatureUnitsSupported()
  ];
  return allUnits;
}

/**
 * Convert between any supported units
 * Automatically detects which converter to use based on the units
 * @param {number} value - The value to convert
 * @param {string} fromUnit - The unit to convert from
 * @param {string} toUnit - The unit to convert to
 * @returns {number} The converted value
 * @throws {Error} If either unit is not supported or if units are from different categories
 */
export default function convertUnits(value, fromUnit, toUnit) {
  const allSupportedUnits = unitsSupported();
  
  // Check if fromUnit is supported
  if (!allSupportedUnits.includes(fromUnit)) {
    throw new Error(`Unit '${fromUnit}' is not supported. Supported units: ${allSupportedUnits.join(', ')}`);
  }
  
  // Check if toUnit is supported
  if (!allSupportedUnits.includes(toUnit)) {
    throw new Error(`Unit '${toUnit}' is not supported. Supported units: ${allSupportedUnits.join(', ')}`);
  }
  
  // Get the converter function for the fromUnit
  const converter = unitConverterMap[fromUnit];
  
  // Verify that toUnit is supported by the same converter
  // (cannot convert between different unit categories)
  try {
    return converter(value, fromUnit, toUnit);
  } catch (error) {
    // If the converter throws an error, it might be because toUnit is from a different category
    if (error.message.includes('is not supported')) {
      throw new Error(`Cannot convert between '${fromUnit}' and '${toUnit}'. They belong to different unit categories.`);
    }
    throw error;
  }
}
