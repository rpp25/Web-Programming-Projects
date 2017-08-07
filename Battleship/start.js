localStorage.clear();
var p1name = document.getElementById('p1name').value;
window.localStorage.setItem("player1", p1name);

var p2name = document.getElementById('p2name').value;
window.localStorage.setItem("player2", p2name);

var p1ships = document.getElementById('p1ships').value;
window.localStorage.setItem("player1ships", p1ships);

var p2ships = document.getElementById('p2ships').value;
window.localStorage.setItem("player2ships", p2ships);

console.log(p1name);
console.log(p2name);
console.log(p1ships);
console.log(p2ships);

function begin(){
  document.location.href = "index.html";
}
