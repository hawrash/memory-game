document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const gameBoard = document.getElementById("game-board");
  const timerDisplay = document.getElementById("timer");
  const scoreDisplay = document.getElementById("score");
  const startBtn = document.getElementById("start-btn");
  const winMessage = document.getElementById("win-message");

  let currentLevel = 1;
  let timePenalty = 0;
  let extraPairs = 0;
  let score = 0;
  let lossCount = 0;
  let gameOver = false;

  const levelConfigs = {
    1: { pairs: 3, time: 40 },
    2: { pairs: 6, time: 30 },
    3: { pairs: 8, time: 20 },
  };

  let time;
  let timer;
  let flipped = [];
  let matched = [];
  let isBusy = false;

  startBtn.addEventListener("click", () => {
    if (!gameOver) {
      startScreen.classList.remove("active");
      gameScreen.classList.add("active");
      startGame();
    }
  });

  function startGame() {
    clearInterval(timer);
    flipped = [];
    matched = [];
    isBusy = false;
    winMessage.style.display = "none";
    winMessage.innerHTML = "";

    const base = levelConfigs[currentLevel] || { pairs: 8, time: 20 };
    let totalPairs = base.pairs + extraPairs;
    if (totalPairs > 10) totalPairs = 10;

    time = Math.max(10, base.time - timePenalty);
    timerDisplay.textContent = `Level ${currentLevel} - Time: ${time}s`;
    scoreDisplay.textContent = `Score: ${score}`;

    startTimer();
    generateCards(totalPairs);
  }

  function startTimer() {
    timer = setInterval(() => {
      time--;
      timerDisplay.textContent = `Level ${currentLevel} - Time: ${time}s`;
      if (time === 0) {
        clearInterval(timer);
        loseRound();
      }
    }, 1000);
  }

  function loseRound() {
    winMessage.textContent = "⏰ Time's up! Try again!";
    winMessage.style.display = "block";
    gameBoard.style.pointerEvents = "none";

    lossCount++;
    if (lossCount >= 3) {
      winMessage.textContent = "❌ Game Over! You lost 3 times.";
      gameOver = true;
      gameBoard.style.pointerEvents = "none";

      const retryBtn = document.createElement("button");
      retryBtn.textContent = "🔁 Try Again";
      styleButton(retryBtn);

      retryBtn.addEventListener("click", () => {
        resetGame();
        retryBtn.remove();
        startGame();
      });

      winMessage.appendChild(document.createElement("br"));
      winMessage.appendChild(retryBtn);
      return;
    }

    timePenalty += 5;
    extraPairs += 1;

    setTimeout(startGame, 2000);
  }

  function generateCards(pairCount) {
    const allColors = [
      "red", "yellow", "green", "pink", "orange", "gray",
      "blue", "purple", "brown", "lime"
    ];
    const neededColors = allColors.slice(0, pairCount);
    const colorPairs = [...neededColors, ...neededColors];
    colorPairs.sort(() => Math.random() - 0.5);

    gameBoard.innerHTML = "";
    const cards = [];

    colorPairs.forEach(color => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.color = color;
      card.dataset.state = "hidden";
      card.style.backgroundColor = "#241F3B";
      gameBoard.appendChild(card);
      cards.push(card);
    });

    isBusy = true;
    gameBoard.style.pointerEvents = "none";

    cards.forEach(card => {
      card.style.backgroundColor = card.dataset.color;
    });

    setTimeout(() => {
      cards.forEach(card => {
        card.style.backgroundColor = "#241F3B";
        card.dataset.state = "hidden";
        card.addEventListener("click", () => handleClick(card));
      });
      isBusy = false;
      gameBoard.style.pointerEvents = "auto";
    }, 1000);
  }

  function handleClick(card) {
    if (isBusy || card.dataset.state !== "hidden") return;
    if (flipped.length >= 2) return;

    card.style.backgroundColor = card.dataset.color;
    card.dataset.state = "flipped";
    flipped.push(card);

    if (flipped.length === 2) {
      isBusy = true;
      gameBoard.style.pointerEvents = "none";
      const [first, second] = flipped;

      if (first.dataset.color === second.dataset.color) {
        first.dataset.state = "matched";
        second.dataset.state = "matched";
        matched.push(first, second);
        flipped = [];
        isBusy = false;
        gameBoard.style.pointerEvents = "auto";

        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;

        if (matched.length === gameBoard.children.length) {
          clearInterval(timer);

          // ✅ Game finished
          if (currentLevel === 3) {
            winMessage.textContent = "🏆 You finished all levels! Well done!";
            winMessage.style.display = "block";
            gameOver = true;
            gameBoard.style.pointerEvents = "none";

            const retryBtn = document.createElement("button");
            retryBtn.textContent = "🔁 Play Again";
            styleButton(retryBtn);

            retryBtn.addEventListener("click", () => {
              resetGame();
              retryBtn.remove();
              startGame();
            });

            winMessage.appendChild(document.createElement("br"));
            winMessage.appendChild(retryBtn);
          } else {
            winMessage.textContent = "🎉 You Win! Next level coming...";
            winMessage.style.display = "block";
            extraPairs = 0;
            timePenalty = 0;
            lossCount = 0;
            currentLevel = Math.min(currentLevel + 1, 3);
            setTimeout(startGame, 2500);
          }
        }
      } else {
        setTimeout(() => {
          first.style.backgroundColor = "#241F3B";
          second.style.backgroundColor = "#241F3B";
          first.dataset.state = "hidden";
          second.dataset.state = "hidden";
          flipped = [];
          isBusy = false;
          gameBoard.style.pointerEvents = "auto";

          score = Math.max(0, score - 5);
          scoreDisplay.textContent = `Score: ${score}`;
        }, 800);
      }
    }
  }

  function resetGame() {
    score = 0;
    lossCount = 0;
    gameOver = false;
    currentLevel = 1;
    timePenalty = 0;
    extraPairs = 0;
    winMessage.style.display = "none";
  }

  function styleButton(btn) {
    btn.style.marginTop = "15px";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "16px";
    btn.style.borderRadius = "10px";
    btn.style.backgroundColor = "#241F3B";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
  }
});

