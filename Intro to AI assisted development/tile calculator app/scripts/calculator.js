class TileCalculator {
    constructor() {
        this.wastePercentage = 10; // Standard waste allowance
    }

    calculateRequirements(dimensions) {
        const {
            floorWidth,
            floorLength,
            floorTileWidth,
            floorTileLength,
            wallHeight,
            wallTileWidth,
            wallTileHeight,
            doorWidth,
            doorHeight
        } = dimensions;

        // Calculate floor area and tiles
        const floorArea = (floorWidth * floorLength) / 1000000; // Convert to square meters
        const floorTilesNeeded = utils.calculateTilesNeeded(
            floorArea,
            floorTileWidth,
            floorTileLength,
            this.wastePercentage
        );

        // Calculate wall areas and tiles
        const wallAreas = this.calculateWallAreas(
            floorWidth,
            floorLength,
            wallHeight,
            doorWidth,
            doorHeight
        );

        const wallTilesNeeded = utils.calculateTilesNeeded(
            wallAreas.total,
            wallTileWidth,
            wallTileHeight,
            this.wastePercentage
        );

        return {
            floorTiles: floorTilesNeeded,
            wallTiles: wallTilesNeeded,
            totalArea: utils.formatNumber(floorArea + wallAreas.total),
            areas: {
                floor: utils.formatNumber(floorArea),
                walls: wallAreas
            }
        };
    }

    calculateWallAreas(roomWidth, roomLength, height, doorWidth, doorHeight) {
        // Calculate individual wall areas
        const wall1 = utils.calculateWallArea(roomWidth, height, true, doorWidth, doorHeight);
        const wall2 = utils.calculateWallArea(roomLength, height);
        const wall3 = utils.calculateWallArea(roomWidth, height);
        const wall4 = utils.calculateWallArea(roomLength, height);

        return {
            wall1: utils.formatNumber(wall1),
            wall2: utils.formatNumber(wall2),
            wall3: utils.formatNumber(wall3),
            wall4: utils.formatNumber(wall4),
            total: utils.formatNumber(wall1 + wall2 + wall3 + wall4)
        };
    }

    validateInputs(dimensions) {
        const validations = {
            floorWidth: { min: 500, max: 10000 },
            floorLength: { min: 500, max: 10000 },
            floorTileWidth: { min: 100, max: 1000 },
            floorTileLength: { min: 100, max: 1000 },
            wallHeight: { min: 1000, max: 5000 },
            wallTileWidth: { min: 100, max: 1000 },
            wallTileHeight: { min: 100, max: 1000 },
            doorWidth: { min: 600, max: 1500 },
            doorHeight: { min: 1800, max: 2400 }
        };

        for (const [key, value] of Object.entries(dimensions)) {
            const { min, max } = validations[key];
            if (!utils.validateDimensions(value, min, max)) {
                throw new Error(`Invalid ${key}: Must be between ${min} and ${max} mm`);
            }
        }

        return true;
    }
}