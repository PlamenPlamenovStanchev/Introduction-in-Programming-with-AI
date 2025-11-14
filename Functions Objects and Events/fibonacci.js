function printFibonacci(n) {
    function fibonacci(num) {
        let a = 1n, b = 1n;
        for (let i = 1; i <= num; i++) {
            let sum = a + b;
            a = b;
            b = sum;
        }
        return a;
    }
    console.log(`Fib(${n}) = ` + fibonacci(n));  
}