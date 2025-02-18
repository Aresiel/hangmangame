from flask import Blueprint

chat_controller = Blueprint('chat_controller', __name__)

@chat_controller.post("/session/<session_id>/chat/send")
def send_message(session_id: str):
    """Send a message in the chat of the session with the given id. The player must be a member of the session."""
    """ Example request body:
    {
      "player_id": "def456",
      "message": "Hello, everyone!"
    }
    """
    raise NotImplementedError()

@chat_controller.get("/session/<session_id>/chat")
def get_chat(session_id: str):
    """Get the chat messages of the session with the given id."""
    raise NotImplementedError()