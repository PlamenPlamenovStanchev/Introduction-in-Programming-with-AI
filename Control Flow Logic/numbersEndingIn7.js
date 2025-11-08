function numbersEndingIn7(n) {
    let output = '';
    for (let i = 7; i <= n; i += 10) {
        output += i + '\n';
    }
    return output.trim();
}

// Example usage
console.log(numbersEndingIn7(30));
console.log(numbersEndingIn7(50));
console.log(numbersEndingIn7(70));
