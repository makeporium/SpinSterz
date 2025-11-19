// ----------------------
// UPDATE COINS IN DATABASE
// ----------------------
async function updateCoins(amount) {
  const res = await fetch("/api/updateCoins", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "ayush",   // later change when login system added
      amount: amount       // + wins / - losses
    }),
  });

  const data = await res.json();

  // Update navbar
  const coinElement = document.getElementById("coin-count");
  if (coinElement) {
    coinElement.textContent = data.coins;
  }
}

// ----------------------
// GET COINS FROM DATABASE (DISPLAY ONLY)
// ----------------------
async function updateCoinDisplay() {
  const res = await fetch("/api/getCoins");
  const data = await res.json();

  const coinElement = document.getElementById("coin-count");
  if (coinElement) {
    coinElement.textContent = data.coins;
  }
}

// ----------------------
// RUN WHEN PAGE LOADS
// ----------------------
window.onload = updateCoinDisplay;
