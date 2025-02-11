from typing import Optional

from model.chat import Chat
from model.hangmangame import HangmanGame
from model.player import Player

class SessionSettings:
    max_guesses: int
    allow_new_players: bool

    def __init__(self, max_guesses: int, allow_new_players: bool):
        self.max_guesses = max_guesses
        self.allow_new_players = allow_new_players

class GameSession:
    session_id: str
    creator: Player
    players: set[Player]
    settings: SessionSettings
    chat: Chat
    game: Optional[HangmanGame]
    turn_order: list[Player]
    current_player: Player

    def __init__(self, session_id: str, creator: Player, settings: SessionSettings):
        self.session_id = session_id
        self.creator = creator
        self.players = {creator}
        self.settings = settings
        self.chat = Chat()
        self.game = None
        self.turn_order = list(self.players)
        self.current_player = self.turn_order[0]

    def __eq__(self, other):
        return self.session_id == other.session_id

    def __hash__(self):
        return hash(self.session_id)

    def add_player(self, player: Player) -> bool:
        if player in self.players:
            return False
        elif not self.settings.allow_new_players:
            return False
        else:
            self.players.add(player)
            self.turn_order.append(player)
            return True

    def remove_player(self, player: Player) -> bool:
        if player == self.creator:
            return False
        elif player not in self.players and player not in self.turn_order:
            return False
        else:
            self.players.remove(player)
            if self.current_player == player:
                self.skip_current_turn()
            self.turn_order.remove(player)
            return True

    def next_turn(self) -> None:
        self.current_player = self.turn_order[(self.turn_order.index(self.current_player) + 1) % len(self.turn_order)]

    def skip_current_turn(self) -> None:
        self.next_turn()
