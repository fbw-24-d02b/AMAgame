1. Globale Variablen

let board; // 2D-Array, das das Spielfeld repräsentiert
let score = 0; // Punktzahl des Spielers
let rows = 4; // Anzahl der Reihen
let columns = 4; // Anzahl der Spalten

Diese Variablen werden verwendet, um den Spielstatus zu speichern. board ist ein 4x4 Array, das die Zahlen auf dem Spielfeld speichert; score hält die Gesamtpunktzahl des Spielers, und rows und columns bestimmen die Größe des Spielfelds.

2. Code, der beim Laden der Seite ausgeführt wird


window.onload = function () {
  let highScore = localStorage.getItem("highScore") || 0;
  document.getElementById("highScore").innerText = highScore;
};

Dieser Code wird ausgeführt, wenn die Seite geladen wird. Er ruft den Höchstpunktestand (highScore) aus dem lokalen Speicher (localStorage) ab und zeigt ihn auf dem Bildschirm an. Wenn kein Höchstpunktestand gespeichert wurde, wird 0 eingestellt.

3. Höchstpunktzahl zurücksetzen


function resetHighScore() {
  localStorage.setItem("highScore", 0);
  document.getElementById("highScore").innerText = 0;
}

Diese Funktion wird verwendet, um den Höchstpunktestand auf 0 zurückzusetzen und den Wert auf dem Bildschirm zu aktualisieren.

4. Spiel starten


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

Diese Funktion startet das Spiel. Der Startbildschirm wird ausgeblendet und der Spielbildschirm angezeigt. Die Punktzahl wird auf 0 zurückgesetzt und das Spielfeld wird bereinigt. Schließlich wird die Funktion setGame() aufgerufen, um das Spielfeld zu initialisieren.

5. Spielfeld einrichten


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

Diese Funktion setzt das Spielfeld zurück und initialisiert es. Zuerst wird das board auf ein 4x4-Array zurückgesetzt (alle Werte auf 0 gesetzt). Dann wird für jedes Feld ein div-Element erstellt und dem Spielfeld hinzugefügt. Schließlich wird die Funktion setTwo() zweimal aufgerufen, um zwei 2er-Zahlen auf dem Spielfeld zu platzieren.

6. Feld aktualisieren


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

Diese Funktion aktualisiert den Inhalt und das Styling eines Feldes. Wenn das Feld nicht 0 ist, wird die entsprechende Zahl in das Feld geschrieben und eine CSS-Klasse je nach Zahl hinzugefügt. Diese Klassen sorgen dafür, dass die Zahlen in unterschiedlichen Farben und Stilen dargestellt werden.

7. Reaktion auf Pfeiltasten


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

Dieser Code wird ausgeführt, wenn eine Pfeiltaste gedrückt wird. Wenn der Spieler eine Taste drückt, wird die entsprechende Verschiebungsfunktion (slideLeft, slideRight, slideUp, slideDown) aufgerufen. Wenn das Spielfeld verändert wurde, wird eine neue 2 hinzugefügt und die Punktzahl auf dem Bildschirm aktualisiert.

8. Nullen filtern


function filterZero(row) {
  return row.filter((num) => num != 0);
}

Diese Funktion filtert die Nullen aus einer Reihe und gibt die nicht nullen Zahlen zurück. Dies wird verwendet, um eine Reihe während der Verschiebung zu komprimieren.

9. Reihe verschieben und kombinieren


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

Diese Funktion verschiebt eine Reihe und kombiniert gleiche Zahlen. Zuerst werden die Nullen gefiltert. Dann werden gleiche nebeneinander liegende Zahlen kombiniert und verdoppelt. Die kombinierte Zahl wird auf null gesetzt, und die Nullen werden erneut gefiltert. Die Reihe wird mit Nullen aufgefüllt, bis die Spaltenanzahl erreicht ist, und die aktualisierte Reihe wird zurückgegeben.

10. Verschiebe-Operationen (links, rechts, oben, unten)

Diese Funktionen werden verwendet, um die Zahlen in vier verschiedene Richtungen zu verschieben.

a) Verschieben nach links (slideLeft)


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

Diese Funktion verschiebt alle Reihen nach links. Wenn sich das Spielfeld verändert hat, wird es aktualisiert und die Funktion gibt true zurück.

b) Verschieben nach rechts (slideRight)


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

Diese Funktion kehrt die Reihen um, verschiebt sie nach rechts und kehrt sie dann wieder um, um das Spielfeld in den ursprünglichen Zustand zurückzubringen. Wenn sich das Spielfeld verändert hat, gibt es true zurück.

c) Verschieben nach oben (slideUp)


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

Diese Funktion verschiebt die Spalten nach oben. Jede Spalte wird wie eine Reihe behandelt und nach oben verschoben. Wenn sich das Spielfeld verändert hat, gibt es true zurück.

d) Verschieben nach unten (slideDown)


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

Diese Funktion kehrt die Spalten um, verschiebt sie nach unten und kehrt sie dann wieder um, um das Spielfeld in den ursprünglichen Zustand zurückzubringen. Wenn sich das Spielfeld verändert hat, gibt es true zurück.

11. Eine „2“ zufällig hinzufügen


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

Diese Funktion fügt eine „2“ in ein zufällig ausgewähltes leeres Feld auf dem Spielfeld ein. Wenn das Spielfeld keine leeren Felder mehr hat, wird keine neue „2“ hinzugefügt.

12. Überprüfen, ob das Spiel vorbei ist


function checkGameOver() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 1; r++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  let highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    document.getElementById("highScore").innerText = score;
  }

  document.getElementById("game-over-score").innerText = score;
  document.getElementById("game-container").style.display = "none";
  document.getElementById("game-over-screen").style.display = "block";
  return true;
}

Diese Funktion überprüft, ob das Spiel vorbei ist. Wenn keine leeren Felder mehr vorhanden sind und keine benachbarten Felder die gleiche Zahl enthalten, wird das Spiel als beendet betrachtet. Das Spiel-Container wird ausgeblendet und der „Game Over“-Bildschirm angezeigt. Falls der aktuelle Punktestand höher ist als der gespeicherte Höchststand, wird dieser aktualisiert.

13. Überprüfen, ob es leere Felder gibt


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

Diese Funktion prüft, ob es auf dem Spielfeld leere Felder gibt. Wenn ja, gibt sie true zurück, andernfalls false.

14. Spiel neu starten


function restartGame() {
  // Spielbrett zurücksetzen
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  // Punktestand zurücksetzen
  score = 0;
  document.getElementById("score").innerText = score;

  // "Game Over"-Bildschirm ausblenden und Spiel-Container anzeigen
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  // Neues Spiel starten
  startGame();
}

Diese Funktion startet das Spiel neu, indem sie das Spielfeld und den Punktestand zurücksetzt und den „Game Over“-Bildschirm ausblendet. Anschließend wird die startGame()-Funktion aufgerufen, um das Spiel zu initialisieren.

Funktion zum Spielstart


function startGame() {
  // Initialisiere das Spielbrett und den Punktestand
  setGame();
}

Diese Funktion startet ein neues Spiel, indem sie das Spielfeld initialisiert und den Punktestand auf 0 setzt. Es wird zweimal setTwo() aufgerufen, um zu Beginn des Spiels zwei zufällige „2“-Werte auf dem Spielfeld zu platzieren.

