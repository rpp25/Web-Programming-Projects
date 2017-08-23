# Budgetting App
## Goal:
To gain experience with building RESTful APIs and using functional programming.

## High-level description:
You will write a very simple budget application for a single user.
Your application should support several budget categories, and a set monthly limit for each category (e.g., $700 for rent, $200 for food, $100 for gas, etc.).
The application should allow the user to enter purchases and present an up to date list of the user's remaining budgeted amount in each category (e.g., you have $0/$700 left for rent, you are $20 over your food budget of $200, and you have $44/$100 left for gas), and the amount spent on uncategorized purchases.
You can represent all server-side data as Python data structures, you do not need to use SQLAlchemy.

## Specifications:
1.  You must build a RESTful API for accessing your budget category and purchase resources.
	Specifically, users should be able to perform HTTP GETs, POSTs, and DELETEs on "/cats" to get a list of budget categories, add a new category, and delete a category (respectively), and also perform HTTP GETs and POSTs to "/purchases" to get a list of individual purchases by the user and to add a new purchase.
	*  All data must be transmitted using JSON.
1.  Since we assume for this project that your website manages the budget of only a single user, you do not need to implement any user management, login, or password authentication.
1.  When the root resource of your site is accessed ("/"), your Flask application should send a basic page skeleton to the user along with a JavaScript application that will make AJAJ requests to populate the page.
1.  Once the page is loaded by a user's browser, it should make AJAJ requests for the list of categories and list of purchases made by the user using the RESTful API.
1.  Because you are only outputting budget category summaries to the main page, use console.log() to print the contents of every AJAJ response you get to ensure ease of grading.
1.  Once populated, the page should display the status of each of the user's budget categories, and the total of uncategorized purchases.
	*  Using Array.map(), Array.reduce(), and/or Array.filter() could be helpful in writing succinct code to perform your budget analysis.
1.  The user should always have the ability to add a new purchase (specifying the amount spent, what it was spent on, the date that it was spent, and the category it should be counted towards) or category (specifying name and limit), and also always have the ability to delete any existing category.
1.  You do not need to regularly poll the server for updates.  However, once user requests any changes (e.g., add a purchase, add a category, delete a category), your application should fetch updated information via the RESTful API, and recompute the status of each of the user's budget categories.
1.  Because we are not storing the data using SQLAlchemy, you do not need to persist data across server instances.
	*  If the server is killed (i.e., Ctrl+C issued), all category/purchase data can be forgotten.
1.  You must build your website using JavaScript, JSON, AJAJ, Python 3.5 or greater, and Flask 0.12.

