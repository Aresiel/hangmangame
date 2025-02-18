# How to start in development environment
Start the flask server with `uv tool run flask --app .\controller\main.py run --debug`.

# Specification-ish (More like notes)

The game should feature the following:
- The ability to create game "sessions" with accompanying creator players.
- The ability for the creator of a session to modify session settings.
- Session settings should include: 1) How many guesses are allowed per game. 2) Whether new players are allowed to join. 3) The turn order.
-  The creator of a session should be able to: 1) Kick players from the session, removing them from the turn order. This must be possible during games, if it is currently that player's turn, their turn must be skipped. 2) Skip the current player's turn.
- The ability for the creator of a session to "start" the session.
- The ability for players to join created sessions.
- The ability for players to choose player names.
- The ability for several players to use the same name.
- Each session has a chat attached, where all players are able to communicate.
- When the session is started, players take turns according to the specified turn order to host each individual game.
- When a game is started, the host picks the following: 1) The word to be guessed. 2) The accompanying hint. 3) The permitted letters to be guessed.
- After the host has picked the aforementioned, the remaining players take turns according to the specified turn order to guess letters. Each correctly guessed letter should award 1 point to the guesser. Each incorrectly guessed letter should subtract 1 point from the guesser.
- It should be possible for players to, instead of guessing a letter, attempt to guess the entire word. Should they guess correctly, they should be awarded 1 point for each remaining unique letter.
