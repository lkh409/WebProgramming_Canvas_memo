var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var score = 0;

var x = canvas.width / 5;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var brickRowCount = 5; //네모 세로 개수
var brickColumnCount = 12; //네모 가로 개수
var brickWidth = 90; //가로 길이 
var brickHeight = 28; //세로 길이
var brickPadding = 7;  
var brickOffsetTop = 30;
var brickOffsetLeft = 10;

var ballRadius = 11;

// 반사판 크기
var paddleHeight = 12;
var paddleWidth = 117;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var bricks = [];
for (i = 0; i < brickColumnCount; ++i) {
  bricks[i] = [];
  for (q = 0; q < brickRowCount; ++q) {
    bricks[i][q] = {
      x: 0,
      y: 0,
      status: 1,
    };
  }
}

//공
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "rgb(102, 103, 171)"
  ctx.fill();
  ctx.closePath();
}

// 반사판
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "rgb(255, 248, 241)";
  ctx.fill();
  ctx.closePath();
}

// 네모
function drawBricks() {
  for (i = 0; i < brickColumnCount; ++i) {
    for (q = 0; q < brickRowCount; ++q) {
      if (bricks[i][q].status == 1) {
        var brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = q * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[i][q].x = brickX;
        bricks[i][q].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "rgb(255, 248, 241)";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "rgb(255, 248, 241)";
  ctx.fillText("Score: " + score, 8, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    changeBallColor("#FF00DD");
  }
  if (y + dy < ballRadius) {
    dy = -dy;
    changeBallColor("#3F0099");
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      // alert("Game Over");
      document.location.reload();
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (i = 0; i < brickColumnCount; ++i) {
    for (q = 0; q < brickRowCount; ++q) {
      var b = bricks[i][q];

      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;

          if (score == brickRowCount * brickColumnCount) {
            alert("You Win, Congratulations");
            document.location.reload();
          }
        }
      }
    }
  }
}

setInterval(draw, 10);
