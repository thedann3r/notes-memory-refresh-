from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Notes(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(50), nullable = False)
    content = db.Column(db.Text, nullable = True)
    created_at = db.Column(db.DateTime, default = db.func.current_timestamp())