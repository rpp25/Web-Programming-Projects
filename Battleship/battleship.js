//localStorage.clear();
// set grid rows and columns and the size of each square
var p1name = localStorage.getItem("player1");
var p2name = localStorage.getItem("player2");
var p1ships = localStorage.getItem("player1ships");
var p2ships = localStorage.getItem("player2ships");
var p1score = document.getElementById('p1score');
var p2score = document.getElementById('p2score');

var squareSize = 50;
var newBoard;
var newBoard2;
var p1turn = true;
var opponentContainer = document.getElementById("gameboard");

//hit counts
var p1a = 0;
var p1b = 0;
var p1s = 0;
var p2a = 0;
var p2b = 0;
var p2s = 0;
var p1hitCount = 0;
var p2hitCount = 0;

var gameEnd = false;
for (i = 0; i < 10; i++) {
	for (j = 0; j < 10; j++) {
		var square = document.createElement("div");
		opponentContainer.appendChild(square);

		square.id = 's' + j + i;

		var topPosition = j * squareSize;
		var leftPosition = i * squareSize;

		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';
	}
}

var yourContainer = document.getElementById("gameboard2");
for (i = 0; i < 10; i++) {
	for (j = 0; j < 10; j++) {

		// create a new div HTML element for each grid square and make it the right size
		var square = document.createElement("div");
		yourContainer.appendChild(square);

		var p = document.createElement("p");
		square.appendChild(p);
    // give each div element a unique id based on its row and column, like "s00"
		square.id = 'y' + j + i;
		p.id = 'p' + j + i;
		p.className = "square";
		// set each grid square's coordinates: multiples of the current row or column number
		var topPosition = j * squareSize;
		var leftPosition = i * squareSize;

		// use CSS absolute positioning to place each grid square on the page
		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';
	}
}
var p1board = [
				[0,0,0,0,0,0,0,0,0,0],	//A
				[0,0,0,0,0,0,0,0,0,0],	//B
				[0,0,0,0,0,0,0,0,0,0],	//C
				[0,0,0,0,0,0,0,0,0,0],	//D
				[0,0,0,0,0,0,0,0,0,0],	//E
				[0,0,0,0,0,0,0,0,0,0],	//F
				[0,0,0,0,0,0,0,0,0,0],	//G
				[0,0,0,0,0,0,0,0,0,0],	//H
				[0,0,0,0,0,0,0,0,0,0],	//I
				[0,0,0,0,0,0,0,0,0,0]		//J
			];

var p2board = [
				[0,0,0,0,0,0,0,0,0,0],	//A
				[0,0,0,0,0,0,0,0,0,0],	//B
				[0,0,0,0,0,0,0,0,0,0],	//C
				[0,0,0,0,0,0,0,0,0,0],	//D
				[0,0,0,0,0,0,0,0,0,0],	//E
				[0,0,0,0,0,0,0,0,0,0],	//F
				[0,0,0,0,0,0,0,0,0,0],	//G
				[0,0,0,0,0,0,0,0,0,0],	//H
				[0,0,0,0,0,0,0,0,0,0],	//I
				[0,0,0,0,0,0,0,0,0,0]		//J
			];

deployShips();
updateScore();

function deployShips(){
	var m = p1ships.match(/\w\d\-\w\d|\w/g);
	var n = p2ships.match(/\w\d\-\w\d|\w/g);

	for (k = 0; k < 6; k++){
		var ship = m[k];
		var shipLoc = m[k + 1].split("-");
		var shipStart = shipLoc[0];
		var shipEnd = shipLoc[1];

		if (shipStart.substring(0,1) == shipEnd.substring(0,1)){ //along the same row
			var row = shipStart.substring(0,1).charCodeAt(0) - 65;
			var start = parseInt(shipStart.substring(1,2)) - 1;
			if (ship.toUpperCase() == "A"){
				for (i = 0; i < 5; i++){
					p1board[row][i + start] = 5;
				}
			}
			else if (ship.toUpperCase() == "B"){
				for (i = 0; i < 4; i++){
					p1board[row][i + start] = 4;
				}
			}
			else{
				for (i = 0; i < 3; i++){
					p1board[row][i + start] = 3;
				}
			}
		}

		else{ //along the same column
			var col = parseInt(shipStart.substring(1,2)) - 1;
			var start = shipStart.substring(0,1).charCodeAt(0) - 65;
			if (ship.toUpperCase() == "A"){
				for (i = 0; i < 5; i++){
					p1board[i + start][col] = 5;
				}
			}
			else if (ship.toUpperCase() == "B"){
				for (i = 0; i < 4; i++){
					p1board[i + start][col] = 4;
				}
			}
			else{
				for (i = 0; i < 3; i++){
					p1board[i + start][col] = 3;
				}
			}
		}
		k++;
	}

	for (k = 0; k < 6; k++){
		var ship = n[k];
		var shipLoc = n[k + 1].split("-");
		var shipStart = shipLoc[0];
		var shipEnd = shipLoc[1];

		if (shipStart.substring(0,1) == shipEnd.substring(0,1)){ //along the same row
			var row = shipStart.substring(0,1).charCodeAt(0) - 65;
			var start = parseInt(shipStart.substring(1,2)) - 1;
			if (ship.toUpperCase() == "A"){
				for (i = 0; i < 5; i++){
					p2board[row][i + start] = 5;
				}
			}
			else if (ship.toUpperCase() == "B"){
				for (i = 0; i < 4; i++){
					p2board[row][i + start] = 4;
				}
			}
			else{
				for (i = 0; i < 3; i++){
					p2board[row][i + start] = 3;
				}
			}
		}

		else{ //along the same column
			var col = parseInt(shipStart.substring(1,2)) - 1;
			var start = shipStart.substring(0,1).charCodeAt(0) - 65;
			if (ship.toUpperCase() == "A"){
				for (i = 0; i < 5; i++){
					p2board[i + start][col] = 5;
				}
			}
			else if (ship.toUpperCase() == "B"){
				for (i = 0; i < 4; i++){
					p2board[i + start][col] = 4;
				}
			}
			else{
				for (i = 0; i < 3; i++){
					p2board[i + start][col] = 3;
				}
			}
		}
		k++;
	}
		for (i = 0; i < 10; i++) {
			for (j = 0; j < 10; j++) {
				var str = 'y' + i + j;
				var text = 'p' + i + j;
				if (p1board[i][j] == 3){
					var c = document.getElementById(str);
					c.style.background = "black";
					var p = document.getElementById(text);
					p.innerHTML = "S";
				}
				if (p1board[i][j] == 4){
					var c = document.getElementById(str);
					c.style.background = "black";
					var p = document.getElementById(text);
					p.innerHTML = "B";
				}
				if (p1board[i][j] == 5){
					var c = document.getElementById(str);
					c.style.background = "black";
					var p = document.getElementById(text);
					p.innerHTML = "A";
				}
			}
		}
	alert("Click OK to begin " + p1name + "\'s turn!");
	opponentContainer.addEventListener("click", fireTorpedo, false);
}

function nextTurn(){
	document.body.style.opacity = 1;
	//document.getElementById('gameboard').style.opacity = 1;
	var yourboard = JSON.parse(window.localStorage.getItem("yourboard"));
	var opponentboard = JSON.parse(window.localStorage.getItem("opponentboard"));
	for (i = 0; i < 10; i++) {
		for (j = 0; j < 10; j++) {
			var str = 'y' + i + j;
			var text = 'p' + i + j;
			var p = document.getElementById(text);
			if (yourboard[i][j] == 0){ //no ship
				var c = document.getElementById(str);
				c.style.background = "lightblue";
				p.innerHTML = "";
			}
			if (yourboard[i][j] == 1){ //missed shot
				var c = document.getElementById(str);
				c.style.background = "white";
				p.innerHTML = "";
			}
			if (yourboard[i][j] == 3){ //untouched S
				var c = document.getElementById(str);
				c.style.background = "black";
				p.innerHTML = "S";
			}
			if (yourboard[i][j] == 4){ //untouched B
				var c = document.getElementById(str);
				c.style.background = "black";
				p.innerHTML = "B";
			}
			if (yourboard[i][j] == 5){ //untocuhed A
				var c = document.getElementById(str);
				c.style.background = "black";
				p.innerHTML = "A";
			}
			if (yourboard[i][j] == 6){ //hit S
				var c = document.getElementById(str);
				c.style.background = "red";
				p.innerHTML = "S";
			}
			if (yourboard[i][j] == 7){ //hit B
				var c = document.getElementById(str);
				c.style.background = "red";
				p.innerHTML = "B";
			}
			if (yourboard[i][j] == 8){ //hit A
				var c = document.getElementById(str);
				c.style.background = "red";
				p.innerHTML = "A";
			}
		}
	}

	for (i = 0; i < 10; i++) {
		for (j = 0; j < 10; j++) {
			var str = 's' + i + j;
			if (opponentboard[i][j] == 0){ //no ship
				var c = document.getElementById(str);
				c.style.background = "lightblue";
			}
			if (opponentboard[i][j] == 1){ //missed shot
				var c = document.getElementById(str);
				c.style.background = "white";
			}
			if (opponentboard[i][j] == 3 || opponentboard[i][j] == 4 || opponentboard[i][j] == 5){
				var c = document.getElementById(str);
				c.style.background = "lightblue";
			}
			if (opponentboard[i][j] == 6 || opponentboard[i][j] == 7 || opponentboard[i][j] == 8){
				var c = document.getElementById(str);
				c.style.background = "red";
			}
		}
	}
}

function fireTorpedo(e) {
	var row = e.target.id.substring(1,2);
	var col = e.target.id.substring(2,3);
	if (e.target !== e.currentTarget) {
		if (p1turn == true){ //PLAYER 1
			if (p2board[row][col] == 0) { //clicking opponent's square was a miss
				e.target.style.background = 'white';
				p2board[row][col] = 1; //marked as a miss
				alert("Miss!");
			} else if (p2board[row][col] == 3) { //hitting S
				e.target.style.background = 'red';
				p2board[row][col] = 6; //marked as a hit
				p2s++;
				p2hitCount++;
				alert("Hit!");
				if (p2s == 3){
					alert("Opponent's submarine was sunk!");
				}
			} else if (p2board[row][col] == 4) { //hitting B
				e.target.style.background = 'red';
				p2board[row][col] = 7; //marked as a hit
				p2b++;
				p2hitCount++;
				alert("Hit!");
				if (p2b == 4){
					alert("Opponent's battleship was sunk!");
				}
			} else if (p2board[row][col] == 5) { //hitting A
				e.target.style.background = 'red';
				p2board[row][col] = 8; //marked as a hit
				alert("Hit!");
				p2a++;
				p2hitCount++;
				if (p2a == 5){
					alert("Opponent's aircraft carrier was sunk!");
				}
			} else if (p2board[row][col] == 1 || p2board[row][col] == 6 ||
				 	p2board[row][col] == 7 || p2board[row][col] == 8) { //clicking a missed or already hit spot
					alert("You already fired at this location, idiot!");
			}
			e.stopPropagation();
			if (p1hitCount == 12){
				alert(p2name + "\'s ships have all been sunk! " + p1name + " wins!");
				gameEnd = true;
			}
			updateScore();
			if (typeof(Storage) !== "undefined") {
				window.localStorage.setItem("yourboard", JSON.stringify(p2board)); //will display as the black squares next turn
				window.localStorage.setItem("opponentboard", JSON.stringify(p1board)); //should have all lightblue's at first
			}
			p1turn = false;
			setTimeout(register, 500);
		}
		else { //PLAYER 2'S TURN
			if (p1board[row][col] == 0) { //clicking opponent's square was a miss
				e.target.style.background = 'white';
				p1board[row][col] = 1; //marked as a miss
				alert("Miss!");
			} else if (p1board[row][col] == 3) { //hitting S
				e.target.style.background = 'red';
				p1board[row][col] = 6; //marked as a hit
				alert("Hit!");
				p1s++;
				p1hitCount++;
				if (p1s == 3){
					alert("Opponent's submarine was sunk!");
				}
			} else if (p1board[row][col] == 4) { //hitting B
				e.target.style.background = 'red';
				p1board[row][col] = 7; //marked as a hit
				alert("Hit!");
				p1b++;
				p1hitCount++;
				if (p1b == 4){
					alert("Opponent's battleship was sunk!");
				}
			} else if (p1board[row][col] == 5) { //hitting A
				e.target.style.background = 'red';
				p1board[row][col] = 8; //marked as a hit
				alert("Hit!");
				p1a++;
				p1hitCount++;
				if (p1a == 5){
					alert("Opponent's aircraft carrier was sunk!");
				}
			} else if (p1board[row][col] == 1 || p1board[row][col] == 6 ||
					p1board[row][col] == 7 || p1board[row][col] == 8) { //clicking a missed or already hit spot
					alert("You already fired at this location, idiot!");
			}
		  e.stopPropagation();
			if (p1hitCount == 12){
				alert(p1name + "\'s ships have all been sunk! " + p2name + " wins!");
				gameEnd = true;
			}
			updateScore();
			//setTimeout(register, 500);
			if (typeof(Storage) !== "undefined") {
				window.localStorage.setItem("yourboard", JSON.stringify(p1board));
				window.localStorage.setItem("opponentboard", JSON.stringify(p2board));
			}
			p1turn = true;
			setTimeout(register, 500);
		}
	}
}

function updateScore(){
	p1score.innerHTML = p1name + "\'s score: " + (24 - (2*p1hitCount));
	p2score.innerHTML = p2name + "\'s score: " + (24 - (2*p2hitCount));
}

function register(){
	if (gameEnd == false){
		document.body.style.opacity = 0;
		if (p1turn == false){
			setTimeout(function(){ alert("Click OK to begin " + p2name + "\'s turn");nextTurn(); }, 10);
		}
		else{
			setTimeout(function(){ alert("Click OK to begin " + p1name + "\'s turn");nextTurn(); }, 10);
		}
	} else{
		if (p2hitCount == 12){
			var score = (24 - (2*p1hitCount));
			var winner = [p1name, score];
			console.log(winner);
			window.localStorage.setItem("winnerstats", winner);
			document.location.href = "highscores.html";
		}
		else{
			var score = (24 - (2*p2hitCount));
			var winner = [p2name, score];
			console.log(winner);
			window.localStorage.setItem("winnerstats", winner);
			document.location.href = "highscores.html";
		}
	}
}
