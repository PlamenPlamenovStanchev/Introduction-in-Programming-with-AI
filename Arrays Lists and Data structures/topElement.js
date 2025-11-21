function extractTopElements(arr) {
    // Input validation
    if (arr === null || arr === undefined) {
        console.error('Error: Input cannot be null or undefined');
        return [];
    }
    
    if (!Array.isArray(arr)) {
        console.error('Error: Input must be an array');
        return [];
    }
    
    if (arr.length === 0) {
        return [];
    }
    
    // Validate all elements are numbers
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'number' || isNaN(arr[i])) {
            console.error(`Error: Element at index ${i} is not a valid number`);
            return [];
        }
    }
    
    let topElements = [];
    let maxRight = -Infinity;
    
    // Iterate from right to left
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] > maxRight) {
            topElements.push(arr[i]);
            maxRight = arr[i];
        }
    }
    
    // Sort in ascending order and return
    return topElements.sort((a, b) => a - b);
}

console.log(extractTopElements([1, 4, 3, 2]));
// Output: [ 2, 3, 4 ]

console.log(extractTopElements([14, 24, 3, 19, 15, 17]));
// Output: [ 17, 19, 24 ]

console.log(extractTopElements([41, 41, 34, 20]));
// Output: [ 20, 34, 41 ]

console.log(extractTopElements([27, 19, 42, 2, 13, 45, 48]));
// Output: [ 48 ]
