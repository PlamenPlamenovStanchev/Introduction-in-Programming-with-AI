// Define the GalacticCreature type
type GalacticCreature = {
    name: string;
    energyLevels: number[];
    avgEnergy?: number;
};

// Function to calculate the average energy level
function calculateCreatureEnergy(creature: GalacticCreature): GalacticCreature {
    // Calculate the sum of all energy levels
    const sum = creature.energyLevels.reduce((acc, level) => acc + level, 0);
    
    // Calculate the average
    const average = sum / creature.energyLevels.length;
    
    // Update the avgEnergy property
    creature.avgEnergy = average;
    
    // Log the creature's information
    console.log(`Creature: ${creature.name}`);
    console.log(`Energy Levels: [${creature.energyLevels.join(', ')}]`);
    console.log(`Average Energy Level: ${average.toFixed(2)}`);
    console.log(); // Empty line for better readability
    
    return creature;
}

// Test cases
const zorblax: GalacticCreature = { 
    name: "Zorblax", 
    energyLevels: [35, 42, 50, 29] 
};
calculateCreatureEnergy(zorblax);

const lumivex: GalacticCreature = { 
    name: "Lumivex", 
    energyLevels: [75, 80, 90] 
};
calculateCreatureEnergy(lumivex);

// Additional test cases
const stellaris: GalacticCreature = {
    name: "Stellaris",
    energyLevels: [100, 95, 88, 92, 97]
};
calculateCreatureEnergy(stellaris);

const nebula: GalacticCreature = {
    name: "Nebula",
    energyLevels: [45, 50, 55, 60, 65, 70]
};
calculateCreatureEnergy(nebula);
