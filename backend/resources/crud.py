from flask import Flask, jsonify, request
from models import db, Notes
from flask_restful import Resource, Api

# app = Flask(__name__)
# api = Api(app)

class Note(Resource):
    def get(self):
        notes = Notes.query.all()
        return [note.to_dict() for note in notes], 200
    
    def post(self):
        data = request.get_json()
        new_note = Notes(
            title = data.get('title'),
            content = data['content']
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

        
