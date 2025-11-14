function processOperations(startValue, ...operations) {
    let currentValue = startValue;

    for (const operation of operations) {
        switch (operation) {
            case 'double':
                currentValue *= 2;
                break;
            case '+1':
                currentValue += 1;
                break;
            case '-1':
                currentValue -= 1;
                break;
            case 'print':
                console.log(currentValue);
                break;
            case 'stop':
                return currentValue;
            default:
                console.log('invalid operation');
        }
    }

    return currentValue;
}
