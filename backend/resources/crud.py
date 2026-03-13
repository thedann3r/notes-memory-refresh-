from flask import Flask, jsonify, request
from models import Notes
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class Note(Resource):
    def get(self):
        notes = Notes.query.get.all()
        return[note.to_dict() for note in notes], 200
