![951518](https://github.com/user-attachments/assets/f4691b4a-3d6e-4365-ac87-1fc293573292)

# memory-game
-Introduction
The Memory game is a classic card-matching game where the player flip two cards at a time to try to find matching pairs. The goal is to match all pairs with the fewest moves possible. This game strengthens logic skills and reinforces DOM manipulation in JavaScript.
##  How to Play
1. Click the "Start" or refresh the page to begin.
2. Flip two cards at a time.
3. If they match, they stay visible.
4. If not, they flip back after a short delay.
5. Match all the pairs to win
 ##  Why I Chose This Game 
I enjoy games that test concentration and memory
##  Minimum Requirements
-HTML,CSS (Flexbox layout)
  A grid of face-down cards
  Clear instructions somewhere on the screen
-JavaScript (DOM, logic, event handling)
When the player clicks a cards, it flips and shows its image
The player can flip two cards at a time
If the two cards match, they stay face-up and can't be clicked again
Once all card pairs are matched, display message in HTML like : "You win" or also "Play again"
## pseudocode 
1.Set up game board:Create an array of card objects (each image appears twice)
Shuffle the card array
For each card:
    Create a card element
    Add front and back faces
    Add click event listener to flip the card
    Append to the game board

2.Track game state: flippedCards = []      // Max 2 cards at a time
matchedCards = []      // Store matched cards
isBusy = false          // Prevent interaction while checking

3.Card click logic:If is Busy or card already matched or flipped:return Flip the card
Add it to flippedCards

If flippedCards has 2 cards:
    isBusy = true
    Wait 1 second
    If the two cards match:
        Keep them flipped
        Add to matchedCards
    Else:
        Flip them back down
    Clear flippedCards
    isBusy = false

4.Check for win:If matchedCards.length equals total cards:Show win message

5.Reset game:Clear board Shuffle cards againReset all variables Recreate and render cards
