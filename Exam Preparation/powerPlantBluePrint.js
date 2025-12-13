function drawRhombus(n) {
  const mid = Math.floor(n / 2); // Middle index (e.g., for n=5, mid=2)

  for (let row = 0; row < n; row++) {
    let line = '';

    for (let col = 0; col < n; col++) {
      // Calculate distance from the center
      const distFromMidRow = Math.abs(row - mid);
      const distFromMidCol = Math.abs(col - mid);
      const distFromCenter = distFromMidRow + distFromMidCol;

      if (distFromCenter === mid) {
        // Border of the rhombus: solar panels
        line += '@';
      } else if (distFromCenter < mid) {
        // Inside the rhombus
        if (row === mid && col === mid) {
          // Center point: the inverter
          line += '+';
        } else if (row === mid) {
          // Middle row: horizontal wiring
          line += '-';
        } else if (col === mid) {
          // Middle column: vertical wiring
          line += '|';
        } else {
          // Inner solar panels
          line += '@';
        }
      } else {
        // Outside the rhombus
        line += ' ';
      }
    }

    console.log(line);
  }
}

// Test cases
console.log('drawRhombus(5):');
drawRhombus(5);

console.log('\ndrawRhombus(7):');
drawRhombus(7);

console.log('\ndrawRhombus(9):');
drawRhombus(9);
