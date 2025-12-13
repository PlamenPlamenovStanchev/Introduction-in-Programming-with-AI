function biggerFigure(width, height, radius) {
  // Calculate rectangle area
  const rectangleArea = width * height;
  
  // Calculate circle area
  const circleArea = Math.PI * radius * radius;
  
  // Determine which figure is bigger
  if (rectangleArea > circleArea) {
    return `Rectangle is bigger: ${rectangleArea.toFixed(2)} cm2`;
  } else {
    return `Circle is bigger: ${circleArea.toFixed(2)} cm2`;
  }
}

// Test cases
console.log(biggerFigure(10, 20, 3));  // Rectangle is bigger: 200.00 cm2
console.log(biggerFigure(10, 5, 10));  // Circle is bigger: 314.16 cm2
