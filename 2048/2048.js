var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    let highScore = localStorage.getItem('highScore') || 0;
    document.getElementById("highScore").innerText = highScore;
}

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("game-over-screen").style.display = "none"; // Oyun bitti ekranını gizle

    score = 0;
    document.getElementById("score").innerText = score;

    const boardDiv = document.getElementById("board");
    while (boardDiv.firstChild) {
        boardDiv.removeChild(boardDiv.firstChild);
    }

    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let box = document.createElement("div");
            box.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateBox(box, num);
            document.getElementById("board").append(box);
        }
    }
    setTwo();
    setTwo();
}

function updateBox(box, num) {
    box.innerText = "";
    box.classList.value = "";
    box.classList.add("box");
    if (num > 0) {
        box.innerText = num.toString();
        if (num <= 4096) {
            box.classList.add("box-" + num.toString());
        } else {
            box.classList.add("box-8192");
        }                
    }
}

document.addEventListener('keyup', (e) => {
    let moved = false;
    if (e.code == "ArrowLeft") {
        moved = slideLeft();
    }
    else if (e.code == "ArrowRight") {
        moved = slideRight();
    }
    else if (e.code == "ArrowUp") {
        moved = slideUp();
    }
    else if (e.code == "ArrowDown") {
        moved = slideDown();
    }
    if (moved) {
        if (checkGameOver()) {
            return;
        }
        setTwo();
    }
    document.getElementById("score").innerText = score;
})

function filterZero(row){
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let newRow = slide(row);
        if (!arraysEqual(newRow, row)) {
            moved = true;
        }
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num);
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        let newRow = slide(row);
        newRow.reverse();
        if (!arraysEqual(newRow, row)) {
            moved = true;
        }
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num);
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let newRow = slide(row);
        if (!arraysEqual(newRow, row)) {
            moved = true;
        }
        for (let r = 0; r < rows; r++) {
            board[r][c] = newRow[r];
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num);
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        let newRow = slide(row);
        newRow.reverse();
        if (!arraysEqual(newRow, row)) {
            moved = true;
        }
        for (let r = 0; r < rows; r++) {
            board[r][c] = newRow[r];
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num);
        }
    }
    return moved;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let box = document.getElementById(r.toString() + "-" + c.toString());
            updateBox(box, 2);
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function checkGameOver() {
    if (hasEmptyTile()) {
        return false;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] === board[r][c + 1]) {
                return false; // Yan yana eşleşen numara varsa oyun bitmemiştir
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] === board[r + 1][c]) {
                return false; // Üst üste eşleşen numara varsa oyun bitmemiştir
            }
        }
    }

    document.getElementById("final-score").innerText = score;
    document.getElementById("game-container").style.display = "none"; // Oyun ekranını gizle
    document.getElementById("game-over-screen").style.display = "flex"; // Oyun bitti ekranını göster
    let highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score); // Yeni yüksek skoru kaydet
        document.getElementById("highScore").innerText = score;
    }
    return true;
}

function restartGame() {
    startGame();
}
