function intersectRectangles(...rectangles) {
  // Helper function to get rectangle bounds
  function getBounds(rect) {
    // x, y is top-left corner
    // In this coordinate system, y increases upward
    // So bottom = y - height, top = y
    return {
      left: rect.x,
      right: rect.x + rect.width,
      bottom: rect.y - rect.height,
      top: rect.y
    };
  }

  // Check relationship between two rectangles
  function getRelation(rect1, rect2) {
    const a = getBounds(rect1);
    const b = getBounds(rect2);

    // Check if completely disjoint (no shared boundary)
    if (a.right < b.left || b.right < a.left || 
        a.top < b.bottom || b.top < a.bottom) {
      return 'disjoint';
    }

    // Check if they only touch (share boundary but no overlap)
    // Touch occurs when one edge is exactly on the other's edge
    if (a.right === b.left || b.right === a.left || 
        a.top === b.bottom || b.top === a.bottom) {
      return 'touch';
    }

    // Otherwise they intersect (have common area)
    return 'intersect';
  }

  // Generate all unique pairs and check their relations
  const results = [];
  
  for (let i = 0; i < rectangles.length; i++) {
    for (let j = i + 1; j < rectangles.length; j++) {
      const rect1 = rectangles[i];
      const rect2 = rectangles[j];
      
      // Put names in alphabetical order
      const names = [rect1.name, rect2.name].sort();
      const relation = getRelation(rect1, rect2);
      
      results.push({
        name1: names[0],
        name2: names[1],
        relation: relation
      });
    }
  }

  // Sort results alphabetically
  results.sort((a, b) => {
    if (a.name1 !== b.name1) {
      return a.name1.localeCompare(b.name1);
    }
    return a.name2.localeCompare(b.name2);
  });

  // Print results
  for (const result of results) {
    console.log(`${result.name1} and ${result.name2} -> ${result.relation}`);
  }
}

// Test case
intersectRectangles(
  {name: "D", x: 5, y: 10, width: 10, height: 20},
  {name: "E", x: 22, y: 12, width: 11, height: 9},
  {name: "B", x: 25, y: 15, width: 10, height: 15},
  {name: "A", x: 20, y: 10, width: 35, height: 15},
  {name: "C", x: 55, y: 5, width: 20, height: 10}
);
