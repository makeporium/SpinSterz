const ROWS = 5;
const COLS = 5;
let minePositions = new Set();
let revealed = new Set();
let gemsFound = 0;
let bet = 0;
let gameActive = false;

const boardContainer = document.getElementById("boardContainer");
const minesInput = document.getElementById("minesInput");
const gemsCount = document.getElementById("gemsCount");
const profitInput = document.getElementById("profit");
const betInput = document.getElementById("betInput");
const placeBetBtn = document.getElementById("placeBetBtn");

function renderBoard() {
  boardContainer.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      const tile = document.createElement("div");
      tile.className =
        "aspect-square w-16 bg-gray-700 flex items-center justify-center rounded-md hover:scale-105 transition-transform cursor-pointer relative";
      tile.dataset.index = idx;
      tile.onclick = () => onTileClick(idx, tile);
      boardContainer.appendChild(tile);
    }
  }
}

function setBet(mode) {
  if (mode === "min") betInput.value = 10;
  else if (mode === "max") betInput.value = 1000;
}

function changeBet(x) {
  const current = Number(betInput.value) || 0;
  betInput.value = current + x;
}

function startGame() {
  const mines = Math.min(Math.max(Number(minesInput.value) || 5, 1), 24);
  bet = Number(betInput.value) || 0;
  if (bet <= 0) return alert("Enter a valid bet amount");
  updateCoins(-bet);
  //updateCoinDisplay();
  gemsFound = 0;
  revealed.clear();
  minePositions.clear();
  gameActive = true;
  while (minePositions.size < mines) {
    const pos = Math.floor(Math.random() * (ROWS * COLS));
    minePositions.add(pos);
  }
  renderBoard();
  updateStats();
  placeBetBtn.textContent = "Game Started";
  placeBetBtn.disabled = true;
}

function onTileClick(idx, tileEl) {
  if (!gameActive || revealed.has(idx)) return;
  revealed.add(idx);
  if (minePositions.has(idx)) {
    tileEl.innerHTML = '<span class="text-red-400 font-bold">💣</span>';
    tileEl.classList.add("bg-red-800");
    endGame(false);
  } else {
    tileEl.innerHTML = '<img src="./gem.png" class="w-10 h-10">';
    gemsFound++;
    updateStats();
    if (revealed.size === ROWS * COLS - minePositions.size) endGame(true);
  }
}

function endGame(won) {
  gameActive = false;
  revealAllMines();
  alert(won ? "🎉 You cleared the board!" : "💣 Boom! You hit a mine.");
  placeBetBtn.textContent = "Place Bet";
  placeBetBtn.disabled = false;
}

function revealAllMines() {
  profitInput.value = 0;
  const tiles = boardContainer.children;
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const idx = Number(tile.dataset.index);
    if (minePositions.has(idx)) {
      if (!revealed.has(idx))
        tile.innerHTML = '<span class="text-red-400 font-bold">💣</span>';
      tile.classList.add("bg-red-900");
    }
  }
}

function updateStats() {
  gemsCount.value = gemsFound;
  profitInput.value = (bet * gemsFound).toFixed(2);
  //updateStats(profitInput.value);
}

function cashOut() {
  if (!gameActive && gemsFound === 0) return alert("No active session.");
  const amount = Number(profitInput.value) || 0;
  if (amount > 0) {
    alert("Cashed out: " + amount);
    updateCoins(amount);
    gemsFound = 0;
    revealed.clear();
    minePositions.clear();
    updateStats();
    renderBoard();
    placeBetBtn.textContent = "Place Bet";
    placeBetBtn.disabled = false;
    gameActive = false;
  } else alert("Nothing to cash out");
}

function toggle_12000() {
  const el = document.getElementById("12000");
  el.classList.toggle("hidden");
}

renderBoard();
