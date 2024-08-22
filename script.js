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
        return arr.concat(zeros);  // Slide to the left
    }

    function combineRow(row) {
        for (let i = 0; i < gridSize - 1; i++) {
            if (row[i] === row[i + 1] && row[i] !== 0) {
                row[i] *= 2;
                row[i + 1] = 0;
            }
        }
        return row;
    }

    function moveRight() {
        for (let r = 0; r < gridSize; r++) {
            let row = grid[r];
            row = slideRow(row.reverse()); // Reverse row to slide and combine for right
            row = combineRow(row);
            grid[r] = slideRow(row).reverse(); // Reverse back after sliding
        }
    }

    function moveLeft() {
        for (let r = 0; r < gridSize; r++) {
            let row = grid[r];
            row = slideRow(row); // Slide left
            row = combineRow(row);
            grid[r] = slideRow(row); // Slide again after combining
        }
    }

    function moveUp() {
        for (let c = 0; c < gridSize; c++) {
            let column = grid.map(row => row[c]);
            column = slideRow(column); // Slide up
            column = combineRow(column);
            column = slideRow(column); // Slide again after combining
            for (let r = 0; r < gridSize; r++) {
                grid[r][c] = column[r];
            }
        }
    }

    function moveDown() {
        for (let c = 0; c < gridSize; c++) {
            let column = grid.map(row => row[c]);
            column = slideRow(column.reverse()); // Reverse column to slide down
            column = combineRow(column);
            column = slideRow(column).reverse(); // Reverse back after sliding
            for (let r = 0; r < gridSize; r++) {
                grid[r][c] = column[r];
            }
        }
    }

    function control(e) {
        switch (e.key) {
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowUp':
                moveUp();
                break;
            case 'ArrowDown':
                moveDown();
                break;
        }
        addTile();
        drawGrid();
    }

    document.addEventListener('keydown', control);

    addTile();
    addTile();
    drawGrid();
});
