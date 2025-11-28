import { GameState } from './BaseGameObject';
import { Player } from './Player';
import { Level, Difficulty } from './Level';
import { GameField } from './GameField';
/**
 * Game configuration options
 */
interface GameConfig {
    canvasId: string;
    targetFPS?: number;
    defaultDifficulty?: Difficulty;
    defaultDuration?: number;
}
/**
 * Game class - Main game controller
 *
 * Responsibilities:
 * 1. Generate levels
 * 2. Initialize the game field
 * 3. Run the game loop:
 *    - Render all objects
 *    - Check for collisions
 *    - Check for end of level
 *    - Repeat at target FPS
 */
export declare class Game {
    private canvas;
    private ctx;
    private gameState;
    private animationId;
    private player;
    private gameField;
    private background;
    private hud;
    private currentLevel;
    private spawnedObjectIndices;
    private currentDifficulty;
    private defaultDuration;
    private targetFPS;
    private frameInterval;
    private lastFrameTime;
    private startTime;
    private elapsedTime;
    private pausedTime;
    private pauseStartTime;
    private keys;
    /**
     * Create a new Game instance
     * @param config Game configuration options
     */
    constructor(config: GameConfig | string);
    /**
     * Generate a new level based on duration and difficulty
     * @param duration Level duration in seconds
     * @param difficulty Difficulty level
     * @returns Generated Level
     */
    private generateLevel;
    /**
     * Set the difficulty for new levels
     * @param difficulty The difficulty to set
     */
    setDifficulty(difficulty: Difficulty): void;
    /**
     * Set the default duration for new levels
     * @param duration Duration in seconds
     */
    setDefaultDuration(duration: number): void;
    /**
     * Get current difficulty
     */
    getDifficulty(): Difficulty;
    /**
     * Initialize the game field for a new game
     * Clears all objects and resets the player
     */
    private initializeField;
    /**
     * Spawn level objects based on elapsed time
     * @param elapsedTimeMs Elapsed time in milliseconds
     */
    private spawnLevelObjects;
    /**
     * Main game loop - called every frame
     * Handles: input → update → collision detection → level check → render
     * @param currentTime Current timestamp from requestAnimationFrame
     */
    private gameLoop;
    /**
     * Process a single game frame
     * @param currentTime Current timestamp
     */
    private processFrame;
    /**
     * Update game state for current frame
     * @param currentTime Current timestamp
     */
    private update;
    /**
     * Check if the level is complete
     * @param elapsedTimeMs Elapsed time in milliseconds
     * @returns true if level is complete
     */
    private checkLevelComplete;
    /**
     * Check for collisions between player and game objects
     * @returns true if collision detected
     */
    private checkCollisions;
    /**
     * Render all game objects to the canvas
     */
    private render;
    /**
     * Render overlay screens (start, pause, game over, win)
     * @param levelDurationSec Level duration in seconds for display
     */
    private renderOverlay;
    /**
     * Start the game loop
     */
    private startGameLoop;
    /**
     * Stop the game loop
     */
    private stopGameLoop;
    /**
     * Set up keyboard and button event listeners
     */
    private setupEventListeners;
    /**
     * Handle player input based on pressed keys
     */
    private handleInput;
    /**
     * Start a new game
     * @param level Optional custom level to use
     * @param difficulty Optional difficulty override
     * @param duration Optional duration override in seconds
     */
    start(level?: Level, difficulty?: Difficulty, duration?: number): void;
    /**
     * Pause the game
     */
    pause(): void;
    /**
     * Resume the game from pause
     */
    resume(): void;
    /**
     * Stop the game and return to initial state
     */
    stop(): void;
    /**
     * Get the current game state
     */
    getGameState(): GameState;
    /**
     * Get the current level
     */
    getCurrentLevel(): Level;
    /**
     * Get the game field
     */
    getGameField(): GameField;
    /**
     * Get the player
     */
    getPlayer(): Player;
    /**
     * Get elapsed time in seconds
     */
    getElapsedTime(): number;
    /**
     * Get target FPS
     */
    getTargetFPS(): number;
    /**
     * Set target FPS
     * @param fps Target frames per second
     */
    setTargetFPS(fps: number): void;
}
export {};
//# sourceMappingURL=Game.d.ts.map