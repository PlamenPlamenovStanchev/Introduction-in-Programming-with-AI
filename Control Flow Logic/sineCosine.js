function printDegreesCosineSine(start, end) {
    for (let degrees = start; degrees <= end; degrees++) {
        const radians = degrees * (Math.PI / 180);
        const cosine = Math.cos(radians).toFixed(4);
        const sine = Math.sin(radians).toFixed(4);
        console.log(`${degrees} degrees: cos = ${cosine}, sin = ${sine}`);
    }
}

// Example usage
printDegreesCosineSine(45, 55);