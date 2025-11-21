function sortProducts(arr) {
    // Input validation
    if (arr === null || arr === undefined) {
        console.error('Error: Input cannot be null or undefined');
        return;
    }
    
    if (!Array.isArray(arr)) {
        console.error('Error: Input must be an array');
        return;
    }
    
    if (arr.length === 0) {
        console.error('Error: Array cannot be empty');
        return;
    }
    
    // Validate all elements are strings
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'string' || arr[i].trim() === '') {
            console.error(`Error: Element at index ${i} is not a valid non-empty string`);
            return;
        }
    }
    
    // Sort products alphabetically (case-insensitive)
    let sorted = arr.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    
    // Create and print numbered list
    let output = '';
    for (let i = 0; i < sorted.length; i++) {
        output += (i + 1) + '.' + sorted[i];
        if (i < sorted.length - 1) {
            output += '\n';
        }
    }
    
    console.log(output);
}

console.log(sortProducts(['Potatoes', 'Tomatoes', 'Onions', 'Apples']));
// Output:
// 1.Apples
// 2.Onions
// 3.Potatoes
// 4.Tomatoes