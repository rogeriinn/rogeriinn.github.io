const audio = document.getElementById("musica");
audio.volume = 0.1;

function iniciarMusica() {
    audio.play().then(() => {
        window.removeEventListener("click", iniciarMusica);
        window.removeEventListener("touchstart", iniciarMusica);
    }).catch(e => {
    });
}

window.addEventListener("click", iniciarMusica);
window.addEventListener("touchstart", iniciarMusica);


// =========================================================================
// LÒGICA JOC 1: CONNECTIONS
// =========================================================================
const CATEGORIES = [{
    name: "Begudes que beus.",
    colorClass: "cat-yellow",
    words: ["VINO", "DESPERADOS", "AIGUA", "COVFEFE"]
}, {
    name: "ÚNIQUES samarretes que portes a l'estiu.",
    colorClass: "cat-green",
    words: ["Flèndit", "Paulaner", "Tossino", "La Cava"]
}, {
    name: "Coses que t'has deixat a la meva habitació.",
    colorClass: "cat-blue",
    words: ["Arrecades", "Mocador", "Labial", "Mòbil"]
}, {
    name: "Paraules del nostre vocabulari menos una lletra (COMÉ, PIPSA, BUSA, ADITA)",
    colorClass: "cat-purple",
    words: ["COM", "PIPS", "BUS", "DITA"]
}];

let allTiles = [];
let selectedTiles = [];
let mistakesLeft = 4;
let solvedCount = 0;
const previousGuesses = new Set();

function initConnections() {
    CATEGORIES.forEach(cat => {
        cat.words.forEach(word => {
            allTiles.push({
                word: word,
                category: cat.name,
                colorClass: cat.colorClass
            });
        });
    });
    shuffleArray(allTiles);
    renderGrid();
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function renderGrid() {
    const grid = document.getElementById("tiles-grid");
    grid.innerHTML = "";
    allTiles.forEach((item) => {
        const div = document.createElement("div");
        div.className = "conn-tile" + (selectedTiles.includes(item) ? " selected" : "");
        div.textContent = item.word;
        div.onclick = () => toggleSelect(item);
        grid.appendChild(div);
    });
    updateSubmitBtn();
}

function toggleSelect(item) {
    const idx = selectedTiles.indexOf(item);
    if (idx > -1) {
        selectedTiles.splice(idx, 1);
    } else if (selectedTiles.length < 4) {
        selectedTiles.push(item);
    }
    renderGrid();
}

function deselectAll() {
    selectedTiles = [];
    renderGrid();
}

function shuffleTiles() {
    shuffleArray(allTiles);
    renderGrid();
}

function updateSubmitBtn() {
    document.getElementById("submit-btn").disabled = selectedTiles.length !== 4;
}

function showToast(text) {
    const toast = document.getElementById("toast");
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function checkGuess() {
    if (selectedTiles.length !== 4) return;

    const guessKey = selectedTiles
        .map(t => t.word)
        .sort()
        .join("|");

    if (previousGuesses.has(guessKey)) {
        showToast("Ja has provat aquesta combinació!");
        return;
    }

    previousGuesses.add(guessKey);

    const firstCat = selectedTiles[0].category;
    const isCorrect = selectedTiles.every(t => t.category === firstCat);

    if (isCorrect) {
        const catData = CATEGORIES.find(c => c.name === firstCat);
        allTiles = allTiles.filter(t => t.category !== firstCat);
        renderSolvedCategory(catData);
        selectedTiles = [];
        solvedCount++;

        if (solvedCount === 4) {
            endGameWin();
        } else {
            renderGrid();
        }
    } else {
        mistakesLeft--;
        updateMistakesUI();
        if (mistakesLeft === 0) {
            alert("Bueno uba et dono 4 intents més...");
            mistakesLeft = 4;
            resetMistakesUI();
        }
    }
}

function renderSolvedCategory(cat) {
    const solvedBox = document.getElementById("solved-box");
    const div = document.createElement("div");
    div.className = `conn-solved-card ${cat.colorClass}`;
    div.innerHTML = `
                <div class="conn-solved-title">${cat.name}</div>
                <div class="conn-solved-words">${cat.words.join(", ")}</div>
            `;
    solvedBox.appendChild(div);
}

function updateMistakesUI() {
    const dots = document.querySelectorAll("#connections-screen .conn-dot");
    if (dots[mistakesLeft]) {
        dots[mistakesLeft].classList.add("lost");
    }
}

function resetMistakesUI() {
    document.querySelectorAll("#connections-screen .conn-dot").forEach(d => d.classList.remove("lost"));
}

function endGameWin() {
    document.getElementById("tiles-grid").style.display = "none";
    document.getElementById("mistakes-box").style.display = "none";
    document.getElementById("action-buttons").style.display = "none";
    document.getElementById("victory-modal").style.display = "block";
}

// =========================================================================
// LÒGICA JOC 2: WORDLE
// =========================================================================
const TARGET_WORD = "CHORI"; // Paraula de 5 lletres
const REWARD_KEY = "numero3"; // Clau que s'entrega en guanyar el Wordle
const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

let currentRow = 0;
let currentTile = 0;
let wordleGameOver = false;

const guesses = Array.from({
    length: MAX_ATTEMPTS
}, () => Array(WORD_LENGTH).fill(""));

const KB_LAYOUT = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
];

function initWordle() {
    createBoard();
    createKeyboard();
    window.addEventListener("keydown", (e) => handleInput(e.key));
}

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let r = 0; r < MAX_ATTEMPTS; r++) {
        const row = document.createElement("div");
        row.className = "wdl-row";
        row.id = `row-${r}`;
        for (let c = 0; c < WORD_LENGTH; c++) {
            const cell = document.createElement("div");
            cell.className = "wdl-cell";
            cell.id = `cell-${r}-${c}`;
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function createKeyboard() {
    const kb = document.getElementById("keyboard");
    kb.innerHTML = "";
    KB_LAYOUT.forEach(rowKeys => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "wdl-kb-row";
        rowKeys.forEach(k => {
            const btn = document.createElement("button");
            btn.className = "wdl-key";
            btn.textContent = k;
            btn.id = `key-${k}`;
            if (k === "ENTER" || k === "⌫") btn.classList.add("wide");
            btn.onclick = () => handleInput(k);
            rowDiv.appendChild(btn);
        });
        kb.appendChild(rowDiv);
    });
}

function handleInput(key) {
    if (wordleGameOver) return;

    if (key === "ENTER" || key === "Enter") {
        submitGuess();
    } else if (key === "⌫" || key === "Backspace") {
        deleteLetter();
    } else if (/^[A-ZÀ-ÿÇ]$/i.test(key) && key.length === 1) {
        addLetter(key.toUpperCase());
    }
}

function addLetter(letter) {
    if (currentTile < WORD_LENGTH) {
        guesses[currentRow][currentTile] = letter;
        const cell = document.getElementById(`cell-${currentRow}-${currentTile}`);
        cell.textContent = letter;
        cell.classList.add("filled");
        currentTile++;
    }
}

function deleteLetter() {
    if (currentTile > 0) {
        currentTile--;
        guesses[currentRow][currentTile] = "";
        const cell = document.getElementById(`cell-${currentRow}-${currentTile}`);
        cell.textContent = "";
        cell.classList.remove("filled");
    }
}

function submitGuess() {
    if (currentTile !== WORD_LENGTH) return;

    const guess = guesses[currentRow].join("");
    const targetLetters = TARGET_WORD.split("");
    const guessLetters = guess.split("");
    const statuses = Array(WORD_LENGTH).fill("absent");

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            statuses[i] = "correct";
            targetLetters[i] = null;
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (statuses[i] !== "correct") {
            const foundIdx = targetLetters.indexOf(guessLetters[i]);
            if (foundIdx > -1) {
                statuses[i] = "present";
                targetLetters[foundIdx] = null;
            }
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        const cell = document.getElementById(`cell-${currentRow}-${i}`);
        cell.classList.add(statuses[i]);
        updateKey(guessLetters[i], statuses[i]);
    }

    if (guess === TARGET_WORD) {
        endWordle(true);
    } else if (currentRow === MAX_ATTEMPTS - 1) {
        endWordle(false);
    } else {
        currentRow++;
        currentTile = 0;
    }
}

function updateKey(letter, status) {
    const keyBtn = document.getElementById(`key-${letter}`);
    if (!keyBtn) return;

    const priority = {
        "correct": 3,
        "present": 2,
        "absent": 1
    };
    const currentStatus = keyBtn.classList.contains("correct") ? "correct" :
        keyBtn.classList.contains("present") ? "present" :
        keyBtn.classList.contains("absent") ? "absent" : null;

    if (!currentStatus || priority[status] > priority[currentStatus]) {
        keyBtn.classList.remove("present", "absent");
        keyBtn.classList.add(status);
    }
}

function endWordle(won) {
    wordleGameOver = true;
    if (won) {
        document.getElementById("reward-key").textContent = REWARD_KEY;
        document.getElementById("wdl-reward").style.display = "block";
    } else {
        alert("FATAL UBA!!! Torna-ho a provar.");
        setTimeout(resetWordle, 500);
    }
}

function resetWordle() {
    // 1. Reiniciar comptadors i estat
    currentRow = 0;
    currentTile = 0;
    wordleGameOver = false;

    // 2. Netejar la matriu d'intents
    for (let r = 0; r < MAX_ATTEMPTS; r++) {
        guesses[r] = Array(WORD_LENGTH).fill("");
    }

    // 3. Netejar les cel·les visuals del tauler
    for (let r = 0; r < MAX_ATTEMPTS; r++) {
        for (let c = 0; c < WORD_LENGTH; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) {
                cell.textContent = "";
                cell.className = "wdl-cell";
            }
        }
    }

    // 4. Reiniciar els colors de les tecles del teclat
    const allKeys = document.querySelectorAll("#wordle-screen .wdl-key");
    allKeys.forEach(k => {
        k.classList.remove("correct", "present", "absent");
    });
}

// Inicialització simultània
initConnections();
initWordle();


function obrirInvitacio() {
    const contra = document.getElementById("contra").value;
    const contenido = document.getElementById("contenido");

    const password = "cumplenumero3de_natros";

    if (contra === password) {
        contenido.classList.remove("hidden");
    } else {
        alert("No és pas aquesta paraula...");
    }
}


// =========================================================================
// LÒGICA JOC 3: WHACK-A-MOLE
// =========================================================================
const MOLE_GOAL = 15;
const MOLE_TIME_LIMIT = 20;

let moleScore = 0;
let moleTimeLeft = MOLE_TIME_LIMIT;
let moleTimerId = null;
let molePopupId = null;
let lastHole = null;
let molePlaying = false;

const targets = document.querySelectorAll('.mole-target');
const moleScoreEl = document.getElementById('mole-score');
const moleTimeEl = document.getElementById('mole-time');
const startMoleBtn = document.getElementById('start-mole-btn');

function randomHole() {
    const idx = Math.floor(Math.random() * targets.length);
    const target = targets[idx];
    if (target === lastHole) {
        return randomHole();
    }
    lastHole = target;
    return target;
}

function showMole() {
    if (!molePlaying) return;

    const target = randomHole();
    target.classList.add('up');
    target.dataset.hit = "false";

    // Temps que es queda a dalt (entre 600ms i 900ms)
    const stayTime = Math.floor(Math.random() * 300) + 600;

    molePopupId = setTimeout(() => {
        target.classList.remove('up');
        if (molePlaying) {
            showMole();
        }
    }, stayTime);
}

function hitMole(target) {
    if (!molePlaying || target.dataset.hit === "true") return;

    target.dataset.hit = "true";
    target.classList.add('bonked');
    moleScore++;
    moleScoreEl.textContent = moleScore;

    setTimeout(() => {
        target.classList.remove('up');
        target.classList.remove('bonked');
    }, 150);

    if (moleScore >= MOLE_GOAL) {
        endMoleGame(true);
    }
}

function startMoleGame() {
    // Reset d'estat
    moleScore = 0;
    moleTimeLeft = MOLE_TIME_LIMIT;
    moleScoreEl.textContent = moleScore;
    moleTimeEl.textContent = moleTimeLeft;
    molePlaying = true;
    startMoleBtn.disabled = true;

    showMole();

    moleTimerId = setInterval(() => {
        moleTimeLeft--;
        moleTimeEl.textContent = moleTimeLeft;

        if (moleTimeLeft <= 0) {
            if (moleScore >= MOLE_GOAL) {
                endMoleGame(true);
            } else {
                endMoleGame(false);
            }
        }
    }, 1000);
}

function endMoleGame(won) {
    molePlaying = false;
    clearInterval(moleTimerId);
    clearTimeout(molePopupId);
    targets.forEach(t => t.classList.remove('up'));

    if (won) {
        startMoleBtn.style.display = "none";
        document.getElementById('mole-reward').style.display = "block";
    } else {
        alert("S'ha acabat el temps! Torna-ho a provar.");
        startMoleBtn.disabled = false;
    }
}
