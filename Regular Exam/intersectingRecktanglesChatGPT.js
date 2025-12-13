function intersectRectangles(...rectangles) {
  const results = [];

  // Helper to normalize rectangle edges
  function normalize(r) {
    return {
      name: r.name,
      left: r.x,
      right: r.x + r.width,
      top: r.y,
      bottom: r.y + r.height
    };
  }

  const rects = rectangles.map(normalize);

  // Compare every unique pair
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const r1 = rects[i];
      const r2 = rects[j];

      const overlapWidth =
        Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left);

      const overlapHeight =
        Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top);

      let relation;

      if (overlapWidth > 0 && overlapHeight > 0) {
        relation = "intersect";
      } else if (overlapWidth >= 0 && overlapHeight >= 0) {
        relation = "touch";
      } else {
        relation = "disjoint";
      }

      const [name1, name2] = [r1.name, r2.name].sort();

      results.push(`${name1} and ${name2} -> ${relation}`);
    }
  }

  // Sort final output alphabetically
  results.sort();

  return results.join("\n");
}
