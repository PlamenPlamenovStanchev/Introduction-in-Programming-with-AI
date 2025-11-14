// ============================================
// Class Color
// ============================================
class Color {
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    toString() {
        // Convert RGB values to hex format #RRGGBB
        const toHex = (value) => {
            const hex = value.toString(16).toUpperCase();
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(this.red)}${toHex(this.green)}${toHex(this.blue)}`;
    }
}

// ============================================
// Class Figure (Abstract)
// ============================================
class Figure {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(dX, dY) {
        this.x += dX;
        this.y += dY;
    }

    resetPosition() {
        this.x = 0;
        this.y = 0;
    }

    area() {
        throw new Error('Method area() must be implemented in subclass');
    }

    perimeter() {
        throw new Error('Method perimeter() must be implemented in subclass');
    }
}

// ============================================
// Class ColorfulFigure (Abstract)
// ============================================
class ColorfulFigure extends Figure {
    constructor(x, y, color) {
        super(x, y);
        this.color = color;
    }
}

// ============================================
// Class Square
// ============================================
class Square extends Figure {
    constructor(x, y, width) {
        super(x, y);
        this.width = width;
    }

    area() {
        return this.width * this.width;
    }

    perimeter() {
        return 4 * this.width;
    }

    toString() {
        return `Square({${this.x}, ${this.y}}, width = ${this.width})`;
    }
}

// ============================================
// Class Rectangle
// ============================================
class Rectangle extends Figure {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }

    perimeter() {
        return 2 * (this.width + this.height);
    }

    toString() {
        return `Rectangle({${this.x}, ${this.y}}, size = ${this.width} x ${this.height})`;
    }
}

// ============================================
// Class Circle
// ============================================
class Circle extends Figure {
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
    }

    area() {
        return Math.PI * this.radius * this.radius;
    }

    perimeter() {
        return 2 * Math.PI * this.radius;
    }

    toString() {
        return `Circle({${this.x}, ${this.y}}, radius = ${this.radius})`;
    }
}

// ============================================
// Class Annulus
// ============================================
class Annulus extends Figure {
    constructor(x, y, outerRadius, innerRadius) {
        super(x, y);
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
    }

    area() {
        return Math.PI * (this.outerRadius * this.outerRadius - this.innerRadius * this.innerRadius);
    }

    perimeter() {
        // Perimeter of annulus = outer circle perimeter + inner circle perimeter
        return 2 * Math.PI * this.outerRadius + 2 * Math.PI * this.innerRadius;
    }

    toString() {
        return `Annulus({${this.x}, ${this.y}}, ext. radius = ${this.outerRadius}, int. radius = ${this.innerRadius})`;
    }
}

// ============================================
// Class ColorfulSquare
// ============================================
class ColorfulSquare extends ColorfulFigure {
    constructor(x, y, width, color) {
        super(x, y, color);
        this.width = width;
    }

    area() {
        return this.width * this.width;
    }

    perimeter() {
        return 4 * this.width;
    }

    toString() {
        return `Square({${this.x}, ${this.y}}, width = ${this.width}, color = ${this.color.toString()})`;
    }
}

// ============================================
// Class ColorfulRectangle
// ============================================
class ColorfulRectangle extends ColorfulFigure {
    constructor(x, y, width, height, color) {
        super(x, y, color);
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }

    perimeter() {
        return 2 * (this.width + this.height);
    }

    toString() {
        return `Rectangle({${this.x}, ${this.y}}, size = ${this.width} x ${this.height}, color = ${this.color.toString()})`;
    }
}

// ============================================
// Class ColorfulCircle
// ============================================
class ColorfulCircle extends ColorfulFigure {
    constructor(x, y, radius, color) {
        super(x, y, color);
        this.radius = radius;
    }

    area() {
        return Math.PI * this.radius * this.radius;
    }

    perimeter() {
        return 2 * Math.PI * this.radius;
    }

    toString() {
        return `Circle({${this.x}, ${this.y}}, radius = ${this.radius}, color = ${this.color.toString()})`;
    }
}

// ============================================
// Class ColorfulAnnulus
// ============================================
class ColorfulAnnulus extends ColorfulFigure {
    constructor(x, y, outerRadius, innerRadius, color) {
        super(x, y, color);
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
    }

    area() {
        return Math.PI * (this.outerRadius * this.outerRadius - this.innerRadius * this.innerRadius);
    }

    perimeter() {
        return 2 * Math.PI * this.outerRadius + 2 * Math.PI * this.innerRadius;
    }

    toString() {
        return `Annulus({${this.x}, ${this.y}}, ext. radius = ${this.outerRadius}, int. radius = ${this.innerRadius}, color = ${this.color.toString()})`;
    }
}

// ============================================
// Creating and Using Figures
// ============================================

console.log('=== Basic Figures ===\n');

// Create a square
const square = new Square(10, 35, 10);
console.log(square.toString());
console.log(`  Area: ${square.area()}`);
console.log(`  Perimeter: ${square.perimeter()}\n`);

// Create a rectangle
const rectangle = new Rectangle(-10, 20, 20, 15);
console.log(rectangle.toString());
console.log(`  Area: ${rectangle.area()}`);
console.log(`  Perimeter: ${rectangle.perimeter()}\n`);

// Create a circle
const circle = new Circle(20, -10, 15);
console.log(circle.toString());
console.log(`  Area: ${circle.area().toFixed(2)}`);
console.log(`  Perimeter: ${circle.perimeter().toFixed(2)}\n`);

// Create an annulus
const annulus = new Annulus(20, -10, 15, 5);
console.log(annulus.toString());
console.log(`  Area: ${annulus.area().toFixed(2)}`);
console.log(`  Perimeter: ${annulus.perimeter().toFixed(2)}\n`);

console.log('=== Colorful Figures ===\n');

// Create colors
const color1 = new Color(255, 122, 30);
const color2 = new Color(127, 170, 232);
const color3 = new Color(0, 238, 0);
const color4 = new Color(238, 51, 51);

// Create colorful square
const colorfulSquare = new ColorfulSquare(10, 35, 10, color1);
console.log(colorfulSquare.toString());
console.log(`  Area: ${colorfulSquare.area()}`);
console.log(`  Perimeter: ${colorfulSquare.perimeter()}\n`);

// Create colorful rectangle
const colorfulRectangle = new ColorfulRectangle(-10, 20, 20, 15, color2);
console.log(colorfulRectangle.toString());
console.log(`  Area: ${colorfulRectangle.area()}`);
console.log(`  Perimeter: ${colorfulRectangle.perimeter()}\n`);

// Create colorful circle
const colorfulCircle = new ColorfulCircle(20, -10, 15, color3);
console.log(colorfulCircle.toString());
console.log(`  Area: ${colorfulCircle.area().toFixed(2)}`);
console.log(`  Perimeter: ${colorfulCircle.perimeter().toFixed(2)}\n`);

// Create colorful annulus
const colorfulAnnulus = new ColorfulAnnulus(20, -10, 15, 5, color4);
console.log(colorfulAnnulus.toString());
console.log(`  Area: ${colorfulAnnulus.area().toFixed(2)}`);
console.log(`  Perimeter: ${colorfulAnnulus.perimeter().toFixed(2)}\n`);

console.log('=== Moving Figures ===\n');

// Move a figure
console.log('Original position:', square.toString());
square.move(5, 10);
console.log('After move(5, 10):', square.toString());
square.resetPosition();
console.log('After resetPosition():', square.toString());
console.log();

// Demonstration with multiple figures
console.log('=== All Figures Summary ===\n');

const figures = [
    square,
    rectangle,
    circle,
    annulus,
    colorfulSquare,
    colorfulRectangle,
    colorfulCircle,
    colorfulAnnulus
];

figures.forEach((fig, index) => {
    console.log(`Figure ${index + 1}: ${fig.toString()}`);
    console.log(`  Area: ${fig.area().toFixed(2)}`);
    console.log(`  Perimeter: ${fig.perimeter().toFixed(2)}\n`);
});
