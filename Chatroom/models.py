from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
	user_id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(48), nullable=False)
	email = db.Column(db.String(120), nullable=False)
	pw = db.Column(db.String(64), nullable=False)

	def __init__(self, username, email, pw):
		self.username = username
		self.email = email
		self.pw = pw

class Chatroom(db.Model):
	chatroom_id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(48), nullable=False)

	def __init__(self, name):
		self.name = name

class Message(db.Model):
	msg_id = db.Column(db.Integer, primary_key=True)
	author = db.Column(db.String(48), nullable=False)
	contents = db.Column(db.String(1024), nullable=False)
	chatroom = db.Column(db.Integer, nullable=False)

	def __init__(self, author, contents, chatroom):
		self.author = author
		self.contents = contents
		self.chatroom = chatroom

	def as_dict(self):
		return {'author': self.author, 'contents': self.contents}
