

// var winner = window.localStorage.getItem("winnerstats");
// var name = winner[0];
// var score = winner[1];
var scores = [];
scores["Jerry"] = 24;
scores["Birdperson"] = 18;
//scores[name] = score;
var keys = Object.keys(scores).sort(function (a, b) {
  return scores[a] - scores[b];
});


var points = [];
points.push(scores["Jerry"]);
points.push(scores["Birdperson"]);
//console.log(keys);
points.sort(function(a, b){return a-b});
//console.log(points);

var scorelist = document.getElementById("scorelist");
//console.log(list);
var newList = '';

for (i = 0; i < scores.length; i++) {
    //newList += '<li>' + scores[i] + ' ' + points[i] '</li>';
    console.log(newList);
    scorelist.innerHTML += newList;
}

//score.innerHTML += newList;
console.log(scorelist);
