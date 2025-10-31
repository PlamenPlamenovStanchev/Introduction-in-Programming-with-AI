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
    

    // Build the output message
    return (
        `Tomatoes: ${tomatoesTotal.toFixed(2)} EUR\n` +
        `Cucumbers: ${cucumbersTotal.toFixed(2)} EUR\n` +
        `Total: ${totalWithoutVAT.toFixed(2)} EUR\n` +
        `20% VAT: ${vatAmount.toFixed(2)} EUR\n` +
        `Total price (with VAT): ${totalWithVAT.toFixed(2)} EUR`
    
  );
  
}

// Example usage
vegetablesPrice(2, 3);
console.log('---');
vegetablesPrice(5, 4);
