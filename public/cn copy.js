const DATA_KEY = 'myGameData';

function getGameData() {
    const dt = localStorage.getItem(DATA_KEY);

    if (!dt) {
        const start = { coins: 10000 };
        saveGameData(start);
        return start;
    }
    return JSON.parse(dt);
}

function saveGameData(dataObject) {
    const jsonString = JSON.stringify(dataObject);
    localStorage.setItem(DATA_KEY, jsonString);
}

function updateCoins(amount) {
  const data = getGameData();

  data.coins += amount;
  
  saveGameData(data);
  
  updateCoinDisplay();
  
  return true;
}

function updateCoinDisplay() {
  const data = getGameData();

  const coinElement = document.getElementById('coin-count');
  if (coinElement) {
    coinElement.textContent = data.coins;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCoinDisplay();
});