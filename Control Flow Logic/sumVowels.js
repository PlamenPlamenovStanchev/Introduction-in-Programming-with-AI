function sumVowels(str) {
    let sum = 0;
    const vowelValues = {
        'a': 1,
        'e': 2,
        'i': 3,
        'o': 4,
        'u': 5
    };
    
    for (let i = 0; i < str.length; i++) {
        const char = str[i].toLowerCase();
        if (vowelValues[char]) {
            sum += vowelValues[char];
        }
    }
    return sum;
}

// Example usage
console.log(sumVowels("Hello")); // 101 + 111 = 212
console.log(sumVowels("World")); // 111 = 111
console.log(sumVowels("AEIOU")); // 65 + 69 + 73 + 79 + 85 = 371
