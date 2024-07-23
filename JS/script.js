// script.js


const checkpointPrinter = document.getElementById('checkPoint')
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 70;
const timerDisplay = document.getElementById('timerDisplay');



const maze = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 2, 1, 0, 2, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 2, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let playerPos = { x: 1, y: 1 };
const collectables = [{ x: 6, y: 6 }, { x: 3, y: 8 }];
let collected = 0;
let blinded = false;


let timer;
let timeElapsed = 0;

function addCollactables(arrayPosCollectables) {
    arrayPosCollectables.forEach(collectablesPos => {
        maze[collectablesPos.x][collectablesPos.y]=5;
    });
}


function startTimer() {
    timeElapsed = 0;
    timerDisplay.textContent = `Time: ${(timeElapsed / 1000).toFixed(3)}s`;
    timer = setInterval(() => {
        timeElapsed += 10; // Increment by 10 milliseconds
        timerDisplay.textContent = `Time: ${(timeElapsed / 1000).toFixed(3)}s`;
    }, 10); // Set interval to 10 milliseconds
}


function stopTimer() {
    clearInterval(timer);
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height+1);
    if (blinded) {
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                let tile = maze[y][x];
                ctx.fillStyle = tile === 0 ? 'black' :
                                tile === 1 ? 'black' :
                                tile === 2 ? 'black' :
                                tile === 4 ? 'black' :
                                tile === 5 ? 'black' : 'grey';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }else{
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                let tile = maze[y][x];
                ctx.fillStyle = tile === 0 ? 'black' :
                                tile === 1 ? 'white' :
                                tile === 2 ? 'red' :
                                tile === 4 ? 'green' :
                                tile === 5 ? 'blue' : 'grey';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
    ctx.fillStyle = 'yellow';
    ctx.fillRect(playerPos.x * tileSize, playerPos.y * tileSize, tileSize, tileSize);
}

function updateCheckPointValue(collected,arrayCollactables){
    checkpointPrinter.innerHTML = `CheckPoint : ${collected} / ${arrayCollactables.length}`;
}

function movePlayer(dx, dy) {
    if (blinded == false) {
        blinded = true;
        drawMaze();
        startTimer();
    }
    let newX = playerPos.x + dx;
    let newY = playerPos.y + dy;

    if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length) {
        if (maze[newY][newX] !== 0) {
            playerPos.x = newX;
            playerPos.y = newY;
            if (maze[newY][newX] === 5) {
                collected+=1;
                maze[newY][newX] = 6;
                updateCheckPointValue(collected,collectables);
            }
            if (maze[newY][newX] === 2) {
                blinded=false;
                drawMaze();
                stopTimer();
                alert('Game Over!');
                resetGame();
                
            } else if (maze[newY][newX] === 4) {
                if (collected == collectables.length) {
                    stopTimer();
                    blinded=false;
                    drawMaze();
                    alert('You Win!');
                    resetGame();
                    
                }
            }
        }
    }

    drawMaze();
}

function resetGame() {
    playerPos = { x: 1, y: 1 };
    blinded = false;
    collected=0;
    addCollactables(collectables);
    updateCheckPointValue(collected,collectables);
    drawMaze();
}

window.addEventListener('keydown', function(e) {
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

// Initial draw
addCollactables(collectables);
updateCheckPointValue(collected,collectables);
drawMaze();
