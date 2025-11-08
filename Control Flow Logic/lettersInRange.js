function lettersInRange(start, end) {
    let output = '';
    for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
        output += String.fromCharCode(i) + ' ';
    }
    return output.trim();
}

// Example usage
console.log(lettersInRange('a', 'c'));
console.log(lettersInRange('x', 'z'));
console.log(lettersInRange('A', 'C'));
