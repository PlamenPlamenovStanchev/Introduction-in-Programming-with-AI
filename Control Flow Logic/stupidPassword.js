function stupidPasswords(n) {
    let passwords = [];
    
    // First part: even numbers from 2 to n
    for (let even = 2; even <= n; even += 2) {
        // Second part: odd numbers from 1 to n
        for (let odd = 1; odd <= n; odd += 2) {
            // Third part: product of even and odd
            let product = even * odd;
            // Combine all three parts
            let password = '' + even + odd + product;
            passwords.push(password);
        }
    }
    
    return passwords.join(' ');
}

// Example usage
console.log(stupidPasswords(5));
console.log(stupidPasswords(6));
console.log(stupidPasswords(11));
