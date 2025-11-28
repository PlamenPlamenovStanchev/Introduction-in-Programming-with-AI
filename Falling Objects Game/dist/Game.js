import { GameState, CANVAS_WIDTH, CANVAS_HEIGHT } from './BaseGameObject';
import { Player } from './Player';
import { Background } from './Background';
import { HUD } from './HUD';
import { Difficulty } from './Level';
import { LevelGenerator } from './LevelGenerator';
import { GameField } from './GameField';
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
export class Game {
    /**
     * Create a new Game instance
     * @param config Game configuration options
     */
    constructor(config) {
        // ==========================================
        // GAME LOOP
        // ==========================================
        /**
         * Main game loop - called every frame
         * Handles: input → update → collision detection → level check → render
         * @param currentTime Current timestamp from requestAnimationFrame
         */
        this.gameLoop = (currentTime) => {
            // Calculate time since last frame
            const deltaTime = currentTime - this.lastFrameTime;
            // Only update if enough time has passed (FPS limiting)
            if (deltaTime >= this.frameInterval) {
                this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
                // Process one frame
                this.processFrame(currentTime);
            }
            // Schedule next frame
            this.animationId = requestAnimationFrame(this.gameLoop);
        };
        // Handle both string (canvasId) and config object
        const options = typeof config === 'string'
            ? { canvasId: config }
            : config;
        // Initialize canvas
        this.canvas = document.getElementById(options.canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id '${options.canvasId}' not found`);
        }
        this.ctx = this.canvas.getContext('2d');
        // Configuration
        this.targetFPS = options.targetFPS ?? 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.currentDifficulty = options.defaultDifficulty ?? Difficulty.EASY;
        this.defaultDuration = options.defaultDuration ?? 30;
        // Initialize game state
        this.gameState = GameState.STOPPED;
        this.animationId = 0;
        // Initialize game components
        this.player = new Player();
        this.gameField = new GameField(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.background = new Background();
        this.hud = new HUD();
        // Initialize level system
        this.currentLevel = this.generateLevel(this.defaultDuration, this.currentDifficulty);
        this.spawnedObjectIndices = new Set();
        // Initialize timing
        this.lastFrameTime = 0;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.pausedTime = 0;
        this.pauseStartTime = 0;
        // Initialize input
        this.keys = {};
        // Setup and start
        this.setupEventListeners();
        this.startGameLoop();
    }
    // ==========================================
    // LEVEL GENERATION
    // ==========================================
    /**
     * Generate a new level based on duration and difficulty
     * @param duration Level duration in seconds
     * @param difficulty Difficulty level
     * @returns Generated Level
     */
    generateLevel(duration, difficulty) {
        return LevelGenerator.generate(duration, difficulty);
    }
    /**
     * Set the difficulty for new levels
     * @param difficulty The difficulty to set
     */
    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
    }
    /**
     * Set the default duration for new levels
     * @param duration Duration in seconds
     */
    setDefaultDuration(duration) {
        this.defaultDuration = duration;
    }
    /**
     * Get current difficulty
     */
    getDifficulty() {
        return this.currentDifficulty;
    }
    // ==========================================
    // FIELD INITIALIZATION
    // ==========================================
    /**
     * Initialize the game field for a new game
     * Clears all objects and resets the player
     */
    initializeField() {
        // Clear all game objects from the field
        this.gameField.clear();
        // Reset player to starting position
        this.player.reset();
        // Reset spawn tracking
        this.spawnedObjectIndices = new Set();
    }
    /**
     * Spawn level objects based on elapsed time
     * @param elapsedTimeMs Elapsed time in milliseconds
     */
    spawnLevelObjects(elapsedTimeMs) {
        this.currentLevel.levelObjects.forEach((levelObj, index) => {
            // Only spawn if not already spawned and time has passed
            if (!this.spawnedObjectIndices.has(index) && levelObj.startTime <= elapsedTimeMs) {
                this.gameField.addObject(levelObj.gameObject);
                this.spawnedObjectIndices.add(index);
            }
        });
    }
    /**
     * Process a single game frame
     * @param currentTime Current timestamp
     */
    processFrame(currentTime) {
        // 1. Handle input
        this.handleInput();
        // 2. Update game state (if running)
        if (this.gameState === GameState.RUNNING) {
            this.update(currentTime);
        }
        // 3. Render all objects
        this.render();
    }
    /**
     * Update game state for current frame
     * @param currentTime Current timestamp
     */
    update(currentTime) {
        // Calculate elapsed time
        const elapsedTimeMs = currentTime - this.startTime - this.pausedTime;
        this.elapsedTime = elapsedTimeMs / 1000;
        // Check for end of level (win condition)
        if (this.checkLevelComplete(elapsedTimeMs)) {
            this.gameState = GameState.WON;
            return;
        }
        // Spawn new objects from level definition
        this.spawnLevelObjects(elapsedTimeMs);
        // Move all game objects
        this.gameField.updateAll();
        // Remove objects that have left the screen
        this.gameField.removeOffScreenObjects();
        // Check for collisions with player
        if (this.checkCollisions()) {
            this.gameState = GameState.GAME_OVER;
            return;
        }
    }
    /**
     * Check if the level is complete
     * @param elapsedTimeMs Elapsed time in milliseconds
     * @returns true if level is complete
     */
    checkLevelComplete(elapsedTimeMs) {
        return elapsedTimeMs >= this.currentLevel.duration;
    }
    /**
     * Check for collisions between player and game objects
     * @returns true if collision detected
     */
    checkCollisions() {
        return this.gameField.hasCollision(this.player);
    }
    /**
     * Render all game objects to the canvas
     */
    render() {
        // Update and render background
        this.background.update();
        this.background.draw(this.ctx);
        const levelDurationSec = this.currentLevel.getDurationInSeconds();
        // Render game objects if not stopped
        if (this.gameState !== GameState.STOPPED) {
            // Render all objects in the game field
            this.gameField.drawAll(this.ctx);
            // Render player
            this.player.draw(this.ctx);
            // Render HUD (status, time, score)
            this.hud.draw(this.ctx, this.gameState, this.gameField.getObjectCount(), this.elapsedTime, levelDurationSec);
        }
        // Render overlay screens based on game state
        this.renderOverlay(levelDurationSec);
    }
    /**
     * Render overlay screens (start, pause, game over, win)
     * @param levelDurationSec Level duration in seconds for display
     */
    renderOverlay(levelDurationSec) {
        switch (this.gameState) {
            case GameState.STOPPED:
                this.hud.drawStartScreen(this.ctx);
                break;
            case GameState.PAUSED:
                this.hud.drawPausedScreen(this.ctx);
                break;
            case GameState.GAME_OVER:
                this.hud.drawGameOver(this.ctx, this.elapsedTime);
                break;
            case GameState.WON:
                this.hud.drawWinScreen(this.ctx, levelDurationSec);
                break;
        }
    }
    /**
     * Start the game loop
     */
    startGameLoop() {
        this.lastFrameTime = performance.now();
        this.animationId = requestAnimationFrame(this.gameLoop);
    }
    /**
     * Stop the game loop
     */
    stopGameLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = 0;
        }
    }
    // ==========================================
    // INPUT HANDLING
    // ==========================================
    /**
     * Set up keyboard and button event listeners
     */
    setupEventListeners() {
        // Button controls
        document.getElementById('startBtn')?.addEventListener('click', () => this.start());
        document.getElementById('pauseBtn')?.addEventListener('click', () => this.pause());
        document.getElementById('resumeBtn')?.addEventListener('click', () => this.resume());
        document.getElementById('stopBtn')?.addEventListener('click', () => this.stop());
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            // Prevent scrolling with arrow keys
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    /**
     * Handle player input based on pressed keys
     */
    handleInput() {
        if (this.gameState !== GameState.RUNNING)
            return;
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.player.moveLeft();
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.player.moveRight();
        }
    }
    // ==========================================
    // GAME CONTROL METHODS
    // ==========================================
    /**
     * Start a new game
     * @param level Optional custom level to use
     * @param difficulty Optional difficulty override
     * @param duration Optional duration override in seconds
     */
    start(level, difficulty, duration) {
        // Set difficulty if provided
        if (difficulty !== undefined) {
            this.currentDifficulty = difficulty;
        }
        // Set duration if provided
        if (duration !== undefined) {
            this.defaultDuration = duration;
        }
        // Generate or use provided level
        if (level) {
            this.currentLevel = level;
        }
        else {
            this.currentLevel = this.generateLevel(this.defaultDuration, this.currentDifficulty);
        }
        // Initialize the game field
        this.initializeField();
        // Reset timing
        this.startTime = performance.now();
        this.pausedTime = 0;
        this.elapsedTime = 0;
        // Reset background
        this.background.reset();
        // Set state to running
        this.gameState = GameState.RUNNING;
    }
    /**
     * Pause the game
     */
    pause() {
        if (this.gameState === GameState.RUNNING) {
            this.gameState = GameState.PAUSED;
            this.pauseStartTime = performance.now();
        }
    }
    /**
     * Resume the game from pause
     */
    resume() {
        if (this.gameState === GameState.PAUSED) {
            this.pausedTime += performance.now() - this.pauseStartTime;
            this.gameState = GameState.RUNNING;
        }
    }
    /**
     * Stop the game and return to initial state
     */
    stop() {
        this.gameState = GameState.STOPPED;
        this.initializeField();
        this.elapsedTime = 0;
    }
    // ==========================================
    // GETTERS
    // ==========================================
    /**
     * Get the current game state
     */
    getGameState() {
        return this.gameState;
    }
    /**
     * Get the current level
     */
    getCurrentLevel() {
        return this.currentLevel;
    }
    /**
     * Get the game field
     */
    getGameField() {
        return this.gameField;
    }
    /**
     * Get the player
     */
    getPlayer() {
        return this.player;
    }
    /**
     * Get elapsed time in seconds
     */
    getElapsedTime() {
        return this.elapsedTime;
    }
    /**
     * Get target FPS
     */
    getTargetFPS() {
        return this.targetFPS;
    }
    /**
     * Set target FPS
     * @param fps Target frames per second
     */
    setTargetFPS(fps) {
        this.targetFPS = fps;
        this.frameInterval = 1000 / fps;
    }
}
//# sourceMappingURL=Game.js.map