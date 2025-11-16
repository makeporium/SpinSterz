function toggle_dailyFree() {
  const body = document.getElementById("body");
  body.classList.toggle("overflow-hidden");
  const twelve_thousand = document.getElementById("dailyfree");
  twelve_thousand.classList.toggle("flex");
  twelve_thousand.classList.toggle("hidden");
}

function claimReward() {
  const reward = Math.floor(Math.random() * 91) + 10;
  const rewardMsg = document.getElementById("rewardMsg");
  const claimBtn = document.getElementById("claimBtn");

  rewardMsg.textContent = `🎉 Congratulations! You won ${reward} coins!`;
  rewardMsg.classList.remove("hidden");

  claimBtn.disabled = true;
  claimBtn.classList.add("opacity-50", "cursor-not-allowed");
  claimBtn.textContent = "Claimed ✅";
}

function toggle_rank() {
  const body = document.getElementById("body");
  body.classList.toggle("overflow-hidden");
  const twelve_thousand = document.getElementById("rank");
  twelve_thousand.classList.toggle("flex");
  twelve_thousand.classList.toggle("hidden");
}

function toggle_help() {
  const body = document.getElementById("body");
  body.classList.toggle("overflow-hidden");
  const twelve_thousand = document.getElementById("help");
  twelve_thousand.classList.toggle("flex");
  twelve_thousand.classList.toggle("hidden");
}