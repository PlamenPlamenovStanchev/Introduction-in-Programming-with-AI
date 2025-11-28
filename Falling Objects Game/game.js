// Game Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 20;
const PLAYER_SPEED = 8;
const GAME_DURATION = 30; // seconds
const SPAWN_INTERVAL = 800; // milliseconds

// Game State
const GameState = {
    STOPPED: 'STOPPED',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER',
    WON: 'WON'
};

// Canvas and Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
let gameState = GameState.STOPPED;
let player;
let fallingObjects = [];
let stars = [];
let objectCount = 0;
let startTime = 0;
let elapsedTime = 0;
let pausedTime = 0;
let lastSpawnTime = 0;
let animationId;
let keys = {};

// Colors for objects
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8B500', '#FF6F61'
];

// Star class for background
class Star {
    constructor() {
        this.x = Math.random() * CANVAS_WIDTH;
        this.y = Math.random() * CANVAS_HEIGHT;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleDirection = 1;
    }

    update() {
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        if (this.opacity >= 1) {
            this.twinkleDirection = -1;
        } else if (this.opacity <= 0.2) {
            this.twinkleDirection = 1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// Player class
class Player {
    constructor() {
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.x = (CANVAS_WIDTH - this.width) / 2;
        this.y = CANVAS_HEIGHT - this.height - 10;
        this.color = '#4CAF50';
    }

    update() {
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.x -= PLAYER_SPEED;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.x += PLAYER_SPEED;
        }
        // Keep player within bounds
        this.x = Math.max(0, Math.min(CANVAS_WIDTH - this.width, this.x));
    }

    draw() {
        // Draw player as a spaceship-like shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Base FallingObject class
class FallingObject {
    constructor() {
        this.size = Math.random() * 25 + 20;
        this.x = Math.random() * (CANVAS_WIDTH - this.size);
        this.y = -this.size;
        this.speed = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    isOffScreen() {
        return this.y > CANVAS_HEIGHT + this.size;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.size,
            height: this.size
        };
    }
}

// Circle falling object
class CircleObject extends FallingObject {
    constructor() {
        super();
        this.radius = this.size / 2;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.radius, this.y + this.radius);
        ctx.rotate(this.rotation);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add highlight
        ctx.beginPath();
        ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.size,
            height: this.size,
            isCircle: true,
            centerX: this.x + this.radius,
            centerY: this.y + this.radius,
            radius: this.radius
        };
    }
}

// Square/Rectangle falling object
class SquareObject extends FallingObject {
    draw() {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        
        // Add highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size / 2, this.size / 2);
        
        ctx.restore();
    }
}

// Triangle falling object
class TriangleObject extends FallingObject {
    draw() {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);
        
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.restore();
    }
}

// Diamond falling object
class DiamondObject extends FallingObject {
    draw() {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);
        
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, 0);
        ctx.lineTo(0, this.size / 2);
        ctx.lineTo(-this.size / 2, 0);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.restore();
    }
}

// Zigzag moving object (more complex movement)
class ZigzagObject extends FallingObject {
    constructor() {
        super();
        this.amplitude = Math.random() * 50 + 30;
        this.frequency = Math.random() * 0.05 + 0.02;
        this.initialX = this.x;
        this.time = 0;
    }

    update() {
        this.y += this.speed;
        this.time += 1;
        this.x = this.initialX + Math.sin(this.time * this.frequency) * this.amplitude;
        this.x = Math.max(0, Math.min(CANVAS_WIDTH - this.size, this.x));
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);
        
        // Draw star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = this.size / 2;
            if (i === 0) {
                ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            } else {
                ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.restore();
    }
}

// Fast falling object
class FastObject extends FallingObject {
    constructor() {
        super();
        this.speed = Math.random() * 3 + 4; // Faster speed
        this.size = Math.random() * 15 + 15; // Smaller size
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        
        // Draw as meteor with trail
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Trail effect
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(0, -this.size * i * 0.3, this.size / 2 - i * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 100, ${0.3 - i * 0.08})`;
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Initialize stars for background
function initStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push(new Star());
    }
}

// Create random falling object
function createFallingObject() {
    const types = [CircleObject, SquareObject, TriangleObject, DiamondObject, ZigzagObject, FastObject];
    const RandomType = types[Math.floor(Math.random() * types.length)];
    return new RandomType();
}

// Check collision between player and object
function checkCollision(player, object) {
    const playerBounds = player.getBounds();
    const objectBounds = object.getBounds();

    // Simple rectangle collision
    return (
        playerBounds.x < objectBounds.x + objectBounds.width &&
        playerBounds.x + playerBounds.width > objectBounds.x &&
        playerBounds.y < objectBounds.y + objectBounds.height &&
        playerBounds.y + playerBounds.height > objectBounds.y
    );
}

// Draw galactic background
function drawBackground() {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.5, '#1a1a3e');
    gradient.addColorStop(1, '#0f1f3a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // Add some nebula effects
    ctx.beginPath();
    const nebulaGradient = ctx.createRadialGradient(600, 150, 0, 600, 150, 200);
    nebulaGradient.addColorStop(0, 'rgba(100, 50, 150, 0.1)');
    nebulaGradient.addColorStop(1, 'rgba(100, 50, 150, 0)');
    ctx.fillStyle = nebulaGradient;
    ctx.arc(600, 150, 200, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    const nebulaGradient2 = ctx.createRadialGradient(200, 350, 0, 200, 350, 150);
    nebulaGradient2.addColorStop(0, 'rgba(50, 100, 150, 0.08)');
    nebulaGradient2.addColorStop(1, 'rgba(50, 100, 150, 0)');
    ctx.fillStyle = nebulaGradient2;
    ctx.arc(200, 350, 150, 0, Math.PI * 2);
    ctx.fill();
}

// Draw HUD (Heads Up Display)
function drawHUD() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 16px Arial';
    
    // Status
    ctx.fillText(`Status: ${gameState}`, 15, 25);
    
    // Object count
    ctx.fillText(`Objects: ${objectCount}`, 15, 50);
    
    // Time
    const timeRemaining = Math.max(0, GAME_DURATION - elapsedTime);
    ctx.fillText(`Time: ${elapsedTime.toFixed(2)}s / ${GAME_DURATION.toFixed(2)}s`, 15, 75);
    
    // Progress bar
    const barWidth = 150;
    const barHeight = 10;
    const progress = Math.min(elapsedTime / GAME_DURATION, 1);
    
    ctx.fillStyle = '#333';
    ctx.fillRect(15, 85, barWidth, barHeight);
    
    ctx.fillStyle = progress < 0.7 ? '#4CAF50' : (progress < 0.9 ? '#FF9800' : '#f44336');
    ctx.fillRect(15, 85, barWidth * progress, barHeight);
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 85, barWidth, barHeight);
}

// Draw game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.fillStyle = '#f44336';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
    
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`You survived for ${elapsedTime.toFixed(2)} seconds`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    ctx.fillText('Press Start to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    
    ctx.textAlign = 'left';
}

// Draw win screen
function drawWinScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('YOU WIN!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
    
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`You survived the full ${GAME_DURATION} seconds!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    ctx.fillText('Press Start to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    
    ctx.textAlign = 'left';
}

// Main game loop
function gameLoop(currentTime) {
    if (gameState === GameState.RUNNING) {
        // Calculate elapsed time
        elapsedTime = (currentTime - startTime - pausedTime) / 1000;
        
        // Check win condition
        if (elapsedTime >= GAME_DURATION) {
            gameState = GameState.WON;
        }
        
        // Spawn new objects
        if (currentTime - lastSpawnTime > SPAWN_INTERVAL) {
            fallingObjects.push(createFallingObject());
            objectCount++;
            lastSpawnTime = currentTime;
        }
        
        // Update player
        player.update();
        
        // Update falling objects
        fallingObjects.forEach(obj => obj.update());
        
        // Remove off-screen objects
        fallingObjects = fallingObjects.filter(obj => !obj.isOffScreen());
        
        // Check collisions
        for (const obj of fallingObjects) {
            if (checkCollision(player, obj)) {
                gameState = GameState.GAME_OVER;
                break;
            }
        }
    }
    
    // Draw everything
    drawBackground();
    
    if (gameState !== GameState.STOPPED) {
        fallingObjects.forEach(obj => obj.draw());
        player.draw();
        drawHUD();
    }
    
    if (gameState === GameState.GAME_OVER) {
        drawGameOver();
    } else if (gameState === GameState.WON) {
        drawWinScreen();
    } else if (gameState === GameState.STOPPED) {
        // Draw start screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('FALLING OBJECTS', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
        
        ctx.font = '20px Arial';
        ctx.fillText('Press Start to begin', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.textAlign = 'left';
    } else if (gameState === GameState.PAUSED) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.textAlign = 'left';
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    gameState = GameState.RUNNING;
    player = new Player();
    fallingObjects = [];
    objectCount = 0;
    startTime = performance.now();
    pausedTime = 0;
    elapsedTime = 0;
    lastSpawnTime = startTime;
    initStars();
}

// Pause game
function pauseGame() {
    if (gameState === GameState.RUNNING) {
        gameState = GameState.PAUSED;
        pauseStartTime = performance.now();
    }
}

// Resume game
let pauseStartTime = 0;
function resumeGame() {
    if (gameState === GameState.PAUSED) {
        pausedTime += performance.now() - pauseStartTime;
        gameState = GameState.RUNNING;
    }
}

// Stop game
function stopGame() {
    gameState = GameState.STOPPED;
    fallingObjects = [];
    objectCount = 0;
    elapsedTime = 0;
}

// Event listeners
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', pauseGame);
document.getElementById('resumeBtn').addEventListener('click', resumeGame);
document.getElementById('stopBtn').addEventListener('click', stopGame);

// Keyboard events
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    // Prevent scrolling with arrow keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Initialize and start game loop
initStars();
animationId = requestAnimationFrame(gameLoop);
