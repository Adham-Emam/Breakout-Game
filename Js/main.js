const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d') // object  we use represend 2D drawing to draw in canvans

const brickRowCount = 4
const brickColumnCount = 8
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 15
const brickOffsetLeft = 30

// Timer Game

// const gameTimer = document.querySelector(".Time-to-start")
// const gameTimerBlock = document.querySelector(".Start-Game")
// let gameTimerNumber = parseInt(gameTimer.textContent)
// const timer = setInterval(() => {
// gameTimerNumber--
// gameTimer.textContent = gameTimerNumber;

// if(gameTimerNumber === 0)

//  {
//     clearInterval(timer)
//     gameTimerBlock.classList.add("hide")
//  }

// }, 1500);

// set the Scores and lives for the Game

let score = 0
let lives = 3
// Create the Header function
function drawHeader() {
  ctx.font = '20px Arial'
  ctx.fillStyle = '#000'
  ctx.fillText(`score ${score}`, 720, 40)
  ctx.fillText(`Lives ${lives}`, 720, 20)
}

// set the ball size
let ballX = canvas.width / 2
let ballY = canvas.height - 45
let ballRaduis = 15

function drawBall() {
  // Create the game ball
  ctx.arc(ballX, ballY, ballRaduis, 0, Math.PI * 2)
  ctx.fillStyle = 'darkblue' // set a color to fill the whole item with it
  ctx.fill() // // fill the whole item with the selected color
}

// Note the differnce between fillstyle() and  strokeStyle()

// fillStyle() => fill the whole item with the selected color
// strokeStyle() => fill the border only with selected color

const paddleWidthSize = 120
const paddleHeightSize = 11

// paddle Diemension in canvas
let paddleWidth = (canvas.width - paddleWidthSize) / 2 // paddle place according to x axis
let paddleHeight = canvas.height - paddleHeightSize - 10 // paddle place according to y axis

// Draw the paddle
function drawPaddle() {
  ctx.rect(paddleWidth, paddleHeight, paddleWidthSize, paddleHeightSize)
  ctx.fillStyle = 'darkblue'
  ctx.fill()
}

let rightpressed = false
let leftpressed = false

document.addEventListener('keydown', handleDown, false)
document.addEventListener('keyup', handleUp, false)

function handleDown(e) {
  if (e.key === 'ArrowRight') {
    rightpressed = true
  } else if (e.key === 'ArrowLeft') {
    leftpressed = true
  }
}

function handleUp(e) {
  if (e.key === 'ArrowRight') {
    rightpressed = false
  } else if (e.key === 'ArrowLeft') {
    leftpressed = false
  }
}

function updatePaddle() {
  if (rightpressed && paddleWidth) {
    if (paddleWidth + paddleWidthSize >= canvas.width) {
      rightpressed = false
    } else {
      rightpressed = true
      paddleWidth += 10
    }
  } else if (leftpressed && paddleWidth > 0) {
    paddleWidth -= 10
  }
}

// Draw the bricks

const bricks = []
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [] // create three empty arrays for columns  (8columns)

  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0 } // create all the bricks inside the current clomuns
    // x and y represent the place of bricks on canvas
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
      bricks[c][r].x = brickX
      bricks[c][r].y = brickY
      ctx.beginPath()
      ctx.rect(brickX, brickY, brickWidth, brickHeight)
      ctx.fillStyle = '#0095DD'
      ctx.fill()
      ctx.closePath()
    }
  }
}

// main loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawHeader()
  drawBall()
  drawPaddle()
  drawBricks()
  updatePaddle()
  requestAnimationFrame(draw)
}
draw()
