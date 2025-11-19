
async function loadBikiniHistory() {
    const res = await fetch("/api/getHistory");
    const data = await res.json();

    const filtered = data.filter(h => h.game === "BikiniSwap");

    let html = "<div>Last Bikini Swap Results:</div>";
    filtered.forEach(h => {
        html += `<div class="${h.result === "W" ? "text-green-400" : "text-red-500"}">
            ${h.result} | Bet: ${h.amount} | Profit: ${h.profit} | Choice: ${h.choice}
        </div>`;
    });

    document.getElementById("bikini-history").innerHTML = html;
}

loadBikiniHistory();



function toggle_12000() {
  const body = document.getElementById("body");
  if (!body) return;

  const twelve_thousand = document.getElementById("12000");
  if (!twelve_thousand) return;

  body.classList.toggle("overflow-hidden");
  twelve_thousand.classList.toggle("flex");
  twelve_thousand.classList.toggle("hidden");
}

class CoinFlipGame {
  constructor() {
    this.gameHistory = [];
    this.total_amt_ht = document.getElementById("tamt_ht");
    this.total_profit_ht = document.getElementById("tpro_ht");
    this.n = "na";
    this.done = false;

    this.loadData(); // Load stored history and totals
  }

  // -------------------------
  // LOAD HISTORY & TOTALS FROM DATABASE
  // -------------------------
  async loadData() {
    try {
      const res = await fetch("/api/getHistory");
      const data = await res.json();

      this.gameHistory = data;

      // Calculate totals
      let totalAmt = 0;
      let totalProfit = 0;

      data.forEach((g) => {
        totalAmt += g.amount || 0;
        totalProfit += g.profit || 0;
      });

      this.total_amt_ht.textContent = totalAmt;
      this.total_profit_ht.textContent = totalProfit;

      this.updateHistoryDisplay();
    } catch (err) {
      console.error("Error loading history:", err);
    }
  }

  toggleForms() {
    const signup = document.getElementById("signupForm");
    const signin = document.getElementById("signinForm");
    signup.classList.toggle("hidden");
    signin.classList.toggle("hidden");
  }

  tryy() {
    const box = document.getElementById("box");
    box.classList.toggle("text-blue-800");
    box.classList.toggle("bg-red-700");
    box.classList.toggle("text-3xl");
  }

  toggle_12000() {
    const body = document.getElementById("body");
    body.classList.toggle("overflow-hidden");
    const twelve_thousand = document.getElementById("12000");
    twelve_thousand.classList.toggle("flex");
    twelve_thousand.classList.toggle("hidden");
  }

  chose(chosee) {
    if (this.done) return;

    const head = document.getElementById("head");
    const tail = document.getElementById("tail");
    const side = document.getElementById("sidename");

    side.classList.add("opacity-0");

    setTimeout(() => {
      side.textContent = chosee === "head" ? "Chosen - Head" : "Chosen - Tail";
      side.classList.remove("opacity-0", "animate-bounce");
    }, 300);

    head.classList.remove("hover:scale-110", "hover:cursor-pointer");
    tail.classList.remove("hover:scale-110", "hover:cursor-pointer");

    this.done = true;
  }

  Undochose() {
    this.done = false;
    const head = document.getElementById("head");
    const tail = document.getElementById("tail");
    const side = document.getElementById("sidename");

    side.textContent = "Select Side";
    side.classList.add("animate-bounce");

    head.classList.add("hover:scale-110", "hover:cursor-pointer");
    tail.classList.add("hover:scale-110", "hover:cursor-pointer");
  }

  updateHistoryDisplay() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";

    if (this.gameHistory.length === 0) {
      historyDiv.textContent = "No games yet.";
      return;
    }

    const displayText = this.gameHistory
      .slice()
      .reverse()
      .map(
        (g) =>
          `<span class="${
            g.result === "W" ? "text-green-400" : "text-red-500"
          } font-bold">${g.result}</span>`
      )
      .join(" ");

    historyDiv.innerHTML = `
        <div class="text-white">Last 5 Games:</div>
        <div>${displayText}</div>
    `;
  }

  // -------------------------
  // AFTER ANIMATIONS → SAVE TO DATABASE
  // -------------------------
  async afteranimations(num1, sidename) {
    const amt = Number(num1) || 0;

    this.total_amt_ht.textContent =
      Number(this.total_amt_ht.textContent) + amt;
    updateCoins(-amt);

    let result = "L";
    let profit = 0;

    if (
      (sidename === "Chosen - Head" && this.n === "H") ||
      (sidename === "Chosen - Tail" && this.n === "T")
    ) {
      this.total_profit_ht.textContent =
        Number(this.total_profit_ht.textContent) + amt;
      result = "W";
      profit = amt;

      updateCoins(2 * amt);
    }

    // SAVE TO MONGO DB
    await fetch("/api/saveHistory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        result,
        amount: amt,
        profit,
      }),
    });

    // Refresh UI with DB data
    this.loadData();

    this.htend();
  }

  htend() {
    const x = document.getElementById("loadinght");

    setTimeout(() => {
      x.classList.remove("hidden");

      if (this.n === "H") {
        this.n = "na";
        document.getElementById("hcame").classList.toggle("hidden");
      } else {
        this.n = "na";
        document.getElementById("lcame").classList.toggle("hidden");
      }

      this.Undochose();
    }, 1000);
  }

  htstart(num1, sidename) {
    if (sidename === "Select Side") {
      alert("Please select Head or Tail first!");
      return;
    } else if (!num1 || num1 <= 0) {
      alert("Amount is invalid!");
      return;
    }

    const x = document.getElementById("loadinght");
    x.classList.add("animate-spin");

    setTimeout(() => {
      x.classList.remove("animate-spin");
      x.classList.add("hidden");

      const randomNumber = Math.random();
      if (randomNumber < 0.5) {
        this.n = "H";
        document.getElementById("hcame").classList.toggle("hidden");
      } else {
        this.n = "T";
        document.getElementById("lcame").classList.toggle("hidden");
      }

      this.afteranimations(num1, sidename);
    }, 1000);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.coinGame = new CoinFlipGame();

  window.htstart = (num1, sidename) => coinGame.htstart(num1, sidename);
  window.afteranimations = (num1, sidename) =>
    coinGame.afteranimations(num1, sidename);
  window.htend = () => coinGame.htend();
  window.chose = (chosee) => coinGame.chose(chosee);
  window.Undochose = () => coinGame.Undochose();
  window.updateHistoryDisplay = () => coinGame.updateHistoryDisplay();
});
