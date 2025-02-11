from flask import Flask

from controller.sessioncontroller import session_controller

app = Flask(__name__)

app.register_blueprint(session_controller)