function happyNumbers(n) {
    let happyNums = [];
    
    // d1 + d2 == n, so d1 ranges from 1 to 9 (cannot start with 0)
    // and d2 ranges from 0 to 9, but d1 + d2 must equal n
    for (let d1 = 1; d1 <= 9; d1++) {
        let d2 = n - d1;
        
        // d2 must be a valid digit (0-9)
        if (d2 < 0 || d2 > 9) continue;
        
        // d3 + d4 == n, so d3 ranges from 0 to 9
        // and d4 ranges from 0 to 9, but d3 + d4 must equal n
        for (let d3 = 0; d3 <= 9; d3++) {
            let d4 = n - d3;
            
            // d4 must be a valid digit (0-9)
            if (d4 < 0 || d4 > 9) continue;
            
            // Form the 4-digit number
            let number = '' + d1 + d2 + d3 + d4;
            happyNums.push(number);
        }
    }
    
    return happyNums.join(' ');
}

// Example usage
console.log(happyNumbers(3));
console.log(happyNumbers(4));
