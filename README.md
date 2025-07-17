![951518](https://github.com/user-attachments/assets/f4691b4a-3d6e-4365-ac87-1fc293573292)
<img width="935" height="437" alt="Screenshot 2025-07-17 10 02 05" src="https://github.com/user-attachments/assets/429aee2a-d0a5-4c10-a985-8698419411c1" />

# memory-game
Introduction

The Memory game is a classic card-matching game where the player flip two cards at a time to try to find matching pairs. The goal is to match all pairs with the fewest moves possible. This game strengthens logic skills and reinforces DOM manipulation in JavaScript.
   
 ##  Why I Chose This Game 
I enjoy games that test memory

 **Play the game here**: ([https://your-username.github.io/memory-game/](https://kindly-force.surge.sh/))  



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

START GAME
- Player picks emojis, clicks Start → hide start, show game
- level = 1, score = 0, lossCount = 0
- call setupLevel(level)

SETUP LEVEL(level):
- Determine pairCount & timeLimit
- Prepare emoji pairs, shuffle, render cards
- Briefly reveal all cards, then hide
- Start timer, enable card clicks

ON CARD CLICK(card):
- If busy or flipped/matched, ignore
- Flip card, add to flippedList
- If two flipped:
    - busy = true
    - If match:
        • mark matched, score++, play “match” sound
    - Else:
        • wait, flip back, score--, play “wrong” sound
    - Clear flippedList, busy = false
- call checkStatus()

CHECK STATUS:
- If all matched:
    - If level == 3: win game
    - Else: level++, setupLevel(level)
- If timer hits zero:
    - lossCount++
    - If lossCount == 3: game over

RESET GAME:
- Reset score, level, lossCount, gameOver flag
- Show start screen



 
## future enhancements
Timer & Score System – Track how fast the player wins and count the number of moves.

Two-Player Mode – Let two players take turns and compete for the best score.
