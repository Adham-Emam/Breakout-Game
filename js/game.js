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

let paddleSpeed = canvas.width * 0.01 // 1% of screen width per frame
let leftPressed = false
let rightPressed = false

function runControls() {
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
}

let brickGrid = null
let lastDifficulty = null

function getDifficultyGrid() {
  if (difficulty !== lastDifficulty) {
    // Difficulty changed → regenerate grid
    brickGrid = createBrickGrid(difficulty)
    lastDifficulty = difficulty
  }
  return brickGrid
}
function gameLoop() {
  timerAnimation()
  setTimeout(() => {
    runControls() // ensures controls applied at least once

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updateBall()
    updatePaddle()
    drawPaddle()
    drawBricks(getDifficultyGrid())
    drawBall()
  }, 3000)
  requestAnimationFrame(gameLoop)
}
document.getElementById('retry-btn').onclick = function () {
  attempts = 3;
  score = 0;
  scoreContainer.textContent = score;
  updateHearts();
  hideGameOverPopup();
  brickGrid = createBrickGrid(difficulty);
  remainingBricks = brickGrid.flat().filter(Boolean).length;
  resetBall();
};



document.getElementById('home-btn').onclick = function () {
  hideGameOverPopup();
  document.querySelector('.game-container').classList.add('hidden');
  document.querySelector('.landing').classList.remove('hidden');
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
    gameLoopId = null;
  }
};
function showGameOverPopup() {
  document.getElementById('game-over-popup').classList.remove('hidden');
}

function hideGameOverPopup() {
  document.getElementById('game-over-popup').classList.add('hidden');
}
function loseAttempt() {
  attempts--;
  updateHearts();

  if (attempts <= 0) {
    showGameOverPopup();
  } else {
    resetBall();
  }
}

function updateHearts() {
  const heartContainer = document.querySelector('.attempts-container');
  heartContainer.innerHTML = '';
  for (let i = 0; i < attempts; i++) {
    const heart = document.createElement('img');
    heart.src = 'assets/images/heart_filled.png';
    heart.alt = 'Heart-filled';
    heartContainer.appendChild(heart);
  }
  for (let i = 0; i < 3 - attempts; i++) {
    const heart = document.createElement('img');
    heart.src = 'assets/images/heart_empty.png';
    heart.alt = 'Heart-empty';
    heartContainer.appendChild(heart);
  }
}
function showWinPopup() {
  document.getElementById('win-popup').classList.remove('hidden');
}
function hideWinPopup() {
  document.getElementById('win-popup').classList.add('hidden');
}

document.getElementById('next-level-btn').onclick = function () {
  hideWinPopup();
  // Next Level logic
  if (difficulty === 'insane') {
    // Restart insane
    score = 0;
    attempts = 3;
    brickGrid = createBrickGrid('insane');
  } else {
    // Go to next difficulty (easy → normal → hard → insane)
    let levels = ['easy', 'normal', 'hard', 'insane'];
    let currentIdx = levels.indexOf(difficulty);
    difficulty = levels[Math.min(currentIdx + 1, levels.length - 1)];
    score = 0;
    attempts = 3;
    brickGrid = createBrickGrid(difficulty);
  }
  remainingBricks = brickGrid.flat().filter(Boolean).length;
  updateHearts();
  scoreContainer.textContent = score;
  resetBall();
  // Optionally: update any UI about current level/difficulty here
};

document.getElementById('win-home-btn').onclick = function () {
  hideWinPopup();
  document.querySelector('.game-container').classList.add('hidden');
  document.querySelector('.landing').classList.remove('hidden');
};
document.getElementById('next-level-btn').onclick = function () {
  hideWinPopup();
  // Next Level logic
  if (difficulty === 'insane') {
    // Restart insane
    score = 0;
    attempts = 3;
    brickGrid = createBrickGrid('insane');
  } else {
    // Go to next difficulty (easy → normal → hard → insane)
    let levels = ['easy', 'normal', 'hard', 'insane'];
    let currentIdx = levels.indexOf(difficulty);
    difficulty = levels[Math.min(currentIdx + 1, levels.length - 1)];
    score = 0;
    attempts = 3;
    brickGrid = createBrickGrid(difficulty);
  }
  remainingBricks = brickGrid.flat().filter(Boolean).length;
  updateHearts();
  scoreContainer.textContent = score;
  resetBall();
};
document.getElementById('next-level-btn').onclick = function () {
  hideWinPopup();
  // Next Level logic
  if (difficulty === 'insane') {
    // Restart insane
    score = 0;
    attempts = 3;
    brickGrid = createBrickGrid('insane');
  } else {
    // Go to next difficulty (easy → normal → hard → insane)
    let levels = ['easy', 'normal', 'hard', 'insane'];
    let currentIdx = levels.indexOf(difficulty);
    difficulty = levels[Math.min(currentIdx + 1, levels.length - 1)];
    score = 0;
    attempts = 3;
    brickGrid = createBrickGrid(difficulty);
  }
  remainingBricks = brickGrid.flat().filter(Boolean).length;
  updateHearts();
  scoreContainer.textContent = score;
  resetBall();
};
document.getElementById('win-home-btn').onclick = function () {
  hideWinPopup();
  document.querySelector('.game-container').classList.add('hidden');
  document.querySelector('.landing').classList.remove('hidden');
};