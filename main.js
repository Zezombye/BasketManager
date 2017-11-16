
//console.log("test");

var canvas = document.getElementById('mon_canvas'),
context = canvas.getContext('2d');
var drag = false;
var joueurSelect = null;
var relativeX, relativeY;

var basketCourt = new Image();
basketcourt.onload = function()

   {
     basketcourt.src= ="basketcourt.png";
     basketcourt.width = canvas.width;
     basketcourt.height = canvas.height;

   }
basketCourt.src = "basketcourt.png";


canvas.ondragstart = function(evt) {
    evt = evt || window.event;
    var x = evt.pageX,
        y = evt.pageY;

    console.log("dragstart: "+x, y);
}

canvas.ondragover = function(evt) {
    evt = evt || window.event;
    var x = evt.clientX,
        y = evt.clientY;

    console.log("dragonvert: "+x, y);
}

canvas.load = function() {
  console.log("test load");
  context.drawImage(basketCourt, 0, 0);
}

canvas.load();

//canvas.ondragover(console.log("test"));

function Joueur(x, y, z, img) {

  this.x=x;
  this.y=y;
  this.z=z;
  this.img=img;
  this.width = this.img.width;
  this.height = this.img.height;

  this.draw = function(x, y) {
    //console.log("dessin du joueur");
    context.drawImage(this.img, x, y);
  }

  this.img.onload = this.draw(100, 100);

}

canvas.draw = function() {
}

ballonImg = new Image();
ballonImg.src = "ballon.jpeg";

j1 = new Joueur(100,100,1, ballonImg);
j2 = new Joueur(500, 300, 2, ballonImg);

joueurs = [j1];

function drawBall(x, y) {
	context.drawImage(base_image, x, y);
}

function testdrag() {
	console.log("test drag");
}

//Détermine le joueur sur lequel la souris clique en fonction des coordonnées et du Z-index
function getJoueur(e) {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;

  joueurSelect = null;

  for (var i = 0; i < joueurs.length; i++) {

    console.log(joueurs[i].x + " " + x + " " + joueurs[i].width);

    if (joueurs[i].x <= x && joueurs[i].x+joueurs[i].width > x
        && joueurs[i].y <= y && joueurs[i].y+joueurs[i].height > y
        && (joueurSelect == null || joueurSelect.z < joueurs[i].z)
        ) {

      joueurSelect = joueurs[i];
    
    }
  }

  //console.log(joueurSelect);

}

function displayJoueurs() {
  for (var i = 0; i < joueurs.length; i++) {
    joueurs[i].draw();
  }
}

function stopDrag(e) {
  
  drag = false;
  joueurSelect.x = posX-relativeX;
  joueurSelect.y = posY-relativeY; 
}

function mouseDown(e) {
  var posX = e.pageX - canvas.offsetLeft;
  var posY = e.pageY - canvas.offsetTop;
  drag = true;
  getJoueur(e);
  if (joueurSelect != null) {
    relativeX = posX-joueurSelect.x;
    relativeY = posY-joueurSelect.y;
  }
}

function mouseUp() {
  drag = false;
}

function mouseMove(e) {
  if (drag) {
	
    getJoueur(e);
    
    if (joueurSelect == null) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(basketCourt, 0, 0, canvas.width, canvas.height);
    var posX = e.pageX - canvas.offsetLeft;
    var posY = e.pageY - canvas.offsetTop;

    console.log("coords : "+posX + "," + posY + " " + relativeX + " " + relativeY);

    joueurSelect.draw(posX-relativeX, posY-relativeY);
	
  }
}

function mouseOut(e) {
  drag = false;
}

canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mouseup', mouseUp, false);
canvas.addEventListener('mousemove', mouseMove, false);
canvas.addEventListener('mouseout', mouseOut, false);
