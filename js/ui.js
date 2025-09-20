let difficulty = null
let controls = 'keyboard'

// Generate Stars Animation
function generateBoxShadows(n) {
  let shadows = []
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000)
    const y = Math.floor(Math.random() * 2000)
    const color =
      document.documentElement.style.getPropertyValue('--text-color')
    shadows.push(`${x}px ${y}px ${color}`)
  }
  return shadows.join(', ')
}
document.getElementById('stars').style.boxShadow = generateBoxShadows(700, 1)
document.getElementById('stars').after.style = ''

document.getElementById('stars2').style.boxShadow = generateBoxShadows(200, 2)
document.getElementById('stars3').style.boxShadow = generateBoxShadows(100, 3)

// Also set shadows on :after elements dynamically
const styleSheet = document.styleSheets[0]
styleSheet.insertRule(
  `#stars:after { box-shadow: ${generateBoxShadows(700, 1)}; }`,
  styleSheet.cssRules.length
)
styleSheet.insertRule(
  `#stars2:after { box-shadow: ${generateBoxShadows(200, 2)}; }`,
  styleSheet.cssRules.length
)
styleSheet.insertRule(
  `#stars3:after { box-shadow: ${generateBoxShadows(100, 3)}; }`,
  styleSheet.cssRules.length
)

// Prevent form submission
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (e) => e.preventDefault())
})

// Set Colors on page load
window.addEventListener('load', () => {
  const gameTheme = localStorage.getItem('gameTheme') || '#ffffff'
  const uiTheme = localStorage.getItem('uiTheme') || 'dark'
  if (gameTheme) {
    document.getElementById('game-theme').value = gameTheme
    document.documentElement.style.setProperty('--game-theme', gameTheme)
  }
  setGameTheme(gameTheme)
  setUITheme(uiTheme)
})

// Set Colors on page load from Settings
function setGameTheme(theme) {
  if (theme) {
    document.documentElement.style.setProperty('--game-theme', theme)
    return
  }
  const gameTheme = document.getElementById('game-theme').value
  localStorage.setItem('gameTheme', gameTheme)
  document.documentElement.style.setProperty('--game-theme', gameTheme)
}
function setUITheme(theme) {
  if (localStorage.getItem('uiTheme') != theme) {
    localStorage.setItem('uiTheme', theme)
  }
  if (theme == 'light') {
    document.documentElement.style.setProperty(
      '--gradient',
      'radial-gradient(ellipse at bottom, #d1d2d2ff 0%, #424243ff 100%)'
    )
    document.documentElement.style.setProperty('--text-color', '#191919')
    document.documentElement.style.setProperty(
      '--background-color',
      '#d1d2d2ff'
    )
    document.documentElement.style.setProperty(
      '--header-shadow',
      '0 0 10px #fff, -5px 10px 0 #fff, 10px 10px 0 #ddd'
    )
  } else {
    document.documentElement.style.setProperty(
      '--gradient',
      'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)'
    )
    document.documentElement.style.setProperty('--text-color', '#ffffff')
    document.documentElement.style.setProperty('--background-color', '#191919')
    document.documentElement.style.setProperty(
      '--header-shadow',
      '0 0 25px #777, -5px 10px 0 #111, 10px 10px 0 #000'
    )
  }
}

// Start Menu Display
const landingMenus = document.querySelectorAll('.landing ul')
function openStartMenu() {
  landingMenus.forEach((menu) => menu.classList.add('hidden'))
  document.querySelector('.start-menu').classList.remove('hidden')
}
function validateName() {
  const playerName = document.querySelector('#playerName').value
  const error = document.querySelector('.error')
  if (playerName && playerName.trim().length > 2) {
    error.classList.add('hidden')
    localStorage.setItem('playerName', playerName)
    selectDifficulty()
  } else {
    error.classList.remove('hidden')
    error.innerHTML = 'Please enter a valid name'
  }
}
function selectDifficulty() {
  landingMenus.forEach((menu) => menu.classList.add('hidden'))
  document.querySelector('.difficulty').classList.remove('hidden')
}
// Set difficulty and start game loop
document.querySelectorAll('.difficulty li').forEach((li) => {
  const selectedDifficulty = li.dataset.difficulty
  const action = li.dataset.action

  li.addEventListener('click', () => {
    if (selectedDifficulty) {
      difficulty = selectedDifficulty
      startGame()
    } else if (action === 'back') {
      openStartMenu()
    }
  })
})

function openMainMenu() {
  landingMenus.forEach((menu) => menu.classList.add('hidden'))
  document.querySelector('.main-menu').classList.remove('hidden')
}

let scores = JSON.parse(localStorage.getItem('scores')) || [
  { player: 'Adham', score: 150 },
  { player: 'Nady', score: 200 },
  { player: 'Youssef', score: 120 },
  { player: 'Montaser', score: 100 },
  { player: 'Mohamed', score: 90 },
]

function openLeaderboardMenu() {
  landingMenus.forEach((menu) => menu.classList.add('hidden'))
  document.querySelector('.leaderboard').classList.remove('hidden')

  if (!localStorage.getItem('scores')) {
    localStorage.setItem('scores', JSON.stringify(scores))
  }

  const tbody = document.querySelector('#leaderboard tbody')
  tbody.innerHTML = '' // clear existing rows

  scores.forEach((entry) => {
    const row = document.createElement('tr')
    row.innerHTML = `<td>${entry.player}</td><td>${entry.score}</td>`
    tbody.appendChild(row)
  })
}
function openSettingsMenu() {
  landingMenus.forEach((menu) => menu.classList.add('hidden'))
  document.querySelector('.settings').classList.remove('hidden')
}
function openThemeMenu() {
  landingMenus.forEach((menu) => menu.classList.add('hidden'))
  document.querySelector('.theme').classList.remove('hidden')
}

function openControlsMenu() {
  landingMenus.forEach((menu) => menu.classList.add('hidden'))
  document.querySelector('.controls').classList.remove('hidden')
}
function setControls(ctrl) {
  controls = ctrl
  openSettingsMenu()
}
// Sound Control
let isMuted = false
function toggleSound() {
  const soundControl = document.querySelectorAll('.sound-control i')
  soundControl.forEach((icon) => {
    icon.classList.toggle('hidden')
  })
  isMuted = !isMuted
}

document.querySelectorAll('.landing li').forEach((li) => {
  li.addEventListener('click', () => {
    if (!isMuted) {
      const sfx = document.querySelector('.click_sfx')
      if (sfx) {
        sfx.currentTime = 0 // restart from beginning
        sfx.play()
      }
    }
  })
})

// Start Game Display
function startGame() {
  document.querySelector('.difficulty').classList.add('hidden')
  document.querySelector('.landing').classList.add('hidden')
  document.querySelector('.game-container').classList.remove('hidden')
  attempts = 3
  score = 0
  gameRunning = true // Restart the game loop
  scoreContainer.textContent = score
  updateHearts()
  brickGrid = createBrickGrid(difficulty)
  remainingBricks = brickGrid.flat().filter(Boolean).length
  resetBall()
  timerAnimation()

  gameLoop()
  setTimeout(() => {
    isPaused = false
  }, 3000)
  isPaused = true
}
function timerAnimation() {
  const timeContainer = document.querySelector('.timer-overlay')
  timeContainer.classList.remove('hidden')
  let time = 3
  timeContainer.innerText = time
  let intervalId = setInterval(() => {
    time--
    timeContainer.innerText = time

    if (time === 0) {
      timeContainer.classList.add('hidden')
      clearInterval(intervalId)
    }
  }, 1000)
}
