function findBalanceIndex(arr) {
    // Input validation
    if (arr === null || arr === undefined) {
        console.error('Error: Input cannot be null or undefined');
        console.log('no');
        return;
    }
    
    if (!Array.isArray(arr)) {
        console.error('Error: Input must be an array');
        console.log('no');
        return;
    }
    
    if (arr.length === 0) {
        console.log('no');
        return;
    }
    
    // Validate all elements are numbers
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'number' || isNaN(arr[i])) {
            console.error(`Error: Element at index ${i} is not a valid number`);
            console.log('no');
            return;
        }
    }
    
    // Calculate total sum
    let totalSum = 0;
    for (let i = 0; i < arr.length; i++) {
        totalSum += arr[i];
    }
    
    // Find balancer element
    let leftSum = 0;
    for (let i = 0; i < arr.length; i++) {
        let rightSum = totalSum - leftSum - arr[i];
        
        if (leftSum === rightSum) {
            console.log(i);
            return;
        }
        
        leftSum += arr[i];
    }
    
    // No balancer element found
    console.log('no');
}

findBalanceIndex([1, 2, 3, 3]);
// Output: 2

findBalanceIndex([1, 2]);
// Output: no

findBalanceIndex([1]);
// Output: 0

findBalanceIndex([1, 2, 3]);
// Output: no

findBalanceIndex([10, 5, 5, 99, 3, 4, 2, 5, 1, 1, 4]);
// Output: 3
