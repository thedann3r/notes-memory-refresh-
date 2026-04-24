from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, Notes, Users
from flask_restful import Resource, Api
from resources.crud import Note, User
from flask_bcrypt import Bcrypt
import re
import os
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, create_refresh_token

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY") or "dev-secret-key"

# initialize database first
db.init_app(app)

# then migrations
migrate = Migrate(app, db)

api = Api(app)
CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

@app.route("/")
def index():
    return "Hello, Dann is refreshing his memory on Flask and React!"

class Signup(Resource):
    def post(self):
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        # basic validation
        if not name or not email or not password or not confirm_password:
            return {"error": "All fields are required"}, 400

        # check duplicate email
        existing_user = Users.query.filter_by(email=email).first()
        if existing_user:
            return {"error": "Email already exists"}, 409

        # check password match
        if password != confirm_password:
            return {"error": "Passwords do not match!"}, 400

        # hash password (fixed variable name)
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        new_user = Users(
            name=name,
            email=email,
            password=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id)

        return {
            "message": "User created successfully!",
            "access_token": access_token,
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email
            }
        }, 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        # name = data['name']
        email = data.get('email')
        password = data.get('password')

        user = Users.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            create_token = create_access_token(identity = {'id': user.id, 'name': user.name, 'email': user.email})
            refresh_token = create_refresh_token(identity = {'id': user.id, 'name': user.name, 'email': user.email})

            return{
                "message":"Login successfully",
                "create_token": create_token,
                "refresh_token": refresh_token,
                "user":{
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
            }, 200
        
        return {"error": "Invalid email or password!"}, 401


api.add_resource(Note, "/notes", "/notes/<int:id>")
api.add_resource(User, "/users", "/users/<int:id>")
api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")

if __name__ == "__main__":
    app.run(debug=True)
