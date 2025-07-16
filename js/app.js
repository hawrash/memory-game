document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const gameBoard = document.getElementById("game-board");
  const timerDisplay = document.getElementById("timer");
  const scoreDisplay = document.getElementById("score");
  const startBtn = document.getElementById("start-btn");
  const winMessage = document.getElementById("win-message");
  const progressBar = document.getElementById("progress-bar");
  const emojiOptions = document.getElementById("emoji-options");
  const emojiWarning = document.getElementById("emoji-warning");

  const gameMusic = new Audio("./js/assets/audio/game.mp3");
  const winSound = new Audio("./js/assets/audio/win.mp3");
  const loseSound = new Audio("./js/assets/audio/lose.mp3");
  const matchSound = new Audio("./js/assets/audio/match.mp3");
  const wrongSound = new Audio("./js/assets/audio/wrong.mp3");

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
    1: { pairs: 3, time: 40 },
    2: { pairs: 6, time: 30 },
    3: { pairs: 8, time: 20 },
  };

  let time;
  let timer;
  let flipped = [];
  let matched = [];
  let isBusy = false;
  let customEmojis = [];
  const selectedEmojis = new Set();

  const emojiPool = [
    "🐱", "🐶", "🦊", "🐻", "🐼", "🐯", "🦁", "🐸", "🐲", "👾",
    "🎃", "👻", "💀", "🌈", "⭐", "🍕", "🍔", "🍟", "🍩", "🍉",
    "🚀", "🛸", "⚽", "🏀", "🎮", "🎲", "🧩", "🎯", "💎", "🔮"
  ];

  emojiPool.forEach(emoji => {
    const btn = document.createElement("button");
    btn.textContent = emoji;
    btn.className = "emoji-btn";
    btn.style.fontSize = "24px";
    btn.style.padding = "10px";
    btn.style.borderRadius = "10px";
    btn.style.border = "2px solid #ccc";
    btn.style.backgroundColor = "white";
    btn.style.cursor = "pointer";

    btn.addEventListener("click", () => {
      if (selectedEmojis.has(emoji)) {
        selectedEmojis.delete(emoji);
        btn.style.backgroundColor = "white";
        btn.style.border = "2px solid #ccc";
      } else {
        selectedEmojis.add(emoji);
        btn.style.backgroundColor = "#4cafafc4";
        btn.style.border = "2px solid #4cafafc4";
      }
    });

    emojiOptions.appendChild(btn);
  });

  startBtn.addEventListener("click", () => {
    const inputList = Array.from(selectedEmojis);
    const { pairs } = levelConfigs[currentLevel] || { pairs: 8 };
    const required = Math.min(10, pairs + extraPairs);

    if (inputList.length < required) {
      emojiWarning.textContent = `⚠️ Please select at least ${required} unique emojis to start.`;
    } else {
      emojiWarning.textContent = "";
      customEmojis = inputList;

      if (!gameOver) {
        try { gameMusic.play(); } catch (err) {}
        startScreen.classList.remove("active");
        gameScreen.classList.add("active");
        startGame();
      }
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

    const { pairs, time: baseTime } = levelConfigs[currentLevel] || { pairs: 8, time: 40 };
    let totalPairs = Math.min(10, pairs + extraPairs);

    time = Math.max(10, baseTime - timePenalty);
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

  function generateCards(pairCount) {
    const selected = customEmojis.slice(0, pairCount);
    const cardsArray = [...selected, ...selected];
    cardsArray.sort(() => Math.random() - 0.5);

    gameBoard.innerHTML = "";
    const cards = [];

    cardsArray.forEach(emoji => {
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
    const isCardBusy = isBusy;
    const isCardNotHidden = card.dataset.state !== "hidden";
    const isTwoCardsFlipped = flipped.length >= 2;
    if (isCardBusy) return;
    if (isCardNotHidden) return;
    if (isTwoCardsFlipped) return;

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
        showEndButton("🔁 Play Again");
        gameOver = true;
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

  function loseRound() {
    winMessage.textContent = "⏰ Time's up!";
    winMessage.style.display = "block";
    gameBoard.style.pointerEvents = "none";
    lossCount++;

    if (lossCount >= 3) {
      try { loseSound.play(); } catch (e) {}
      winMessage.textContent = "❌ Game Over! You lost 3 times.";
      showEndButton("🔁 Try Again");
      gameOver = true;
      return;
    }

    timePenalty += 5;
    extraPairs += 1;
    setTimeout(startGame, 2000);
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

  function showEndButton(text) {
    const retryBtn = document.createElement("button");
    retryBtn.textContent = text;
    styleButton(retryBtn);
    retryBtn.addEventListener("click", () => {
      resetGame();
      retryBtn.remove();
      startScreen.classList.add("active");
      gameScreen.classList.remove("active");
    });
    winMessage.appendChild(document.createElement("br"));
    winMessage.appendChild(retryBtn);
    winMessage.style.display = "block";
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
