function partialReverseArrayUnshift(n, arr) {
    // Input validation
    if (arr === null || arr === undefined) {
        console.error('Error: Array cannot be null or undefined');
        return;
    }
    
    if (!Array.isArray(arr)) {
        console.error('Error: Second parameter must be an array');
        return;
    }
    
    if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
        console.error('Error: First parameter must be a non-negative integer');
        return;
    }
    
    if (n === 0) {
        console.log('');
        return;
    }
    
    // Build reversed array using unshift
    let reversed = [];
    for (let i = 0; i < n && i < arr.length; i++) {
        reversed.unshift(arr[i]);
    }
    
    // Print as space-separated string
    console.log(reversed.join(' '));
}

partialReverseArrayUnshift(3, [10, 20, 30, 40, 50]);
// Output: 30 20 10

partialReverseArrayUnshift(4, [-1, 20, 99, 5]);
// Output: 5 99 20 -1

partialReverseArrayUnshift(2, ["one", "two", 3, 4, 5]);
// Output: two one
