from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, Notes
from flask_restful import Resource, Api
from resources.crud import Note

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# initialize database first
db.init_app(app)

# then migrations
migrate = Migrate(app, db)

api = Api(app)
CORS(app)

@app.route("/")
def index():
    return "Hello, Dann is refreshing his memory on Flask and React!"

api.add_resource(Note, "/notes", "/notes/<int:id>")

if __name__ == "__main__":
    app.run(debug=True)