class RoomVisualizer {
    constructor() {
        this.floorCanvas = document.getElementById('floorCanvas');
        this.wallCanvases = [
            document.getElementById('wallCanvas1'),
            document.getElementById('wallCanvas2'),
            document.getElementById('wallCanvas3'),
            document.getElementById('wallCanvas4')
        ];
        this.colors = utils.generateColorScheme();
    }

    initialize(dimensions) {
        this.dimensions = dimensions;
        this.setupCanvases();
        this.drawRoom();
    }

    setupCanvases() {
        // Set up floor canvas
        const containerWidth = this.floorCanvas.parentElement.offsetWidth;
        const containerHeight = this.floorCanvas.parentElement.offsetHeight;
        
        this.floorCanvas.width = containerWidth * 0.6;
        this.floorCanvas.height = containerHeight * 0.6;

        // Set up wall canvases
        this.wallCanvases.forEach(canvas => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });
    }

    drawRoom() {
        this.drawFloor();
        this.drawWalls();
    }

    drawFloor() {
        const ctx = this.floorCanvas.getContext('2d');
        const { floorWidth, floorLength, floorTileWidth, floorTileLength } = this.dimensions;

        // Clear canvas
        ctx.clearRect(0, 0, this.floorCanvas.width, this.floorCanvas.height);

        // Scale dimensions to fit canvas
        const scaledWidth = utils.scaleForCanvas(floorWidth, this.floorCanvas.width);
        const scaledLength = utils.scaleForCanvas(floorLength, this.floorCanvas.height);
        const scaledTileWidth = utils.scaleForCanvas(floorTileWidth, this.floorCanvas.width);
        const scaledTileLength = utils.scaleForCanvas(floorTileLength, this.floorCanvas.height);

        // Draw floor outline
        ctx.strokeStyle = this.colors.wallOutline;
        ctx.lineWidth = 2;
        ctx.strokeRect(
            (this.floorCanvas.width - scaledWidth) / 2,
            (this.floorCanvas.height - scaledLength) / 2,
            scaledWidth,
            scaledLength
        );

        // Draw tiles
        ctx.strokeStyle = this.colors.tileStroke;
        ctx.lineWidth = 0.5;

        const startX = (this.floorCanvas.width - scaledWidth) / 2;
        const startY = (this.floorCanvas.height - scaledLength) / 2;

        for (let x = startX; x < startX + scaledWidth; x += scaledTileWidth) {
            for (let y = startY; y < startY + scaledLength; y += scaledTileLength) {
                ctx.strokeRect(x, y, scaledTileWidth, scaledTileLength);
            }
        }
    }

    drawWalls() {
        const { 
            floorWidth, 
            floorLength, 
            wallHeight,
            wallTileWidth, 
            wallTileHeight,
            doorWidth,
            doorHeight 
        } = this.dimensions;

        this.wallCanvases.forEach((canvas, index) => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate scaled dimensions
            const wallWidth = index % 2 === 0 ? floorWidth : floorLength;
            const scaledWidth = utils.scaleForCanvas(wallWidth, canvas.width);
            const scaledHeight = utils.scaleForCanvas(wallHeight, canvas.height);
            const scaledTileWidth = utils.scaleForCanvas(wallTileWidth, canvas.width);
            const scaledTileHeight = utils.scaleForCanvas(wallTileHeight, canvas.height);

            // Draw wall outline
            ctx.strokeStyle = this.colors.wallOutline;
            ctx.lineWidth = 2;
            ctx.strokeRect(
                (canvas.width - scaledWidth) / 2,
                (canvas.height - scaledHeight) / 2,
                scaledWidth,
                scaledHeight
            );

            // Draw tiles
            ctx.strokeStyle = this.colors.tileStroke;
            ctx.lineWidth = 0.5;

            const startX = (canvas.width - scaledWidth) / 2;
            const startY = (canvas.height - scaledHeight) / 2;

            for (let x = startX; x < startX + scaledWidth; x += scaledTileWidth) {
                for (let y = startY; y < startY + scaledHeight; y += scaledTileHeight) {
                    // Check if tile position intersects with door (only for front wall)
                    if (index === 0) {
                        const scaledDoorWidth = utils.scaleForCanvas(doorWidth, canvas.width);
                        const scaledDoorHeight = utils.scaleForCanvas(doorHeight, canvas.height);
                        const doorX = startX + (scaledWidth - scaledDoorWidth) / 2;
                        const doorY = startY + scaledHeight - scaledDoorHeight;

                        if (!utils.isPointInDoor(x, y, doorX, doorY, scaledDoorWidth, scaledDoorHeight)) {
                            ctx.strokeRect(x, y, scaledTileWidth, scaledTileHeight);
                        }
                    } else {
                        ctx.strokeRect(x, y, scaledTileWidth, scaledTileHeight);
                    }
                }
            }

            // Draw door (only on front wall)
            if (index === 0) {
                const scaledDoorWidth = utils.scaleForCanvas(doorWidth, canvas.width);
                const scaledDoorHeight = utils.scaleForCanvas(doorHeight, canvas.height);
                const doorX = startX + (scaledWidth - scaledDoorWidth) / 2;
                const doorY = startY + scaledHeight - scaledDoorHeight;

                ctx.fillStyle = this.colors.doorFill;
                ctx.fillRect(doorX, doorY, scaledDoorWidth, scaledDoorHeight);
                ctx.strokeStyle = this.colors.doorStroke;
                ctx.strokeRect(doorX, doorY, scaledDoorWidth, scaledDoorHeight);
            }
        });
    }
}