var totalBudget, currMonth;
var months = new Array();
var timeoutID;
var timeout = 1000;
var originalBudget = {};

function setup() {
	document.getElementById("purchaseAdd").addEventListener("click", makePurchasePost, true);
	document.getElementById("categoryAdd").addEventListener("click", addCategoryPost, true);
	months[0] = "January";
	months[1] = "February";
	months[2] = "March";
	months[3] = "April";
	months[4] = "May";
	months[5] = "June";
	months[6] = "July";
	months[7] = "August";
	months[8] = "September";
	months[9] = "October";
	months[10] = "November";
	months[11] = "December";
	timeoutID = window.setTimeout(getCategoryList, timeout);

}

function getCategoryList() {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest)
		return false;

	httpRequest.onreadystatechange = function() { handlePoll(httpRequest) };
	httpRequest.open("GET", "/categories");
	httpRequest.send();
}

function handlePoll(httpRequest) {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200) {
			budget = JSON.parse(httpRequest.responseText);
			console.log("Current budget: (Returned from GET request to /categories)" + JSON.stringify(budget));
			for (b in budget){
				if (!(b in originalBudget)){
					originalBudget[ b ] = budget[b];
				}
			}
			showBudget(budget);
		}
	}
}

function showBudget(budget) {
	var table = document.getElementById("budgetTable");
	var newRow, newCell, newText;

	while (table.firstChild) {
	    table.removeChild(table.firstChild);
	}

	for (b in budget){
		if (b != 'Misc'){
			newRow = table.insertRow();
			newRow.id = b
			newCell = newRow.insertCell();
			deleteCell = newRow.insertCell();
			deleteCell.innerHTML = "<button id=\"" + b + "del\" onclick=\"deleteCategoryPost(" + b + ")\">Delete</button>";
			if (budget[b] < 0){
				over = -(budget[b]);
				newText = document.createTextNode("You are $" + over + " over in your budget for " + b);
			}
			else{
				newText = document.createTextNode("You have $" + budget[b] + "/$" + originalBudget[b] + " left in your budget for " + b);
			}
			newCell.appendChild(newText);
		}
		else{
			if (budget[b] != 0){
				newRow = table.insertRow();
				newRow.id = b
				newCell = newRow.insertCell();
				newText = document.createTextNode("You have spent $" + budget[b] + " towards uncategorized purchases.");
				newCell.appendChild(newText);
			}
		}
	}

	totalBudget = budget;
}

function addCategoryPost() {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest)
		return false;

	var amount = document.getElementById("catAmount").value;
	var name = document.getElementById("catName").value;

	httpRequest.onreadystatechange = function() { handleCategoryPost(httpRequest) };
	httpRequest.open("POST", "/categories");
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	var data;
	data = "categoryname=" + name + "&categoryamount=" + amount + "&op=a";
	httpRequest.send(data);
}

function handleCategoryPost(httpRequest) {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200) {
			budget = JSON.parse(httpRequest.responseText);
			console.log("Budget with updated categories: (Returned from POST request to /categories)" + JSON.stringify(budget));
			for (b in budget){
				if (!(b in originalBudget)){
					originalBudget[ b ] = budget[b];
				}
			}
			showBudget(budget);
		}
	}
}

function deleteCategoryPost(name) {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest)
		return false;

	httpRequest.onreadystatechange = function() { handleCategoryPost(httpRequest) };
	httpRequest.open("DELETE", "/categories");
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	var data;
	data = "categoryname=" + name.id + "&op=d";
	delete originalBudget[name.id];
	httpRequest.send(data);
}

function makePurchasePost() {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest)
		return false;

	var amount = document.getElementById("purchaseAmount").value;
	var item = document.getElementById("purchaseItem").value;
	var category = document.getElementById("purchaseCategory").value;
	if (category == ""){
		category = "Misc";
	}
	var inputDate = document.getElementById("purchaseDate").value;
	var date = new Date(inputDate);
	currMonth = date.getMonth();

	httpRequest.onreadystatechange = function() { handlePurchasePost(httpRequest) };
	httpRequest.open("POST", "/purchases");
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	var data;
	data = "category=" + category + "&item=" + item + "&amount=" + amount + "&month=" + currMonth;
	httpRequest.send(data);
}

function handlePurchasePost(httpRequest) {
	//return the new purchase info
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200) {
			clearInput();
			var purchase = JSON.parse(httpRequest.responseText)
			console.log("New purchase (before validation; Returned from POST request to /purchases): " + JSON.stringify(purchase));
			checkPurchase(purchase); //make sure the purchase is valid
		}
	}
}

function checkPurchase(purchase) {
	for (p in purchase){
		if (purchase[p] == "invalid"){
			alert("Invalid purchase entry!");
			return;
		}
	}
	getPurchases(); //purchases should be updated
}

function getPurchases() {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest)
		return false;
	httpRequest.onreadystatechange = function() { handlePurchases(httpRequest) };
	httpRequest.open("GET", "/purchases");
	httpRequest.send();
}

function handlePurchases(httpRequest) {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		if (httpRequest.status === 200) {
			var purchases = JSON.parse(httpRequest.responseText);
			console.log("List of purchases (Returned from GET request to /purchases):" + JSON.stringify(purchases));
			calculateBudget(purchases);
		}
	}
}

function calculateBudget(purchaseList) {
	var newRow, newCell, newText;
	var purchaseTable = document.getElementById("purchaseTable");
	var budgetTable = document.getElementById("budgetTable");

	while (purchaseTable.rows.length > 0) {
		purchaseTable.deleteRow(0);
	}

	//console.log(purchaseList);
	categories = [];
	for (p in purchaseList){
		purchase = purchaseList[p];
		category = purchase['Category'];
		if (!categories.includes(category)){
			categories.push(category);
		}
	}
	for (c in categories){
		category = categories[c];
		costs = purchaseList.map(function(purchase){
			if (purchase['Category'] == category)
				return purchase['Amount'];
			else
				return 0;
		});
		total = costs.reduce(add);
		// console.log("Costs: " + costs);
		// console.log("Total: " + total);
		// console.log("Previous budget: " + totalBudget[category]);
		if (category != "Misc"){
			newTotal = originalBudget[category] - total;
			// console.log("New budget for category: " + newTotal);
			totalBudget[category] = newTotal;
			// console.log("New total budget: " + JSON.stringify(totalBudget));
		}
		else{
			newTotal = originalBudget[category] + total;
			// console.log("New budget for category: " + newTotal);
			totalBudget[category] = newTotal;
			// console.log("New total budget: " + JSON.stringify(totalBudget));
		}
		updateBudget(totalBudget);
		// currGas = parseInt(totalBudget['Gas']) - gasTotal;
	}


	for (p in purchaseList) {
		newRow = purchaseTable.insertRow();
		newCell = newRow.insertCell();
		newText = document.createTextNode("You spent $" + purchaseList[p]['Amount'] + " on " + purchaseList[p]['Item'] + " from your " + purchaseList[p]['Category'] + " category for " + months[purchaseList[p]['Month']] + ".");
		newCell.appendChild(newText);
	}
}

function updateBudget(newBudget) {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest)
		return false;

	httpRequest.onreadystatechange = function() { handleCategoryPost(httpRequest) };
	httpRequest.open("POST", "/categories");
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	var data;
	data = "newbudget=" + JSON.stringify(newBudget) + "&op=u";
	httpRequest.send(data);
}


function clearInput() {
	document.getElementById("purchaseAmount").value = "";
	document.getElementById("purchaseItem").value = "";
	document.getElementById("purchaseDate").value = "";
	document.getElementById("purchaseCategory").value = "";
}

function add(x,y){
	return x + y;
}

window.addEventListener("load", setup, true);
