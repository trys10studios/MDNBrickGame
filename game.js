var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var ball_x = canvas.width / 2;
var ball_y = canvas.height - 30;
var ball_dx = 2;
var ball_dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleOffset = 10; // Used to put paddle above the bottom of the board
var paddleX = (canvas.width - paddleWidth) / 2;

var interval; // Frame rate for game

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var colorRed = "#CC0000"
var colorBlue = "#0000CC"
var colorGreen = "#00CC00"
var points = 0;

var bricks = []; // Brick 'objects'
for (let col = 0; col < brickColumnCount; col++) {
    bricks[col] = [];
    for (let row = 0; row < brickRowCount; row++) {
        bricks[col][row] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function drawBricks() {
    for (let col = 0; col < brickColumnCount; col++) {
        for (let row = 0; row < brickRowCount; row++) {
            if (bricks[col][row].status == 1) {
                let brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if (row == 0) {
                    ctx.fillStyle = colorRed;
                } // Red
                if (row == 1) {
                    ctx.fillStyle = colorGreen;
                } // Red
                if (row == 2) {
                    ctx.fillStyle = colorBlue;
                } // Red
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball_x, ball_y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#999999";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - paddleOffset, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (ball_x + ballRadius > b.x && ball_x - ballRadius < b.x + brickWidth && ball_y + ballRadius > b.y && ball_y - ballRadius < b.y + brickHeight) {
                    ball_dy = -ball_dy;
                    b.status = 0;
                    if (r == 0) {
                        points += 3;
                    }
                    if (r == 1) {
                        points += 2;
                    }
                    if (r == 2) {
                        points++;
                    }

                }
            }
        }
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // Left and right walls
    if (ball_x + ball_dx > canvas.width - ballRadius || ball_x + ball_dx < ballRadius) {
        ball_dx = -ball_dx;
    }
    // Top wall
    if (ball_y + ball_dy < ballRadius) {
        ball_dy = -ball_dy;
    }

    // Collision with paddle, the '2' here is used to make the ball seem to bounce off the surface of the paddle and not embed
    if (ball_y + ball_dy > canvas.height - ballRadius * 2) {
        if (ball_x > paddleX && ball_x < paddleX + paddleWidth) {
            ball_dy = -ball_dy;
        }

        // Originally the tutorial suggested an 'else' statement, I'm using 'else if' here to make sure the ball passes the paddle before the game is over (due to the need for the 'ballRadius * 2 above to make it look like the ball bounces off the surface of the paddle) NOTE: Interesting stuff happening here because of the ball passing the paddle, kind of cool.
        if (ball_y + ball_dy > canvas.height - paddleHeight) {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    ball_x += ball_dx;
    ball_y += ball_dy;

    // Accessing an HTML div through id to change the text here
    document.getElementById("score").textContent = "Score: " + points;

    // Using ctx (draw) to change the overlay text
    if (points == 30) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '60px serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = "#8B228B"; // Purple
        ctx.fillText("WINNER!", canvas.width / 2, canvas.height / 2);
        clearInterval(interval); // Needed for Chrome to end game
    }
}

interval = setInterval(draw, 10);
