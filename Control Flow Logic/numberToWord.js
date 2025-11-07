function numberToWord(number) {
    if (number < 0 || number > 100 || !Number.isInteger(number)) {
        return '>> out of range <<';
    }
    if (number == 0){
        return 'zero';
    } else if (number == 1){ 
        return 'one';
    } else if (number == 2){
         return 'two';
    } else if (number == 3){
         return 'three';
    } else if (number == 4){
        return 'four';
    } else if (number == 5){
        return 'five';
    } else if (number == 6){
        return 'six';
    } else if (number == 7){
        return 'seven';
    } else if (number == 8){
        return 'eight';
    } else if (number == 9){
        return 'nine';
    } else if (number == 10){
        return 'ten';
    } else if (number == 11){
        return 'eleven';
    } else if (number == 12){
        return 'twelve';
    } else if (number == 13){
        return 'thirteen';
    } else if (number == 14){
         return 'fourteen';
    } else if (number == 15){
         return 'fifteen';
    } else if (number == 16){
         return 'sixteen';
    } else if (number == 17){
         return 'seventeen';
    } else if (number == 18){
         return 'eighteen';
    } else if (number == 19){
         return 'nineteen';
    }


    let lastDigit = number % 10;    
    if (number >= 20 && number <= 29){
        return 'twenty' + (lastDigit == 0 ? '' : '-' + numberToWord(lastDigit));
    }
    if (number >= 30 && number <= 39){
        return 'thirty' + (lastDigit == 0 ? '' : '-' + numberToWord(lastDigit));
    }
    if (number >= 40 && number <= 49) {
        return 'forty' + (lastDigit == 0 ? '' : '-' + numberToWord(lastDigit));
    }
     if (number >= 50 && number <= 59) {
        return 'fifty' + (lastDigit == 0 ? '' : '-' + numberToWord(lastDigit));
    }
     if (number >= 60 && number <= 69) {
        return 'sixty' + (lastDigit == 0 ? '' : '-' + numberToWord(lastDigit));
    }
    if (number >= 70 && number <= 79) {
        return 'seventy' + (lastDigit == 0 ? '' : '-' + numberToWord(lastDigit));
    }
    if (number >= 80 && number <= 89) {
        return 'eighty' + (lastDigit == 0 ? '' : '-' + numberToWord(lastDigit));
    }
    if (number >= 90 && number <= 99) {
        return 'ninety' + (lastDigit == 0 ? '' : '-' + numberToWord(lastDigit));
    }
    if (number == 100){
        return 'one hundred'
    }

    return '>> out of range <<';
}

console.log(numberToWord(45));   