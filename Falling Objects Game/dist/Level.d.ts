import { GameObject } from './interfaces';
/**
 * LevelObject - Represents a game object that is created at a specific time after level start
 * Properties: startTime, gameObject
 */
export declare class LevelObject {
    startTime: number;
    gameObject: GameObject;
    constructor(startTime: number, gameObject: GameObject);
}
/**
 * Difficulty levels for the game
 */
export declare enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
    EXTREME = "EXTREME"
}
/**
 * Level - Represents a game level with difficulty, duration and sequence of game objects
 * Properties: difficulty, duration, levelObjects
 */
export declare class Level {
    difficulty: Difficulty;
    duration: number;
    levelObjects: LevelObject[];
    constructor(difficulty: Difficulty, duration: number, levelObjects?: LevelObject[]);
    /**
     * Add a level object to the sequence
     * @param levelObject The level object to add
     */
    addLevelObject(levelObject: LevelObject): void;
    /**
     * Add a game object at a specific time
     * @param startTime Time in milliseconds after level start
     * @param gameObject The game object to create
     */
    addGameObjectAt(startTime: number, gameObject: GameObject): void;
    /**
     * Get all level objects that should be spawned between two time points
     * @param fromTime Start time in milliseconds
     * @param toTime End time in milliseconds
     * @returns Array of level objects to spawn
     */
    getObjectsToSpawn(fromTime: number, toTime: number): LevelObject[];
    /**
     * Get the number of objects in this level
     */
    getObjectCount(): number;
    /**
     * Get the duration in seconds
     */
    getDurationInSeconds(): number;
}
//# sourceMappingURL=Level.d.ts.map