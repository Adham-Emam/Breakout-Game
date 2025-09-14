const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let mouseX = canvas.width / 2;

function getThemeColor() {
  return localStorage.getItem("gameTheme") || "#ffffff";
}

let ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 10,
  vx: 5,
  vy: -5,
  trail: [],
};
const paddle = {
  x: canvas.width / 2 - 80,
  y: canvas.height - 20,
  width: 160,
  height: 15,
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // reset paddle position relative to new size
  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height - 20;

  // reset ball if needed
  if (ball.y > canvas.height) {
    resetBall();
  }
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawBall() {
  let color = getThemeColor();
  drawTrail();
  drawBallGlow();

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
  //glow low mechs
  ctx.fillStyle = "#dacccc44";
  ctx.beginPath();
  ctx.arc(ball.x - 3, ball.y - 3, ball.radius / 3, 0, Math.PI * 2);
  ctx.fill();
}
// Trail effects
function drawTrail() {
  let color = getThemeColor();

  for (let i = 0; i < ball.trail.length; i++) {
    let trailPos = ball.trail[i];
    const alpha = 1 - i / ball.trail.length;
    const size = ball.radius * alpha;
    ctx.globalAlpha = alpha * 0.5;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(trailPos.x, trailPos.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0; //this resets the transparency  ***https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha***
}
//update trail for memory purposes remember to tell Adham to add this to the game function on main
function updateTrail() {
  ball.trail.unshift({ x: ball.x, y: ball.y }); //
  if (ball.trail.length > 10) {
    ball.trail.pop();
  }
}

//glow effects
function drawBallGlow() {
  let color = getThemeColor();

  const gradient = ctx.createRadialGradient(
    ball.x,
    ball.y,
    0,
    ball.x,
    ball.y,
    ball.radius * 2.5
  );
  gradient.addColorStop(0, color + "80"); // center = semi-transparent color **revise**
  gradient.addColorStop(1, color + "00"); // edge = fully transparent**revise**
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius * 2.5, 0, Math.PI * 2);
  ctx.fill();
}
//paddle
function drawPaddle() {
  let color = getThemeColor();

  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 10);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

//Ball physics
function updateBall() {
  updateTrail();
  ball.x += ball.vx;
  ball.y += ball.vy;

  //wall collision
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.vx = -ball.vx;
    if (ball.x - ball.radius <= 0) ball.x = ball.radius;
    if (ball.x + ball.radius >= canvas.width) {
      ball.x = canvas.width - ball.radius;
    }
  }
  //roof collision
  if (ball.y - ball.radius <= 0) {
    ball.vy = -ball.vy;
    ball.y = ball.radius;
  }
  //paddle collision
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width
  ) {
    //supposedly a hotfix for the prependicular loop****revise****
    let hitPosition = (ball.x - paddle.x) / paddle.width;
    let bounceAngle = (hitPosition - 0.5) * 2;
    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    ball.vx = bounceAngle * speed * 0.7;
    ball.vy = -Math.abs(ball.vy);
    ball.y = paddle.y - ball.radius - 2;

    // ball.vy = -ball.vy;
    // ball.y = paddle.y - ball.radius - 2;
  }
  if (ball.y > canvas.height + 40) {
    resetBall();
  }
}
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 100;
  ball.vy = -4;
  ball.trail = [];
}

let currentControls = null;
let paddleSpeed = canvas.width * 0.005; // 1% of screen width per frame
let leftPressed = false;
let rightPressed = false;

function applyControls(controls) {
  // Remove old listeners
  document.onkeydown = null;
  document.onkeyup = null;
  canvas.onmousemove = null;

  if (controls === "keyboard") {
    document.onkeydown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        leftPressed = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        rightPressed = true;
    };
    document.onkeyup = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        leftPressed = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        rightPressed = false;
    };
  } else if (controls === "mouse") {
    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      paddle.x = mouseX - paddle.width / 2;
    };
  }

  currentControls = controls;
}

function updatePaddle() {
  if (leftPressed) {
    paddle.x -= paddleSpeed;
  }
  if (rightPressed) {
    paddle.x += paddleSpeed;
  }

  // keep paddle in bounds
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }
}

function runControls() {
  let controls = localStorage.getItem("controls") || "mouse";
  if (controls !== currentControls) {
    applyControls(controls);
  }
}

// ✅ React when localStorage changes (from settings menu or other tab)
window.addEventListener("storage", (e) => {
  if (e.key === "controls") {
    applyControls(e.newValue);
  }
});

// prototype gameLoop for adham
function gameLoop() {
  runControls(); // ensures controls applied at least once
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBall();
  updatePaddle();
  drawPaddle();
  drawBall();
  requestAnimationFrame(gameLoop);
}
gameLoop();
