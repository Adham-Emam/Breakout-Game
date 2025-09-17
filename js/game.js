let currentControls = null
let paddleSpeed = canvas.width * 0.01 // 1% of screen width per frame
let leftPressed = false
let rightPressed = false

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
  timerAnimation()
  setTimeout(() => {
    runControls() // ensures controls applied at least once

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updateBall()
    updatePaddle()
    drawPaddle()
    drawBall()
  }, 3000)
  requestAnimationFrame(gameLoop)
}
