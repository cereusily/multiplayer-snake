
const BG_COLOUR = '#231f20';
const SNAKE_ONE_COLOUR = '#408bb6';
const SNAKE_TWO_COLOUR = '#9bcb81';
const FOOD_COLOUR = "#e55916";

const socket = io('https://warm-castle-45866.herokuapp.com/');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);
socket.on('tooManyPlayers', handleTooManyPlayers);

const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initialScreen");
const newGameBtn = document.getElementById("newGameButton");
const joinGameBtn = document.getElementById("joinGameButton");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

function newGame() {
    socket.emit('newGame');
    init()
}

function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    init()
}

let canvas, ctx;
let player;
let gameActive = false;

function init() {
    initialScreen.style.display = "none";
    gameScreen.style.display = "block"

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', keydown);
    gameActive = true;
}

function keydown(e) {
    socket.emit('keydown', e.keyCode);
}

function drawGame(state) {
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridsize = state.gridsize;
    const size = canvas.width / gridsize;

    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    drawPlayer(state.players[0], size, SNAKE_ONE_COLOUR);
    drawPlayer(state.players[1], size, SNAKE_TWO_COLOUR);
};

function drawPlayer(playerState, size, colour) {
    const snake = playerState.snake;

    ctx.fillStyle = colour;
    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    };
}

function handleInit(number) {
    playerNumber = number;
};

function handleGameState(gameState) {
    if (!gameActive) {
        return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => drawGame(gameState))
}

function handleGameOver(data) {
    if (!gameActive) {
        return;
    }
    data = JSON.parse(data);

    if (data.winner === playerNumber) {
        alert("You win!");
    } else {
        alert("You lose!");
    }
    gameActive = false;
}

function handleGameCode(gameCode) {
    gameCodeDisplay.innerText = gameCode;
}

function handleUnknownGame() {
    resetGame();
    alert("Unknown game code.")
}

function handleTooManyPlayers() {
    resetGame();
    alert("This game is already in progress.")
}

function resetGame() {
    playerNumber = null;
    gameCodeInput.value = "";
    gameCodeDisplay.innerText = "block";
    gameScreen.style.display = "none";
}