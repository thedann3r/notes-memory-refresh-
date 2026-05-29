from flask import Flask, jsonify, request
from models import db, Notes, Users
from flask_restful import Resource, Api
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt

# app = Flask(__name__)
# api = Api(app)
bcrypt = Bcrypt()

class Note(Resource):
    # def get(self, id = None):

    #     if id:
    #         note = Notes.query.get(id)  

    #         if not note:
    #             return {"error": "Note not found!"}, 404
            
    #         return note.to_dict(), 200
    
    #     notes = Notes.query.all()
    #     return [note.to_dict() for note in notes], 200

    @jwt_required()
    def get(self):
        current_user = int(get_jwt_identity())

        notes = Notes.query.filter_by(user_id=current_user).all()
        return [note.to_dict() for note in notes], 200
    
    @jwt_required()
    def post(self):

        current_user = int(get_jwt_identity())

        data = request.get_json()
        new_note = Notes(
            title = data.get('title'),
            content = data.get('content'),
            user_id = current_user
        )
        db.session.add(new_note)
        db.session.commit()

        return new_note.to_dict(), 201
    
    @jwt_required()
    def patch(self, id):

        current_user = int(get_jwt_identity())

        # if current_user != id:
        #     return {"error": "Unauthorized!"}, 403
        
        note = Notes.query.get(id)

        if not note or note.user_id != current_user:
            return {"error": "Note not found!"}, 404
        
        data = request.get_json() or {}

        if "title" in data:
            note.title = data.get('title')

        if "content" in data:
            note.content = data.get('content')

        db.session.commit()

        return note.to_dict(), 200
    @jwt_required()
    def delete(self, id):

        current_user = int(get_jwt_identity())

        note = Notes.query.get(id)

        if not note or note.user_id != current_user:
            return{"error": "Note not found!"}, 404
        
        db.session.delete(note)
        db.session.commit()

        return {"message": "Note deleted successfully!"}, 200   
    

class User(Resource):

    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()

        user = Users.query.get(current_user)
        if not user:
            return {"error": "User not found!"}, 404
        
        return user.to_dict(), 200
    
        # if id:
        #     user = Users.query.get(id)
        #     if not user:
        #         return {"error": "User not found!"}, 404
            
        #     return user.to_dict(), 200
        
        # users = Users.query.all()

        # return [user.to_dict() for user in users], 200
 
    @jwt_required()
    def patch(self):
        current_user = get_jwt_identity()

        # if current_user != id:
        #     return {"error": "Unauthorized!"}, 403
        
        user = Users.query.get(current_user)

        if not user:
            return {"error": "User not found!"}, 404
        
        data = request.get_json() or {}

        if "name" in data:
            user.name = data.get('name')

        if "email" in data:
            user.email = data.get('email')

        # if "password" in data:
        #     user.password = data.get('password')

        new_password = data.get("new_password")

        if new_password is not None:
            if not new_password.strip():
                return {"error": "New password cannot be empty"}, 400

            current_password = data.get("current_password")
            if not current_password:
                return {"error": "Current password is required"}, 400

            if not bcrypt.check_password_hash(user.password, current_password):
                return {"error": "Incorrect current password"}, 401

            user.password = bcrypt.generate_password_hash(new_password).decode("utf-8")

        db.session.commit()

        return user.to_dict(), 200
    
    

        
