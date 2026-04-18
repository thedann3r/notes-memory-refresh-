from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class Users(db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), nullable = False)
    email = db.Column(db.String(120), nullable = False, unique = True)
    password = db.Column(db.String(120), nullable = False)

    notes = db.relationship("Notes", back_populates = "user", cascade = "all, delete-orphan")

    serialize_rules = ("-password", "-notes.user")

class Notes(db.Model, SerializerMixin):
    __tablename__ = "notes"
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(50), nullable = False)
    content = db.Column(db.Text, nullable = True)
    created_at = db.Column(db.DateTime, default = db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)

    user = db.relationship("Users", back_populates = "notes")

    serialize_rules = ("-user.notes",)




