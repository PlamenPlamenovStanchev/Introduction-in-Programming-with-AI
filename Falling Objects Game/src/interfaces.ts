/**
 * Represents a location point on the game field
 */
export interface Point {
    x: number;
    y: number;
}

/**
 * Represents the bounds for game objects, used for collision detection
 */
export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Represents a game object with location, speed, movement and collision detection
 */
export interface GameObject {
    location: Point;
    speed: number;
    
    /**
     * Move the object according to its own moving algorithm
     */
    move(): void;
    
    /**
     * Get the bounds of the object for collision detection
     */
    getBounds(): Bounds;
    
    /**
     * Check if this object collides with another game object
     * @param gameObject The other game object to check collision with
     * @returns true if there is a collision, false otherwise
     */
    hasCollision(gameObject: GameObject): boolean;
}
