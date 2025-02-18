from flask import Flask

from controller.sessioncontroller import session_controller
from controller.gamecontroller import game_controller

app = Flask(__name__)

app.register_blueprint(session_controller)
app.register_blueprint(game_controller)