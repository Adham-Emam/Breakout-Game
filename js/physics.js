const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 10);
  ctx.fillStyle = paddle.color;
  ctx.fill();
  ctx.closePath();
}

//Ball physics
function updateBall() {
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
    ball.vy = -ball.vy;
    ball.y = paddle.y - ball.radius - 2;
  }
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
