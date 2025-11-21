function sortProducts(arr, formatAsHTML = false) {
    // Input validation
    if (arr === null || arr === undefined) {
        console.error('Error: Input cannot be null or undefined');
        return;
    }
    
    if (!Array.isArray(arr)) {
        console.error('Error: Input must be an array');
        return;
    }
    
    if (arr.length === 0) {
        console.error('Error: Array cannot be empty');
        return;
    }
    
    // Validate all elements are strings
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'string' || arr[i].trim() === '') {
            console.error(`Error: Element at index ${i} is not a valid non-empty string`);
            return;
        }
    }
    
    // Validate formatAsHTML is boolean
    if (typeof formatAsHTML !== 'boolean') {
        console.error('Error: formatAsHTML parameter must be a boolean');
        return;
    }
    
    // Sort products alphabetically (case-insensitive)
    let sorted = arr.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    
    // Format output
    if (formatAsHTML) {
        // Generate HTML ordered list
        let htmlOutput = '<ol>\n';
        for (let i = 0; i < sorted.length; i++) {
            htmlOutput += `  <li>${sorted[i]}</li>`;
            if (i < sorted.length - 1) {
                htmlOutput += '\n';
            }
        }
        htmlOutput += '\n</ol>';
        return htmlOutput;
    } else {
        // Generate text output
        let textOutput = '';
        for (let i = 0; i < sorted.length; i++) {
            textOutput += (i + 1) + '.' + sorted[i];
            if (i < sorted.length - 1) {
                textOutput += '\n';
            }
        }
        return textOutput;
    }
}

// Test cases - Text format
console.log(sortProducts(['Potatoes', 'Tomatoes', 'Onions', 'Apples']));
// Output:
// 1.Apples
// 2.Onions
// 3.Potatoes
// 4.Tomatoes

// Test cases - HTML format
console.log(sortProducts(['Potatoes', 'Tomatoes', 'Onions', 'Apples'], true));
// Output:
// <ol>
//   <li>Apples</li>
//   <li>Onions</li>
//   <li>Potatoes</li>
//   <li>Tomatoes</li>
// </ol>

// Additional test cases
console.log(sortProducts(['Watermelon', 'Banana', 'Apples']));
// Output:
// 1.Apples
// 2.Banana
// 3.Watermelon

console.log(sortProducts(['Watermelon', 'Banana', 'Apples'], true));
// Output:
// <ol>
//   <li>Apples</li>
//   <li>Banana</li>
//   <li>Watermelon</li>
// </ol>
