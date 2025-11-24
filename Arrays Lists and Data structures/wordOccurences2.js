function countWordOccurrences(text) {
    const cleanText = text.toLowerCase().replace(/[.,!?;:]]/g, '');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = new Map();

    words.forEach(word => {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    const sortedWords = Array.from(wordCount.entries()).sort((a, b) => {
        if (b[1] !== a[1]) {
            return b[1] - a[1];
        }
        return a[0].localeCompare(b[0]);
    });
    return sortedWords;
 //   sortedWords.forEach(([word, count]) => {
//      console.log(`${word} -> ${count} times`);

}