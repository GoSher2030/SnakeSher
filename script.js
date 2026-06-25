const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("finalScore");
const bestScoreEl = document.getElementById("bestScore");

const menuMusic = document.getElementById("menuMusic");
const gameMusic = document.getElementById("gameMusic");
const eatSound = document.getElementById("eatSound");
const loseSound = document.getElementById("loseSound");

const box = 20;
const size = canvas.width / box;

let snake;
let direction;
let food;
let score;
let bestScore = localStorage.getItem("bestScore") || 0;
bestScoreEl.textContent = bestScore;

let gameLoop;
let speed = 120;

function initGame() {
    snake = [
        { x: 10, y: 10 }
    ];

    direction = { x: 1, y: 0 };

    score = 0;
    scoreEl.textContent = score;

    spawnFood();
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size)
    };
}

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * box, y * box, box, box);
}

function drawSnake() {
    snake.forEach((part, i) => {
        drawCell(
            part.x,
            part.y,
            i === 0 ? "#00ff66" : "#00cc55"
        );
    });
}

function drawFood() {
    drawCell(food.x, food.y, "#ff3b3b");
}

function update() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // стены
    if (
        head.x < 0 ||
        head.x >= size ||
        head.y < 0 ||
        head.y >= size
    ) {
        return gameOver();
    }

    // себя
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            return gameOver();
        }
    }

    snake.unshift(head);

    // еда
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;

        eatSound.currentTime = 0;
        eatSound.play();

        spawnFood();

        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("bestScore", bestScore);
            bestScoreEl.textContent = bestScore;
        }

    } else {
        snake.pop();
    }
}

function render() {
    ctx.fillStyle = "#0a0f0c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawFood();
}

function gameTick() {
    update();
    render();
}

function startGame() {
    menuScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    menuMusic.pause();
    gameMusic.currentTime = 0;
    gameMusic.play();

    initGame();

    clearInterval(gameLoop);
    gameLoop = setInterval(gameTick, speed);
}

function gameOver() {
    clearInterval(gameLoop);

    loseSound.play();

    finalScoreEl.textContent = score;

    gameScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");

    gameMusic.pause();
    menuMusic.play();
}

function goMenu() {
    clearInterval(gameLoop);

    gameOverScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    menuScreen.classList.remove("hidden");

    gameMusic.pause();
    menuMusic.currentTime = 0;
    menuMusic.play();
}

// управление
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction.y === 0) {
        direction = { x: 0, y: -1 };
    }
    if (e.key === "ArrowDown" && direction.y === 0) {
        direction = { x: 0, y: 1 };
    }
    if (e.key === "ArrowLeft" && direction.x === 0) {
        direction = { x: -1, y: 0 };
    }
    if (e.key === "ArrowRight" && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
});

// кнопки
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
menuBtn.addEventListener("click", goMenu);

// стартовое меню
menuMusic.volume = 0.4;
gameMusic.volume = 0.4;
menuMusic.play();
