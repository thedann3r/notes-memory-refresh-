from flask import Flask, jsonify, request
from models import db, Notes, Users
from flask_restful import Resource, Api

# app = Flask(__name__)
# api = Api(app)

class Note(Resource):
    def get(self, id = None):

        if id:
            note = Notes.query.get(id)  

            if not note:
                return {"error": "Note not found!"}, 404
            
            return note.to_dict(), 200
    
        notes = Notes.query.all()
        return [note.to_dict() for note in notes], 200
    
    def post(self):
        data = request.get_json()
        new_note = Notes(
            title = data.get('title'),
            content = data['content'],
            user_id = data['user_id']
        )
        db.session.add(new_note)
        db.session.commit()

        return new_note.to_dict(), 201
    
    def patch(self, id):
        note = Notes.query.get(id)

        if not note:
            return {"error": "Note not found!"}, 404
        
        data = request.get_json()

        if "title" in data:
            note.title = data['title']

        if "content" in data:
            note.content = data.get('content')

        db.session.commit()

        return note.to_dict(), 200
    
    def delete(self, id):
        note = Notes.query.get(id)

        if not note:
            return{"error": "Note not found!"}, 404
        
        db.session.delete(note)
        db.session.commit()

        return {"message": "Note deleted successfully!"}, 200   
    

class User(Resource):
    def get(self, id = None):

        if id:
            user = Users.query.get(id)
            if not user:
                return {"error": "User not found!"}, 404
            
            return user.to_dict(), 200
        
        users = Users.query.all()

        return [user.to_dict() for user in users], 200
    
    def post(self):
        data = request.get_json()
        new_user = Users(
            name = data.get('name'),
            email = data['email'],
            password = data.get('password')
        )

        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict(), 201
    
    def patch(self, id):
        user = Users.query.get(id)

        if not user:
            return {"error": "User not found!"}, 404
        
        data = request.get_json()

        if "name" in data:
            user.name = data.get('name')

        if "email" in data:
            user.email = data['email']

        if "password" in data:
            user.password = data.get('password')

        db.session.commit()

        return user.to_dict(), 200
    
    def delete(self, id):
        user = User.query.get(id)

        if not user:
            return {"error": "user not found!"}, 404
        
        db.session.delete(user)
        db.session.commit()

        return {"message": "user deleted successfully!"}, 200
    

        
