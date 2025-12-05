// Example usage of the Unit Converter library
// This file demonstrates how to use each converter module

import metricConverter, { unitsSupported as metricUnitsSupported } from './metric-converter.js';
import weightConverter, { unitsSupported as weightUnitsSupported } from './weight-converter.js';
import temperatureConverter, { unitsSupported as temperatureUnitsSupported } from './temperature-converter.js';

console.log('=== UNIT CONVERTER LIBRARY EXAMPLES ===\n');

// Metric/Length Converter Examples
console.log('--- Metric/Length Conversions ---');
console.log(`Supported units: ${metricUnitsSupported().join(', ')}\n`);

console.log('1 meter to feet:', metricConverter(1, 'm', 'foot'));
console.log('5 kilometers to miles:', metricConverter(5, 'km', 'mile'));
console.log('100 centimeters to inches:', metricConverter(100, 'cm', 'inch'));
console.log('1 yard to meters:', metricConverter(1, 'yard', 'm'));

// Weight Converter Examples
console.log('\n--- Weight Conversions ---');
console.log(`Supported units: ${weightUnitsSupported().join(', ')}\n`);

console.log('1 kilogram to pounds:', weightConverter(1, 'kg', 'lb'));
console.log('500 grams to ounces:', weightConverter(500, 'g', 'oz'));
console.log('1 metric ton to kilograms:', weightConverter(1, 't', 'kg'));
console.log('100 milligrams to grams:', weightConverter(100, 'mg', 'g'));

// Temperature Converter Examples
console.log('\n--- Temperature Conversions ---');
console.log(`Supported units: ${temperatureUnitsSupported().join(', ')}\n`);

console.log('0°C to Fahrenheit:', temperatureConverter(0, 'cel', 'fah'));
console.log('32°F to Celsius:', temperatureConverter(32, 'fah', 'cel'));
console.log('25°C to Kelvin:', temperatureConverter(25, 'cel', 'kel'));
console.log('273.15 K to Celsius:', temperatureConverter(273.15, 'kel', 'cel'));

// Error handling example
console.log('\n--- Error Handling Example ---');
try {
  metricConverter(10, 'meter', 'm');
} catch (error) {
  console.log('Error caught:', error.message);
}
