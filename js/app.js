document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const gameBoard = document.getElementById("game-board");
  const timerDisplay = document.getElementById("timer");
  const scoreDisplay = document.getElementById("score");
  const startBtn = document.getElementById("start-btn");
  const winMessage = document.getElementById("win-message");
  const progressBar = document.getElementById("progress-bar");

  const gameMusic = new Audio("./js/assets/audio/game.mp3");
  const winSound = new Audio("./js/assets/audio/win.mp3");
  const loseSound = new Audio("./js/assets/audio/lose.mp3");
  

  gameMusic.loop = true;
  gameMusic.volume = 0.5;
  winSound.volume = 0.5;
  loseSound.volume = 0.6;
  

  let currentLevel = 1;
  let timePenalty = 0;
  let extraPairs = 0;
  let score = 0;
  let lossCount = 0;
  let gameOver = false;

  const levelConfigs = {
    1: { pairs: 3, time: 60 },
    2: { pairs: 6, time: 50 },
    3: { pairs: 8, time: 40 },
  };

  let time;
  let timer;
  let flipped = [];
  let matched = [];
  let isBusy = false;

  const allEmojis = ["🥑", "🍐", "🍇", "🍓", "🍒", "🍑", "🥝", "🥭", "🍍", "🍏"];

  startBtn.addEventListener("click", () => {
    if (!gameOver) {
      try { gameMusic.play(); } catch (err) {}
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
    gameBoard.style.pointerEvents = "auto";

    const base = levelConfigs[currentLevel] || { pairs: 8, time: 40 };
    let totalPairs = base.pairs + extraPairs;
    if (totalPairs > 10) totalPairs = 10;

    time = Math.max(10, base.time - timePenalty);
    timerDisplay.textContent = `Level ${currentLevel} - Time: ${time}s`;
    scoreDisplay.textContent = `Score: ${score}`;
    progressBar.style.width = "100%";

    startTimer();
    generateCards(totalPairs);
  }

  function startTimer() {
    const maxTime = levelConfigs[currentLevel].time - timePenalty;
    timer = setInterval(() => {
      time--;
      timerDisplay.textContent = `Level ${currentLevel} - Time: ${time}s`;
      progressBar.style.width = (time / maxTime) * 100 + "%";
      if (time === 0) {
        clearInterval(timer);
        loseRound();
      }
    }, 1000);
  }

  function loseRound() {
    winMessage.textContent = "⏰ Time's up!";
    winMessage.style.display = "block";
    gameBoard.style.pointerEvents = "none";
    lossCount++;
    if (lossCount >= 3) {
      try { loseSound.play(); } catch (e) {}
      winMessage.textContent = "❌ Game Over! You lost 3 times.";
      gameOver = true;
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
    const selected = allEmojis.slice(0, pairCount);
    const emojis = [...selected, ...selected];
    emojis.sort(() => Math.random() - 0.5);
    gameBoard.innerHTML = "";
    const cards = [];
    emojis.forEach(emoji => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.emoji = emoji;
      card.dataset.state = "hidden";
      const front = document.createElement("div");
      front.className = "front";
      front.textContent = emoji;
      const back = document.createElement("div");
      back.className = "back";
      back.textContent = "🌟";
      card.appendChild(front);
      card.appendChild(back);
      gameBoard.appendChild(card);
      cards.push(card);
    });
    cards.forEach(card => card.classList.add("flipped"));
    isBusy = true;
    gameBoard.style.pointerEvents = "none";
    setTimeout(() => {
      cards.forEach(card => {
        card.classList.remove("flipped");
        card.dataset.state = "hidden";
        card.addEventListener("click", () => handleClick(card));
      });
      isBusy = false;
      gameBoard.style.pointerEvents = "auto";
    }, 2000);
  }

  function handleClick(card) {
    if (isBusy) return;
    if (card.dataset.state !== "hidden") return;
    if (flipped.length >= 2) return;
    card.classList.add("flipped");
    card.dataset.state = "flipped";
    flipped.push(card);
    if (flipped.length === 2) {
      isBusy = true;
      gameBoard.style.pointerEvents = "none";
      const [first, second] = flipped;
      if (first.dataset.emoji === second.dataset.emoji) {
        handleMatch(first, second);
      } else {
        try { wrongSound.play(); } catch (e) {}
        setTimeout(() => {
          first.classList.remove("flipped");
          second.classList.remove("flipped");
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

  function handleMatch(first, second) {
    try { matchSound.play(); } catch (e) {}
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
      if (currentLevel === 3) {
        try { winSound.play(); } catch (e) {}
        winMessage.textContent = "🏆 You Win!";
        winMessage.style.display = "block";
        gameOver = true;
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
        winMessage.textContent = " Next level coming...";
        winMessage.style.display = "block";
        extraPairs = 0;
        timePenalty = 0;
        lossCount = 0;
        currentLevel++;
        setTimeout(startGame, 2500);
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

