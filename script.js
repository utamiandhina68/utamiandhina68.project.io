let score = 0;
let timeLeft = 30; // Waktu permainan dalam detik
let level = 1; // Level permainan
let scoreThreshold = 5; // Skor yang dibutuhkan untuk naik ke level berikutnya
const scoreBoard = document.getElementById('score');
const timerBoard = document.getElementById('timer');
const levelBoard = document.getElementById('level');
const gameArea = document.getElementById('game-area');
const backgroundMusic = document.getElementById('background-music');
const ghostSound = document.getElementById('ghost-sound');
const jumpscareSound = document.getElementById('jumpscare-sound');
const message = document.getElementById('message');
const startButton = document.getElementById('start-button');
const jumpscareImage = document.getElementById('jumpscare');
const restartButton = document.getElementById('restart-button'); // Tombol restart
let gameInterval;
let ghosts = [];
let ghostCount = 1; // Jumlah hantu awal
const winScore = 20; // Skor untuk menang

function createGhost() {
    const ghost = document.createElement('div');
    ghost.classList.add('ghost');
    ghost.style.width = '50px';
    ghost.style.height = '50px';
    ghost.style.background = 'url("ghost.jpeg") no-repeat center center';
    ghost.style.backgroundSize = 'contain';
    ghost.style.position = 'absolute';
    ghost.style.cursor = 'pointer';
    ghost.addEventListener('click', () => {
        score++;
        scoreBoard.textContent = score;
        ghost.style.display = 'none';
        ghostSound.play();
        if (score >= winScore) {
            winGame();
        } else {
            setTimeout(() => moveGhost(ghost), 1000);
        }
    });
    gameArea.appendChild(ghost);
    return ghost;
}

function randomPosition(element) {
    const x = Math.floor(Math.random() * (gameArea.clientWidth - element.clientWidth));
    const y = Math.floor(Math.random() * (gameArea.clientHeight - element.clientHeight));
    return { x, y };
}

function moveGhost(ghost) {
    if (timeLeft > 0) {
        const { x, y } = randomPosition(ghost);
        ghost.style.left = `${x}px`;
        ghost.style.top = `${y}px`;
        ghost.style.display = 'block';
    }
}

function startGame() {
    // Reset state
    score = 0;
    timeLeft = 30;
    level = 1;
    scoreThreshold = 5;
    ghostCount = 1;
    scoreBoard.textContent = score;
    timerBoard.textContent = timeLeft;
    levelBoard.textContent = level;
    message.style.display = 'none';
    jumpscareImage.style.display = 'none';
    jumpscareSound.pause();
    jumpscareSound.currentTime = 0;
    
    startButton.style.display = 'none'; // Sembunyikan tombol mulai setelah permainan dimulai
    restartButton.style.display = 'none'; // Sembunyikan tombol restart jika ada
	restartButton.addEventListener('click', function() {
    location.reload(); // Tombol reload untuk memuat ulang halaman
});


    // Hapus hantu yang ada
    while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild);
    }
    ghosts = [];

    // Buat hantu awal
    for (let i = 0; i < ghostCount; i++) {
        const ghost = createGhost();
        ghosts.push(ghost);
        setTimeout(() => moveGhost(ghost), 1000);
    }

    backgroundMusic.play();
    gameInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    timerBoard.textContent = timeLeft;
    if (timeLeft <= 0) {
        if (score >= scoreThreshold) {
            levelUp();
        } else {
            endGame();
        }
    }
}

function levelUp() {
    clearInterval(gameInterval);
    level++;
    ghostCount++; // Tambah jumlah hantu di setiap level
    scoreThreshold += 5; // Tingkatkan ambang skor untuk level berikutnya
    timeLeft = 30 - level * 5; // Kurangi waktu untuk setiap level baru
    if (timeLeft <= 0) {
        timeLeft = 5; // Pastikan ada minimal 5 detik untuk bermain
    }
    scoreBoard.textContent = score;
    levelBoard.textContent = level;
    timerBoard.textContent = timeLeft;

    // Tambah hantu baru
    for (let i = ghosts.length; i < ghostCount; i++) {
        const ghost = createGhost();
        ghosts.push(ghost);
        setTimeout(() => moveGhost(ghost), 1000);
    }

    setTimeout(() => {
        ghosts.forEach(ghost => moveGhost(ghost));
    }, 1000);
    
    gameInterval = setInterval(updateTimer, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    ghosts.forEach(ghost => ghost.style.display = 'none');
    backgroundMusic.pause();
    message.textContent = "Game Over!";
    message.style.display = 'block';
    restartButton.style.display = 'inline-block'; // Tampilkan tombol restart
    showJumpscare();
}

function winGame() {
    clearInterval(gameInterval);
    ghosts.forEach(ghost => ghost.style.display = 'none');
    backgroundMusic.pause();
    message.textContent = "You Win!";
    message.style.display = 'block';
    restartButton.style.display = 'inline-block'; // Tampilkan tombol restart
}

function showJumpscare() {
    jumpscareImage.style.display = 'block';
    jumpscareSound.play();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame); // Tambahkan event listener untuk tombol restart
