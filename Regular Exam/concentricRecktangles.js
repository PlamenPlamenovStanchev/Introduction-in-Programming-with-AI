function drawFigure(n) {
  const size = 2 * n - 1;
  const needsPadding = n >= 10;
  
  // Build the matrix of numbers
  const matrix = [];
  for (let row = 0; row < size; row++) {
    const line = [];
    for (let col = 0; col < size; col++) {
      // Calculate distance from nearest edge
      const distFromTop = row;
      const distFromBottom = size - 1 - row;
      const distFromLeft = col;
      const distFromRight = size - 1 - col;
      
      // The value is n minus the minimum distance
      const minDist = Math.min(distFromTop, distFromBottom, distFromLeft, distFromRight);
      const value = n - minDist;
      
      line.push(value);
    }
    matrix.push(line);
  }
  
  // Format and print with frame
  const contentWidth = size * (needsPadding ? 3 : 2) - 1;
  const topBorder = '┌─' + '─'.repeat(contentWidth) + '─┐';
  console.log(topBorder);
  
  for (let row = 0; row < size; row++) {
    let lineStr = '│ ';
    for (let col = 0; col < size; col++) {
      const value = matrix[row][col];
      if (needsPadding) {
        lineStr += value.toString().padStart(2, ' ');
      } else {
        lineStr += value;
      }
      
      // Add space after each number except the last one
      if (col < size - 1) {
        lineStr += ' ';
      }
    }
    lineStr += ' │';
    console.log(lineStr);
  }
  
  const bottomBorder = '└─' + '─'.repeat(contentWidth) + '─┘';
  console.log(bottomBorder);
}

// Test cases
console.log("drawFigure(1):");
drawFigure(1);
console.log("\ndrawFigure(3):");
drawFigure(3);
console.log("\ndrawFigure(10):");
drawFigure(10);
