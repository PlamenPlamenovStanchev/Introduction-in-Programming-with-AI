function figureArea(figure, dimension1, dimension2) {
    if (figure === "square") {
        const area = dimension1 * dimension1;
        return `square area = ${area.toFixed(2)}`;
    } else if (figure === "rectangle") {
        const area = dimension1 * dimension2;
        return `rectangle area = ${area.toFixed(2)}`;
    } else if (figure === "circle") {
        const area = Math.PI * dimension1 * dimension1;
        return `circle area = ${area.toFixed(2)}`;
    } else {
        return "Invalid figure!";
    }
}

// Example usage
console.log(figureArea("square", 5));                  // square area = 25.00
console.log(figureArea("rectangle", 2.5, 7.85));       // rectangle area = 19.63
console.log(figureArea("circle", 1.5));                // circle area = 7.07
console.log(figureArea("rhombus", 30, 50));            // Invalid figure!
