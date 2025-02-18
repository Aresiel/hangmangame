from flask import Blueprint, request

import helpers
from model.gamesession import SessionSettings, GameSession
from model.player import Player

session_controller = Blueprint('session_controller', __name__)

sessions: set[GameSession] = set()


def __get_session__(session_id: str):
    return next((s for s in sessions if s.session_id == session_id), None)


@session_controller.post("/session/create")
def create_session():
    """Create a new session and join it as the creator. Returns the session id and the creator's id and name."""
    creator_name = str(request.json['creator_name'])
    creator_id = helpers.random_id()
    max_guesses = int(request.json['settings']['max_guesses'])
    allow_new_players = bool(request.json['settings']['allow_new_players'])

    creator = Player(creator_id, creator_name)
    settings = SessionSettings(max_guesses, allow_new_players)

    session_id = helpers.random_id()
    session = GameSession(session_id, creator, settings)

    if session in sessions:
        raise ValueError("Session already exists")

    sessions.add(session)
    return {
        "session_id": session_id,
        "creator": {
            "id": creator_id,
            "name": creator_name
        }
    }


@session_controller.post("/session/join")
def join_session():
    """Join an existing session as a player. Returns the session id and the player's id and name."""
    session_id = str(request.json['session_id'])
    player_name = str(request.json['player_name'])

    session = __get_session__(session_id)
    if session is None:
        return "Session not found", 404

    if not session.settings.allow_new_players:
        return "Session does not allow new players", 403

    player_id = helpers.random_id()
    player = Player(player_id, player_name)

    session.add_player(player)
    return {
        "session_id": session_id,
        "player": {
            "id": player_id,
            "name": player_name
        }
    }


@session_controller.put("/session/settings")
def update_settings():
    """Update the settings of an existing session. Only the creator is able to update the settings."""
    raise NotImplementedError()


@session_controller.post("/session/kick")
def kick_player():
    """Kick a player from an existing session. Only the creator is able to kick players."""
    # The game may need to be informed that a player has been kicked somehow.
    raise NotImplementedError()


@session_controller.post("/session/leave")
def leave_session():
    """Leave an existing session. If the creator leaves the session, a new creator must be chosen, if no players remain the session is discarded."""
    # The game may need to be informed that a player has left somehow.
    raise NotImplementedError()


@session_controller.get("/session/<session_id>")
def get_session(session_id: str):
    """Get the information of an existing session. This includes the session's settings, whether a game is in progress, the turn order, the current player."""
    raise NotImplementedError()
