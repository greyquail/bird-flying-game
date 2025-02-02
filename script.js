// Setting up the canvas and the game environment
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set the canvas dimensions
canvas.width = 800;
canvas.height = 600;

const bird = {
    x: 100,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    color: "yellow"
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
let frame = 0;
let gameOver = false;
let score = 0;

document.getElementById("gameMessage").style.display = 'none';

// Bird control
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !gameOver) {
        bird.velocity = bird.lift;
    }
});

// Pipe movement and collision check
function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: pipeHeight + pipeGap
    });
}

function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;
        if (pipes[i].x + pipeWidth <= 0) {
            pipes.splice(i, 1);
            score++;
        }
    }
}

function checkCollision() {
    // Check if bird hits the ground or the ceiling
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
        document.getElementById("gameMessage").textContent = "Game Over! Press Space to Restart";
        document.getElementById("gameMessage").style.display = 'block';
    }

    // Check if bird hits pipes
    for (let i = 0; i < pipes.length; i++) {
        if (bird.x + bird.width > pipes[i].x && bird.x < pipes[i].x + pipeWidth) {
            if (bird.y < pipes[i].top || bird.y + bird.height > pipes[i].bottom) {
                gameOver = true;
                document.getElementById("gameMessage").textContent = "Game Over! Press Space to Restart";
                document.getElementById("gameMessage").style.display = 'block';
            }
        }
    }
}

// Game render function
function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the bird and apply gravity
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Draw the bird
    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw the pipes
    for (let i = 0; i < pipes.length; i++) {
        ctx.fillStyle = "green";
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top);
        ctx.fillRect(pipes[i].x, pipes[i].bottom, pipeWidth, canvas.height - pipes[i].bottom);
    }

    // Display the score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    if (!gameOver) {
        frame++;
        if (frame % 90 === 0) {
            createPipe();
        }
        movePipes();
        checkCollision();
        requestAnimationFrame(renderGame);
    }
}

// Restart the game
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && gameOver) {
        // Reset the game state
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        pipes.length = 0;
        score = 0;
        gameOver = false;
        document.getElementById("gameMessage").style.display = 'none';
        renderGame();
});

// Start the game
renderGame();
