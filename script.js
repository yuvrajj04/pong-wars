
const colorPalette = {
    ArcticPowder: "#F1F6F4",
    MysticMint: "#D9E8E3",
    Forsythia: "#FFC801",
    DeepSaffron: "#FF9932",
    NocturnalExpedition: "#114C5A",
    OceanicNoir: "#172B36",
  };


  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");
  const scoreElement = document.getElementById("score");

  const DAY_COLOR = colorPalette.MysticMint;
  const DAY_BALL_COLOR = colorPalette.NocturnalExpedition;

  const NIGHT_COLOR = colorPalette.NocturnalExpedition;
  const NIGHT_BALL_COLOR = colorPalette.MysticMint;

  const SQUARE_SIZE = 25;

  const numSquaresX = canvas.width / SQUARE_SIZE;
  const numSquaresY = canvas.height / SQUARE_SIZE;

  let squares = [];

  for (let i = 0; i < numSquaresX; i++) {
    squares[i] = [];
    for (let j = 0; j < numSquaresY; j++) {
      squares[i][j] = i < numSquaresX / 2 ? DAY_COLOR : NIGHT_COLOR;
    }
  }

  let x1 = canvas.width / 4;
  let y1 = canvas.height / 2;
  let dx1 = 12.5;
  let dy1 = -12.5;

  let x2 = (canvas.width / 4) * 3;
  let y2 = canvas.height / 2;
  let dx2 = -12.5;
  let dy2 = 12.5;

  let iteration = 0;

  function drawBall(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, SQUARE_SIZE / 2, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  function drawSquares() {
    for (let i = 0; i < numSquaresX; i++) {
      for (let j = 0; j < numSquaresY; j++) {
        ctx.fillStyle = squares[i][j];
        ctx.fillRect(
          i * SQUARE_SIZE,
          j * SQUARE_SIZE,
          SQUARE_SIZE,
          SQUARE_SIZE
        );
      }
    }
  }

  function updateSquareAndBounce(x, y, dx, dy, color) {
    let updatedDx = dx;
    let updatedDy = dy;

    // Check multiple points around the ball's circumference
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      let checkX = x + Math.cos(angle) * (SQUARE_SIZE / 2);
      let checkY = y + Math.sin(angle) * (SQUARE_SIZE / 2);

      let i = Math.floor(checkX / SQUARE_SIZE);
      let j = Math.floor(checkY / SQUARE_SIZE);

      if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
        if (squares[i][j] !== color) {
          squares[i][j] = color;

          // Determine bounce direction based on the angle
          if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
            updatedDx = -updatedDx;
          } else {
            updatedDy = -updatedDy;
          }
        }
      }
    }

    return { dx: updatedDx, dy: updatedDy };
  }

  function updateScoreElement() {
    let dayScore = 0;
    let nightScore = 0;
    for (let i = 0; i < numSquaresX; i++) {
      for (let j = 0; j < numSquaresY; j++) {
        if (squares[i][j] === DAY_COLOR) {
          dayScore++;
        } else if (squares[i][j] === NIGHT_COLOR) {
          nightScore++;
        }
      }
    }

    scoreElement.textContent = `day ${dayScore} | night ${nightScore}`;
  }

  function checkBoundaryCollision(x, y, dx, dy) {
    if (x + dx > canvas.width - SQUARE_SIZE / 2 || x + dx < SQUARE_SIZE / 2) {
      dx = -dx;
    }
    if (
      y + dy > canvas.height - SQUARE_SIZE / 2 ||
      y + dy < SQUARE_SIZE / 2
    ) {
      dy = -dy;
    }

    return { dx: dx, dy: dy };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSquares();

    drawBall(x1, y1, DAY_BALL_COLOR);
    let bounce1 = updateSquareAndBounce(x1, y1, dx1, dy1, DAY_COLOR);
    dx1 = bounce1.dx;
    dy1 = bounce1.dy;

    drawBall(x2, y2, NIGHT_BALL_COLOR);
    let bounce2 = updateSquareAndBounce(x2, y2, dx2, dy2, NIGHT_COLOR);
    dx2 = bounce2.dx;
    dy2 = bounce2.dy;

    let boundary1 = checkBoundaryCollision(x1, y1, dx1, dy1);
    dx1 = boundary1.dx;
    dy1 = boundary1.dy;

    let boundary2 = checkBoundaryCollision(x2, y2, dx2, dy2);
    dx2 = boundary2.dx;
    dy2 = boundary2.dy;

    x1 += dx1;
    y1 += dy1;
    x2 += dx2;
    y2 += dy2;

    iteration++;
    if (iteration % 1_000 === 0) console.log("iteration", iteration);

    updateScoreElement();

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);