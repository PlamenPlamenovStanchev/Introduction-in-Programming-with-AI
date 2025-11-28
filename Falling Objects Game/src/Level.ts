import { GameObject } from './interfaces';

/**
 * LevelObject - Represents a game object that is created at a specific time after level start
 * Properties: startTime, gameObject
 */
export class LevelObject {
    startTime: number;      // Time in milliseconds after level start when this object should be created
    gameObject: GameObject; // The game object to create

    constructor(startTime: number, gameObject: GameObject) {
        this.startTime = startTime;
        this.gameObject = gameObject;
    }
}

/**
 * Difficulty levels for the game
 */
export enum Difficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
    EXTREME = 'EXTREME'
}

/**
 * Level - Represents a game level with difficulty, duration and sequence of game objects
 * Properties: difficulty, duration, levelObjects
 */
export class Level {
    difficulty: Difficulty;     // The difficulty of this level
    duration: number;           // Duration of the level in milliseconds
    levelObjects: LevelObject[]; // Sequence of level objects to spawn during the level

    constructor(
        difficulty: Difficulty,
        duration: number,
        levelObjects: LevelObject[] = []
    ) {
        this.difficulty = difficulty;
        this.duration = duration;
        this.levelObjects = levelObjects;
    }

    /**
     * Add a level object to the sequence
     * @param levelObject The level object to add
     */
    addLevelObject(levelObject: LevelObject): void {
        this.levelObjects.push(levelObject);
        // Keep objects sorted by start time
        this.levelObjects.sort((a, b) => a.startTime - b.startTime);
    }

    /**
     * Add a game object at a specific time
     * @param startTime Time in milliseconds after level start
     * @param gameObject The game object to create
     */
    addGameObjectAt(startTime: number, gameObject: GameObject): void {
        this.addLevelObject(new LevelObject(startTime, gameObject));
    }

    /**
     * Get all level objects that should be spawned between two time points
     * @param fromTime Start time in milliseconds
     * @param toTime End time in milliseconds
     * @returns Array of level objects to spawn
     */
    getObjectsToSpawn(fromTime: number, toTime: number): LevelObject[] {
        return this.levelObjects.filter(
            obj => obj.startTime >= fromTime && obj.startTime < toTime
        );
    }

    /**
     * Get the number of objects in this level
     */
    getObjectCount(): number {
        return this.levelObjects.length;
    }

    /**
     * Get the duration in seconds
     */
    getDurationInSeconds(): number {
        return this.duration / 1000;
    }
}
