document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('#grid-container');
    const gridSize = 4;
    let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));

    function addTile() {
        let emptyCells = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        if (emptyCells.length) {
            let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function drawGrid() {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                let value = grid[r][c];
                let cell = document.querySelector(`#cell-${r * gridSize + c}`);
                cell.textContent = value === 0 ? '' : value;
                cell.className = 'grid-cell';
                if (value > 0) {
                    cell.classList.add(`tile-${value}`);
                }
            }
        }
    }

    function slideRow(row) {
        let arr = row.filter(val => val);
        let missing = gridSize - arr.length;
        let zeros = Array(missing).fill(0);
        return zeros.concat(arr);
    }

    function combineRow(row) {
        for (let i = gridSize - 1; i > 0; i--) {
            if (row[i] === row[i - 1]) {
                row[i] *= 2;
                row[i - 1] = 0;
            }
        }
        return row;
    }

    function moveRight() {
        for (let r = 0; r < gridSize; r++) {
            let row = grid[r];
            row = slideRow(row);
            row = combineRow(row);
            row = slideRow(row);
            grid[r] = row;
        }
    }

    function rotateGrid() {
        let newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                newGrid[c][gridSize - 1 - r] = grid[r][c];
            }
        }
        grid = newGrid;
    }

    function moveLeft() {
        rotateGrid();
        rotateGrid();
        moveRight();
        rotateGrid();
        rotateGrid();
    }

    function moveUp() {
        rotateGrid();
        rotateGrid();
        rotateGrid();
        moveRight();
        rotateGrid();
    }

    function moveDown() {
        rotateGrid();
        moveRight();
        rotateGrid();
        rotateGrid();
        rotateGrid();
    }

    function control(e) {
        switch (e.key) {
            case 'ArrowRight':
                moveRight();
                addTile();
                drawGrid();
                break;
            case 'ArrowLeft':
                moveLeft();
                addTile();
                drawGrid();
                break;
            case 'ArrowUp':
                moveUp();
                addTile();
                drawGrid();
                break;
            case 'ArrowDown':
                moveDown();
                addTile();
                drawGrid();
                break;
        }
    }

    document.addEventListener('keydown', control);

    addTile();
    addTile();
    drawGrid();
});
