![memory_game_adults_emoji](https://github.com/user-attachments/assets/3b9bf3d0-93c7-4068-8fb8-587cf254cba4)
# memory-game
A fun and simple memory-matching game built with HTML, CSS, and JavaScript. The goal is to match all the emoji pairs as quickly as possible!
##  How to Play
1. Click the "Start" or refresh the page to begin.
2. Flip two cards at a time.
3. If they match, they stay visible.
4. If not, they flip back after a short delay.
5. Match all the pairs to win
 ##  Why I Chose This Game 
ame
I enjoy games that test concentration and memory
##  Technologies Used
- HTML
- CSS (Flexbox layout)
- JavaScript (DOM, logic, event handling)
 ## Win Condition
There is no losing in the game, but the challenge is to complete it quickly and with fewer moves. A win message appears when all pairs are matched.
 ## Pseudocode
START

// 1. Setup cards
CREATE emojiCards array with pairs of emojis (each emoji appears twice)
SHUFFLE emojiCards randomly

// 2. Render cards on the page
FOR each emoji in emojiCards
    CREATE a card element
    SET card's data-value to emoji
    SHOW card back (hide emoji)
    ADD card element to the game board
END FOR

// 3. Initialize game state
SET flippedCards to empty list
SET matchedPairs to 0
SET totalPairs to number of emoji pairs

// 4. On card click event
WHEN user clicks a card:
 IF card is already matched OR already flipped THEN
        IGNORE click
    ELSE
        FLIP card face-up (show emoji)
        ADD card to flippedCards list
        IF flippedCards contains 2 cards THEN
         DISABLE clicks on other cards temporarily
         IF emoji of flippedCards[0] EQUALS emoji of flippedCards[1] THEN
          MARK both cards as matched
           INCREMENT matchedPairs by 1
            CLEAR flippedCards list
             ENABLE clicks again
         IF matchedPairs EQUALS totalPairs THEN
             DISPLAY "You Win!" message
               SHOW restart button
            ELSE
                WAIT for short delay ( 1 second)
                FLIP both cards back face-down
                CLEAR flippedCards list
                ENABLE clicks again

// 5. Restart game
WHEN restart button clicked:
    RESET matchedPairs to 0
    CLEAR flippedCards list
    SHUFFLE emojiCards
    RERENDER all cards face-down

END
