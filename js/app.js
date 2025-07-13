document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const gameBoard = document.getElementById("game-board");
  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("start-btn");

  let time = 20;
  let timer;
  let flipped = [];
  let matched = [];
  let isBusy = false;

  startBtn.addEventListener("click", () => {
    startScreen.classList.remove("active");
    gameScreen.classList.add("active");
    startGame();
  });

  function startGame() {
    clearInterval(timer);
    time = 20;
    flipped = [];
    matched = [];
    isBusy = false;
    startTimer();
    generateCards();
  }

  function startTimer() {
    timerDisplay.textContent = `Time: ${time}s`;
    timer = setInterval(() => {
      time--;
      timerDisplay.textContent = `Time: ${time}s`;
      if (time === 0) {
        clearInterval(timer);
        alert("⏰ Time's up!");
      }
    }, 1000);
  }

  function generateCards() {
    const colors = ["red", "red", "yellow", "yellow", "green", "green", "pink", "pink"];
    gameBoard.innerHTML = "";
    colors.sort(() => Math.random() - 0.5);

    const cards = [];

    colors.forEach(color => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.color = color;
      card.dataset.state = "hidden";
      card.style.backgroundColor = color; 
      gameBoard.appendChild(card);
      cards.push(card);
    });

    
    isBusy = true;
    setTimeout(() => {
      cards.forEach(card => {
        card.style.backgroundColor = "blue";
        card.dataset.state = "hidden";
        card.addEventListener("click", () => handleClick(card));
      });
      isBusy = false;
    }, 1000);
  }

  function handleClick(card) {
    if (isBusy || card.dataset.state === "matched") return;

    if (card.dataset.state === "flipped") {
      card.style.backgroundColor = "blue";
      card.dataset.state = "hidden";
      flipped = flipped.filter(c => c !== card);
      return;
    }

    if (flipped.length >= 2) return;

    card.style.backgroundColor = card.dataset.color;
    card.dataset.state = "flipped";
    flipped.push(card);

    if (flipped.length === 2) {
      isBusy = true;
      const [first, second] = flipped;

      if (first.dataset.color === second.dataset.color) {
        first.dataset.state = "matched";
        second.dataset.state = "matched";
        matched.push(first, second);
        flipped = [];
        isBusy = false;

        if (matched.length === 8) {
          clearInterval(timer);
          alert("you win!");
        }
      } else {
        setTimeout(() => {
          first.style.backgroundColor = "blue";
          second.style.backgroundColor = "blue";
          first.dataset.state = "hidden";
          second.dataset.state = "hidden";
          flipped = [];
          isBusy = false;
        }, 800);
      }
    }
  }
});

