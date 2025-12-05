// Non-blocking version using async/await
async function nonBlockingFindSum(limit) {
    let sum = 0;
    for (let i = 1; i <= limit; i++) {
        if (i % 1_000_000 === 0) {
            console.log(`Calculating [${Math.round((i/limit)*100)}%]`);
            // Yield control to the event loop every 1 million iterations
            await new Promise(resolve => setImmediate(resolve));
        }
        sum += i;
    }
    return sum;
}

// Main execution
(async () => {
    console.log("Start...");
    console.log("Computing sum of 1 to 30,000,000 (non-blocking)...");
    const startTime = Date.now();
    
    try {
        const result = await nonBlockingFindSum(30_000_000);
        const endTime = Date.now();
        console.log(`Done! Sum = ${result}`);
        console.log(`Time taken: ${(endTime - startTime) / 1000} seconds`);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
