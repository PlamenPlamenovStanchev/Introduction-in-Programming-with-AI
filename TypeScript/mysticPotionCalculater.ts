// Function to calculate the effect of a potion
function calculatePotionEffect(potion: { type: string; name: string; healingAmount?: number; enhancementAmount?: number }): string {
    // Define the HealingPotion type
    type HealingPotion = {
        type: "healing";
        name: string;
        healingAmount: number;
    };

    // Define the EnhancementPotion type
    type EnhancementPotion = {
        type: "enhancement";
        name: string;
        enhancementAmount: number;
    };

    // Define the Potion union type
    type Potion = HealingPotion | EnhancementPotion;

    // Use type guard to determine which type of potion it is
    if (potion.type === "healing") {
        return `${potion.name} restores ${potion.healingAmount} health points.`;
    } else {
        return `${potion.name} enhances abilities by ${potion.enhancementAmount} points.`;
    }
}

// Test cases - exact format from requirements
let healingPotion = {
    type: "healing",
    name: "Elixir of Life",
    healingAmount: 50
};
console.log(calculatePotionEffect(healingPotion)); // Output: Elixir of Life restores 50 health points.

let enhancementPotion = {
    type: "enhancement",
    name: "Strength Brew",
    enhancementAmount: 25
};
console.log(calculatePotionEffect(enhancementPotion)); // Output: Strength Brew enhances abilities by 25 points.
