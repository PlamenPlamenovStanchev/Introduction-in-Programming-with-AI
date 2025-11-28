/**
 * LevelObject - Represents a game object that is created at a specific time after level start
 * Properties: startTime, gameObject
 */
export class LevelObject {
    constructor(startTime, gameObject) {
        this.startTime = startTime;
        this.gameObject = gameObject;
    }
}
/**
 * Difficulty levels for the game
 */
export var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "EASY";
    Difficulty["MEDIUM"] = "MEDIUM";
    Difficulty["HARD"] = "HARD";
    Difficulty["EXTREME"] = "EXTREME";
})(Difficulty || (Difficulty = {}));
/**
 * Level - Represents a game level with difficulty, duration and sequence of game objects
 * Properties: difficulty, duration, levelObjects
 */
export class Level {
    constructor(difficulty, duration, levelObjects = []) {
        this.difficulty = difficulty;
        this.duration = duration;
        this.levelObjects = levelObjects;
    }
    /**
     * Add a level object to the sequence
     * @param levelObject The level object to add
     */
    addLevelObject(levelObject) {
        this.levelObjects.push(levelObject);
        // Keep objects sorted by start time
        this.levelObjects.sort((a, b) => a.startTime - b.startTime);
    }
    /**
     * Add a game object at a specific time
     * @param startTime Time in milliseconds after level start
     * @param gameObject The game object to create
     */
    addGameObjectAt(startTime, gameObject) {
        this.addLevelObject(new LevelObject(startTime, gameObject));
    }
    /**
     * Get all level objects that should be spawned between two time points
     * @param fromTime Start time in milliseconds
     * @param toTime End time in milliseconds
     * @returns Array of level objects to spawn
     */
    getObjectsToSpawn(fromTime, toTime) {
        return this.levelObjects.filter(obj => obj.startTime >= fromTime && obj.startTime < toTime);
    }
    /**
     * Get the number of objects in this level
     */
    getObjectCount() {
        return this.levelObjects.length;
    }
    /**
     * Get the duration in seconds
     */
    getDurationInSeconds() {
        return this.duration / 1000;
    }
}
//# sourceMappingURL=Level.js.map