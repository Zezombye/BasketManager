//console.log("test");

var canvas = document.getElementById('mon_canvas'),
context = canvas.getContext('2d');
var upload = document.getElementById("upload");
var uploadButton = document.getElementById("upload-button");
var drag = false;
var joueurSelect = null;
var relativeX, relativeY;

var basketCourt = new Image();
basketCourt.src = "basketcourt.png";


function parseFile(fileContent) {

  //Parsage JSON
  console.log(fileContent);
  var content = JSON.parse(fileContent);
  console.log(content);
  console.log(content.joueurs[0].x);
  console.log(content.joueurs[0].y);
  console.log(content.joueurs[0].vecteurs[0]);
  console.log(content.joueurs[0].vecteurs[1]);
  console.log(content.joueurs[0].vecteurs[1].t);
}

function uploadFile() {
  //console.log("upload file");
  var file = upload.files[0];

  var read = new FileReader();
  read.readAsBinaryString(file);

  read.onloadend = function() {
    parseFile(read.result);
  }
}

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
  console.log("bit loaded");
  context.drawImage(basketCourt, 0, 0, canvas.width, canvas.height);
}

canvas.load();

//canvas.ondragover(console.log("test"));

function Joueur(x, y, z, imgurl) {

  this.x=x;
  this.y=y;
  this.z=z;
  this.img=new Image();
  this.img.src = imgurl;
  this.width = this.img.width;
  this.height = this.img.height;

  this.draw = function() {
    //console.log("dessin du joueur");
    context.drawImage(this.img, this.x*canvas.width, this.y*canvas.height);
  }

  this.img.onload = this.draw(100, 100);

}

canvas.draw = function() {
}

ballonImg = new Image();
ballonImg.src = "ballon.png";

j1 = new Joueur(100,100,1, "ballon.png");
j2 = new Joueur(500, 300, 2, ballonImg);

joueurs = [];

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
    relativeY = posY-joueurSelect.y

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


saveParDefaut = JSON.parse('{"joueurs":[{"x":0.1,"y":0.33,"vecteurs":[{"x":0.13,"y":0.15,"t":2.5},{"x":0.3,"y":0.5,"t":5}]},{"x":0.3,"y":0.23,"vecteurs":[{"x":0.13,"y":0.15,"t":2.5},{"x":0.3,"y":0.5,"t":5}]},{"x":0.35,"y":0.48,"vecteurs":[{"x":0.13,"y":0.15,"t":2.5},{"x":0.3,"y":0.5,"t":5}]},{"x":0.18,"y":0.70,"vecteurs":[{"x":0.13,"y":0.15,"t":2.5},{"x":0.3,"y":0.5,"t":5}]},{"x":0.05,"y":0.86,"vecteurs":[{"x":0.13,"y":0.15,"t":2.5},{"x":0.3,"y":0.5,"t":5}]}]}');

for (var i = 0; i < 5; i++) {

  joueurs[i] = new Joueur(saveParDefaut.joueurs[i].x, saveParDefaut.joueurs[i].y, i, "joueur"+(i+1)+".png");

}

function download(strData, strFileName, strMimeType) {
  var D = document,
      A = arguments,
      a = D.createElement("a"),
      d = A[0],
      n = A[1],
      t = A[2] || "text/plain";

  //build download link:
  a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


  if (window.MSBlobBuilder) { // IE10
      var bb = new MSBlobBuilder();
      bb.append(strData);
      return navigator.msSaveBlob(bb, strFileName);
  } /* end if(window.MSBlobBuilder) */



  if ('download' in a) { //FF20, CH19
      a.setAttribute("download", n);
      a.innerHTML = "downloading...";
      D.body.appendChild(a);
      setTimeout(function() {
          var e = D.createEvent("MouseEvents");
          e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          a.dispatchEvent(e);
          D.body.removeChild(a);
      }, 66);
      return true;
  }; /* end if('download' in a) */



  //do iframe dataURL download: (older W3)
  var f = D.createElement("iframe");
  D.body.appendChild(f);
  f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
  setTimeout(function() {
      D.body.removeChild(f);
  }, 333);
  return true;
}

function exportFile() {
  download(JSON.stringify(joueurs), "systeme.bskt", "text/plain");

}

