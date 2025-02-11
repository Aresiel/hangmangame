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
    session_id = str(request.json['session_id'])
    player_name = str(request.json['player_name'])

    session = __get_session__(session_id)
    if session is None:
        return "Session not found", 404

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

