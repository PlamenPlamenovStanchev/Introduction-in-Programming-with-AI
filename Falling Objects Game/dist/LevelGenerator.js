import { Level, Difficulty } from './Level';
import { FallingCircle, RotatingFallingSquare, RotatingFallingTriangle } from './FallingObjects';
import { CANVAS_WIDTH } from './BaseGameObject';
/**
 * LevelGenerator - Utility class to generate game levels
 * Generates random sequences of level objects based on duration and difficulty
 */
export class LevelGenerator {
    /**
     * Generate a level with random objects based on duration and difficulty
     * @param duration Duration in seconds
     * @param difficulty The difficulty level (controls how many objects appear)
     * @returns A generated Level with random sequence of level objects
     */
    static generate(duration, difficulty) {
        const durationMs = duration * 1000;
        const level = new Level(difficulty, durationMs);
        const config = this.difficultyConfigs[difficulty];
        // Calculate total number of objects based on difficulty
        const totalObjects = Math.floor(duration * config.objectsPerSecond);
        // Generate random spawn times distributed throughout the level
        const spawnTimes = [];
        for (let i = 0; i < totalObjects; i++) {
            // Start spawning after 500ms, leave 1 second at the end
            const minTime = 500;
            const maxTime = durationMs - 1000;
            const spawnTime = minTime + Math.random() * (maxTime - minTime);
            spawnTimes.push(spawnTime);
        }
        // Sort spawn times chronologically
        spawnTimes.sort((a, b) => a - b);
        // Create level objects at each spawn time
        for (const spawnTime of spawnTimes) {
            const gameObject = this.createRandomObject(config);
            level.addGameObjectAt(spawnTime, gameObject);
        }
        return level;
    }
    /**
     * Generate a level (alias for generate method)
     * @param difficulty The difficulty level
     * @param durationMs Duration in milliseconds
     * @returns A generated Level
     */
    static generateRandomLevel(difficulty, durationMs) {
        return this.generate(durationMs / 1000, difficulty);
    }
    /**
     * Create a random falling object based on difficulty configuration
     */
    static createRandomObject(config) {
        const objectType = Math.floor(Math.random() * 3);
        // Random speed within difficulty range
        const speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);
        // Random size within difficulty range
        const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
        // Random x position
        const location = {
            x: Math.random() * (CANVAS_WIDTH - size),
            y: -size
        };
        switch (objectType) {
            case 0:
                return new FallingCircle(location, speed, size / 2); // radius is half the size
            case 1:
                return new RotatingFallingSquare(location, speed, size);
            case 2:
            default:
                return new RotatingFallingTriangle(location, speed, size);
        }
    }
    /**
     * Generate a predefined easy level (30 seconds)
     */
    static createEasyLevel() {
        return this.generate(30, Difficulty.EASY);
    }
    /**
     * Generate a predefined medium level (45 seconds)
     */
    static createMediumLevel() {
        return this.generate(45, Difficulty.MEDIUM);
    }
    /**
     * Generate a predefined hard level (60 seconds)
     */
    static createHardLevel() {
        return this.generate(60, Difficulty.HARD);
    }
    /**
     * Generate a predefined extreme level (90 seconds)
     */
    static createExtremeLevel() {
        return this.generate(90, Difficulty.EXTREME);
    }
    /**
     * Create a custom level with specific object placements
     * @param difficulty The difficulty setting
     * @param durationMs Duration in milliseconds
     * @param objectPlacements Array of {time, type, x} placements
     */
    static createCustomLevel(difficulty, durationMs, objectPlacements) {
        const level = new Level(difficulty, durationMs);
        for (const placement of objectPlacements) {
            let gameObject;
            const location = placement.x !== undefined
                ? { x: placement.x, y: -50 }
                : undefined;
            switch (placement.type) {
                case 'circle':
                    gameObject = new FallingCircle(location, placement.speed, placement.size);
                    break;
                case 'square':
                    gameObject = new RotatingFallingSquare(location, placement.speed, placement.size);
                    break;
                case 'triangle':
                    gameObject = new RotatingFallingTriangle(location, placement.speed, placement.size);
                    break;
            }
            level.addGameObjectAt(placement.time, gameObject);
        }
        return level;
    }
    /**
     * Get the estimated object count for a given duration and difficulty
     * @param duration Duration in seconds
     * @param difficulty The difficulty level
     * @returns Estimated number of objects
     */
    static getEstimatedObjectCount(duration, difficulty) {
        const config = this.difficultyConfigs[difficulty];
        return Math.floor(duration * config.objectsPerSecond);
    }
}
/**
 * Difficulty configurations
 */
LevelGenerator.difficultyConfigs = {
    [Difficulty.EASY]: {
        objectsPerSecond: 0.7,
        minSpeed: 1,
        maxSpeed: 2,
        minSize: 20,
        maxSize: 35
    },
    [Difficulty.MEDIUM]: {
        objectsPerSecond: 1.2,
        minSpeed: 1.5,
        maxSpeed: 3,
        minSize: 18,
        maxSize: 40
    },
    [Difficulty.HARD]: {
        objectsPerSecond: 1.8,
        minSpeed: 2,
        maxSpeed: 4,
        minSize: 15,
        maxSize: 45
    },
    [Difficulty.EXTREME]: {
        objectsPerSecond: 2.5,
        minSpeed: 2.5,
        maxSpeed: 5.5,
        minSize: 12,
        maxSize: 50
    }
};
//# sourceMappingURL=LevelGenerator.js.map