from Flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from models import db

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

migrate = Migrate(app,db)
CORS(app)

@app.route("/")
def index():
    return "Hello, Dann is refreshing his memory on Flask and SQLAlchemy!"

if __name__ =="__main__":
    app.run(debug = True)