let gameLoopId

// Render Score Dynamically
let score = 0
const scoreContainer = document.querySelector('.score-container #score')
scoreContainer.textContent = score

const scoreUpdate = {
  easy: 5,
  normal: 10,
  hard: 15,
  insane: 20,
}

// Generate Hearts
let attempts = 3
const heartContainer = document.querySelector('.attempts-container')

function updateHearts() {
  heartContainer.innerHTML = ''
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
}

let isPaused = false

// ESC key listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    togglePause()
  }
})

function togglePause() {
  isPaused = !isPaused
  document.querySelector('.popup-container').classList.toggle('hidden')
  document.querySelector('.popup.pause-menu').classList.toggle('hidden')
}

let brickGrid = null
let lastDifficulty = null
let gameRunning = true

function getDifficultyGrid() {
  if (difficulty !== lastDifficulty) {
    // Difficulty changed → regenerate grid
    brickGrid = createBrickGrid(difficulty)
    lastDifficulty = difficulty
  }
  return brickGrid
}

function restartGame() {
  if (isPaused) {
    togglePause()
  } else if (remainingBricks === 0) {
    toggleWinPopup()
  } else if (attempts === 0) {
    toggleGameOverPopup()
  }
  startGame()
}

function backToMenu() {
  document.querySelector('.game-container').classList.add('hidden')
  document.querySelector('.landing').classList.remove('hidden')
  document.querySelector('.landing .main-menu').classList.remove('hidden')
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId)
    gameLoopId = null
  }
  if (isPaused) {
    togglePause()
  } else {
    if (remainingBricks === 0) {
      toggleWinPopup()
    } else if (attempts === 0) {
      toggleGameOverPopup()
    }
  }
}

function toggleGameOverPopup() {
  gameRunning = false
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId)
    gameLoopId = null
  }

  document.querySelector('.popup-container').classList.toggle('hidden')
  document.querySelector('.popup.lose-menu').classList.toggle('hidden')
}
function toggleWinPopup() {
  gameRunning = false
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId)
    gameLoopId = null
  }

  document.querySelector('.popup-container').classList.toggle('hidden')
  document.querySelector('.popup.win-menu').classList.toggle('hidden')
}

function loseAttempt() {
  attempts--
  updateHearts()

  if (attempts <= 0) {
    gameRunning = false // Stop the game loop

    toggleGameOverPopup('lose')
  } else {
    resetBall()
  }
}

function goToNextLevel() {
  toggleWinPopup()
  // Next Level logic
  const nextLvlBtn = document.querySelector('.popup.win-menu .next')
  if (difficulty === 'insane') {
    nextLvlBtn.classList.add('hidden')

    // Restart insane
  } else {
    nextLvlBtn.classList.remove('hidden')

    // Go to next difficulty (easy → normal → hard → insane)
    let levels = ['easy', 'normal', 'hard', 'insane']
    let currentIdx = levels.indexOf(difficulty)
    difficulty = levels[currentIdx + 1]
  }
  restartGame()
}

function gameLoop() {
  if (!isPaused && gameRunning) {
    // Check if game is still running
    updateHearts()

    if (!isPaused && gameRunning) {
      // Check again after the timeout
      runControls()

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBricks(getDifficultyGrid())
      updateBall()
      updatePaddle()
      drawPaddle()
      drawBall()
    }
  }

  if (gameRunning) {
    // Only continue loop if game is running
    gameLoopId = requestAnimationFrame(gameLoop)
  }
}
