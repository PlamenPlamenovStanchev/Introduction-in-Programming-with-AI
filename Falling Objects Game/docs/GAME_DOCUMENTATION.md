# 🌌 Falling Objects Game - Documentation

## Table of Contents
1. [Game Overview](#game-overview)
2. [Game Mechanics](#game-mechanics)
3. [Architecture & Design](#architecture--design)
4. [Class Hierarchy](#class-hierarchy)
5. [Game Loop](#game-loop)
6. [Level System](#level-system)
7. [Collision Detection](#collision-detection)
8. [Controls](#controls)
9. [Configuration](#configuration)

---

## Game Overview

**Falling Objects** is a survival arcade game built with TypeScript and HTML5 Canvas. The player controls a spaceship at the bottom of a galactic playing field and must avoid falling objects of various shapes and sizes to survive through multiple levels of increasing difficulty.

### Objective
- **Survive** through all 4 levels (EASY → MEDIUM → HARD → EXTREME)
- **Avoid** all falling objects (circles, squares, triangles)
- **Win** by completing all levels without collision

### Game States
| State | Description |
|-------|-------------|
| `STOPPED` | Initial state, waiting for player to start |
| `RUNNING` | Game is active, objects are falling |
| `PAUSED` | Game is temporarily halted |
| `GAME_OVER` | Player collided with an object |
| `WON` | Player completed all levels |

---

## Game Mechanics

### Playing Field
- **Dimensions**: 800 × 500 pixels
- **Background**: Animated galactic starfield with twinkling stars
- **Coordinate System**: Origin (0,0) at top-left corner

### Player
- **Shape**: Rectangle (spaceship)
- **Size**: 60 × 20 pixels
- **Starting Position**: Center-bottom of the screen
- **Movement**: Horizontal only (left/right)
- **Speed**: 8 pixels per frame

### Falling Objects

Three types of objects fall from the top of the screen:

| Object Type | Shape | Special Properties |
|-------------|-------|-------------------|
| `FallingCircle` | Circle | Smooth edges, radius-based collision |
| `RotatingFallingSquare` | Square | Rotates while falling |
| `RotatingFallingTriangle` | Triangle | Rotates while falling, pointed shape |

**Common Properties:**
- `location`: Current position (x, y coordinates)
- `speed`: Falling velocity (pixels per frame)
- `size/radius`: Object dimensions
- `color`: Fill color (randomly selected)
- `borderColor`: Stroke color

### Scoring & Progression
- No traditional score system
- Progress measured by **survival time** and **levels completed**
- Difficulty increases with each level

---

## Architecture & Design

### Design Patterns Used

1. **Interface-Based Design**
   - Core interfaces (`Point`, `Bounds`, `GameObject`) define contracts
   - Enables polymorphism and loose coupling

2. **Abstract Factory Pattern**
   - `LevelGenerator` creates random falling objects
   - Configurable based on difficulty settings

3. **Game Loop Pattern**
   - Fixed timestep with FPS control (60 FPS default)
   - Separation of update and render phases

4. **Component Composition**
   - `GameField` manages collection of `GameObject` instances
   - `HUD` handles all UI rendering separately

### Project Structure

```
src/
├── interfaces.ts       # Core interfaces (Point, Bounds, GameObject)
├── BaseGameObject.ts   # Abstract base class, constants, GameState enum
├── Player.ts           # Player class with movement logic
├── FallingObjects.ts   # FallingCircle, RotatingFallingSquare, RotatingFallingTriangle
├── Background.ts       # Star and Background classes for visuals
├── HUD.ts              # Heads-Up Display rendering
├── Level.ts            # Level and LevelObject classes, Difficulty enum
├── LevelGenerator.ts   # Level generation with difficulty configs
├── GameField.ts        # Game field managing active objects
├── Game.ts             # Main game controller
└── main.ts             # Entry point
```

---

## Class Hierarchy

### Core Interfaces

```typescript
interface Point {
    x: number;
    y: number;
}

interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface GameObject {
    location: Point;
    speed: number;
    move(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    getBounds(): Bounds;
    hasCollision(other: GameObject): boolean;
}
```

### Class Diagram

```
GameObject (interface)
    │
    └── BaseGameObject (abstract)
            │
            ├── Player
            │       Properties: location, width, height, color, borderColor
            │       Methods: moveLeft(), moveRight(), reset()
            │
            ├── FallingCircle
            │       Properties: location, speed, radius, color, borderColor
            │
            ├── RotatingFallingSquare
            │       Properties: location, speed, size, color, borderColor, rotation
            │
            └── RotatingFallingTriangle
                    Properties: location, speed, size, color, borderColor, rotation
```

### Support Classes

```
Level
    Properties: difficulty, duration, levelObjects[]
    
LevelObject
    Properties: startTime, gameObject
    
GameField
    Properties: width, height, gameObjects[]
    Methods: addObject(), clear(), updateAll(), removeOffScreenObjects(), 
             hasCollision(), drawAll()

LevelGenerator (static)
    Methods: generate(), createRandomObject()
    
Background
    Properties: stars[]
    Methods: update(), draw(), reset()
    
HUD
    Methods: draw(), drawStartScreen(), drawPausedScreen(), 
             drawGameOver(), drawWinScreen()
```

---

## Game Loop

The game uses a fixed-timestep loop controlled by `requestAnimationFrame`:

```
┌─────────────────────────────────────────────────────────┐
│                     GAME LOOP                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. REQUEST ANIMATION FRAME                             │
│         ↓                                               │
│  2. CHECK FPS TIMING (skip if too early)                │
│         ↓                                               │
│  3. HANDLE INPUT                                        │
│     └── Read keyboard state                             │
│     └── Move player if keys pressed                     │
│         ↓                                               │
│  4. UPDATE (if RUNNING)                                 │
│     └── Calculate elapsed time                          │
│     └── Check level completion                          │
│     └── Spawn new objects based on time                 │
│     └── Move all falling objects                        │
│     └── Remove off-screen objects                       │
│     └── Check collisions                                │
│         ↓                                               │
│  5. RENDER                                              │
│     └── Draw background (stars)                         │
│     └── Draw all falling objects                        │
│     └── Draw player                                     │
│     └── Draw HUD (level, time, progress)                │
│     └── Draw overlay (if paused/game over/won)          │
│         ↓                                               │
│  6. REPEAT (go to step 1)                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Frame Timing
- **Target FPS**: 60 frames per second
- **Frame Interval**: ~16.67 milliseconds
- **Delta Time**: Used to maintain consistent speed regardless of frame rate

---

## Level System

### Difficulty Progression

| Level | Difficulty | Duration | Objects/Second | Speed Range | Size Range |
|-------|------------|----------|----------------|-------------|------------|
| 1 | EASY | 20s | 0.7 | 1-2 | 20-35 |
| 2 | MEDIUM | 25s | 1.2 | 1.5-3 | 18-40 |
| 3 | HARD | 30s | 1.8 | 2-4 | 15-45 |
| 4 | EXTREME | 35s | 2.5 | 2.5-5.5 | 12-50 |

### Level Generation Algorithm

```
1. Calculate total objects = duration × objectsPerSecond
2. Generate random spawn times distributed across level duration
3. For each spawn time:
   a. Randomly select object type (circle/square/triangle)
   b. Randomize speed within difficulty range
   c. Randomize size within difficulty range
   d. Set random x position (within canvas bounds)
   e. Set y position above screen (-size)
   f. Create LevelObject with spawn time and game object
4. Sort all LevelObjects by spawn time
```

### Level Transition Flow

```
Level 1 (EASY)
    ↓ [complete]
Level 2 (MEDIUM)
    ↓ [complete]
Level 3 (HARD)
    ↓ [complete]
Level 4 (EXTREME)
    ↓ [complete]
  WIN! 🎉
```

---

## Collision Detection

### Bounding Box Collision (AABB)

All collision detection uses Axis-Aligned Bounding Box (AABB) algorithm:

```typescript
hasCollision(other: GameObject): boolean {
    const a = this.getBounds();
    const b = other.getBounds();
    
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
```

### Collision Check Flow

```
For each falling object in GameField:
    │
    ├── Get player bounds
    ├── Get object bounds
    ├── Check AABB overlap
    │
    └── If overlap detected → GAME OVER
```

### Bounding Box Calculation by Shape

| Shape | Bounding Box |
|-------|--------------|
| Circle | Square around circle: (x-r, y-r, 2r, 2r) |
| Square | Exact square bounds (ignoring rotation) |
| Triangle | Square containing triangle |
| Player | Exact rectangle bounds |

---

## Controls

### Keyboard Controls

| Key | Action |
|-----|--------|
| `←` (Arrow Left) | Move player left |
| `→` (Arrow Right) | Move player right |
| `A` | Move player left (alternative) |
| `D` | Move player right (alternative) |

### Button Controls

| Button | Action |
|--------|--------|
| Start | Begin new game from Level 1 |
| Pause | Pause the game |
| Resume | Continue from pause |
| Stop | End game and return to start screen |

### Movement Constraints

- Player cannot move beyond left edge (x ≥ 0)
- Player cannot move beyond right edge (x ≤ CANVAS_WIDTH - PLAYER_WIDTH)
- Movement speed: 8 pixels per frame

---

## Configuration

### Game Constants (BaseGameObject.ts)

```typescript
CANVAS_WIDTH = 800      // Playing field width
CANVAS_HEIGHT = 500     // Playing field height
PLAYER_WIDTH = 60       // Player rectangle width
PLAYER_HEIGHT = 20      // Player rectangle height
PLAYER_SPEED = 8        // Player movement speed
```

### Game Configuration Options

```typescript
interface GameConfig {
    canvasId: string;           // Canvas element ID
    targetFPS?: number;         // Target frames per second (default: 60)
    levelDurations?: number[];  // Duration for each level in seconds
}
```

### Customizing Level Durations

```typescript
const game = new Game({
    canvasId: 'gameCanvas',
    targetFPS: 60,
    levelDurations: [15, 20, 25, 30]  // Custom durations per level
});
```

---

## Visual Design

### Color Palette

**Background:**
- Dark space gradient (#0a0a2e to #1a1a4e)
- White/yellow twinkling stars

**Player:**
- Cyan fill (#00CED1)
- White border

**Falling Objects:**
- Random bright colors from palette:
  - `#FF6B6B` (red)
  - `#4ECDC4` (teal)
  - `#45B7D1` (blue)
  - `#96CEB4` (green)
  - `#FFEAA7` (yellow)
  - `#DDA0DD` (plum)
  - And more...

**HUD:**
- White text on semi-transparent background
- Green/Orange/Red progress bar based on time

---

## Technical Stack

- **Language**: TypeScript (strict mode)
- **Rendering**: HTML5 Canvas 2D API
- **Build Tool**: Vite
- **Module System**: ES Modules
- **Target**: ES2020

---

## Future Enhancement Ideas

1. **Power-ups**: Shields, slow-motion, size reduction
2. **Score System**: Points based on survival time and difficulty
3. **Leaderboard**: Local storage high scores
4. **Sound Effects**: Collision sounds, background music
5. **Mobile Support**: Touch controls
6. **Additional Object Types**: Zigzag patterns, homing objects
7. **Boss Levels**: Special challenges between difficulty tiers

---

*Documentation created for Falling Objects Game v1.0*
