from flask import Flask, jsonify, request
from datetime import timedelta
from dotenv import load_dotenv
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, Notes, Users
from flask_restful import Resource, Api
from resources.crud import Note, User
from flask_bcrypt import Bcrypt
import re
import datetime
# import secrets
import requests
from jwt import decode
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
import os
from email_utility import send_password_reset_email
from flask_mail import Mail, Message
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, create_refresh_token

load_dotenv(override=True)

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default_secret_key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes = 15)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days = 7)


app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.getenv('EMAIL_USER')
app.config["MAIL_PASSWORD"] = os.getenv('EMAIL_PASS')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('EMAIL_USER')

mail = Mail(app)

EMAIL_VALIDATION_API_KEY = os.getenv("EMAIL_VALIDATION_API_KEY")
EMAIL_VALIDATION_API_URL = os.getenv("EMAIL_VALIDATION_API_URL")

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

def is_valid_email(email):
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))


def is_strong_password(password):
    return bool(
        re.match(
            r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$",
            password
        )
    )


def is_real_email(email):
    try:
        response = requests.get(
            f"{EMAIL_VALIDATION_API_URL}?email={email}&api_key={EMAIL_VALIDATION_API_KEY}"
        )

        data = response.json()

        return (
            response.status_code == 200 and
            data.get("data", {}).get("result") == "deliverable"
        )

    except Exception:
        return False

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

        if not is_valid_email(email):
            return {"error": "Invalid email format"}, 400

        if not is_strong_password(password):
            return {"error": "Password must be at least 8 characters long and contain both letters and numbers"}, 400

        if not is_real_email(email):
            return {"error": "This email address is not valid"}, 400

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

        access_token = create_access_token(identity=str(new_user.id))
        refresh_token = create_refresh_token(identity=str(new_user.id))
        return {
            "message": "User created successfully!",
            "access_token": access_token,
            "refresh_token": refresh_token,
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
            access_token = create_access_token(identity=str(user.id))
            refresh_token = create_refresh_token(identity=str(user.id))
            return{
                "message":"Login successfully",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user":{
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
            }, 200
        
        return {"error": "Invalid email or password!"}, 401
    
class DeleteAcc(Resource):
    @jwt_required()
    def delete(self):
        # JWT identity = user_id (as you set in login/signup)
        current_user = get_jwt_identity()

        user = Users.query.get(current_user)
        if not user:
            return {'error': 'User does not exist!'}, 404

        # hard delete
        db.session.delete(user)
        db.session.commit()

        return {'message': 'Account deleted successfully!'}, 200
    
class RefreshToken(Resource):
    @jwt_required(refresh=True)
    def post(self):
        user_id = get_jwt_identity()

        new_access_token = create_access_token(identity=user_id)

        return {
            "access_token": new_access_token
        }, 200
        
class ForgotPassword(Resource):
    def post(self):
        data = request.get_json() or {}

        email = data.get("email")

        if not email:
            return {"error": "Email is required"}, 400

        user = Users.query.filter_by(email=email).first()

        if not user:
            return {"error": "User with that email not found"}, 404

        expires = datetime.timedelta(minutes=15)

        reset_token = create_access_token(
            identity=str(user.id),
            additional_claims={"email": user.email},
            expires_delta=expires
        )

        reset_link = (
            f"http://localhost:5173/reset-password?token={reset_token}"
        )

        send_password_reset_email(
            user.name,
            user.email,
            reset_link
        )

        return {
            "message": "Password reset link sent to your email."
        }, 200

class ResetPassword(Resource):
    def post(self):
        data = request.get_json() or {}

        token = data.get("token")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        if not token:
            return {"error": "Token is required"}, 400

        if not new_password:
            return {"error": "New password is required"}, 400

        if not confirm_password:
            return {"error": "Confirm password is required"}, 400

        if new_password != confirm_password:
            return {"error": "Passwords do not match"}, 400

        try:
            payload = decode(
                token,
                app.config["JWT_SECRET_KEY"],
                algorithms=["HS256"]
            )

            user_id = payload["sub"]

            user = Users.query.get(user_id)

            if not user:
                return {"error": "User not found"}, 404

            user.password = bcrypt.generate_password_hash(
                new_password
            ).decode("utf-8")

            db.session.commit()

            return {
                "message": "Password reset successful"
            }, 200

        except ExpiredSignatureError:
            return {"error": "Token has expired"}, 400

        except InvalidTokenError:
            return {"error": "Invalid token"}, 400

        except Exception as e:
            print("Reset error:", e)
            return {"error": "Something went wrong"}, 500
        
api.add_resource(Note, "/notes", "/notes/<int:id>")
api.add_resource(User, "/users", "/users/<int:id>")
api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")
api.add_resource(RefreshToken, "/refresh")
api.add_resource(DeleteAcc, "/delete-account")
api.add_resource(ForgotPassword, "/forgot-password")
api.add_resource(ResetPassword, "/reset-password")
if __name__ == "__main__":
    app.run(debug=True)
