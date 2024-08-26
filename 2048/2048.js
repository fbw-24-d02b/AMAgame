var board; // Oyun tahtası (2D dizi olarak)
var score = 0; // Oyuncunun puanı
var rows = 4; // Satır sayısı
var columns = 4; // Sütun sayısı

// Sayfa yüklendiğinde çalışır
window.onload = function() {
    // Daha önce kaydedilmiş yüksek puanı al
    let highScore = localStorage.getItem('highScore') || 0;
    document.getElementById("highScore").innerText = highScore; // Yüksek puanı göster
}

// Oyunu başlatır
function startGame() {
    document.getElementById("start-screen").style.display = "none"; // Başlangıç ekranını gizle
    document.getElementById("game-container").style.display = "block"; // Oyun ekranını göster
    document.getElementById("game-over-screen").style.display = "none"; // Oyun bitti ekranını gizle

    score = 0; // Puanı sıfırla
    document.getElementById("score").innerText = score; // Puanı güncelle

    const boardDiv = document.getElementById("board");
    while (boardDiv.firstChild) {
        boardDiv.removeChild(boardDiv.firstChild); // Tahtadaki tüm eski kutuları temizle
    }

    setGame(); // Oyunu başlat
}

// Oyunun başlangıç durumunu ayarlar
function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Tahtadaki kutuları oluşturur
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let box = document.createElement("div");
            box.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateBox(box, num); // Kutuyu güncelle
            document.getElementById("board").append(box); // Kutuyu tahtaya ekle
        }
    }
    setTwo(); // İlk iki "2"yi yerleştir
    setTwo(); // İkinci bir "2"yi yerleştir
}

// Kutunun içeriğini ve stilini günceller
function updateBox(box, num) {
    box.innerText = ""; // Kutunun içeriğini temizle
    box.classList.value = ""; // Mevcut sınıfları temizle
    box.classList.add("box"); // Genel kutu stilini ekle
    if (num > 0) {
        box.innerText = num.toString(); // Sayıyı kutuya ekle
        if (num <= 4096) {
            box.classList.add("box-" + num.toString()); // Sayıya göre stil ekle
        } else {
            box.classList.add("box-8192"); // Daha büyük sayılar için özel stil
        }                
    }
}

// Klavye ok tuşlarına tepki verir
document.addEventListener('keyup', (e) => {
    let moved = false;
    if (e.code == "ArrowLeft") {
        moved = slideLeft(); // Sol kaydırma işlemini yap
    }
    else if (e.code == "ArrowRight") {
        moved = slideRight(); // Sağ kaydırma işlemini yap
    }
    else if (e.code == "ArrowUp") {
        moved = slideUp(); // Yukarı kaydırma işlemini yap
    }
    else if (e.code == "ArrowDown") {
        moved = slideDown(); // Aşağı kaydırma işlemini yap
    }
    if (moved) {
        if (checkGameOver()) {
            return; // Oyun bitti mi kontrol et
        }
        setTwo(); // Yeni "2" ekle
    }
    document.getElementById("score").innerText = score; // Puanı güncelle
})

// Sıfır olmayan elemanları filtreler
function filterZero(row){
    return row.filter(num => num != 0);
}

// Bir satırı kaydırır ve birleştirir
function slide(row) {
    row = filterZero(row); // Sıfırları kaldır
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2; // Aynı sayılar birleşir
            row[i + 1] = 0; // Birleşen sayıyı sıfırla
            score += row[i]; // Puanı güncelle
        }
    }
    row = filterZero(row); // Sıfırları tekrar kaldır
    while (row.length < columns) {
        row.push(0); // Satırı tamamla
    }
    return row;
}

// Sol kaydırma işlemi
function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let newRow = slide(row); // Satırı kaydır
        if (!arraysEqual(newRow, row)) {
            moved = true; // Satır değiştiyse hareket yapıldı
        }
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num); // Kutuları güncelle
        }
    }
    return moved;
}

// Sağ kaydırma işlemi
function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse(); // Satırı ters çevir
        let newRow = slide(row); // Satırı kaydır
        newRow.reverse(); // Satırı tekrar düzelt
        if (!arraysEqual(newRow, row)) {
            moved = true; // Satır değiştiyse hareket yapıldı
        }
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num); // Kutuları güncelle
        }
    }
    return moved;
}

// Yukarı kaydırma işlemi
function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let newRow = slide(row); // Sütunu kaydır
        if (!arraysEqual(newRow, row)) {
            moved = true; // Sütun değiştiyse hareket yapıldı
        }
        for (let r = 0; r < rows; r++) {
            board[r][c] = newRow[r]; // Tahtayı güncelle
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num); // Kutuları güncelle
        }
    }
    return moved;
}

// Aşağı kaydırma işlemi
function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse(); // Sütunu ters çevir
        let newRow = slide(row); // Sütunu kaydır
        newRow.reverse(); // Sütunu tekrar düzelt
        if (!arraysEqual(newRow, row)) {
            moved = true; // Sütun değiştiyse hareket yapıldı
        }
        for (let r = 0; r < rows; r++) {
            board[r][c] = newRow[r]; // Tahtayı güncelle
            let box = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateBox(box, num); // Kutuları güncelle
        }
    }
    return moved;
}

// Boş bir "2" ekler
function setTwo() {
    if (!hasEmptyTile()) {
        return; // Boş yer yoksa çık
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2; // Boş bir yere "2" ekle
            let box = document.getElementById(r.toString() + "-" + c.toString());
            updateBox(box, 2); // Kutuyu güncelle
            found = true;
        }
    }
}

// Tahtada boş yer olup olmadığını kontrol eder
function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true; // Boş yer varsa true döndür
            }
        }
    }
    return false; // Boş yer yoksa false döndür
}

// İki diziyi karşılaştırır
function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

// Oyun bitip bitmediğini kontrol eder
function checkGameOver() {
    if (hasEmptyTile()) {
        return false; // Boş yer varsa oyun bitmemiştir
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

    document.getElementById("final-score").innerText = score; // Son puanı göster
    document.getElementById("game-container").style.display = "none"; // Oyun ekranını gizle
    document.getElementById("game-over-screen").style.display = "flex"; // Oyun bitti ekranını göster
    let highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score); // Yeni yüksek skoru kaydet
        document.getElementById("highScore").innerText = score; // Yüksek puanı güncelle
    }
    return true;
}

// Oyunu yeniden başlatır
function restartGame() {
    startGame();
}
