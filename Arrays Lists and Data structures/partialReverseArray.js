function partialReverseArray(n, arr) {
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
    
    // Extract first n elements and reverse them
    let partial = arr.slice(0, n).reverse();
    
    // Print as space-separated string
    console.log(partial.join(' '));
}

partialReverseArray(3, [10, 20, 30, 40, 50]);
// Output: 30 20 10

partialReverseArray(4, [-1, 20, 99, 5]);
// Output: 5 99 20 -1

partialReverseArray(2, ["one", "two", 3, 4, 5]);
// Output: two one
