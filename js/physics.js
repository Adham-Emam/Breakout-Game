const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let mouseX = canvas.width / 2;

let ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 10,
  vx: 5,
  vy: -5,
  color: "#00ff88",
  trail: [],
};
const paddle = {
  x: canvas.width / 2 - 60,
  y: canvas.height - 20,
  width: 120,
  height: 15,
  color: "#ff6b6b",
};
function drawBall() {
  drawTrail();
  drawBallGlow();

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
  //glow low mechs
  ctx.fillStyle = "#dacccc44";
  ctx.beginPath();
  ctx.arc(ball.x - 3, ball.y - 3, ball.radius / 3, 0, Math.PI * 2);
  ctx.fill();
}
//traileffects
function drawTrail() {
  for (let i = 0; i < ball.trail.length; i++) {
    let trailPos = ball.trail[i];
    const alpha = (i + 1) / ball.trail.length;
    const size = ball.radius * alpha;
    ctx.globalAlpha = alpha * 0.4;
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(trailPos.x, trailPos.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0; //this resets the transperancy***https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha***
}
//update trail for memory purposes remember to tell adham to add this to the game function on main
function updateTrail() {
  ball.trail.unshift({ x: ball.x, y: ball.y }); //
  if (ball.trail.length > 10) {
    ball.trail.pop();
  }
}

//glow effects
function drawBallGlow() {
  const gradient = ctx.createRadialGradient(
    ball.x,
    ball.y,
    0,
    ball.x,
    ball.y,
    ball.radius * 2.5
  );
  gradient.addColorStop(0, ball.color + "80"); // center = semi-transparent color **revise**
  gradient.addColorStop(1, ball.color + "00"); // edge = fully transparent**revise**
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius * 2.5, 0, Math.PI * 2);
  ctx.fill();
}
//paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 10);
  ctx.fillStyle = paddle.color;
  ctx.fill();
  ctx.closePath();
}

//Ball physics
function updateBall() {
  updateTrail();
  ball.x += ball.vx;
  ball.y += ball.vy;

  //wallcollision
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
  //paddlecollision
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

//keyboard movement
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      paddle.x -= 20;
      if (paddle.x < 0) paddle.x = 0;
      break;
    case "ArrowRight":
      paddle.x += 20;
      if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
      }
      break;
  }
});
//mouse movement
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  paddle.x = mouseX - paddle.width / 2;

  // Keep paddle in bounds
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }
});

/*prototypegameloop for adham
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBall();
  drawPaddle(); 
  drawBall();
  requestAnimationFrame(gameLoop);
}
gameLoop();*/
