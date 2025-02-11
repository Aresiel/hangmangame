from dataclasses import dataclass
from datetime import datetime

from model.player import Player

@dataclass(frozen=True)
class ChatMessage:
    player: Player
    content: str
    timestamp: datetime = datetime.now()


class Chat:
    messages: list[ChatMessage]

    def __init__(self):
        self.messages = []

    def send_message(self, player: Player, content: str) -> None:
        self.messages.append(ChatMessage(player, content))

    def get_messages(self, limit = -1) -> list[ChatMessage]:
        return self.messages[-limit:] if limit > 0 else self.messages