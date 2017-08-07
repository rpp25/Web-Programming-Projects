#rpp25
from flask import Flask, render_template, flash, url_for, redirect
from flask_restful import reqparse, abort, Api, Resource
import json

# Configuration
# SECRET_KEY = 'development key'

app = Flask(__name__)
api = Api(app)
app.secret_key = 'development key'

parser = reqparse.RequestParser()
parser.add_argument('category')
parser.add_argument('amount')
parser.add_argument('item')
parser.add_argument('month')
parser.add_argument('op')
parser.add_argument('categoryname')
parser.add_argument('categoryamount')
parser.add_argument('newbudget')

budget = {"Rent" : 700, "Food" : 200, "Gas" : 100, "Misc": 0}
#print(budget)
purchases = []

@app.route("/")
def root_page():
	return render_template("layout.html")

#returns a list of the current budget categories
class Budget(Resource):
	def get(self):
		return budget
	def post(self):
		args = parser.parse_args()
		if args['op'] == "a":
			global budget
			newCategory = {args['categoryname'] : int(args['categoryamount'])}
			budget.update(newCategory)
			return budget
		if args['op'] == "u":
			newBudget = args['newbudget']
			budget = json.loads(newBudget)
			return budget
	def delete(self):
		args = parser.parse_args()
		delCategory = args['categoryname']
		del budget[delCategory];
		return budget

#returns the list of purchases, or allows the user to add a purchase
class Purchases(Resource):
	def get(self):
		return purchases
	def post(self):
		args = parser.parse_args()
		item = args['item']
		try:
			amount = int(args['amount'])
			category = args['category']
			month = args['month']
			purchase = {'Amount' : amount, 'Item' : item, 'Category' : category, 'Month' : args['month']}
			if category in budget and amount > 0 and month != 'NaN':
				purchases.append(purchase)
				return purchase
			else:
				purchase = {'Amount' : 'invalid', 'Item' : item, 'Category' : 'invalid', 'Month' : 'invalid'}
				return purchase
		except ValueError:
			purchase = {'Amount' : 'invalid', 'Item' : item, 'Category' : 'invalid', 'Month' : 'invalid'}
			return purchase

api.add_resource(Budget, "/categories")
api.add_resource(Purchases, "/purchases")

if __name__ == '__main__':
	app.run(debug=True)
