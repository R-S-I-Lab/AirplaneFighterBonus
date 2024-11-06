let plane = document.getElementById("plane");
let gameArea = document.getElementById("gameArea");
let score = 0, gameInterval = 0, milliSeconds = 0;
const hundred = 100, leftArrowKey = 37, rightArrowKey = 39, maxSize = 600;
const frequency = 75, spaceKey = 32;
const positions = ["0px", "200px", "400px"];
const parameters = [
    ["obstacle", 3],
    ["rockets", -5],
];

function isCollision(object, obstacle) {
    let objectRect = object.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();
    return !(
        objectRect.top > obstacleRect.bottom ||
        objectRect.bottom < obstacleRect.top ||
        objectRect.right < obstacleRect.left ||
        objectRect.left > obstacleRect.right
    );
}

function isDestroyed(firedRocket) {
    const obstacles = document.getElementsByClassName("obstacle");
    for (let i = 0; i < obstacles.length; ++i) {
        if (isCollision(firedRocket, obstacles[i])) {
            firedRocket.remove();
            obstacles[i].remove();
            return true;
        }
    }
    return false;
}

function moveObjects(line, column) {
    let objects = document.getElementsByClassName(parameters[line][column]);
    for (let i = 0; i < objects.length; ++i) {
        let topPosition = parseInt(window.getComputedStyle(objects[i]).top, 10);
        objects[i].style.top = (topPosition + parameters[line][column + 1]) + "px";
        if (topPosition > maxSize || topPosition < 0) {
            objects[i].remove();
        }
        if (parameters[line][column] === "obstacle" && isCollision(plane, objects[i])) {
            clearInterval(gameInterval);
            showScore();
            break;
        }
        if (parameters[line][column] === "rockets" && isDestroyed(objects[i])) {
            ++score;
            updateScore();
        }
    }
}

function createObstacles() {
    let obstacle = document.createElement("div");
    obstacle.id = "obstacle";
    obstacle.className = "obstacle";
    const index = Math.floor(Math.random() * positions.length);
    obstacle.style.left = positions[index];
    gameArea.appendChild(obstacle);
}

function fire() {
    let rockets = document.createElement("div");
    rockets.id = "rockets";
    rockets.className = "rockets";
    rockets.style.left = plane.style.left;
    gameArea.appendChild(rockets);
}

function startGame() {
    const card = document.getElementById("startCard");
    card.remove();
    createObstacles();
    startInterval();
}

document.addEventListener("keydown", function(e) {
    let leftPosition = parseInt(window.getComputedStyle(plane).left, 10);
    if (e.keyCode === leftArrowKey && leftPosition > hundred) {
        plane.style.left = (leftPosition - 2 * hundred) + "px";
    } else if (e.keyCode === rightArrowKey && leftPosition < maxSize - hundred) {
        plane.style.left = (leftPosition + 2 * hundred) + "px";
    }
    if (e.keyCode === spaceKey) {
        fire();
    }
});

function startInterval() {
    gameInterval = setInterval(function () {
        ++milliSeconds;
        if (!(milliSeconds % frequency)) {
            createObstacles();
        }
        moveObjects(0, 0);
        moveObjects(1, 0);
    }, 10);
}

function updateScore() {
    const scoreBoard = document.getElementById("score");
    scoreBoard.innerText = "Score: " + score;
}

function addAttributes(element, attributes) {
    for (let i = 0; i < attributes.length; i += 2) {
        element.setAttribute(attributes[i], attributes[i + 1]);
    }
    return element;
}

function showScore() {
    let finalScore = addAttributes(document.createElement("div"), ["class", "card_result"]);
    finalScore.innerText = "Game Over! Your score: " + score;
    const restartButton = addAttributes(document.createElement("button"), ["class",
        "btn btn-primary", "style", "width:150px", "onclick", "window.location.reload()"]);
    restartButton.innerText = "Restart Game";
    finalScore.appendChild(restartButton);
    gameArea.appendChild(finalScore);
}
