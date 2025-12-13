function matrixFill(rows, cols, commands) {
  // Initialize matrix with '#'
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix.push(new Array(cols).fill('#'));
  }

  // Process each command
  for (const command of commands) {
    // Validate command format: "Fill {size1} x {size2} @ {row: r, col: c, char: ch}"
    const regex = /^Fill (\d+) x (\d+) @ \{row: (\d+), col: (\d+), char: (.)\}$/;
    const match = command.match(regex);

    if (!match) {
      console.log("error");
      continue;
    }

    const size1 = parseInt(match[1]);
    const size2 = parseInt(match[2]);
    const row = parseInt(match[3]);
    const col = parseInt(match[4]);
    const char = match[5];

    // Check if it's a square (size1 must equal size2)
    if (size1 !== size2) {
      console.log("error");
      continue;
    }

    const size = size1;

    // Check if the fill area is within matrix boundaries
    if (row < 0 || col < 0 || row + size > rows || col + size > cols) {
      console.log("error");
      continue;
    }

    // Valid command - execute the fill
    for (let r = row; r < row + size; r++) {
      for (let c = col; c < col + size; c++) {
        matrix[r][c] = char;
      }
    }

    console.log("OK");
  }

  // Print empty line before matrix
  console.log("");

  // Print the final matrix
  for (let i = 0; i < rows; i++) {
    console.log(matrix[i].join(' '));
  }
}

// Test case
matrixFill(5, 10, [
  "Fill 1 x 1 @ {row: 2, col: 2, char: X}",
  "Fill 2 x 2 @ {row: 1, col: 4, char: Y}",
  "Fill 2 x 5 @ {row: 2, col: 3, char: B}",
  "Fill 3 x 3 @ {row: 2, col: 5, char: Z}",
  "Fill 2 x 2 @ {row: 4, col: 9, char: A}",
  "Fill 1 x 1 @ {row: 2, col: 3}",
  "Fill 2 x 2 @ row: 1, col: 0, char: A",
]);
