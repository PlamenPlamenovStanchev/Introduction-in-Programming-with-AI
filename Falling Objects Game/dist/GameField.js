import { CANVAS_WIDTH, CANVAS_HEIGHT } from './BaseGameObject';
/**
 * GameField - Holds the active objects in the game
 * Properties: width, height, gameObjects
 */
export class GameField {
    constructor(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
        this.width = width;
        this.height = height;
        this.gameObjects = [];
    }
    /**
     * Add a game object to the field
     * @param gameObject The game object to add
     */
    addObject(gameObject) {
        this.gameObjects.push(gameObject);
    }
    /**
     * Add multiple game objects to the field
     * @param gameObjects Array of game objects to add
     */
    addObjects(gameObjects) {
        this.gameObjects.push(...gameObjects);
    }
    /**
     * Remove a game object from the field
     * @param gameObject The game object to remove
     */
    removeObject(gameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
        }
    }
    /**
     * Clear all game objects from the field
     */
    clear() {
        this.gameObjects = [];
    }
    /**
     * Get the count of active game objects
     */
    getObjectCount() {
        return this.gameObjects.length;
    }
    /**
     * Move all game objects according to their movement algorithms
     */
    updateAll() {
        this.gameObjects.forEach(obj => obj.move());
    }
    /**
     * Remove objects that have moved off the screen (for falling objects)
     */
    removeOffScreenObjects() {
        this.gameObjects = this.gameObjects.filter(obj => {
            // Check if the object has isOffScreen method (falling objects)
            if ('isOffScreen' in obj && typeof obj.isOffScreen === 'function') {
                return !obj.isOffScreen();
            }
            return true;
        });
    }
    /**
     * Check if any game object collides with a target object
     * @param target The target object to check collisions against
     * @returns The first colliding object, or null if no collision
     */
    checkCollision(target) {
        for (const obj of this.gameObjects) {
            if (obj !== target && target.hasCollision(obj)) {
                return obj;
            }
        }
        return null;
    }
    /**
     * Check if any game object collides with a target object
     * @param target The target object to check collisions against
     * @returns true if there is a collision
     */
    hasCollision(target) {
        return this.checkCollision(target) !== null;
    }
    /**
     * Get all objects that collide with a target object
     * @param target The target object to check collisions against
     * @returns Array of colliding objects
     */
    getAllCollisions(target) {
        return this.gameObjects.filter(obj => obj !== target && target.hasCollision(obj));
    }
    /**
     * Draw all game objects on the canvas
     * @param ctx The canvas rendering context
     */
    drawAll(ctx) {
        this.gameObjects.forEach(obj => {
            if ('draw' in obj && typeof obj.draw === 'function') {
                obj.draw(ctx);
            }
        });
    }
    /**
     * Check if a point is within the game field bounds
     * @param x X coordinate
     * @param y Y coordinate
     * @returns true if the point is within bounds
     */
    isWithinBounds(x, y) {
        return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    }
    /**
     * Get the center point of the game field
     */
    getCenter() {
        return {
            x: this.width / 2,
            y: this.height / 2
        };
    }
    /**
     * Filter game objects by type
     * @param type The constructor type to filter by
     * @returns Array of objects matching the type
     */
    getObjectsByType(type) {
        return this.gameObjects.filter(obj => obj instanceof type);
    }
}
//# sourceMappingURL=GameField.js.map