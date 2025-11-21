function plusMinusSum(arr) {
    let sum = arr[0];
    let expression = String(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        if (i % 2 === 1)   {
            sum += arr[i];
            expression += " + " + arr[i];
        } else {
            sum -= arr[i];
            expression += " - " + arr[i];
        }
    }
    console.log(`${expression} = ${sum}`);
}