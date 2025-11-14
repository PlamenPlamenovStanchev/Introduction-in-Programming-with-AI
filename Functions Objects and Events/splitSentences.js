function splitSentences(text, processSentenceCallback) {
    let sentence = '';

    for (let char of text) {
        sentence += char;
        if (char === '.' || char === '!' || char === '?') {
            processSentenceCallback(sentence.trim());
            sentence = '';
        }
    }
}