const canvas = document.getElementById("canvas");
canvas.setAttribute("width", 500);
canvas.setAttribute("height", 700);
const ctx = canvas.getContext("2d");

const CS = 20;
const WH = 500;
const WW = 300;
const gameSR = 150;

let grid = [];

let currentFigure;

ctx.fillRect(0, 0, WW + 2 * CS, CS);
ctx.fillRect(WW + CS, 0, CS, WH + 2 * CS);
ctx.fillRect(0, WH + CS, WW + 2 * CS, CS);
ctx.fillRect(0, 0, CS, WH + 2 * CS);

class Cell {

    constructor(pos) {

        this.color = "white";
        this.pos = pos;
        this.filled = false;
    }
}

class Vec2 {

    constructor(x, y) {

        this.x = x;
        this.y = y; 
    }
}

const outOfGrid = (pos) => pos.x < 0 || pos.y >= grid.length || pos.x >= grid[0].length; 

const clearWindow = () => {

    ctx.clearRect(CS, CS, WW, WH);
}

const chooseFigure = () => {

    currentFigure = figures[Math.floor(Math.random() * figures.length)];
    currentFigure.rotation = currentFigure.startRotation;
    currentFigure.pos = new Vec2(7, -1);
}

const createGrid = () => {

    const gridW = WW / CS;
    const gridH = WH / CS;

    for(let y = 0; y < gridH; y++) {

        grid[y] = [];
        for(let x = 0; x < gridW; x++) {

            grid[y][x] = new Cell(new Vec2(x * CS + CS, y * CS + CS));
        }
    }
}

const colorCells = () => {

    grid.forEach(row => {
        row.forEach(cell => {

            ctx.fillStyle = cell.color;
            ctx.fillRect(cell.pos.x, cell.pos.y, CS, CS);
        })
    })
}

const clearPrevFigurePos = () => {

    const cells = currentFigure[currentFigure.rotation];

    cells.forEach(cell => {

        const pos = new Vec2(currentFigure.pos.x + cell.x, currentFigure.pos.y + cell.y);

        if(!outOfGrid(pos) && pos.y >= 0) {
            
            grid[pos.y][pos.x].color = "white";
        }
    });
}

const drawFigure = () => {

    const cells = currentFigure[currentFigure.rotation];

    cells.forEach(cell => {

        if(!checkCollision(cell) && currentFigure.pos.y + cell.y >= 0) {

            grid[currentFigure.pos.y + cell.y][currentFigure.pos.x + cell.x].color = currentFigure.color;
        }
    });
}

const checkCollision = (cell) => {
    
    return outOfGrid(new Vec2(currentFigure.pos.x + cell.x, currentFigure.pos.y + cell.y)) || 
    (currentFigure.pos.y + cell.y >= 0 && grid[currentFigure.pos.y + cell.y][currentFigure.pos.x + cell.x].filled);
}

const checkRow = () => {

    let diff = 0;

    for(let i = grid.length - 1; i >= 0; i--) {

        const row = grid[i];

        const scored = row.reduce((prev, cur) => prev && cur.filled);
        if(scored) {

            diff++;
            row.forEach(cell => { 

                cell.filled = false;
                cell.color = "white";
            });
        } else {

            if(diff > 0) {

                row.forEach((cell, j) => {
                    
                    if(cell.filled) {

                        const colorT = cell.color;

                        cell.filled = false;
                        cell.color = "white";

                        grid[i + diff][j].color = colorT;
                        grid[i + diff][j].filled = true;
                    }
                });
            }
        }

    }
}

const moveFigure = (e) => {

    if(e.key == "ArrowRight") {

        clearPrevFigurePos();

        currentFigure.pos.x++;

        let hit = false;
        const cells = currentFigure[currentFigure.rotation];

        cells.forEach(cell => {

            if(checkCollision(cell)) {
    
                hit = true;
            }
        });

        if(hit) {

            currentFigure.pos.x--;
        }

        drawFigure();
    } else if(e.key == "ArrowLeft") {

        clearPrevFigurePos();

        currentFigure.pos.x--;

        let hit = false;
        const cells = currentFigure[currentFigure.rotation];

        cells.forEach(cell => {

            if(checkCollision(cell)) {
    
                hit = true;
            }
        });

        if(hit) {

            currentFigure.pos.x++;
        }

        drawFigure();
    }

}

const rotateFigure = (e) => {

    if(e.key == "ArrowUp") {

        clearPrevFigurePos();

        const prevRotation = currentFigure.rotation;

        switch(prevRotation) {
            case "top":
                currentFigure.rotation = "right";
                break;
            case "right":
                currentFigure.rotation = "down";
                break;
            case "down":
                currentFigure.rotation = "left";
                break;
            case "left":
                currentFigure.rotation = "top";
                break;
        }
        
        let hit = false;
        const cells = currentFigure[currentFigure.rotation];

        cells.forEach(cell => {

            if(checkCollision(cell)) {
    
                hit = true;
            }
        });

        if(hit) {

            currentFigure.rotation = prevRotation;
        }

        drawFigure();

    } else if(e.key == "ArrowDown") {

        clearPrevFigurePos();

        const prevRotation = currentFigure.rotation;

        switch(prevRotation) {
            case "top":
                currentFigure.rotation = "left";
                break;
            case "right":
                currentFigure.rotation = "top";
                break;
            case "down":
                currentFigure.rotation = "right";
                break;
            case "left":
                currentFigure.rotation = "down";
                break;
        }
        
        let hit = false;
        const cells = currentFigure[currentFigure.rotation];

        cells.forEach(cell => {

            if(checkCollision(cell)) {
    
                hit = true;
            }
        });

        if(hit) {

            currentFigure.rotation = prevRotation;
        }

        drawFigure();
    }
}

const figureFall = () => {

    clearPrevFigurePos();

    currentFigure.pos.y++;

    const cells = currentFigure[currentFigure.rotation];

    let hit = false;

    cells.forEach(cell => {

        if(checkCollision(cell)) {

            hit = true;
        }
    });

    if(hit) {
        
        currentFigure.pos.y--;
        cells.forEach(cell => {

            grid[currentFigure.pos.y + cell.y][currentFigure.pos.x + cell.x].filled = true;
            grid[currentFigure.pos.y + cell.y][currentFigure.pos.x + cell.x].color = currentFigure.color;
        });

        checkRow();
        chooseFigure();
    }

    drawFigure();
}

const gameLoop = () => {
  
    clearWindow();
    figureFall();
    colorCells();
}

figures = [

    T = { pos: new Vec2(7, -1),
          color: 'green', 
          startRotation: "down",
          rotation: "down",
          down: [ new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, 1) ],
          top: [ new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, -1) ],
          left: [ new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, 1), new Vec2(0, -1) ],
          right: [ new Vec2(1, 0), new Vec2(0, 0), new Vec2(0, 1), new Vec2(0, -1) ] },

    S = { pos: new Vec2(7, -1),
          color: 'violet', 
          startRotation: "right",
          rotation: "right",
          down: [ new Vec2(0, -1), new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, 1) ],
          top: [ new Vec2(0, 1), new Vec2(0, 0), new Vec2(-1, 0), new Vec2(-1, -1) ],
          left: [ new Vec2(-1, 1), new Vec2(0, 0), new Vec2(0, 1), new Vec2(1, 0) ],
          right: [ new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, -1), new Vec2(1, -1) ] },

    Z = { pos: new Vec2(7, -1),
          color: "red", 
          startRotation: "left",
          rotation: "left",
          down: [ new Vec2(0, -1), new Vec2(0, 0), new Vec2(-1, 0), new Vec2(-1, 1) ],
          top: [ new Vec2(0, 1), new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, -1) ],
          left: [ new Vec2(-1, -1), new Vec2(0, 0), new Vec2(0, -1), new Vec2(1, 0) ],
          right: [ new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, 1), new Vec2(1, 1) ] },
        
    J = { pos: new Vec2(7, -1),
          color: "blue", 
          startRotation: "left",
          rotation: "left",
          down: [ new Vec2(0, 1), new Vec2(0, 0), new Vec2(0, -1), new Vec2(1, -1) ],
          top: [ new Vec2(0, 1), new Vec2(0, 0), new Vec2(-1, 1), new Vec2(0, -1) ],
          left: [ new Vec2(-1, -1), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0) ],
          right: [ new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, 1) ] },
    
    L = { pos: new Vec2(7, -1),
          color: "orange", 
          startRotation: "left",
          rotation: "left",
          down: [ new Vec2(0, 1), new Vec2(0, 0), new Vec2(0, -1), new Vec2(-1, -1) ],
          top: [ new Vec2(0, -1), new Vec2(0, 0), new Vec2(1, 1), new Vec2(0, 1) ],
          left: [ new Vec2(1, -1), new Vec2(1, 0), new Vec2(0, 0), new Vec2(-1, 0) ],
          right: [ new Vec2(1, 0), new Vec2(0, 0), new Vec2(-1, 0), new Vec2(-1, 1) ] },
    
    I = { pos: new Vec2(7, -1),
          color: "aqua", 
          startRotation: "right",
          rotation: "right",
          down: [ new Vec2(0, 2), new Vec2(0, 1), new Vec2(0, 0), new Vec2(0, -1) ],
          top: [ new Vec2(0, -2), new Vec2(0, -1), new Vec2(0, 0), new Vec2(0, 1) ],
          left: [ new Vec2(-2, 0), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0) ],
          right: [ new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(2, 0) ] },

    O = { pos: new Vec2(7, -1),
          color: "yellow", 
          startRotation: "right",
          rotation: "right",
          down: [ new Vec2(1, 0), new Vec2(0, 1), new Vec2(1, 1), new Vec2(0, 0) ],
          top: [ new Vec2(0, 0), new Vec2(-1, -1), new Vec2(-1, 0), new Vec2(0, -1) ],
          left: [ new Vec2(-1, 1), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, 1) ],
          right: [ new Vec2(1, -1), new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, -1) ] }
];

chooseFigure();
createGrid();

setInterval(gameLoop, gameSR);

window.addEventListener("keydown", (e) => { moveFigure(e); });
window.addEventListener("keydown", (e) => { rotateFigure(e); });