let width = 10;
let height = 10;
let currentMode = 'wall';
let maze = [];
let startCell = null;
let endCell = null;
let pathCells = [];

// Initialize maze
function initMaze() {
    maze = Array(height).fill(null).map(() => Array(width).fill('free'));
    startCell = null;
    endCell = null;
    pathCells = [];
    renderMaze();
    updateInfo();
}

// Update dimensions
function updateDimensions() {
    width = parseInt(document.getElementById('widthSlider').value);
    height = parseInt(document.getElementById('heightSlider').value);
    document.getElementById('widthValue').textContent = width;
    document.getElementById('heightValue').textContent = height;
    
    const grid = document.getElementById('mazeGrid');
    grid.style.gridTemplateColumns = `repeat(${width}, 40px)`;
    
    initMaze();
}

// Set current mode
function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Handle cell click
function cellClick(row, col) {
    if (currentMode === 'wall') {
        maze[row][col] = maze[row][col] === 'wall' ? 'free' : 'wall';
    } else if (currentMode === 'free') {
        maze[row][col] = 'free';
    } else if (currentMode === 'start') {
        if (startCell) maze[startCell.row][startCell.col] = 'free';
        startCell = {row, col};
        maze[row][col] = 'start';
    } else if (currentMode === 'end') {
        if (endCell) maze[endCell.row][endCell.col] = 'free';
        endCell = {row, col};
        maze[row][col] = 'end';
    }
    
    renderMaze();
    updateInfo();
}

// Render maze
function renderMaze() {
    const grid = document.getElementById('mazeGrid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${width}, 40px)`;
    
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const cell = document.createElement('div');
            cell.className = `cell ${maze[row][col]}`;
            
            // Add arrow for path cells
            if (maze[row][col] === 'path' && pathCells[row] && pathCells[row][col]) {
                const arrow = pathCells[row][col];
                cell.textContent = arrow;
            } else if (maze[row][col] === 'start') {
                cell.textContent = 'S';
            } else if (maze[row][col] === 'end') {
                cell.textContent = 'E';
            }
            
            cell.onclick = () => cellClick(row, col);
            grid.appendChild(cell);
        }
    }
}

// BFS pathfinding algorithm
function bfs() {
    if (!startCell || !endCell) {
        showMessage('Please set both start and end cells', 'error');
        return null;
    }
    
    const queue = [[startCell.row, startCell.col]];
    const visited = Array(height).fill(null).map(() => Array(width).fill(false));
    const parent = Array(height).fill(null).map(() => Array(width).fill(null));
    
    visited[startCell.row][startCell.col] = true;
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right
    
    while (queue.length > 0) {
        const [row, col] = queue.shift();
        
        if (row === endCell.row && col === endCell.col) {
            // Path found, reconstruct it
            return reconstructPath(parent);
        }
        
        for (let [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < height && 
                newCol >= 0 && newCol < width && 
                !visited[newRow][newCol] && 
                maze[newRow][newCol] !== 'wall') {
                
                visited[newRow][newCol] = true;
                parent[newRow][newCol] = {row, col, dr, dc};
                queue.push([newRow, newCol]);
            }
        }
    }
    
    return null; // No path found
}

// Reconstruct path from parent array
function reconstructPath(parent) {
    const path = [];
    let current = {row: endCell.row, col: endCell.col};
    
    while (current.row !== startCell.row || current.col !== startCell.col) {
        path.unshift(current);
        if (parent[current.row][current.col] === null) break;
        current = {row: parent[current.row][current.col].row, col: parent[current.row][current.col].col};
    }
    
    path.unshift(startCell);
    return path;
}

// Direction to arrow
function directionToArrow(dr, dc) {
    if (dr === -1) return '↑';
    if (dr === 1) return '↓';
    if (dc === -1) return '←';
    if (dc === 1) return '→';
    return '';
}

// Find and visualize path
function findPath() {
    pathCells = Array(height).fill(null).map(() => Array(width).fill(null));
    const path = bfs();
    
    if (!path) {
        showMessage('No path found!', 'error');
        return;
    }
    
    // Clear previous path
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (maze[row][col] === 'path') {
                maze[row][col] = 'free';
            }
        }
    }
    
    // Mark path cells with arrows
    for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];
        const dr = next.row - current.row;
        const dc = next.col - current.col;
        const arrow = directionToArrow(dr, dc);
        
        if (!(current.row === startCell.row && current.col === startCell.col)) {
            maze[current.row][current.col] = 'path';
            pathCells[current.row][current.col] = arrow;
        }
    }
    
    const pathLength = path.length - 1;
    showMessage(`Path found! Length: ${pathLength} steps`, 'success');
    document.getElementById('pathLengthInfo').textContent = pathLength;
    renderMaze();
}

// Clear maze
function clearMaze() {
    initMaze();
    showMessage('Maze cleared', 'success');
}

// Clear path only
function clearPath() {
    pathCells = Array(height).fill(null).map(() => Array(width).fill(null));
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (maze[row][col] === 'path') {
                maze[row][col] = 'free';
            }
        }
    }
    document.getElementById('pathLengthInfo').textContent = '-';
    renderMaze();
}

// Generate random maze
function randomMaze() {
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (!((startCell && row === startCell.row && col === startCell.col) ||
                  (endCell && row === endCell.row && col === endCell.col))) {
                maze[row][col] = Math.random() > 0.7 ? 'wall' : 'free';
            }
        }
    }
    renderMaze();
}

// Update info display
function updateInfo() {
    document.getElementById('startInfo').textContent = startCell 
        ? `(${startCell.row}, ${startCell.col})` 
        : 'Not set';
    
    document.getElementById('endInfo').textContent = endCell 
        ? `(${endCell.row}, ${endCell.col})` 
        : 'Not set';
}

// Show message
function showMessage(text, type) {
    const msgEl = document.getElementById('message');
    msgEl.textContent = text;
    msgEl.className = type;
    
    setTimeout(() => {
        msgEl.className = '';
    }, 3000);
}

// Initialize on load
initMaze();
