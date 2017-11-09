
//console.log("test");

var canvas = document.getElementById('mon_canvas'),
context = canvas.getContext('2d');
var drag = false;

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

    console.log("dragover: "+x, y);
}

//canvas.ondragover(console.log("test"));

function Joueur(x, y, z, img) {

  this.x=x;
  this.y=y;
  this.z=z;
  this.img=img;

  this.draw = function(x, y) {
    //console.log("dessin du joueur");
    context.drawImage(this.img, x-this.img.width/2, y-this.img.height/2);
  }

  this.img.onload = this.draw(100, 100);

}

ballonImg = new Image();
ballonImg.src = "ballon.jpeg";

j1 = new Joueur(100,100,1, ballonImg);

/*function make_base()
{
  //base_image = new Image();
  //base_image.src = 'ballon.jpeg';
  base_image.onload = function(){
    context.drawImage(base_image, 100, 100);
  }
}*/

joueurs = [j1];

function drawBall(x, y) {
	context.drawImage(base_image, x, y);
}

function testdrag() {
	console.log("test drag");
}

function mouseDown(e) {
  drag = true;
}

function mouseUp() {
  drag = false;
}

function mouseMove(e) {
  if (drag) {
	
    var posX = e.pageX - canvas.offsetLeft;
    var posY = e.pageY - canvas.offsetTop;
	console.log("coords : "+posX + "," + posY);
	context.clearRect(0, 0, canvas.width, canvas.height);
	//context.drawImage(base_image, posX-125, posY-125);
  j1.draw(posX, posY);
	



  }
}



canvas.addEventListener('mousedown', mouseUp, false);
canvas.addEventListener('mouseup', mouseDown, false);
canvas.addEventListener('mousemove', mouseMove, false);