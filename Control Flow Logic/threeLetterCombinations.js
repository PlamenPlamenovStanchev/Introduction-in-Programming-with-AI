function threeLettersCombinations(s, e, x) {
    let combinations = [];
    let count = 0;
    
    // Generate all 3-letter combinations
    for (let i = s.charCodeAt(0); i <= e.charCodeAt(0); i++) {
        let first = String.fromCharCode(i);
        
        // Skip excluded letter
        if (first === x) continue;
        
        for (let j = s.charCodeAt(0); j <= e.charCodeAt(0); j++) {
            let second = String.fromCharCode(j);
            
            // Skip excluded letter
            if (second === x) continue;
            
            for (let k = s.charCodeAt(0); k <= e.charCodeAt(0); k++) {
                let third = String.fromCharCode(k);
                
                // Skip excluded letter
                if (third === x) continue;
                
                combinations.push(first + second + third);
                count++;
            }
        }
    }
    
    // Return total count and combinations
    return `Total count: ${count}\n${combinations.join(' ')}`;
}

// Example usage
console.log(threeLettersCombinations('a', 'c', 'b'));
console.log(threeLettersCombinations('p', 't', 'q'));
