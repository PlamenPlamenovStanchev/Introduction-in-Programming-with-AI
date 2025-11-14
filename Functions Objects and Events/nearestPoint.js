function nearestPoint({locX, locY}, ...points) {
    let closestPoint = points[0];
    let minDistance = Math.sqrt((points[0].x - locX)**2 + (points[0].y - locY)**2);

    for (const point of points) {
        const distance = Math.sqrt((point.x - locX)**2 + (point.y - locY)**2);
        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
        }
    }

    return closestPoint;
}
