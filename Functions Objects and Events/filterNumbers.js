function filterNumbers(...nums) {
    // Predicate: sum of digits equals 10
    let sumOfDigitsIs10 = (num) => {
        const digits = Math.abs(num)
            .toString()
            .split('')
            .map(Number);
        return digits.reduce((sum, digit) => sum + digit, 0) === 10;
    };

    // Predicate: contains digit 5
    let containsDigit5 = (num) => {
        return Math.abs(num).toString().includes('5');
    };

    // Predicate: has at least 3 digits
    let hasAtLeast3Digits = (num) => {
        return Math.abs(num).toString().length >= 3;
    };

    // Combined predicate: all conditions must be true
    let combinedFilters = (num) => 
        sumOfDigitsIs10(num) && containsDigit5(num) && hasAtLeast3Digits(num);

    // Filter and print matching numbers
    for (let num of nums) {
        if (combinedFilters(num)) {
            console.log(num);
        }
    }
}

// 
console.log(filterNumbers(253, 75, -415, 198, 532, 38));