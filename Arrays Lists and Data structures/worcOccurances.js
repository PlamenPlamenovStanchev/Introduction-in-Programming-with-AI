function countWordOccurences(text) {
    // Ensure input is a string
    if(typeof text !== 'string') {
        text = String(text);
    }

    // Input validation
    if (text === null || text === undefined) {
        console.error('Error: Input cannot be null or undefined');
        return;
    }
    
    if (typeof text !== 'string') {
        console.error('Error: Input must be a string');
        return;
    }
    
    if (text.trim() === '') {
        console.error('Error: Input cannot be empty');
        return;
    }
    
    // Convert to lowercase and extract words (only letters)
    // Replace all non-letter characters with spaces and split
    let words = text.toLowerCase().split(/[^a-z]+/).filter(word => word.length > 0);
    
    // Count occurrences
    let wordCount = {};
    for (let word of words) {
        wordCount[word] = (wordCount[word] || 0) + 1;
    }
    
    // Convert to array of [word, count] pairs
    let wordPairs = Object.entries(wordCount);
    
    // Sort by count (descending), then alphabetically
    wordPairs.sort((a, b) => {
        if (b[1] !== a[1]) {
            return b[1] - a[1]; // Sort by count descending (higher counts first)
        }
        return a[0].localeCompare(b[0]); // Sort alphabetically (a-z)
    });
    
    // Print results
    for (let [word, count] of wordPairs) {
        console.log(`${word} -> ${count} times`);
    }
}

countWordOccurences("Here is the first sentence. Here is another sentence. And finally, the third sentence.");
// Expected Output:
// sentence -> 3 times
// here -> 2 times
// is -> 2 times
// the -> 2 times
// and -> 1 times
// another -> 1 times
// finally -> 1 times
// first -> 1 times
// third -> 1 times

countWordOccurences("Hello world! Hello everyone. Hello!");
// Expected Output:
// hello -> 3 times
// everyone -> 1 times
// world -> 1 times
