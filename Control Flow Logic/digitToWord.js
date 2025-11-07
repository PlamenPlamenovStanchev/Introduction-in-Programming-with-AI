function digitToWord(digit) {
    switch (digit) {
        case 1: return "one";
        case 2: return "two";
        case 3: return "three";
        case 4: return "four";
        case 5: return "five";
        case 6: return "six";
        case 7: return "seven";
        case 8: return "eight";
        case 9: return "nine";
        default: return "out of range";
        }
    }

    console.log(digitToWord(5));  // Output: five
    console.log(digitToWord(0));   // Output: zero
    console.log(digitToWord(9));   // Output: nine
    console.log(digitToWord(10));  // Output: out of range