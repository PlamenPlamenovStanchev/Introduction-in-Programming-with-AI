function sumDigits(num) {
    let sum = 0;
    num = Math.abs(num);
    while (num > 0) {
        sum += num % 10;
        num = Math.floor(num / 10);
    }
    return sum;
}

// Example usage
console.log(sumDigits(1712)); // 11
console.log(sumDigits(985625)); // 35
