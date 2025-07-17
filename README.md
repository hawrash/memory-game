![951518](https://github.com/user-attachments/assets/f4691b4a-3d6e-4365-ac87-1fc293573292)
<img width="724" height="435" alt="Screenshot 2025-07-15 15 46 18" src="https://github.com/user-attachments/assets/583d2ce3-83fd-4f1a-8744-7c06a6fe9b7a" />

# memory-game
Introduction

The Memory game is a classic card-matching game where the player flip two cards at a time to try to find matching pairs. The goal is to match all pairs with the fewest moves possible. This game strengthens logic skills and reinforces DOM manipulation in JavaScript.
##  How to Play
1. Choose the emoji you want .
2.  Click the "Start" .
3. Flip two cards at the same time.
4. If they match, they stay visible.
5. If not, they flip back after a short delay.
6. Match all the pairs to win .
   
 ##  Why I Chose This Game 
I enjoy games that test concentration and memory

 **Play the game here**: [https://your-username.github.io/memory-game/](https://kindly-force.surge.sh/))  



##  Minimum Requirements
1. HTML & CSS

A grid of face-down cards using Flexbox

Clear instructions visible on the screen

2. JavaScript

When a player clicks a card, it flips and reveals its emoji

Two cards can be flipped at a time

If the cards match, they remain face-up and become unclickable

When all pairs are matched, display a message in the HTML like:

✅ "You win!"

🔄 "Play again" button

3. DOM Manipulation  

4. Git + GitHub
  
## pseudocode  


1. SET UP GAME BOARD
----------------------
- On game start:
  - Hide start screen
  - Show game screen
  - Load level configuration (pairs and time)
  - Calculate total pairs with extra difficulty
  - Shuffle emoji array with selected pairs (each emoji appears twice)
  - For each emoji in the shuffled list:
      - Create a card element with front (emoji) and back (🌟)
      - Set card state to "hidden"
      - Add to game board
  - Briefly flip all cards (2 seconds), then flip back
  - Add click event listener to each card


2. TRACK GAME STATE
----------------------
- Define:
  - flippedCards = []        // to hold up to 2 flipped cards
  - matchedCards = []        // store matched cards
  - isBusy = false           // lock clicks while checking
  - score = 0
  - time = levelTime - penalty
  - lossCount = 0
  - gameOver = false


3. CARD CLICK LOGIC
----------------------
- On card click:
  - If isBusy or card is already flipped/matched → ignore
  - Flip the card and mark as "flipped"
  - Add card to flippedCards

  - If two cards are flipped:
      - Set isBusy = true
      - If the two emojis match:
          - Mark both as "matched"
          - Add to matchedCards
          - Increase score
      - Else:
          - Flip both cards back after delay
          - Subtract score
      - Clear flippedCards
      - Set isBusy = false


4. CHECK FOR WIN
----------------------
- After each successful match:
  - If matchedCards.length equals total number of cards:
      - If current level is 3:
          - Show "You Win!" message
          - Play win sound
          - Offer replay button
      - Else:
          - Show "Next level" message
          - Increase level
          - Reset penalties
          - Start next level after delay


5. RESET GAME
----------------------
- On game over or replay:
  - Reset:
    - score = 0
    - currentLevel = 1
    - timePenalty = 0
    - extraPairs = 0
    - lossCount = 0
    - gameOver = false
  - Start game from level 1

 
## future enhancements
Timer & Score System – Track how fast the player wins and count the number of moves.

Two-Player Mode – Let two players take turns and compete for the best score.
