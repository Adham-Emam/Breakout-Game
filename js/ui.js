function createBrickLayout(level) {
  let grid = []

  // Define the number of rows for each level
  const levelRows = {
    easy: 2,
    medium: 4,
    hard: 6,
    insane: 10,
  }

  // Iterate over the number of rows for the given level
  for (let i = 0; i < levelRows[level]; i++) {
    let row = []
    // Iterate over half the number of columns (6)
    for (let j = 0; j < 6; j++) {
      // Randomly populate the row with a minimum of 60% and a maximum of 85% of bricks
      row.push(Math.random() < 0.75)
    }
    // Mirror the row to ensure symmetry
    let reversedRow = [...row].reverse()
    row.push(...reversedRow)
    grid.push(row)
  }

  return grid
}
