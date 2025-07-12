const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const gameBoard = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");

let timeLeft = 60;
let timerInterval;

startBtn.addEventListener("click", () => {
  
  document.body.style.backgroundColor = "#f0f0f0";
  document.body.style.color = "black";

  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  startGame();
});

function startGame() {
  startTimer();
  renderCards();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      alert("⏰ Time's up!");
    }
  }, 1000);
}

function renderCards() {
  gameBoard.innerHTML = "";

  const backColors = ["red", "red", "yellow", "yellow"];
  backColors.sort(() => Math.random() - 0.5);

  const cards = [];

  for (let i = 0; i < 4; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.backColor = backColors[i];

    
    card.style.backgroundColor = card.dataset.backColor;
    card.classList.add("flipped");

    cards.push(card);
    gameBoard.appendChild(card);
  }

  
  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove("flipped");
      card.style.backgroundColor = "blue";

     
      card.addEventListener("click", () => {
        if (card.classList.contains("flipped")) return;

        card.classList.add("flipped");
        card.style.backgroundColor = card.dataset.backColor;
      });
    });
  }, 2000);
}
