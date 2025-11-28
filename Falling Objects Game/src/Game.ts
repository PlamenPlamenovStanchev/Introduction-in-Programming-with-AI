import { GameState, CANVAS_WIDTH, CANVAS_HEIGHT } from './BaseGameObject';
import { Player } from './Player';
import { Background } from './Background';
import { HUD } from './HUD';
import { Level, Difficulty } from './Level';
import { LevelGenerator } from './LevelGenerator';
import { GameField } from './GameField';

/**
 * Game configuration options
 */
interface GameConfig {
    canvasId: string;
    targetFPS?: number;
    levelDurations?: number[]; // Duration for each level in seconds
}

/**
 * All difficulty levels in order of progression
 */
const DIFFICULTY_PROGRESSION: Difficulty[] = [
    Difficulty.EASY,
    Difficulty.MEDIUM,
    Difficulty.HARD,
    Difficulty.EXTREME
];

/**
 * Game class - Main game controller
 * 
 * Responsibilities:
 * 1. Generate and manage multiple levels
 * 2. Initialize the game field
 * 3. Run the game loop:
 *    - Render all objects
 *    - Check for collisions
 *    - Check for end of level
 *    - Progress to next level or end game
 *    - Repeat at target FPS
 */
export class Game {
    // Canvas and rendering
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    
    // Game state
    private gameState: GameState;
    private animationId: number;
    
    // Game components
    private player: Player;
    private gameField: GameField;
    private background: Background;
    private hud: HUD;
    
    // Level system
    private levels: Level[];
    private currentLevelIndex: number;
    private spawnedObjectIndices: Set<number>;
    private levelDurations: number[];
    
    // Timing
    private targetFPS: number;
    private frameInterval: number;
    private lastFrameTime: number;
    private levelStartTime: number;
    private elapsedTime: number;
    private pausedTime: number;
    private pauseStartTime: number;
    private totalGameTime: number;
    
    // Input
    private keys: { [key: string]: boolean };

    /**
     * Create a new Game instance
     * @param config Game configuration options
     */
    constructor(config: GameConfig | string) {
        // Handle both string (canvasId) and config object
        const options: GameConfig = typeof config === 'string' 
            ? { canvasId: config } 
            : config;

        // Initialize canvas
        this.canvas = document.getElementById(options.canvasId) as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error(`Canvas element with id '${options.canvasId}' not found`);
        }
        this.ctx = this.canvas.getContext('2d')!;

        // Configuration
        this.targetFPS = options.targetFPS ?? 60;
        this.frameInterval = 1000 / this.targetFPS;
        
        // Level durations for each difficulty (EASY, MEDIUM, HARD, EXTREME)
        this.levelDurations = options.levelDurations ?? [20, 25, 30, 35];

        // Initialize game state
        this.gameState = GameState.STOPPED;
        this.animationId = 0;

        // Initialize game components
        this.player = new Player();
        this.gameField = new GameField(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.background = new Background();
        this.hud = new HUD();

        // Initialize level system
        this.levels = [];
        this.currentLevelIndex = 0;
        this.spawnedObjectIndices = new Set();
        this.generateAllLevels();

        // Initialize timing
        this.lastFrameTime = 0;
        this.levelStartTime = 0;
        this.elapsedTime = 0;
        this.pausedTime = 0;
        this.pauseStartTime = 0;
        this.totalGameTime = 0;

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
     * Generate all levels for the game (one for each difficulty)
     */
    private generateAllLevels(): void {
        this.levels = DIFFICULTY_PROGRESSION.map((difficulty, index) => {
            const duration = this.levelDurations[index] ?? 30;
            return LevelGenerator.generate(duration, difficulty);
        });
    }

    /**
     * Get the current level
     */
    private get currentLevel(): Level {
        return this.levels[this.currentLevelIndex];
    }

    /**
     * Get current difficulty (from current level)
     */
    getDifficulty(): Difficulty {
        return this.currentLevel.difficulty;
    }

    /**
     * Get the current level number (1-based for display)
     */
    getCurrentLevelNumber(): number {
        return this.currentLevelIndex + 1;
    }

    /**
     * Get total number of levels
     */
    getTotalLevels(): number {
        return this.levels.length;
    }

    /**
     * Check if there are more levels after the current one
     */
    private hasNextLevel(): boolean {
        return this.currentLevelIndex < this.levels.length - 1;
    }

    /**
     * Advance to the next level
     * @returns true if advanced, false if no more levels
     */
    private advanceToNextLevel(): boolean {
        if (this.hasNextLevel()) {
            this.currentLevelIndex++;
            this.initializeFieldForLevel();
            this.levelStartTime = performance.now();
            this.pausedTime = 0;
            return true;
        }
        return false;
    }

    // ==========================================
    // FIELD INITIALIZATION
    // ==========================================

    /**
     * Initialize the game field for a new level
     * Clears all objects and resets spawn tracking
     */
    private initializeFieldForLevel(): void {
        // Clear all game objects from the field
        this.gameField.clear();
        
        // Reset spawn tracking
        this.spawnedObjectIndices = new Set();
    }

    /**
     * Initialize the game for a fresh start
     * Resets everything including player and level progression
     */
    private initializeGame(): void {
        // Reset to first level
        this.currentLevelIndex = 0;
        
        // Regenerate all levels for variety
        this.generateAllLevels();
        
        // Clear field
        this.initializeFieldForLevel();
        
        // Reset player to starting position
        this.player.reset();
        
        // Reset timing
        this.totalGameTime = 0;
    }

    /**
     * Spawn level objects based on elapsed time
     * @param elapsedTimeMs Elapsed time in milliseconds
     */
    private spawnLevelObjects(elapsedTimeMs: number): void {
        this.currentLevel.levelObjects.forEach((levelObj, index) => {
            // Only spawn if not already spawned and time has passed
            if (!this.spawnedObjectIndices.has(index) && levelObj.startTime <= elapsedTimeMs) {
                this.gameField.addObject(levelObj.gameObject);
                this.spawnedObjectIndices.add(index);
            }
        });
    }

    // ==========================================
    // GAME LOOP
    // ==========================================

    /**
     * Main game loop - called every frame
     * Handles: input → update → collision detection → level check → render
     * @param currentTime Current timestamp from requestAnimationFrame
     */
    private gameLoop = (currentTime: number): void => {
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
    }

    /**
     * Process a single game frame
     * @param currentTime Current timestamp
     */
    private processFrame(currentTime: number): void {
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
    private update(currentTime: number): void {
        // Calculate elapsed time for current level
        const elapsedTimeMs = currentTime - this.levelStartTime - this.pausedTime;
        this.elapsedTime = elapsedTimeMs / 1000;

        // Check for end of level
        if (this.checkLevelComplete(elapsedTimeMs)) {
            // Add level time to total
            this.totalGameTime += this.currentLevel.getDurationInSeconds();
            
            // Try to advance to next level
            if (this.hasNextLevel()) {
                this.advanceToNextLevel();
            } else {
                // All levels completed - player wins!
                this.gameState = GameState.WON;
            }
            return;
        }

        // Spawn new objects from level definition
        this.spawnLevelObjects(elapsedTimeMs);

        // Move all game objects
        this.gameField.updateAll();

        // Remove objects that have left the screen
        this.gameField.removeOffScreenObjects();

        // Check for collisions with player - game over!
        if (this.checkCollisions()) {
            this.totalGameTime += this.elapsedTime;
            this.gameState = GameState.GAME_OVER;
            return;
        }
    }

    /**
     * Check if the current level is complete
     * @param elapsedTimeMs Elapsed time in milliseconds
     * @returns true if level is complete
     */
    private checkLevelComplete(elapsedTimeMs: number): boolean {
        return elapsedTimeMs >= this.currentLevel.duration;
    }

    /**
     * Check for collisions between player and game objects
     * @returns true if collision detected
     */
    private checkCollisions(): boolean {
        return this.gameField.hasCollision(this.player);
    }

    /**
     * Render all game objects to the canvas
     */
    private render(): void {
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

            // Render HUD (status, time, level info)
            this.hud.draw(
                this.ctx,
                this.gameState,
                this.gameField.getObjectCount(),
                this.elapsedTime,
                levelDurationSec,
                this.currentLevelIndex + 1,
                this.levels.length,
                this.currentLevel.difficulty
            );
        }

        // Render overlay screens based on game state
        this.renderOverlay();
    }

    /**
     * Render overlay screens (start, pause, game over, win)
     */
    private renderOverlay(): void {
        switch (this.gameState) {
            case GameState.STOPPED:
                this.hud.drawStartScreen(this.ctx, this.levels.length);
                break;
            case GameState.PAUSED:
                this.hud.drawPausedScreen(this.ctx, this.currentLevelIndex + 1, this.currentLevel.difficulty);
                break;
            case GameState.GAME_OVER:
                this.hud.drawGameOver(this.ctx, this.totalGameTime, this.currentLevelIndex + 1, this.levels.length);
                break;
            case GameState.WON:
                this.hud.drawWinScreen(this.ctx, this.totalGameTime, this.levels.length);
                break;
        }
    }

    /**
     * Start the game loop
     */
    private startGameLoop(): void {
        this.lastFrameTime = performance.now();
        this.animationId = requestAnimationFrame(this.gameLoop);
    }

    /**
     * Stop the game loop
     */
    private stopGameLoop(): void {
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
    private setupEventListeners(): void {
        // Button controls
        document.getElementById('startBtn')?.addEventListener('click', () => this.start());
        document.getElementById('pauseBtn')?.addEventListener('click', () => this.pause());
        document.getElementById('resumeBtn')?.addEventListener('click', () => this.resume());
        document.getElementById('stopBtn')?.addEventListener('click', () => this.stop());

        // Keyboard controls
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keys[e.code] = true;

            // Prevent scrolling with arrow keys
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys[e.code] = false;
        });
    }

    /**
     * Handle player input based on pressed keys
     */
    private handleInput(): void {
        if (this.gameState !== GameState.RUNNING) return;

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
     * Start a new game from the beginning
     * Goes through all levels (EASY → MEDIUM → HARD → EXTREME)
     */
    start(): void {
        // Initialize the entire game (resets levels, player, etc.)
        this.initializeGame();

        // Reset timing for first level
        this.levelStartTime = performance.now();
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
    pause(): void {
        if (this.gameState === GameState.RUNNING) {
            this.gameState = GameState.PAUSED;
            this.pauseStartTime = performance.now();
        }
    }

    /**
     * Resume the game from pause
     */
    resume(): void {
        if (this.gameState === GameState.PAUSED) {
            this.pausedTime += performance.now() - this.pauseStartTime;
            this.gameState = GameState.RUNNING;
        }
    }

    /**
     * Stop the game and return to initial state
     */
    stop(): void {
        this.gameState = GameState.STOPPED;
        this.currentLevelIndex = 0;
        this.initializeFieldForLevel();
        this.player.reset();
        this.elapsedTime = 0;
        this.totalGameTime = 0;
    }

    // ==========================================
    // GETTERS
    // ==========================================

    /**
     * Get the current game state
     */
    getGameState(): GameState {
        return this.gameState;
    }

    /**
     * Get the current level object
     */
    getCurrentLevel(): Level {
        return this.currentLevel;
    }

    /**
     * Get the game field
     */
    getGameField(): GameField {
        return this.gameField;
    }

    /**
     * Get the player
     */
    getPlayer(): Player {
        return this.player;
    }

    /**
     * Get elapsed time in seconds (for current level)
     */
    getElapsedTime(): number {
        return this.elapsedTime;
    }

    /**
     * Get total game time across all levels
     */
    getTotalGameTime(): number {
        return this.totalGameTime + this.elapsedTime;
    }

    /**
     * Get target FPS
     */
    getTargetFPS(): number {
        return this.targetFPS;
    }

    /**
     * Set target FPS
     * @param fps Target frames per second
     */
    setTargetFPS(fps: number): void {
        this.targetFPS = fps;
        this.frameInterval = 1000 / fps;
    }
}
