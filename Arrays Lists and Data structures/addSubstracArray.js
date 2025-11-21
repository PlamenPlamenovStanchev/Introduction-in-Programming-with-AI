function addSubtractArray(arr) {
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
    
    // Validate all elements are numbers
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'number' || isNaN(arr[i])) {
            console.error(`Error: Element at index ${i} is not a valid number`);
            return;
        }
    }
    
    let sumOriginal = 0;
    let sumModified = 0;
    let modified = [];

    for (let i = 0; i < arr.length; i++) {
        sumOriginal += arr[i];
        
        if (arr[i] % 2 === 0) {
            // Even number: add index
            modified[i] = arr[i] + i;
        } else {
            // Odd number: subtract index
            modified[i] = arr[i] - i;
        }
        
        sumModified += modified[i];
    }

    console.log(modified);
    console.log('Sum original: ' + sumOriginal);
    console.log('Sum modified: ' + sumModified);
}

addSubtractArray([5, 15, 23, 56, 35]);
// Output:
// [ 5, 14, 21, 59, 31 ]
// Sum original: 134
// Sum modified: 130

addSubtractArray([-5, 11, 3, 0, 2, 4]);
// Output:
// [ -5, 10, 1, 3, 6, 9 ]
// Sum original: 15
// Sum modified: 24
