function vegetablesPrice(tomatoesKg, cucumbersKg) {
    // Fixed prices per kg (without VAT)
    const tomatoPricePerKg = 2.4;
    const cucumberPricePerKg = 1.9;
    const vatRate = 0.20; // 20%
    
    // Calculate prices without VAT
    const tomatoesTotal = tomatoesKg * tomatoPricePerKg;
    const cucumbersTotal = cucumbersKg * cucumberPricePerKg;
    const totalWithoutVAT = tomatoesTotal + cucumbersTotal;
    
    // Calculate VAT and total with VAT
    const vatAmount = totalWithoutVAT * vatRate;
    const totalWithVAT = totalWithoutVAT + vatAmount;
    
    // Format all numbers to 2 decimal places
    const formatPrice = (num) => num.toFixed(2);
    
    // Build the output message
    const output = 
        `Tomatoes: ${formatPrice(tomatoesTotal)} EUR\n` +
        `Cucumbers: ${formatPrice(cucumbersTotal)} EUR\n` +
        `Total: ${formatPrice(totalWithoutVAT)} EUR\n` +
        `20% VAT: ${formatPrice(vatAmount)} EUR\n` +
        `Total price (with VAT): ${formatPrice(totalWithVAT)} EUR`;
    
    console.log(output);
    return output;
}

// Example usage
vegetablesPrice(2, 3);
console.log('---');
vegetablesPrice(5, 4);
