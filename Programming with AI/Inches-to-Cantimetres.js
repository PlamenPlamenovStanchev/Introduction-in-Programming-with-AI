function inchesToCentimeters(inches) {
    // Convert inches to centimeters, with rounding to 2 decimal digits
    const centimeters = inches * 2.54;
    return Math.round(centimeters * 100) / 100;
}

// Example usage
console.log(inchesToCentimeters(10));   // 25.4
console.log(inchesToCentimeters(5.5));  // 13.97
console.log(inchesToCentimeters(1));    // 2.54