
1. Global Değişkenler

let board; // Oyun tahtasını temsil eden 2D dizi
let score = 0; // Oyuncunun puanı
let rows = 4; // Satır sayısı
let columns = 4; // Sütun sayısı

Bu değişkenler, oyunun durumunu tutmak için kullanılır. board, sayıları tutan 4x4'lük bir dizi; score, oyuncunun kazandığı toplam puan; rows ve columns ise tahta boyutlarını belirler.

2. Sayfa Yüklendiğinde Çalışan Kod

window.onload = function () {
  let highScore = localStorage.getItem("highScore") || 0;
  document.getElementById("highScore").innerText = highScore;
};

Bu kod, sayfa yüklendiğinde çalışır ve yerel depolamadan (localStorage) en yüksek puanı (highScore) alır ve bunu ekranda gösterir. Eğer daha önce bir yüksek puan kaydedilmediyse, 0 olarak ayarlanır.

3. Yüksek Puanı Sıfırlama

function resetHighScore() {
  localStorage.setItem("highScore", 0);
  document.getElementById("highScore").innerText = 0;
}

Bu fonksiyon, yüksek puanı sıfırlamak için kullanılır. highScore değeri 0 olarak ayarlanır ve ekranda güncellenir.

4. Oyunu Başlatma

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

Bu fonksiyon, oyunu başlatır. Başlangıç ekranını gizler ve oyun ekranını gösterir. Puanı sıfırlar ve oyun tahtasını temizler. Son olarak, setGame() fonksiyonunu çağırarak oyun tahtasını başlatır.

5. Oyun Tahtasını Kurma

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

Bu fonksiyon, oyun tahtasını sıfırlar ve başlatır. İlk olarak, 4x4'lük bir dizi olarak boardu sıfırlar (tüm değerler 0 olarak ayarlanır). Daha sonra, her hücre için bir div öğesi oluşturur ve bunu oyun tahtasına ekler. Son olarak, tahtaya iki tane 2 eklemek için setTwo() fonksiyonunu iki kez çağırır.

6. Kutuyu Güncelleme

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

Bu fonksiyon, bir kutunun içeriğini ve stilini günceller. Eğer kutu 0 değilse, kutunun içine ilgili sayı yazılır ve numaraya göre bir CSS sınıfı eklenir. Bu sınıflar, sayıların farklı renk ve stillerle gösterilmesini sağlar.

7. Klavye Ok Tuşlarına Yanıt Verme

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

Bu kod, klavye ok tuşlarına basıldığında çalışır. Oyuncu bir tuşa bastığında, ilgili kaydırma fonksiyonu (slideLeft, slideRight, slideUp, slideDown) çalıştırılır. Eğer tahtada bir hareket gerçekleştiyse, tahtaya yeni bir 2 eklenir ve puan ekranda güncellenir.

8. Sıfırları Filtreleme

function filterZero(row) {
  return row.filter((num) => num != 0);
}

Bu fonksiyon, bir satırdaki 0 değerlerini filtreleyerek sıfır olmayan sayıları döndürür. Bu, kaydırma işlemlerinde kullanılmak üzere satırı sıkıştırmak için kullanılır.

9. Satırı Kaydırma ve Birleştirme

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

Bu fonksiyon, bir satırı kaydırır ve aynı sayıları birleştirir. İlk olarak, satırdaki sıfırları filtreler. Daha sonra, satırdaki bitişik aynı sayıları birleştirir ve bu sayılar iki katına çıkar. Birleştirilen sayı sıfırlanır ve tekrar sıfırları filtreler. Satır, sütun sayısına ulaşana kadar sıfırlarla doldurulur ve güncellenmiş satır döndürülür.

10. Kaydırma İşlemleri (Sol, Sağ, Yukarı, Aşağı)

Bu fonksiyonlar, oyunda sayıların dört farklı yönde kaydırılması için kullanılır.

a) Sol Kaydırma (slideLeft)


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

Bu fonksiyon, tüm satırları sola kaydırır. Eğer kaydırma sonucu tahtada bir değişiklik olduysa, bu değişiklik güncellenir ve fonksiyon true döner.

b) Sağa Kaydırma (slideRight)


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

Bu fonksiyon, satırları ters çevirip sağa kaydırır, ardından tekrar ters çevirerek tahtayı eski haline getirir. Tahtada bir değişiklik olduysa true döner.

c) Yukarı Kaydırma (slideUp)

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

Bu fonksiyon, sütunları yukarı kaydırır ve tahtada bir değişiklik olduysa true döner.

d) Aşağı Kaydırma (slideDown)

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

Bu fonksiyon, sütunları ters çevirip aşağı kaydırır ve tekrar ters çevirerek eski haline getirir. Tahtada bir değişiklik olduysa true döner.

Kaydırma ve Birleştirme İşlemi İçin Ortak Kodlar
Bu fonksiyonlar, kaydırma işlemlerinin temelini oluşturur ve kaydırma sonucu oluşan yeni düzeni yönetir. Her bir kaydırma işleminde oyun tahtası güncellenir ve kutular yeni değerlere göre tekrar düzenlenir.



11. Rastgele Bir "2" Ekleme

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }
  let found = false;
  while (!found) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    if (board[r][c] == 0 && !document.querySelector(".box-2048")) {
      board[r][c] = 2;
      let box = document.getElementById(r.toString() + "-" + c.toString());
      updateBox(box, 2);
      found = true;
    }
  }
}

Bu fonksiyon, tahtadaki rastgele boş bir hücreye 2 ekler. Tahtada boş hücre yoksa işlem yapılmaz. Ayrıca, 2048 kutusu varsa yeni 2 eklenmez.

12. Oyun Bitti Mi Kontrol Etme

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
Bu fonksiyon, oyunun bitip bitmediğini kontrol eder. Eğer tahtada boş hücre veya birleştirilebilecek sayılar yoksa oyun biter. Oyun bittiğinde, eğer oyuncu yeni bir yüksek puan yapmışsa, bu puan yerel depolamada güncellenir ve oyun bitti ekranı gösterilir.

13. Boş Hücre Var mı?

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

Bu fonksiyon, tahtada boş hücre olup olmadığını kontrol eder ve buna göre true veya false döndürür.

14. Oyunu Yeniden Başlatma (restartGame)

Bu fonksiyon, oyunu yeniden başlatmak için kullanılır ve kullanıcı yeni bir oyun başlatmak istediğinde çalıştırılır.


// Restarts the game
function restartGame() {
  // Reset the game board
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  // Reset the score
  score = 0;
  document.getElementById("score").innerText = score;

  // Hide the game over screen and show the game container
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  // Start a new game
  startGame();
}

// Function to start the game
function startGame() {
  // Initialize the game board and score
  addRandomTile();
  addRandomTile();
  renderBoard();
}

Fonksiyonların Açıklamaları:
restartGame: Bu fonksiyon, oyun tahtasını sıfırlayarak (board array'i sıfırlanır) ve skoru 0'a getirerek oyunu yeniden başlatır. Ayrıca, "game over" ekranını gizleyip oyun ekranını tekrar görünür hale getirir.

startGame: Yeni bir oyun başlatmak için çağrılır. Oyun tahtasında rastgele iki yeni taş eklenir ve tahtayı günceller.

