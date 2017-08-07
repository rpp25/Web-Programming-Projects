from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Staff(db.Model):
	staffID = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(24), nullable=False)
	password = db.Column(db.String(64), nullable=False)
	events = db.relationship('Event', secondary='events', primaryjoin='Staff.staffID==events.c.staffID', secondaryjoin='Event.eventID==events.c.eventID', backref=db.backref('staff', lazy='dynamic'), lazy='dynamic')

	def __init__(self, username, password):
		self.username = username
		self.password = password

	def __repr__(self):
		return 'Staff {}'.format(self.username)

events = db.Table('events',
	db.Column('staffID', db.Integer, db.ForeignKey('staff.staffID')),
    db.Column('eventID', db.Integer, db.ForeignKey('event.eventID'))
)


class Customer(db.Model):
	custID = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(24), nullable=False)
	password = db.Column(db.String(64), nullable=False)

	def __init__(self, username, password):
		self.username = username
		self.password = password

	def __repr__(self):
		return '<Customer {}>'.format(self.custName)

class Event(db.Model):
	eventID = db.Column(db.Integer, primary_key=True)
	eventName = db.Column(db.String(128), nullable=False)
	eventDate = db.Column(db.Date, nullable=False)

	custID = db.Column(db.Integer, db.ForeignKey('customer.custID'))

	def __init__(self, name, date, customer):
		self.eventName = name
		self.eventDate = date
		self.custID = customer

	def __repr__(self):
		return '<Event {}>'.format(self.eventName)
