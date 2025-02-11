from dataclasses import dataclass


@dataclass
class Player:
    player_id: str
    name: str
    score: int = 0

    def __eq__(self, other):
        return self.player_id == other.player_id

    def __hash__(self):
        return hash(self.player_id)
