function triangle(n) {
    let result = '';
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            result += '*';
        }
        result += '\n';
    }
    return result.trim();
}

// Example usage
console.log(triangle(3));
console.log(triangle(6));
