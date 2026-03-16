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
            title = data.get("title"),
            content = data["content"]
        )
        db.session.add(new_note)
        db.session.commit()

        return new_note.to_dict(), 201
