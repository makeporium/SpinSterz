// ----------------------
// TOGGLE POPUP
// ----------------------
function toggle_12000() {
  const body = document.getElementById("body");
  if (!body) return;
  body.classList.toggle("overflow-hidden");

  const twelve_thousand = document.getElementById("12000");
  if (!twelve_thousand) return;

  twelve_thousand.classList.toggle("flex");
  twelve_thousand.classList.toggle("hidden");
}

// ----------------------
// MAIN GAME CLASS
// ----------------------
class CoinFlipGame {
  constructor() {
    this.gameHistory = [];
    this.total_amt_ht = document.getElementById("tamt_ht");
    this.total_profit_ht = document.getElementById("tpro_ht");
    this.n = "na";
    this.done = false;

    // Only load history if on CoinFlip page
    if (document.getElementById("history")) {
      this.loadHistoryFromDB();
    }
  }

  async loadHistoryFromDB() {
    const res = await fetch("/api/getHistory");
    const data = await res.json();
    this.gameHistory = data;
    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    const historyDiv = document.getElementById("history");
    if (!historyDiv) return; // Prevent errors on other pages

    historyDiv.innerHTML = "";

    if (!this.gameHistory || this.gameHistory.length === 0) {
      historyDiv.textContent = "No games yet.";
      return;
    }

    const displayText = this.gameHistory
      .slice()
      .reverse()
      .map(
        g => `<span class="${g.result === "W" ? "text-green-400" : "text-red-500"} font-bold">${g.result}</span>`
      )
      .join(" ");

    historyDiv.innerHTML = `
      <div class="text-white">Last 5 Games:</div>
      <div>${displayText}</div>
    `;
  }

  async afteranimations(num1, sidename) {
    const amt = Number(num1) || 0;

    if (this.total_amt_ht)
      this.total_amt_ht.textContent = Number(this.total_amt_ht.textContent) + amt;

    updateCoins(-amt);

    let result = "L";
    let profit = 0;

    if (
      (sidename === "Chosen - Head" && this.n === "H") ||
      (sidename === "Chosen - Tail" && this.n === "T")
    ) {
      if (this.total_profit_ht)
        this.total_profit_ht.textContent =
          Number(this.total_profit_ht.textContent) + amt;

      result = "W";
      profit = amt;
      updateCoins(2 * amt);
    }

    // Store in DB
    fetch("/api/saveHistory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result, amount: amt, profit })
    });

    await this.loadHistoryFromDB();
    this.htend();
  }

  htend() {
    const x = document.getElementById("loadinght");
    if (!x) return;

    setTimeout(() => {
      x.classList.remove("hidden");

      if (this.n === "H") {
        const el = document.getElementById("hcame");
        if (el) el.classList.toggle("hidden");
      } else {
        const el = document.getElementById("lcame");
        if (el) el.classList.toggle("hidden");
      }

      this.Undochose();
    }, 1000);
  }

  // ----------------------
  // START GAME
  // ----------------------
  htstart(num1, sidename) {
    if (!document.getElementById("loadinght")) return; // Prevent errors on other pages

    if (sidename === "Select Side") return alert("Select Head or Tail first!");
    if (!num1 || num1 <= 0) return alert("Amount is invalid!");

    const x = document.getElementById("loadinght");
    x.classList.add("animate-spin");

    setTimeout(() => {
      x.classList.remove("animate-spin");
      x.classList.add("hidden");

      this.n = Math.random() < 0.5 ? "H" : "T";

      if (this.n === "H") {
        const el = document.getElementById("hcame");
        if (el) el.classList.toggle("hidden");
      } else {
        const el = document.getElementById("lcame");
        if (el) el.classList.toggle("hidden");
      }

      this.afteranimations(num1, sidename);
    }, 1000);
  }
}

// ----------------------
// INITIALIZE ON LOAD
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  window.coinGame = new CoinFlipGame();

  // Expose functions to HTML buttons
  window.htstart = (num1, sidename) => coinGame.htstart(num1, sidename);

  // Load coins globally
  updateCoinDisplay();
});