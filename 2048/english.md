
1. Global Variables


let board; // 2D array representing the game board
let score = 0; // Player's score
let rows = 4; // Number of rows
let columns = 4; // Number of columns

These variables are used to track the game's state. board is a 4x4 array that holds the numbers on the game board; score tracks the player's total score; rows and columns define the dimensions of the board.

2. Code to Execute When the Page Loads


window.onload = function () {
  let highScore = localStorage.getItem("highScore") || 0;
  document.getElementById("highScore").innerText = highScore;
};
This code runs when the page loads and retrieves the highest score (highScore) from local storage, displaying it on the screen. If no high score is previously saved, it defaults to 0.

3. Reset High Score


function resetHighScore() {
  localStorage.setItem("highScore", 0);
  document.getElementById("highScore").innerText = 0;
}
This function resets the high score by setting it to 0 in local storage and updating the displayed high score on the screen.

4. Start the Game

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  document.getElementById("game-over-screen").style.display = "none";

  score = 0;
  document.getElementById("score").innerText = score;

  const boardDiv = document.getElementById("board");
  while (boardDiv.firstChild) {
    boardDiv.removeChild(boardDiv.firstChild);
  }

  setGame();
}

This function starts the game by hiding the start screen, displaying the game container, and resetting the score. It also clears the game board and initializes it by calling setGame().

5. Set Up the Game Board


function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
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

This function initializes the game board to a 4x4 grid of zeros. It creates a div element for each cell and updates its content using updateBox(). It also places two initial "2" tiles on the board by calling setTwo() twice.

6. Update a Box


function updateBox(box, num) {
  box.innerText = "";
  box.classList.value = "";
  box.classList.add("box");
  if (num > 0) {
    box.innerText = num.toString();
    if (num <= 4096) {
      box.classList.add("box-" + num.toString());
    } else {
      box.classList.add("box-2048");
    }
  }
}

This function updates the content and style of a div element representing a box on the board. If the number is greater than 0, it displays the number and adds a CSS class for styling based on the number's value.

7. Respond to Keyboard Arrow Keys


document.addEventListener("keyup", (e) => {
  let moved = false;
  if (e.code == "ArrowLeft") {
    moved = slideLeft();
  } else if (e.code == "ArrowRight") {
    moved = slideRight();
  } else if (e.code == "ArrowUp") {
    moved = slideUp();
  } else if (e.code == "ArrowDown") {
    moved = slideDown();
  }
  if (moved) {
    if (checkGameOver()) {
      return;
    }
    setTwo();
  }
  document.getElementById("score").innerText = score;
});

This code listens for keyboard arrow key presses and calls the appropriate slide function (slideLeft, slideRight, slideUp, slideDown) based on the key pressed. If a move is made, it checks if the game is over and, if not, adds a new "2" tile to the board. It also updates the displayed score.

8. Filter Zeros


function filterZero(row) {
  return row.filter((num) => num != 0);
}

This function filters out zeros from a row, leaving only non-zero numbers. It's used to compress the row during sliding operations.

9. Slide and Merge a Row


function slide(row) {
  row = filterZero(row);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1] && row[i] <= 2048) {
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

This function slides and merges a row of numbers. It first removes zeros, then merges adjacent equal numbers if they are less than or equal to 2048, and finally adds zeros to the end of the row to maintain the correct length.

10. Slide Operations (Left, Right, Up, Down)

These functions handle sliding rows or columns in various directions:

a) Slide Left


function slideLeft() {
  let moved = false;
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    let originalRow = [...row];
    row = slide(row);
    if (row.join('') !== originalRow.join('')) {
      moved = true;
    }
    board[r] = row;
    for (let c = 0; c < columns; c++) {
      let box = document.getElementById(r.toString() + "-" + c.toString());
      updateBox(box, board[r][c]);
    }
  }
  return moved;
}

This function slides all rows to the left. It checks if the row has changed after sliding and updates the board and boxes accordingly.

b) Slide Right


function slideRight() {
  let moved = false;
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    let originalRow = [...row];
    row.reverse();
    row = slide(row);
    row.reverse();
    if (row.join('') !== originalRow.join('')) {
      moved = true;
    }
    board[r] = row;
    for (let c = 0; c < columns; c++) {
      let box = document.getElementById(r.toString() + "-" + c.toString());
      updateBox(box, board[r][c]);
    }
  }
  return moved;
}

This function slides all rows to the right by reversing the rows, sliding them left, and then reversing them back. It checks for changes and updates the board and boxes.

c) Slide Up


function slideUp() {
  let moved = false;
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    let originalRow = [...row];
    row = slide(row);
    if (row.join('') !== originalRow.join('')) {
      moved = true;
    }
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let box = document.getElementById(r.toString() + "-" + c.toString());
      updateBox(box, board[r][c]);
    }
  }
  return moved;
}
This function slides all columns up. It constructs a column as a row, slides it, and then updates the board and boxes accordingly.

d) Slide Down


function slideDown() {
  let moved = false;
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    let originalRow = [...row];
    row.reverse();
    row = slide(row);
    row.reverse();
    if (row.join('') !== originalRow.join('')) {
      moved = true;
    }
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let box = document.getElementById(r.toString() + "-" + c.toString());
      updateBox(box, board[r][c]);
    }
  }
  return moved;
}

This function slides all columns down by reversing the columns, sliding them up, and then reversing them back. It checks for changes and updates the board and boxes.

11. Add a "2" Tile


function setTwo() {
  let emptyCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }
  if (emptyCells.length === 0) return;

  let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[r][c] = 2;
  let box = document.getElementById(r.toString() + "-" + c.toString());
  updateBox(box, 2);
}

This function adds a new "2" tile to a random empty cell on the board. It first finds all empty cells, then selects one at random and places a "2" tile there.

12. Check Game Over


function checkGameOver() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) return false;
      if (c < columns - 1 && board[r][c] === board[r][c + 1]) return false;
      if (r < rows - 1 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  gameOver();
  return true;
}

This function checks if the game is over by verifying if there are any empty cells or if any adjacent cells can be merged. If no moves are possible, it calls gameOver().

13. Game Over Function


function gameOver() {
  let highScore = parseInt(localStorage.getItem("highScore") || 0);
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    document.getElementById("highScore").innerText = score;
  }

  document.getElementById("game-over-screen").style.display = "block";
  document.getElementById("game-container").style.display = "none";
}

This function handles the game over scenario. It updates the high score if the current score is higher, displays the game over screen, and hides the game container.

14. Reset Game


function resetGame() {
  startGame();
}

This function resets the game by calling startGame().

15. Restart Game Button


document.getElementById("restart-button").addEventListener("click", resetGame);
This code adds an event listener to the "restart" button, so that clicking it calls resetGame() to restart the game.

