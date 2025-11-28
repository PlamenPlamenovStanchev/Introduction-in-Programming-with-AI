import { Level, Difficulty } from './Level';
/**
 * LevelGenerator - Utility class to generate game levels
 * Generates random sequences of level objects based on duration and difficulty
 */
export declare class LevelGenerator {
    /**
     * Difficulty configurations
     */
    private static readonly difficultyConfigs;
    /**
     * Generate a level with random objects based on duration and difficulty
     * @param duration Duration in seconds
     * @param difficulty The difficulty level (controls how many objects appear)
     * @returns A generated Level with random sequence of level objects
     */
    static generate(duration: number, difficulty: Difficulty): Level;
    /**
     * Generate a level (alias for generate method)
     * @param difficulty The difficulty level
     * @param durationMs Duration in milliseconds
     * @returns A generated Level
     */
    static generateRandomLevel(difficulty: Difficulty, durationMs: number): Level;
    /**
     * Create a random falling object based on difficulty configuration
     */
    private static createRandomObject;
    /**
     * Generate a predefined easy level (30 seconds)
     */
    static createEasyLevel(): Level;
    /**
     * Generate a predefined medium level (45 seconds)
     */
    static createMediumLevel(): Level;
    /**
     * Generate a predefined hard level (60 seconds)
     */
    static createHardLevel(): Level;
    /**
     * Generate a predefined extreme level (90 seconds)
     */
    static createExtremeLevel(): Level;
    /**
     * Create a custom level with specific object placements
     * @param difficulty The difficulty setting
     * @param durationMs Duration in milliseconds
     * @param objectPlacements Array of {time, type, x} placements
     */
    static createCustomLevel(difficulty: Difficulty, durationMs: number, objectPlacements: Array<{
        time: number;
        type: 'circle' | 'square' | 'triangle';
        x?: number;
        speed?: number;
        size?: number;
    }>): Level;
    /**
     * Get the estimated object count for a given duration and difficulty
     * @param duration Duration in seconds
     * @param difficulty The difficulty level
     * @returns Estimated number of objects
     */
    static getEstimatedObjectCount(duration: number, difficulty: Difficulty): number;
}
//# sourceMappingURL=LevelGenerator.d.ts.map