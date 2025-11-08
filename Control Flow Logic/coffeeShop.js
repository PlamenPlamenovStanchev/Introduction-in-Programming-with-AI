function drinkPrice(drink, extra1, extra2) {
    const drinks = {
        "coffee": 1.00,
        "tea": 0.60,
        "soda": 1.20
    };

    const extras = {
        "sugar": 0.40,
        "creamer": 0.30
    };

    // Check if drink is valid
    if (!drinks.hasOwnProperty(drink)) {
        return "Invalid drink!";
    }

    let price = drinks[drink];

    // Check and add extra1
    if (extra1) {
        if (!extras.hasOwnProperty(extra1)) {
            return "Invalid extra!";
        }
        price += extras[extra1];
    }

    // Check and add extra2
    if (extra2) {
        if (!extras.hasOwnProperty(extra2)) {
            return "Invalid extra!";
        }
        price += extras[extra2];
    }

    return `Final price: ${price.toFixed(2)}`;
}

// Example usage
console.log(drinkPrice("coffee", "sugar"));           // Final price: 1.40
console.log(drinkPrice("coffee", "creamer", "sugar")); // Final price: 1.70
console.log(drinkPrice("tea"));                       // Final price: 0.60
console.log(drinkPrice("tea", "sugar"));              // Final price: 1.00
console.log(drinkPrice("water"));                     // Invalid drink!

