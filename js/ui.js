function createBrickLayout(level) {
  let grid = []

  const levelRows = {
    easy: 2,
    medium: 4,
    hard: 6,
    insane: 10,
  }

  for (let i = 0; i < levelRows[level]; i++) {
    let row = []
    for (let j = 0; j < 6; j++) {
      row.push(Math.random() < 0.75)
    }
    let reversedRow = [...row].reverse()

    row.push(...reversedRow)
    grid.push(row)
  }

  return grid
}
