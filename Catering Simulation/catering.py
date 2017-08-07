import time
import os
from hashlib import md5
from datetime import datetime
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack
from models import db, Staff, Customer, Event

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config.update(dict(
	DEBUG=True,
	SECRET_KEY='development key',
	USERNAME='owner',
	PASSWORD='pass',
	SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'catering.db')
))

app.config.from_envvar('CATERING', silent=True)
db.init_app(app)

@app.cli.command('initdb')
def initdb_command():
	"""Creates the database tables."""
	db.create_all()
	print('Initialized the database.')

@app.route('/')
def home():
	if session.get('isLoggedIn'):
			if session.get('ownerLoggedIn'):
				return redirect(url_for('owner'))
			elif 'staffID' in session:
				return redirect(url_for('staff'))
			elif 'customerID' in session:
				return redirect(url_for('customer'))

	return render_template('layout.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
	error = None
	if request.method == 'POST':
		if request.form['username'] == app.config['USERNAME'] and request.form['password'] == app.config['PASSWORD']:
			session['isLoggedIn'] = True
			session['ownerLoggedIn'] = True
			return redirect(url_for('owner'))
		else:
			staffList = Staff.query.all()
			custList = Customer.query.all()
			for staff in staffList:
				if staff.username == request.form['username'] and staff.password == request.form['password']:
					session['isLoggedIn'] = True
					session['staffID'] = staff.staffID
					return redirect(url_for('staff'))
			for customer in custList:
				if customer.username == request.form['username'] and customer.password == request.form['password']:
					session['isLoggedIn'] = True
					session['customerID'] = customer.custID
					return redirect(url_for('customer'))

			error = "Login failed! Please try again."
	else:
		if session.get('isLoggedIn'):
			if session.get('ownerLoggedIn'):
				return redirect(url_for('owner'))
			elif 'staffID' in session:
				return redirect(url_for('staff'))
			elif 'customerID' in session:
				return redirect(url_for('customer'))

	return render_template('loginPage.html', error=error)

@app.route('/owner')
def owner():
	if not session.get('ownerLoggedIn'):
		abort(401)
	elif not 'isLoggedIn' in session:
		abort(401)
	events = Event.query.all()
	return render_template('owner.html', events=events)

@app.route('/logout')
def logout():
	session.pop('isLoggedIn', None)
	session.pop('customerID', None)
	session.pop('staffID', None)
	session['ownerLoggedIn'] = False
	flash('Logged out.')
	return redirect(url_for('login'))

@app.route('/newStaff', methods=['POST'])
def newStaff():
	staff = Staff(request.form['username'], request.form['password'])
	db.session.add(staff)
	flash('Created new staff account!')
	db.session.commit()
	return redirect(url_for('owner'))

@app.route('/staff')
def staff():
	if not 'isLoggedIn' in session:
		abort(401)
	if not 'staffID' in session:
		abort(401)
	id = session['staffID']
	staff = Staff.query.filter_by(staffID=id).first()
	currentEvents = staff.events
	eventIDList = []
	for e in currentEvents:
		eventIDList.append(e.eventID)
	events = Event.query.filter(~Event.eventID.in_(eventIDList)).all()
	for e in events:
		if e.staff.count() == 3:
			events.remove(e)
	return render_template('staff.html', events=events, currentEvents=currentEvents, username=staff.username)

@app.route('/assignStaff_<eventID>')
def assignStaff(eventID):
	if not 'isLoggedIn' in session:
		abort(401)
	if not 'staffID' in session:
		abort(401)
	id = session['staffID']
	event = Event.query.filter_by(eventID=eventID).first()
	staff = Staff.query.filter_by(staffID=id).first()
	staff.events.append(event)
	flash('You have been assigned to this event.')
	db.session.commit()
	return redirect(url_for('staff'))

@app.route('/newCustomer', methods=['POST'])
def newCustomer():
	customer = Customer(request.form['customerUsername'], request.form['customerPassword'])
	db.session.add(customer)
	flash('Created new customer account!')
	db.session.commit()
	return redirect(url_for('login'))

@app.route('/customer')
def customer():
	if not 'isLoggedIn' in session:
		abort(401)
	if not 'customerID' in session:
		abort(401)
	id = session['customerID']
	customer = Customer.query.filter_by(custID=id).first()
	events = Event.query.filter_by(custID=id).all()
	return render_template('customer.html', events=events, custName=customer.username)


@app.route('/newEvent', methods=['POST'])
def newEvent():
	if not 'isLoggedIn' in session:
		abort(401)
	if not 'customerID' in session:
		abort(401)
	id = session['customerID']
	eventDate = datetime.strptime(request.form['eventDate'], "%Y-%m-%d").date()
	event = Event(request.form['eventName'], eventDate, id)
	eventList = Event.query.all()
	for e in eventList:
		if e.eventDate == eventDate:
			flash('Something\'s already booked! Try another date')
			return redirect(url_for('customer'))

	db.session.add(event)
	flash('Scheduled a new event.')
	db.session.commit()
	return redirect(url_for('customer'))

@app.route('/deleteEvent_<eventID>')
def deleteEvent(eventID):
	if not 'isLoggedIn' in session:
		abort(401)
	if not 'customerID' in session:
		abort(401)
	Event.query.filter_by(eventID=eventID).delete()
	flash('Event removed from your schedule.')
	db.session.commit()
	return redirect(url_for('customer'))
