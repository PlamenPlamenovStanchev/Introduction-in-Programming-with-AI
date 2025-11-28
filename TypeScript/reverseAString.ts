function reverseString(str: string): string {
    const reversedStr = str.split('').reverse().join('');
    const result = `The reversed string of "${str}" is: "${reversedStr}"`;
    console.log(result);
    return result;
}

// Test cases
console.log(reverseString("hello"));
console.log(reverseString("TypeScript"));
console.log(reverseString("OpenAI"));