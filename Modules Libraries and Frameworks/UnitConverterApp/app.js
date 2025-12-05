// Console-based Unit Converter Application
// Demonstrates the usage of the unified unit converter library

import convertUnits, { unitsSupported } from './unit-converter.js';

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                  UNIT CONVERTER APPLICATION                    ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Display all supported units
console.log('📋 All Supported Units:');
console.log('─'.repeat(64));
const allUnits = unitsSupported();
console.log(allUnits.join(', '));
console.log(`\nTotal supported units: ${allUnits.length}\n`);

// Metric/Length Conversions
console.log('🏗️  METRIC/LENGTH CONVERSIONS');
console.log('─'.repeat(64));

const metricConversions = [
  { value: 1, from: 'm', to: 'foot', description: '1 meter to feet' },
  { value: 5, from: 'km', to: 'mile', description: '5 kilometers to miles' },
  { value: 100, from: 'cm', to: 'inch', description: '100 centimeters to inches' },
  { value: 1, from: 'yard', to: 'm', description: '1 yard to meters' },
  { value: 10, from: 'mm', to: 'cm', description: '10 millimeters to centimeters' }
];

metricConversions.forEach(({ value, from, to, description }) => {
  const result = convertUnits(value, from, to);
  console.log(`${description.padEnd(45)} = ${result.toFixed(4)} ${to}`);
});

// Weight Conversions
console.log('\n⚖️  WEIGHT CONVERSIONS');
console.log('─'.repeat(64));

const weightConversions = [
  { value: 1, from: 'kg', to: 'lb', description: '1 kilogram to pounds' },
  { value: 500, from: 'g', to: 'oz', description: '500 grams to ounces' },
  { value: 1, from: 't', to: 'kg', description: '1 metric ton to kilograms' },
  { value: 100, from: 'mg', to: 'g', description: '100 milligrams to grams' },
  { value: 2.2, from: 'lb', to: 'kg', description: '2.2 pounds to kilograms' }
];

weightConversions.forEach(({ value, from, to, description }) => {
  const result = convertUnits(value, from, to);
  console.log(`${description.padEnd(45)} = ${result.toFixed(4)} ${to}`);
});

// Temperature Conversions
console.log('\n🌡️  TEMPERATURE CONVERSIONS');
console.log('─'.repeat(64));

const temperatureConversions = [
  { value: 0, from: 'cel', to: 'fah', description: '0°C to Fahrenheit' },
  { value: 32, from: 'fah', to: 'cel', description: '32°F to Celsius' },
  { value: 25, from: 'cel', to: 'kel', description: '25°C to Kelvin' },
  { value: 273.15, from: 'kel', to: 'cel', description: '273.15 K to Celsius' },
  { value: 98.6, from: 'fah', to: 'cel', description: '98.6°F (body temp) to Celsius' }
];

temperatureConversions.forEach(({ value, from, to, description }) => {
  const result = convertUnits(value, from, to);
  console.log(`${description.padEnd(45)} = ${result.toFixed(2)} ${to}`);
});

// Error Handling Demonstration
console.log('\n⚠️  ERROR HANDLING');
console.log('─'.repeat(64));

// Test 1: Invalid unit
try {
  convertUnits(10, 'meter', 'm');
} catch (error) {
  console.log(`❌ Invalid unit: ${error.message}`);
}

// Test 2: Cross-category conversion (should fail)
try {
  convertUnits(10, 'm', 'kg');
} catch (error) {
  console.log(`❌ Cross-category conversion: ${error.message}`);
}

// Test 3: Another invalid unit
try {
  convertUnits(100, 'g', 'fahrenheit');
} catch (error) {
  console.log(`❌ Invalid unit: ${error.message}`);
}

console.log('\n' + '═'.repeat(64));
console.log('✅ Unit Converter Application Completed Successfully!');
console.log('═'.repeat(64) + '\n');
