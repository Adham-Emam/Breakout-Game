let currentControls = null
let paddleSpeed = canvas.width * 0.01 // 1% of screen width per frame
let leftPressed = false
let rightPressed = false

let score = 0

// Generate Hearts
let attempts = 3
const heartContainer = document.querySelector('.attempts-container')

for (i = 0; i < attempts; i++) {
  const heart = document.createElement('img')
  heart.src = 'assets/images/heart_filled.png'
  heart.alt = 'Heart-filled'
  heartContainer.appendChild(heart)
}

for (i = 0; i < 3 - attempts; i++) {
  const heart = document.createElement('img')
  heart.src = 'assets/images/heart_empty.png'
  heart.alt = 'Heart-empty'
  heartContainer.appendChild(heart)
}

function applyControls(controls) {
  // Remove old listeners
  document.onkeydown = null
  document.onkeyup = null
  canvas.onmousemove = null

  if (controls === 'keyboard') {
    document.onkeydown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
        leftPressed = true
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
        rightPressed = true
    }
    document.onkeyup = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
        leftPressed = false
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
        rightPressed = false
    }
  } else if (controls === 'mouse') {
    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      paddle.x = mouseX - paddle.width / 2
    }
  }

  currentControls = controls
}

function runControls() {
  let controls = localStorage.getItem('controls') || 'mouse'
  if (controls !== currentControls) {
    applyControls(controls)
  }
}

// React when localStorage changes (from settings menu or other tab)
window.addEventListener('storage', (e) => {
  if (e.key === 'controls') {
    applyControls(e.newValue)
  }
})

function gameLoop() {
  runControls() // ensures controls applied at least once

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  updateBall()
  updatePaddle()
  drawPaddle()
  drawBall()
  requestAnimationFrame(gameLoop)
}
gameLoop()
