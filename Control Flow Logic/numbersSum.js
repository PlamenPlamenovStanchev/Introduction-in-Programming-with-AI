function numbersSum(num1) {
    //Write a function numbersSum(n) to return the sum of all numbers 1…n in the below format.
    let sum = 0;
    let output = '';    
    for (let i = 1; i <= num1; i++) {
        sum += i;
        if (i > 1) output += ' + ';
        output += i;    
    }
    return `${output} = ${sum}`;
}
// Example usage
console.log(numbersSum(3));
console.log(numbersSum(5));
console.log(numbersSum(7));
