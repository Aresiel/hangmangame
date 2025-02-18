from flask import Blueprint, session

game_controller = Blueprint('game_controller', __name__)


@game_controller.post("/session/<session_id>/game/start")
def start_game(session_id: str):
    """Start a game in the session with the given id. Only the player whose turn it currently is in the session is allowed to start a game."""
    """ Example request body:
    {
      "session_id": "abc123",
      "player_id": "def456",
      "word": "python",
      "hint": "A popular programming language"
    }
    """
    raise NotImplementedError()


@game_controller.post("/session/<session_id>/game/guess/letter")
def guess_letter(session_id: str):
    """Guess a letter in the current active game. Only the player whose turn it currently is in the game is allowed to make a guess."""
    """ Example request body:
    {
      "player_id": "def456",
      "letter": "a"
    }
    """
    raise NotImplementedError()


@game_controller.post("/session/<session_id>/game/guess/word")
def guess_word(session_id: str):
    """Guess the word in the current active game. Only the player whose turn it currently is in the game is allowed to make a guess."""
    """ Example request body:
    {
      "player_id": "def456",
      "word": "python"
    }
    """
    raise NotImplementedError()


@game_controller.get("/session/<session_id>/game")
def get_game(session_id: str):
    """Get the information of the current active game in the session with the given id. This includes the hint, the partially guessed word, the number of remaining guesses, the player whose turn it currently is."""
    raise NotImplementedError()
