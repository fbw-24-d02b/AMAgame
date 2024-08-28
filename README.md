# gameAMA

2048 Game
Description
2048 is a popular single-player puzzle game where the player combines tiles with the same number to reach the tile with the number 2048. This project is a web-based implementation of the 2048 game using HTML, CSS, and JavaScript.

Features

-- Start Screen: Instructions on how to play the game and a button to start the game.
-- Game Screen: Displays the game board, current score, and high score.
-- Game Over Screen: Shows when the game is over, displaying the final score and providing an option to restart the game.
-- High Score Management: Tracks and displays the highest score achieved.

Files

-- index.html: The main HTML file that structures the game's user interface.
-- 2048.css: The CSS file that styles the game's layout and appearance.
-- 2048.js: The JavaScript file that contains the game logic and interactions.

HTML Structure

-- Start Screen (#start-screen): Provides game instructions and a "Start Game" button.
-- Game Container (#game-container): Displays the game board, current score, and high score.
-- Game Over Screen (#game-over-screen): Shows the game over message, final score, and a "Restart Game" button.

CSS Styling

-- General Styling: Sets up a full-height, centered layout with a light grey background and flexbox alignment.
-- Start Screen: Styled with a white background, rounded corners, and a shadow effect.
-- Game Screen: Features a turquoise title, a grey game board, and a shadow effect for the board.
-- Game Over Screen: A fixed overlay with a dark background and white text to ensure visibility.

JavaScript Functionality

Initialization:

-- window.onload sets up the high score display.
-- startGame() initializes the game state and displays the game screen.

Game Setup:

-- setGame() initializes the game board and places two "2" tiles randomly.

Board Updates:

-- updateBox(box, num) updates the box on the board with the given number and applies appropriate styling.

Movement Handling:

-- Responds to arrow key presses to move and merge tiles using slideLeft(), slideRight(), slideUp(), and slideDown() functions.
-- Tiles are moved and merged, and the board is updated accordingly.

Tile Management:

-- setTwo() adds a "2" tile to a random empty spot on the board.
-- hasEmptyTile() checks for empty tiles on the board.

Game Over:

-- checkGameOver() determines if the game is over based on the presence of empty tiles and possible moves.
-- Displays a message if the 2048 tile is reached or if no moves are left.

Restarting:

-- restartGame() starts a new game by calling startGame().

How to Play

-- Open index.html in your browser.
-- Read the instructions on the start screen.
-- Use the arrow keys to move the tiles.
-- Combine tiles with the same number to create larger numbers.
-- Reach the 2048 tile to win or continue to get the highest score possible.
-- Restart the game anytime using the "Restart Game" button.

How to Run

-- Clone the repository: git clone https://github.com/fbw-24-d02b/AMAgame.git
-- Navigate to the project directory: cd 2048-game
-- Open index.html in your browser to play the game.
