
//console.log("test");

var canvas = document.getElementById('mon_canvas'),
context = canvas.getContext('2d');

//alert(canvas);

make_base();

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

function make_base()
{
  base_image = new Image();
  base_image.src = 'ballon.jpeg';
  base_image.onload = function(){
    context.drawImage(base_image, 100, 100);
  }
}

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
	context.drawImage(base_image, posX-125, posY-125);
	



  }
}

canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mouseup', mouseUp, false);
canvas.addEventListener('mousemove', mouseMove, false);


