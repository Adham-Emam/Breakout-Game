const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
let mouseX = canvas.width / 2

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

//Ball physics
function updateBall() {
  updateTrail()
  ball.x += ball.vx
  ball.y += ball.vy

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
    resetBall()
  }
}
function resetBall() {
  ball.x = paddle.x + paddle.width / 2
  ball.y = paddle.y - ball.radius

  const angleRange = Math.PI / 4 // max angle from vertical
  const randomAngle = Math.random() * angleRange - angleRange / 2

  const baseSpeed = 6

  ball.vx = baseSpeed * Math.sin(randomAngle)
  ball.vy = -baseSpeed * Math.cos(randomAngle)
  ball.trail = []
}
resetBall()

function updatePaddle() {
  if (leftPressed) {
    paddle.x -= paddleSpeed
  }
  if (rightPressed) {
    paddle.x += paddleSpeed
  }

  // keep paddle in bounds
  if (paddle.x < 0) paddle.x = 0
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width
  }
}
