document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('#grid-container');
    const moveCounterElement = document.querySelector('#move-counter');
    const playerNameInput = document.querySelector('#player-name');
    const playersList = document.querySelector('#players-list');
    const gridSize = 4;
    let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    let moveCount = 0;
    let gameOver = false;
    let lastPlayers = [];
    let score = 0; // Track the player's score

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
                cell.innerHTML = value === 0 ? '' : `<div>${value}</div>`;
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
        return arr.concat(zeros);
    }

    function combineRow(row) {
        for (let i = 0; i < gridSize - 1; i++) {
            if (row[i] === row[i + 1] && row[i] !== 0) {
                row[i] *= 2;
                row[i + 1] = 0;
                score += row[i]; // Update score when combining tiles
            }
        }
        return row;
    }

    function moveRight() {
        for (let r = 0; r < gridSize; r++) {
            let row = grid[r];
            row = slideRow(row.reverse());
            row = combineRow(row);
            grid[r] = slideRow(row).reverse();
        }
    }

    function moveLeft() {
        for (let r = 0; r < gridSize; r++) {
            let row = grid[r];
            row = slideRow(row);
            row = combineRow(row);
            grid[r] = slideRow(row);
        }
    }

    function moveUp() {
        for (let c = 0; c < gridSize; c++) {
            let column = grid.map(row => row[c]);
            column = slideRow(column);
            column = combineRow(column);
            column = slideRow(column);
            for (let r = 0; r < gridSize; r++) {
                grid[r][c] = column[r];
            }
        }
    }

    function moveDown() {
        for (let c = 0; c < gridSize; c++) {
            let column = grid.map(row => row[c]);
            column = slideRow(column.reverse());
            column = combineRow(column);
            column = slideRow(column).reverse();
            for (let r = 0; r < gridSize; r++) {
                grid[r][c] = column[r];
            }
        }
    }

    function updateMoveCounter() {
        moveCount += 1;
        moveCounterElement.textContent = `Moves: ${moveCount}`;
    }

    function isGameOver() {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 0) return false;
                if (c < gridSize - 1 && grid[r][c] === grid[r][c + 1]) return false;
                if (r < gridSize - 1 && grid[r][c] === grid[r + 1][c]) return false;
            }
        }
        return true;
    }

    function addPlayerToList(name, score) {
        if (name.trim() === '') name = 'Anonymous';
        lastPlayers.unshift({ name, score });
        if (lastPlayers.length > 5) lastPlayers.pop();
        updatePlayersList();
    }

    function updatePlayersList() {
        playersList.innerHTML = '';
        lastPlayers.forEach(player => {
            let li = document.createElement('li');
            li.textContent = `${player.name} - Score: ${player.score}`;
            playersList.appendChild(li);
        });
    }

    function control(e) {
        if (gameOver) return;

        let moved = false;
        switch (e.key) {
            case 'ArrowRight':
                moveRight();
                moved = true;
                break;
            case 'ArrowLeft':
                moveLeft();
                moved = true;
                break;
            case 'ArrowUp':
                moveUp();
                moved = true;
                break;
            case 'ArrowDown':
                moveDown();
                moved = true;
                break;
            default:
                return;
        }

        if (moved) {
            addTile();
            drawGrid();
            updateMoveCounter();

            if (isGameOver()) {
                gameOver = true;
                alert(`Game Over! ${playerNameInput.value || 'Player'}, no more moves possible.`);
                addPlayerToList(playerNameInput.value || 'Anonymous', score);
            }
        }
    }

    document.addEventListener('keydown', control);

    addTile();
    addTile();
    drawGrid();
});
