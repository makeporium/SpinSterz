let gameHistory = [];


window.onload = () => {
    const saved = localStorage.getItem("coinHistory");
    if (saved) {
        gameHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
};

// function zoomImage(img) { // try for ladki pic
  
//   if (img.classList.contains('scale-[5]')) {
//     img.classList.remove('scale-[5]');
//   } else {
//     img.classList.add('scale-[5]'); 
//   }
// }

function toggleForms() {
  const signup = document.getElementById("signupForm");
  const signin = document.getElementById("signinForm");
  signup.classList.toggle("hidden");
  signin.classList.toggle("hidden");
}

const box = document.getElementById("box");
const btn = document.getElementById("btn");

function tryy() {
  box.classList.toggle("text-blue-800");
  box.classList.toggle("bg-red-700");
  box.classList.toggle("text-3xl");
}

function toggle_12000() {
  const body = document.getElementById("body");
  body.classList.toggle("overflow-hidden");
  const twelve_thousand = document.getElementById("12000");
  twelve_thousand.classList.toggle("flex");
  twelve_thousand.classList.toggle("hidden");
}
let done = false;

function chose(chosee) {
  if (done == true) {
    return;
  }
  head = document.getElementById("head");
  tail = document.getElementById("tail");
  side = document.getElementById("sidename");

  side.classList.add("opacity-0");

  setTimeout(() => {
    //wait for 300ms, then run this.
    if (chosee == "head") {
      side.textContent = "Chosen - Head";
    } else {
      side.textContent = "Chosen - Tail";
    }
    side.classList.remove("opacity-0", "animate-bounce");
  }, 300);

  head.classList.remove("hover:scale-110", "hover:cursor-pointer");
  tail.classList.remove("hover:scale-110", "hover:cursor-pointer");

  done = true;

  //side.classList.toggle('hidden'); --> IMP --> DOES NOT WAIT FOR 300MS DELAY, OR OTHER CODES BELOW THAT.
}

function Undochose(chosee) {
  done=false;
  head = document.getElementById("head");
  tail = document.getElementById("tail");
  side = document.getElementById("sidename");

  side.textContent = "Select Side";
  side.classList.add("animate-bounce");

  head.classList.add("hover:scale-110", "hover:cursor-pointer");
  tail.classList.add("hover:scale-110", "hover:cursor-pointer");


  //side.classList.toggle('hidden'); --> IMP --> DOES NOT WAIT FOR 300MS DELAY, OR OTHER CODES BELOW THAT.
}
let total_profit_ht = document.getElementById('tpro_ht');
let total_amt_ht = document.getElementById('tamt_ht');

let n = "na";

// function afteranimations(num1, sidename){
// total_amt_ht.textContent = Number(total_amt_ht.textContent)+Number(num1);

    
// if((sidename == "Chosen - Head")&&(n == "H")){
//     total_profit_ht.textContent = Number(total_profit_ht.textContent)+Number(num1);  
// }

// else if((sidename == "Chosen - Tail")&&(n == "T")){
//     total_profit_ht.textContent = Number(total_profit_ht.textContent)+Number(num1);
// }
// else{
//     console.log("KONSA CASE HAI YE?")
// }

// htend();
// }

function updateHistoryDisplay() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = ""; // clear

    if (gameHistory.length === 0) {
        historyDiv.textContent = "No games yet.";
        return;
    }

    // reverse to show latest first
    let displayText = gameHistory
        .slice()
        .reverse()
        .map(g => `<span class="${g.result === 'W' ? 'text-green-400' : 'text-red-500'} font-bold">${g.result}</span>`)
        .join(" ");

    historyDiv.innerHTML = `
        <div class="text-white">Last 5 Games:</div>
        <div>${displayText}</div>
    `;
    
}



function afteranimations(num1, sidename) {
    // ensure numeric
    const amt = Number(num1) || 0;

    total_amt_ht.textContent = Number(total_amt_ht.textContent) + amt;

    let result = "L";  // assume loss by default
    let profit = 0;

    if ((sidename == "Chosen - Head" && n == "H") || (sidename == "Chosen - Tail" && n == "T")) {
        total_profit_ht.textContent = Number(total_profit_ht.textContent) + amt;
        result = "W";
        profit = amt;
    }

    // store in array
    gameHistory.push({ result: result, amount: amt, profit: profit });

    // keep only last 5 games
    if (gameHistory.length > 5) {
        gameHistory.shift(); // remove oldest
    }

    // save to localStorage
    localStorage.setItem("coinHistory", JSON.stringify(gameHistory));

    // update history div (no htend() here)
    updateHistoryDisplay();

    // continue UI flow
    htend();
}



function htend(num1, sidename) {
  
  let x = document.getElementById("loadinght");

  setTimeout(() => {   //***IMP --> FIND BETTER WAYS TO HAVE DURATIONS, THEN CODE AFTER IT... ITS DIFFICULT TO PUT EVERYHTING IN TIMEOUT
    x.classList.remove("hidden");

    
    if (n == "H") {
      //head
      n = "na";
      let x = document.getElementById("hcame");
      x.classList.toggle("hidden");
    } else {
      //tails
      n = "na";
      let x = document.getElementById("lcame");
      x.classList.toggle("hidden");
    }

  Undochose();




  }, 1000);


}

function htstart(num1, sidename) {
  if (sidename == "Select Side") {
    alert("please select which side of head and tails.");
    return;
  } else if (num1 == null || num1 <= 0) {
    alert("Amount is either null or undefined.");
    return;
  }

  let x = document.getElementById("loadinght");
  //     setTimeout(()=>{
  // x.classList.add('animate-spin');

  //     }, 300);

  x.classList.add("animate-spin");

  setTimeout(() => {   //***IMP --> FIND BETTER WAYS TO HAVE DURATIONS, THEN CODE AFTER IT... ITS DIFFICULT TO PUT EVERYHTING IN TIMEOUT
    x.classList.remove("animate-spin");
    x.classList.add("hidden");

    let randomNumber = Math.random(); //RANDOM FUNCTIONNNN, since, random is from 0, to 1, 0.5 is mid.
    
    if (randomNumber < 0.5) {
      //head
      n = "H";
      let x = document.getElementById("hcame");
      x.classList.toggle("hidden");
    } else {
      //tails
      n = "T";
      let x = document.getElementById("lcame");
      x.classList.toggle("hidden");
    }

    afteranimations(num1, sidename);
  }, 1000);
}
