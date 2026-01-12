let board = document.querySelector(".board")
// Dynamic block size based on screen width
let blockWidth = window.innerWidth < 480 ? 25 : window.innerWidth < 768 ? 35 : 50;
let blockHeight = blockWidth;
let rows = Math.floor(board.clientHeight / blockHeight)
let cols = Math.floor(board.clientWidth / blockWidth)
let modal = document.querySelector(".modal")
let startbtn = document.querySelector(".startbtn")
let restartbtn = document.querySelector(".restartbtn")
let gameOver = document.querySelector(".gameOver")
let startGame = document.querySelector(".start-game")
let scoreElement = document.querySelector("#score")
let timeElement = document.querySelector("#time")
let highScoreElement = document.querySelector("#hi-score")

let blocks = []
let snake = [{ x: 5, y: 12 }]
let direction = "left"
let head = null
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
let interval = null
let timeInterval = null
let score = 0
let time = `00-00`
let highScore = localStorage.getItem("highScore") || 0
highScoreElement.innerHTML = `High Score: ${highScore}`;


for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        let block = document.createElement("div")
        board.appendChild(block)
        block.classList.add("block")
        blocks[`${row}-${col}`] = block;
    }
}

function renderSnake() {
    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    }
    else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    }
    else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(interval);
        clearInterval(timeInterval);
        modal.style.display = "flex";
        gameOver.style.display = "flex";
        startGame.style.display = "none";
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        return;
    }

    for (let i = 0; i < snake.length; i++) {
        if (head.x == snake[i].x && head.y == snake[i].y) {
            clearInterval(interval);
            clearInterval(timeInterval);
            modal.style.display = "flex";
            gameOver.style.display = "flex";
            startGame.style.display = "none";
            blocks[`${food.x}-${food.y}`].classList.remove("food")
            return;
        }
    }
    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })
    snake.unshift(head)
    snake.pop()

    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        snake.push(head)
        score += 10
        scoreElement.innerHTML = `Score: ${score}`

        if (score > highScore) {
            highScore = score
            highScoreElement.innerHTML = `High Score: ${highScore}`
            localStorage.setItem("highScore", highScore)
        }

    }
    snake.forEach((segments) => {
        blocks[`${segments.x}-${segments.y}`].classList.add("fill")
    })

    blocks[`${food.x}-${food.y}`].classList.add("food")

}


// Keyboard controls
addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key == "w" && direction !== "down") {
        direction = "up"
    }
    else if (e.key === "ArrowDown" || e.key == "s" && direction !== "up") {
        direction = "down"
    }
    else if (e.key === "ArrowLeft" || e.key == "a" && direction !== "right") {
        direction = "left"
    }
    else if (e.key === "ArrowRight" || e.key == "d" && direction !== "left") {
        direction = "right"
    }
})

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

board.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    e.preventDefault();
}, { passive: false });

board.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
    e.preventDefault();
}, { passive: false });

function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const minSwipeDistance = 30;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0 && direction !== "left") {
                direction = "right";
            } else if (diffX < 0 && direction !== "right") {
                direction = "left";
            }
        }
    } else {
        // Vertical swipe
        if (Math.abs(diffY) > minSwipeDistance) {
            if (diffY > 0 && direction !== "up") {
                direction = "down";
            } else if (diffY < 0 && direction !== "down") {
                direction = "up";
            }
        }
    }
}

restartbtn.addEventListener("click", () => {
    clearInterval(timeInterval);
    score = 0
    time = `00-00`
    timeElement.innerHTML = `Time: ${time}`
    scoreElement.innerHTML = `Score: ${score}`;

    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })
    snake = [{ x: 5, y: 12 }]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

    modal.style.display = "none";
    gameOver.style.display = "none";
    timer()
    interval = setInterval(() => {
        renderSnake()

    }, 300)
})


startbtn.addEventListener("click", () => {
    modal.style.display = "none";
    timer()
    interval = setInterval(() => {
        renderSnake()
    }, 300)
})

function timer() {
    timeInterval = setInterval(() => {
        let [min, sec] = time.split("-").map(Number)
        if (sec === 59) {
            min += 1
            sec = 0
        } else {
            sec += 1
        }
        time = `${min.toString().padStart(2, '0')}-${sec.toString().padStart(2, '0')}`
        timeElement.innerHTML = `Time: ${time}`
    }, 1000)
}