
import time
import os
import json
from datetime import datetime
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack

from models import db, User, Chatroom, Message

# Create our app
app = Flask(__name__)

# Configuration
SECRET_KEY = 'development key'

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'chat.db')

app.config.from_object(__name__)

db.init_app(app)

# so db can be initialized via cmd line
@app.cli.command('initdb')
def initdb_command():
	"""Creates the database tables."""
	db.create_all()
	print('Initialized the database.')

# use this so I can access current user thru g variable
@app.before_request
def before_request():
	g.user = None
	if 'user_id' in session:
		g.user = User.query.filter_by(user_id=session['user_id']).first()

# Home page
@app.route('/', methods=['GET', 'POST'])
def home():
	if not g.user:
		return redirect(url_for('login'))

	# get all the chatrooms
	cr = Chatroom.query.all()
	error = None
	if request.method == 'POST':
		if not request.form['name']:
			error = "Please specify a name for your chatroom."
			return render_template('index.html', error=error, rooms=cr)
		else:
			name = request.form['name']
			db.session.add(Chatroom(name))
			db.session.commit()
			cr = Chatroom.query.all()
			return render_template('index.html', error=error, rooms=cr)
	return render_template('index.html', error=error, rooms=cr)


# Register functionality
@app.route('/register', methods=['GET', 'POST'])
def register():
	# if a user is logged in, redirect them to the homepage
	if g.user:
		return redirect(url_for('home'))
	error = None
	if request.method == 'POST':
		if not request.form['username']:
			error = "You must enter a username"
		elif not request.form['email']:
			error = "You must enter an email"
		elif not request.form['password']:
			error = "You must enter a password"
		else:
			db.session.add(User(request.form['username'], request.form['email'], request.form['password'], "user"))
			db.session.commit()
			return redirect(url_for("login"))
	return render_template("register.html", error=error)

# Login functionality
@app.route('/login', methods=['GET', 'POST'])
def login():
	#if a user is already logged in, redirect them to the homepage
	if g.user:
		return redirect(url_for('home'))
	error = None
	if request.method == 'POST':
		user = User.query.filter_by(username=request.form['username']).first()
		# if invalid user name
		if user is None:
			error = "Invalid Username or Password"
		# make sure password matches
		elif user.pw != request.form['password']:
			error = "Invalid Username orPassword"
			return redirect(url_for('login'))
		# if we pass these checks, we log in
		else:
			flash("Logged in successfully.")
			session['user_id'] = user.user_id
			return redirect(url_for('home'))
	return render_template("login.html", error=error)

# Logout
@app.route('/logout')
def logout():
	session.pop('user_id', None)
	return redirect(url_for('login'))


@app.route('/chatroom/<id>', methods=['GET', 'POST'])
def chatroom(id):
	if not g.user:
		return redirect(url_for('home'))

	if request.method == 'POST':
		if not request.form['msgs']:
			error = "Please enter some text to send a message."
			messages = Message.query.filter_by(chatroom=id).all()
			return render_template('chatroom.html', id=id, msgs=messages, error=error)

	messages = Message.query.filter_by(chatroom=id).all()
	return render_template('chatroom.html', id=id, msgs=messages)

@app.route('/delete_chatroom/<id>', methods=['GET', 'POST'])
def delete_chatroom(id):
	if not g.user:
		return redirect(url_for('login'))

	if not Chatroom.query.get(id):
		abort(404)
	chatroom = Chatroom.query.get(id)
	chatname = chatroom.name
	messages = Message.query.filter_by(chatroom=id).all()
	# for m in messages:
	# 	print(m.contents)
	db.session.delete(chatroom)
	for m in messages:
		db.session.delete(m)
	db.session.commit()
	flash(chatname + ' chatroom was deleted successfully.', 'success')
	return redirect(url_for('home'))

@app.route('/new_msg', methods=['POST'])
def new_msg():
	db.session.add(Message(request.form['username'], request.form['msg'], request.form['room']))
	db.session.commit()
	return ""

@app.route('/msgs/<id>', methods=['GET'])
def msgs(id):
	m = Message.query.filter_by(chatroom=id).all()
	a = []
	for msg in m:
		a.append({'author':msg.author, 'content':msg.contents})
	return json.dumps(a)
