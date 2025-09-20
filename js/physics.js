const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
let mouseX = canvas.width / 2

let remainingBricks = 0

let ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 10,
  vx: 5,
  vy: -5,
  trail: [],
}

function getPaddleWidth() {
  if (difficulty === 'insane') return 120
  if (difficulty === 'hard') return 160
  return 250
}

const paddle = {
  x: canvas.width / 2 - 125,
  y: canvas.height - 20,
  get width() {
    return getPaddleWidth()
  },
  height: 15,
  speed: canvas.width * 0.05, // 5% of screen width per frame
}

function getThemeColor() {
  return localStorage.getItem('gameTheme') || '#ffffff'
}

function setBallSpeed(multiplier) {
  // current speed magnitude
  const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2)
  // current angle of movement
  const angle = Math.atan2(ball.vy, ball.vx)
  // scale speed
  const newSpeed = speed * multiplier

  // recompute velocity components
  ball.vx = Math.cos(angle) * newSpeed
  ball.vy = Math.sin(angle) * newSpeed
}

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // reset paddle position relative to new size
  paddle.x = canvas.width / 2 - paddle.width / 2
  paddle.y = canvas.height - 20

  // reset ball if needed
  if (ball.y > canvas.height) {
    resetBall()
  }
}
window.addEventListener('resize', resizeCanvas)
resizeCanvas()

function drawBall() {
  let color = getThemeColor()
  drawTrail()
  drawBallGlow()

  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
  //glow low mechs
  ctx.fillStyle = color + '44'
  ctx.beginPath()
  ctx.arc(ball.x - 3, ball.y - 3, ball.radius / 3, 0, Math.PI * 2)
  ctx.fill()
}
// Trail effects
function drawTrail() {
  let color = getThemeColor()

  for (let i = 0; i < ball.trail.length; i++) {
    let trailPos = ball.trail[i]
    const alpha = 1 - i / ball.trail.length
    const size = ball.radius * alpha
    ctx.globalAlpha = alpha * 0.5
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(trailPos.x, trailPos.y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1.0 //this resets the transparency  ***https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha***
}

function updateTrail() {
  ball.trail.unshift({ x: ball.x, y: ball.y }) //
  if (ball.trail.length > 10) {
    ball.trail.pop()
  }
}

//glow effects
function drawBallGlow() {
  let color = getThemeColor()

  const gradient = ctx.createRadialGradient(
    ball.x,
    ball.y,
    0,
    ball.x,
    ball.y,
    ball.radius * 2.5
  )
  gradient.addColorStop(0, color + '80') // center = semi-transparent color **revise**
  gradient.addColorStop(1, color + '00') // edge = fully transparent**revise**
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius * 2.5, 0, Math.PI * 2)
  ctx.fill()
}
//paddle
function drawPaddle() {
  let color = getThemeColor()

  ctx.beginPath()
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 10)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
}

let grid = []

// Create Brick Layout
function createBrickGrid(level) {
  grid = []

  // Define the number of rows for each level
  const levelRows = {
    easy: 2,
    normal: 4,
    hard: 6,
    insane: 8,
  }

  // Iterate over the number of rows for the given level
  for (let i = 0; i < levelRows[level]; i++) {
    let row = []
    // Iterate over half the number of columns (6)
    for (let j = 0; j < 6; j++) {
      // Randomly populate the row with a minimum of 60% and a maximum of 85% of bricks
      const isBrick = Math.random() < 0.75

      if (isBrick) {
        remainingBricks += 2
      }
      row.push(isBrick)
    }
    // Mirror the row to ensure symmetry
    let reversedRow = [...row].reverse()
    row.push(...reversedRow)
    grid.push(row)
  }
  return grid
}

// Bricks config
function getBrickDimensions() {
  return {
    width: canvas.width * 0.06,
    height: canvas.height * 0.03,
  }
}

const brickPadding = 10
const brickOffsetTop = 50

function drawBricks(grid) {
  let color = getThemeColor()
  const { width: brickWidth, height: brickHeight } = getBrickDimensions()

  // total grid width = (bricks in row * width) + (padding * gaps)
  const totalGridWidth =
    grid[0].length * brickWidth + (grid[0].length - 1) * brickPadding

  // Center horizontally
  const brickOffsetLeft = (canvas.width - totalGridWidth) / 2

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c]) {
        // Count remaining bricks

        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop

        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = color
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function checkBrickCollision() {
  if (!grid || grid.length === 0) return // Safety check

  const { width: brickWidth, height: brickHeight } = getBrickDimensions()
  const totalGridWidth =
    grid[0].length * brickWidth + (grid[0].length - 1) * brickPadding
  const brickOffsetLeft = (canvas.width - totalGridWidth) / 2

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c]) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop

        // Check if ball intersects with brick
        if (
          ball.x + ball.radius >= brickX &&
          ball.x - ball.radius <= brickX + brickWidth &&
          ball.y + ball.radius >= brickY &&
          ball.y - ball.radius <= brickY + brickHeight
        ) {
          // Remove the brick
          grid[r][c] = false

          // Decrease remaining bricks count
          remainingBricks -= 1

          // Update score
          score += scoreUpdate[difficulty]
          scoreContainer.textContent = score

          // Determine collision side and bounce accordingly
          const ballCenterX = ball.x
          const ballCenterY = ball.y
          const brickCenterX = brickX + brickWidth / 2
          const brickCenterY = brickY + brickHeight / 2

          const deltaX = ballCenterX - brickCenterX
          const deltaY = ballCenterY - brickCenterY

          // Calculate overlap on each axis
          const overlapX = brickWidth / 2 + ball.radius - Math.abs(deltaX)
          const overlapY = brickHeight / 2 + ball.radius - Math.abs(deltaY)

          // Bounce based on smallest overlap (most likely collision side)
          if (overlapX < overlapY) {
            // Horizontal collision (left or right side)
            ball.vx = -ball.vx
            // Move ball out of brick
            if (deltaX > 0) {
              ball.x = brickX + brickWidth + ball.radius
            } else {
              ball.x = brickX - ball.radius
            }
          } else {
            // Vertical collision (top or bottom side)
            ball.vy = -ball.vy
            // Move ball out of brick
            if (deltaY > 0) {
              ball.y = brickY + brickHeight + ball.radius
            } else {
              ball.y = brickY - ball.radius
            }
          }

          // Check win condition
          console.log(remainingBricks)
          checkWinCondition()

          return // Exit after first collision to prevent multiple hits per frame
        }
      }
    }
  }
}

function checkWinCondition() {
  if (!grid || grid.length === 0) return // Safety check

  const playerName = localStorage.getItem('playerName')
  if (remainingBricks === 0) {
    toggleWinPopup()
    // Loop over scores and update score if playerName exists
    for (let i = 0; i < scores.length; i++) {
      if (scores[i].player === playerName) {
        scores[i].score += score
        localStorage.setItem('scores', JSON.stringify(scores))
        return
      }
    }

    // Append new player object if not found
    scores.push({ player: playerName, score: score })
    localStorage.setItem('scores', JSON.stringify(scores))
  }
}

//Ball physics
function updateBall() {
  updateTrail()
  ball.x += ball.vx
  ball.y += ball.vy

  //brick collision
  checkBrickCollision()

  //wall collision
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.vx = -ball.vx
    if (ball.x - ball.radius <= 0) ball.x = ball.radius
    if (ball.x + ball.radius >= canvas.width) {
      ball.x = canvas.width - ball.radius
    }
  }
  //roof collision
  if (ball.y - ball.radius <= 0) {
    ball.vy = -ball.vy
    ball.y = ball.radius
  }
  //paddle collision
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width
  ) {
    let hitPosition = (ball.x - paddle.x) / paddle.width
    let bounceAngle = (hitPosition - 0.5) * (Math.PI / 3)
    const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2)

    ball.vx = speed * Math.sin(bounceAngle)
    ball.vy = -speed * Math.cos(bounceAngle)

    ball.y = paddle.y - ball.radius - 2

    if (difficulty === 'hard' || difficulty === 'insane') {
      const multiplier = difficulty === 'hard' ? 1.02 : 1.05
      setBallSpeed(multiplier)
    }
  }

  if (ball.y > canvas.height + 40) {
    loseAttempt()
  }
}
function resetBall() {
  ball.x = paddle.x + paddle.width / 2
  ball.y = paddle.y - ball.radius

  const angleRange = Math.PI / 4 // max angle from vertical
  const randomAngle = Math.random() * angleRange - angleRange / 2

  const baseSpeed = 5

  ball.vx = baseSpeed * Math.sin(randomAngle)
  ball.vy = -baseSpeed * Math.cos(randomAngle)
  ball.trail = []
}

resetBall()

let leftPressed = false
let rightPressed = false

function runControls() {
  // Remove old listeners
  document.onkeydown = null
  document.onkeyup = null
  canvas.onmousemove = null

  if (controls === 'keyboard') {
    document.onkeydown = (e) => {
      if (isPaused) return // Don't process game controls when paused
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
        leftPressed = true
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
        rightPressed = true
    }
    document.onkeyup = (e) => {
      if (isPaused) return // Don't process game controls when paused
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
        leftPressed = false
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
        rightPressed = false
    }
  } else if (controls === 'mouse') {
    canvas.onmousemove = (e) => {
      if (isPaused) return // Don't process game controls when paused
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      paddle.x = mouseX - paddle.width / 2
    }
  }
}

function updatePaddle() {
  if (leftPressed) {
    paddle.x -= paddle.speed
  }
  if (rightPressed) {
    paddle.x += paddle.speed
  }

  // keep paddle in bounds
  if (paddle.x < 0) paddle.x = 0
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width
  }
}
