// Initialize classes
const calculator = new TileCalculator();
const visualizer = new RoomVisualizer();

// Form handling
document.getElementById('tileCalculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect form data
    const dimensions = {
        floorWidth: parseFloat(document.getElementById('floorWidth').value),
        floorLength: parseFloat(document.getElementById('floorLength').value),
        floorTileWidth: parseFloat(document.getElementById('floorTileWidth').value),
        floorTileLength: parseFloat(document.getElementById('floorTileLength').value),
        wallHeight: parseFloat(document.getElementById('wallHeight').value),
        wallTileWidth: parseFloat(document.getElementById('wallTileWidth').value),
        wallTileHeight: parseFloat(document.getElementById('wallTileHeight').value),
        doorWidth: parseFloat(document.getElementById('doorWidth').value),
        doorHeight: parseFloat(document.getElementById('doorHeight').value)
    };

    try {
        // Validate inputs
        calculator.validateInputs(dimensions);

        // Calculate requirements
        const results = calculator.calculateRequirements(dimensions);

        // Update results display
        updateResults(results);

        // Initialize and draw visualization
        visualizer.initialize(dimensions);

        // Show results section
        document.getElementById('results').classList.remove('hidden');
        document.querySelector('.visualization').classList.add('active');

    } catch (error) {
        alert(error.message);
    }
});

// Update results in the DOM
function updateResults(results) {
    document.getElementById('floorTilesCount').textContent = `${results.floorTiles} tiles`;
    document.getElementById('wallTilesCount').textContent = `${results.wallTiles} tiles`;
    document.getElementById('totalArea').textContent = `${results.totalArea} m²`;
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (visualizer.dimensions) {
            visualizer.initialize(visualizer.dimensions);
        }
    }, 250);
});