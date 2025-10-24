// Utility functions for calculations and conversions
const utils = {
    // Calculate number of tiles needed for a given area with waste allowance
    calculateTilesNeeded: function(area, tileWidth, tileLength, wastePercentage = 10) {
        const tileArea = (tileWidth * tileLength) / 1000000; // Convert to square meters
        const tilesNeeded = Math.ceil(area / tileArea);
        return Math.ceil(tilesNeeded * (1 + wastePercentage / 100));
    },

    // Calculate wall area excluding door
    calculateWallArea: function(width, height, isDoorWall = false, doorWidth = 0, doorHeight = 0) {
        const wallArea = (width * height) / 1000000; // Convert to square meters
        if (isDoorWall) {
            const doorArea = (doorWidth * doorHeight) / 1000000;
            return wallArea - doorArea;
        }
        return wallArea;
    },

    // Format number to 2 decimal places
    formatNumber: function(number) {
        return Number(number.toFixed(2));
    },

    // Validate input dimensions
    validateDimensions: function(value, min, max) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },

    // Scale dimensions for visualization
    scaleForCanvas: function(dimension, maxSize) {
        const scaleFactor = 0.8; // Leave some margin
        return (dimension * maxSize * scaleFactor) / 10000; // Scale down from mm
    },

    // Generate a color scheme for visualization
    generateColorScheme: function() {
        return {
            tileStroke: '#ccc',
            tileFill: '#fff',
            doorFill: '#f8f9fa',
            doorStroke: '#666',
            wallOutline: '#2196f3'
        };
    },

    // Check if point is inside door area
    isPointInDoor: function(x, y, doorX, doorY, doorWidth, doorHeight) {
        return x >= doorX && 
               x <= doorX + doorWidth && 
               y >= doorY && 
               y <= doorY + doorHeight;
    }
};