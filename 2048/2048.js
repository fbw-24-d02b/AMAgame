let board; // Game board (2D array)
let score = 0; // Player's score
let rows = 4; // Number of rows
let columns = 4; // Number of columns

// Runs when the page is loaded
window.onload = function() {
    let highScore = localStorage.getItem('highScore') || 0;
    document.getElementById("highScore").innerText = highScore; // Display the high score
}

// Resets the high score
function resetHighScore() {
    localStorage.setItem('highScore', 0); // Reset the high score
    document.getElementById("highScore").innerText = 0; // Update the high score display
}

// Starts the game
function startGame() {
    document.getElementById("start-screen").style.display = "none"; // Hide the start screen
    document.getElementById("game-container").style.display = "block"; // Show the game screen
    document.getElementById("game-over-screen").style.display = "none"; // Hide the game over screen

    score = 0; // Reset the score
    document.getElementById("score").innerText = score; // Update the score display

    const boardDiv = document.getElementById("board");
    while (boardDiv.firstChild) {
        boardDiv.removeChild(boardDiv.firstChild); // Remove all existing boxes from the board
    }

    setGame(); // Initialize the game
}

// Sets up the initial state of the game
function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Create boxes on the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let box = document.createElement("div");
            box.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateBox(box, num); // Update the box
            document.getElementById("board").append(box); // Add the box to the board
        }
    }
    setTwo(); // Place the first "2"
    setTwo(); // Place the second "2"
}

// Updates the content and style of a box
function updateBox(box, num) {
    box.innerText = ""; // Clear the box content
    box.classList.value = ""; // Clear existing classes
    box.classList.add("box"); // Add general box style
    if (num > 0) {
        box.innerText = num.toString(); // Add the number to the box
        if (num <= 4096) {
            box.classList.add("box-" + num.toString()); // Add style based on number
        } else {
            box.classList.add("box-8192"); // Special style for numbers larger than 4096
        }
    }
}

// Responds to keyboard arrow keys
document.addEventListener('keyup', (e) => {
    let moved = false;
    if (e.code == "ArrowLeft") {
        moved = slideLeft(); // Perform left slide
    } else if (e.code == "ArrowRight") {
        moved = slideRight(); // Perform right slide
    } else if (e.code == "ArrowUp") {
        moved = slideUp(); // Perform up slide
    } else if (e.code == "ArrowDown") {
        moved = slideDown(); // Perform down slide
    }
    if (moved) {
        if (checkGameOver()) {
            return; // Check if the game is over
        }
        setTwo(); // Add a new "2"
    }
    document.getElementById("score").innerText = score; // Update the score display
})

// Filters out non-zero elements
function filterZero(row){
    return row.filter(num => num != 0);
}

// Slides and merges a row
function slide(row) {
    row = filterZero(row); // Remove zeros
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2; // Combine equal numbers
            row[i + 1] = 0; // Set combined number to zero
            score += row[i]; // Update score
        }
    }
    row = filterZero(row); // Remove zeros again
    while (row.length < columns) {
        row.push(0); // Fill the row
    }
    return row;
}

// Performs left slide
function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let newRow = slide(row); // Slide the row
        if (!arraysEqual(newRow, row)) {
            moved = true; // Row changed, movement occurred
        }
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num); // Update boxes
        }
    }
    return moved;
}

// Performs right slide
function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse(); // Reverse the row
        let newRow = slide(row); // Slide the row
        newRow.reverse(); // Reverse it back
        if (!arraysEqual(newRow, row)) {
            moved = true; // Row changed, movement occurred
        }
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num); // Update boxes
        }
    }
    return moved;
}

// Performs up slide
function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let newRow = slide(row); // Slide the column
        if (!arraysEqual(newRow, row)) {
            moved = true; // Column changed, movement occurred
        }
        for (let r = 0; r < rows; r++) {
            board[r][c] = newRow[r]; // Update the board
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num); // Update boxes
        }
    }
    return moved;
}

// Performs down slide
function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse(); // Reverse the column
        let newRow = slide(row); // Slide the column
        newRow.reverse(); // Reverse it back
        if (!arraysEqual(newRow, row)) {
            moved = true; // Column changed, movement occurred
        }
        for (let r = 0; r < rows; r++) {
            board[r][c] = newRow[r]; // Update the board
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num); // Update boxes
        }
    }
    return moved;
}

// Adds a "2" to a random empty tile
function setTwo() {
    if (!hasEmptyTile()) {
        return; // Exit if no empty tiles
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2; // Add "2" to an empty spot
            let box = document.getElementById(r.toString() + "-" + c.toString());
            updateBox(box, 2); // Update the box
            found = true;
        }
    }
}

// Checks if there are any empty tiles on the board
function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true; // Return true if there is an empty tile
            }
        }
    }
    return false; // Return false if there are no empty tiles
}

// Compares two arrays
function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

// Checks if the game is over
function checkGameOver() {
    if (hasEmptyTile()) {
        return false; // The game is not over if there are empty tiles
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] === board[r][c + 1]) {
                return false; // The game is not over if there are matching numbers next to each other
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] === board[r + 1][c]) {
                return false; // The game is not over if there are matching numbers on top of each other
            }
        }
    }

    if (document.querySelector(".box-2048")) {
        setTimeout(() => {
            alert("Congratulations! You've reached 2048!"); // Display a congratulatory message
            document.getElementById("game-container").style.display = "none"; // Hide the game screen
            document.getElementById("game-over-screen").style.display = "flex"; // Show the game over screen
            let highScore = localStorage.getItem('highScore') || 0;
            if (score > highScore) {
                localStorage.setItem('highScore', score); // Save the new high score
                document.getElementById("highScore").innerText = score; // Update the high score display
            }
        }, 100);
    } else {
        document.getElementById("final-score").innerText = score; // Display the final score
        document.getElementById("game-container").style.display = "none"; // Hide the game screen
        document.getElementById("game-over-screen").style.display = "flex"; // Show the game over screen
        let highScore = localStorage.getItem('highScore') || 0;
        if (score > highScore) {
            localStorage.setItem('highScore', score); // Save the new high score
            document.getElementById("highScore").innerText = score; // Update the high score display
        }
    }
    return true;
}

// Restarts the game
function restartGame() {
    startGame(); // Start a new game
}
