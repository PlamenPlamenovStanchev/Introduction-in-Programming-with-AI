function processArrayCommands(input) {
    // Input validation
    if (input === null || input === undefined) {
        console.error('Error: Input cannot be null or undefined');
        return '';
    }
    
    if (!Array.isArray(input)) {
        console.error('Error: Input must be an array');
        return '';
    }
    
    if (input.length === 0) {
        console.error('Error: Input array cannot be empty');
        return '';
    }
    
    // Parse initial array from first element
    let arr = input[0].trim().split(/\s+/).map(x => {
        const num = parseInt(x);
        if (isNaN(num)) {
            throw new Error(`Invalid number: ${x}`);
        }
        return num;
    });
    
    // Process each command
    for (let i = 1; i < input.length; i++) {
        const command = input[i].trim();
        const parts = command.split(/\s+/);
        const action = parts[0];
        
        try {
            if (action === 'Add') {
                const num = parseInt(parts[1]);
                if (isNaN(num)) {
                    throw new Error(`Invalid number for Add command: ${parts[1]}`);
                }
                arr.push(num);
                
            } else if (action === 'Remove') {
                const num = parseInt(parts[1]);
                if (isNaN(num)) {
                    throw new Error(`Invalid number for Remove command: ${parts[1]}`);
                }
                arr = arr.filter(el => el !== num);
                
            } else if (action === 'RemoveAt') {
                const index = parseInt(parts[1]);
                if (isNaN(index) || index < 0 || index >= arr.length) {
                    throw new Error(`Invalid index for RemoveAt command: ${parts[1]}`);
                }
                arr.splice(index, 1);
                
            } else if (action === 'Insert') {
                const num = parseInt(parts[1]);
                const index = parseInt(parts[2]);
                if (isNaN(num)) {
                    throw new Error(`Invalid number for Insert command: ${parts[1]}`);
                }
                if (isNaN(index) || index < 0 || index > arr.length) {
                    throw new Error(`Invalid index for Insert command: ${parts[2]}`);
                }
                arr.splice(index, 0, num);
                
            } else {
                throw new Error(`Unknown command: ${action}`);
            }
        } catch (error) {
            console.error(`Error processing command "${command}": ${error.message}`);
            return '';
        }
    }
    
    // Return array as space-separated string
    return arr.join(' ');
}

console.log(processArrayCommands(['4 19 2 53 6 43', 'Add 3', 'Remove 2', 'RemoveAt 1', 'Insert 8 3']));
// Output: 4 53 6 8 43 3

console.log(processArrayCommands(['6 12 2 65 6 42', 'Add 8', 'Remove 12', 'RemoveAt 3', 'Insert 6 2']));
// Output: 6 2 6 65 42 8
