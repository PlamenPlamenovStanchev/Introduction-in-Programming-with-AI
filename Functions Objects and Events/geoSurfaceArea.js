function calculateGeoArea(...locations) {
    // Earth's radius in meters
    const EARTH_RADIUS = 6371000;

    // Convert degrees to radians
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    // Convert radians to degrees
    const toDegrees = (radians) => (radians * 180) / Math.PI;

    // Validate input
    if (locations.length < 3) {
        throw new Error('At least 3 points are required to define a polygon');
    }

    // Convert locations to radians
    const points = locations.map(loc => ({
        lat: toRadians(loc.latitude),
        lon: toRadians(loc.longitude)
    }));

    // Calculate spherical excess using the formula for spherical polygons
    // Using the method based on spherical triangulation
    let sphericalExcess = 0;

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const p3 = points[(i + 2) % points.length];

        // Calculate the angle at each vertex using spherical excess
        const angle = calculateSphericalAngle(p1, p2, p3);
        sphericalExcess += angle;
    }

    // Subtract (n-2)*π from the sum of angles (where n is the number of vertices)
    // This gives us the spherical excess (E)
    const n = points.length;
    sphericalExcess = sphericalExcess - (n - 2) * Math.PI;

    // Apply Girard's theorem: Area = R² * E
    // where R is Earth's radius and E is the spherical excess
    const area = EARTH_RADIUS * EARTH_RADIUS * sphericalExcess;

    return Math.abs(area);
}

// Helper function to calculate angle at a vertex in spherical geometry
function calculateSphericalAngle(p1, p2, p3) {
    // Calculate vectors on the sphere surface
    // Using the spherical law of cosines

    // Convert spherical coordinates to Cartesian for calculation
    const toCartesian = (lat, lon) => ({
        x: Math.cos(lat) * Math.cos(lon),
        y: Math.cos(lat) * Math.sin(lon),
        z: Math.sin(lat)
    });

    const c1 = toCartesian(p1.lat, p1.lon);
    const c2 = toCartesian(p2.lat, p2.lon);
    const c3 = toCartesian(p3.lat, p3.lon);

    // Calculate vectors from p2 to p1 and p2 to p3
    const v1 = normalize(subtract(c1, c2));
    const v2 = normalize(subtract(c3, c2));

    // Calculate angle between vectors
    const dotProduct = dot(v1, v2);
    // Clamp to [-1, 1] to avoid numerical errors
    const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct)));

    return angle;
}

// Vector helper functions
function subtract(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    };
}

function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a, b) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
}

function magnitude(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function normalize(v) {
    const mag = magnitude(v);
    return {
        x: v.x / mag,
        y: v.y / mag,
        z: v.z / mag
    };
}

// Alternative implementation using L'Huilier's theorem for better accuracy with smaller areas
function calculateGeoAreaAlt(...locations) {
    const EARTH_RADIUS = 6371000;

    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    if (locations.length < 3) {
        throw new Error('At least 3 points are required to define a polygon');
    }

    // Convert to radians
    const points = locations.map(loc => ({
        lat: toRadians(loc.latitude),
        lon: toRadians(loc.longitude)
    }));

    // Calculate area using sum of signed areas of spherical triangles
    let totalArea = 0;

    // Use the first point as a reference
    const refPoint = points[0];

    // Triangulate from the first point
    for (let i = 1; i < points.length - 1; i++) {
        const area = sphericalTriangleArea(refPoint, points[i], points[i + 1]);
        totalArea += area;
    }

    // Scale by Earth's radius squared
    const result = totalArea * EARTH_RADIUS * EARTH_RADIUS;
    return Math.abs(result);
}

function sphericalTriangleArea(p1, p2, p3) {
    // Convert to Cartesian coordinates
    const toCartesian = (lat, lon) => ({
        x: Math.cos(lat) * Math.cos(lon),
        y: Math.cos(lat) * Math.sin(lon),
        z: Math.sin(lat)
    });

    const c1 = toCartesian(p1.lat, p1.lon);
    const c2 = toCartesian(p2.lat, p2.lon);
    const c3 = toCartesian(p3.lat, p3.lon);

    // Calculate the angles of the spherical triangle using spherical law of cosines
    const a = Math.acos(Math.max(-1, Math.min(1, dot(c2, c3))));
    const b = Math.acos(Math.max(-1, Math.min(1, dot(c1, c3))));
    const c = Math.acos(Math.max(-1, Math.min(1, dot(c1, c2))));

    // Calculate spherical excess using L'Huilier's theorem
    const s = (a + b + c) / 2;
    const E = 4 * Math.atan(Math.sqrt(
        Math.tan(s / 2) *
        Math.tan((s - a) / 2) *
        Math.tan((s - b) / 2) *
        Math.tan((s - c) / 2)
    ));

    return E;
}
