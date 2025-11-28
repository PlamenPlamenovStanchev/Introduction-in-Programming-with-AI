import { GameObject } from './interfaces';
/**
 * GameField - Holds the active objects in the game
 * Properties: width, height, gameObjects
 */
export declare class GameField {
    width: number;
    height: number;
    gameObjects: GameObject[];
    constructor(width?: number, height?: number);
    /**
     * Add a game object to the field
     * @param gameObject The game object to add
     */
    addObject(gameObject: GameObject): void;
    /**
     * Add multiple game objects to the field
     * @param gameObjects Array of game objects to add
     */
    addObjects(gameObjects: GameObject[]): void;
    /**
     * Remove a game object from the field
     * @param gameObject The game object to remove
     */
    removeObject(gameObject: GameObject): void;
    /**
     * Clear all game objects from the field
     */
    clear(): void;
    /**
     * Get the count of active game objects
     */
    getObjectCount(): number;
    /**
     * Move all game objects according to their movement algorithms
     */
    updateAll(): void;
    /**
     * Remove objects that have moved off the screen (for falling objects)
     */
    removeOffScreenObjects(): void;
    /**
     * Check if any game object collides with a target object
     * @param target The target object to check collisions against
     * @returns The first colliding object, or null if no collision
     */
    checkCollision(target: GameObject): GameObject | null;
    /**
     * Check if any game object collides with a target object
     * @param target The target object to check collisions against
     * @returns true if there is a collision
     */
    hasCollision(target: GameObject): boolean;
    /**
     * Get all objects that collide with a target object
     * @param target The target object to check collisions against
     * @returns Array of colliding objects
     */
    getAllCollisions(target: GameObject): GameObject[];
    /**
     * Draw all game objects on the canvas
     * @param ctx The canvas rendering context
     */
    drawAll(ctx: CanvasRenderingContext2D): void;
    /**
     * Check if a point is within the game field bounds
     * @param x X coordinate
     * @param y Y coordinate
     * @returns true if the point is within bounds
     */
    isWithinBounds(x: number, y: number): boolean;
    /**
     * Get the center point of the game field
     */
    getCenter(): {
        x: number;
        y: number;
    };
    /**
     * Filter game objects by type
     * @param type The constructor type to filter by
     * @returns Array of objects matching the type
     */
    getObjectsByType<T extends GameObject>(type: new (...args: any[]) => T): T[];
}
//# sourceMappingURL=GameField.d.ts.map