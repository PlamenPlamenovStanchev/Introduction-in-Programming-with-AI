function processArrayCommands(input) {
    // Step 1: Extract the initial array from the first element
    // Use shift() to remove and get the first element, then convert to array of numbers
    const commands = [...input]; // Create a copy to avoid modifying the original
    const initialArrayString = commands.shift(); // Remove and get first element
    const arr = initialArrayString.split(' ').map(num => parseInt(num)); // Convert to array of numbers
    
    // Step 2: Loop through each command and process it
    for (let command of commands) {
        // Destructure the command by splitting it into parts
        const commandParts = command.split(' ');
        const operation = commandParts[0]; // The command type (Add, Remove, etc.)
        
        // Step 3: Use switch statement to handle different commands
        switch (operation) {
            case 'Add':
                // Extract the number to add and use push() to add at the end
                const numberToAdd = parseInt(commandParts[1]);
                arr.push(numberToAdd);
                break;
                
            case 'Remove':
                // Extract the number to remove and use filter() to remove all occurrences
                const numberToRemove = parseInt(commandParts[1]);
                // Filter keeps only elements that are NOT equal to the number to remove
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (arr[i] === numberToRemove) {
                        arr.splice(i, 1);
                    }
                }
                break;
                
            case 'RemoveAt':
                // Extract the index and use splice() to remove element at that position
                const indexToRemove = parseInt(commandParts[1]);
                arr.splice(indexToRemove, 1); // Remove 1 element at the specified index
                break;
                
            case 'Insert':
                // Extract the number and index, use splice() to insert
                const numberToInsert = parseInt(commandParts[1]);
                const insertIndex = parseInt(commandParts[2]);
                arr.splice(insertIndex, 0, numberToInsert); // Insert at index, remove 0 elements, add the number
                break;
                
            default:
                console.log(`Unknown command: ${operation}`);
        }
    }
    
    // Step 4: Return the manipulated array as a space-separated string
    return arr.join(' ');
}

console.log(processArrayCommands(['4 19 2 53 6 43', 'Add 3', 'Remove 2', 'RemoveAt 1', 'Insert 8 3']));
// Output: 4 53 6 8 43 3

console.log(processArrayCommands(['6 12 2 65 6 42', 'Add 8', 'Remove 12', 'RemoveAt 3', 'Insert 6 2']));
// Output: 6 2 6 65 42 8
