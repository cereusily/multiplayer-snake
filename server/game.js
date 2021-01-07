const { GRID_SIZE } = require('./constants');

module.exports = {
    initGame,
    gameLoop,
    getUpdatedVelocity,
}

function initGame() {
    const state = createGameState();
    randomFood(state);
    return state;
}

class PlayerSnakeObj {
    constructor(posX, posY, vectorX, vectorY, playerVal) {
        this.pos = {
            x: posX,
            y: posY
        }
        this.vel = {
            x: vectorX,
            y: vectorY
        }
        this.snake = [
            {x: posX - 2, y: posY},
            {x: posX - 1, y: posY},
            {x: posX, y: posY}
        ]
        this.playerVal = playerVal
    }
    calculateVelocity() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }
    checkCollision() {
        if (this.pos.x < 0 || this.pos.x > GRID_SIZE || this.pos.y < 0 || this.pos.y > GRID_SIZE) {
            return true;
        }
    }
    checkFood(state) {
        if (state.food.x === this.pos.x && state.food.y === this.pos.y) {
            this.snake.push({ ...this.pos });
            this.calculateVelocity()
            randomFood(state);
        }
    }
    checkSelfCollision() {
        if (this.vel.x || this.vel.y) {
            for (let cell of this.snake) {
                if (cell.x === this.pos.x && cell.y === this.pos.y) {
                    return true;
                }
            }
            this.snake.push({...this.pos});
            this.snake.shift();
        }
        return false;
    }
    checkSnakeCollision(snakePlayer) {
        for (let cell of snakePlayer.snake) {
            if (this.pos.x === cell.x && this.pos.y === cell.y) {
                return true
            }
        }
    }
}

function createGameState() {
    const playerOne = new PlayerSnakeObj(3, 5, 0, 0, 2);
    const playerTwo = new PlayerSnakeObj(3, 15, 0, 0, 1);

    return {
        players: [playerOne, playerTwo],
        food: {},
        gridsize: GRID_SIZE,
    };
}

function gameLoop(state) {
    if (!state) {
        return;
    }

    const playerOne = state.players[0];
    const playerTwo = state.players[1];

    playerOne.calculateVelocity();
    playerTwo.calculateVelocity();

    if (playerOne.checkCollision() || playerOne.checkSelfCollision() || 
    playerOne.checkSnakeCollision(playerTwo)) {
        return playerOne.playerVal;
    }
    if (playerTwo.checkCollision() || playerTwo.checkSelfCollision() || 
    playerTwo.checkSnakeCollision(playerOne)) {
        return playerTwo.playerVal;
    }

    playerOne.checkFood(state);
    playerTwo.checkFood(state);

    return false;
}

function randomFood(state) {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    }

    for (let cell of state.players[0].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }
    for (let cell of state.players[1].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }
    state.food = food;
}

function getUpdatedVelocity(keyCode) {
    switch (keyCode) {
        case 37: { // left
            return { x: -1, y: 0}
        }
        case 38: { // down
            return { x: 0, y: -1}
        }
        case 39: { // right
            return { x: 1, y: 0}
        }
        case 40: { // up
            return { x: 0, y: 1}
        }
    }
}
