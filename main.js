//console.log("test");

var canvas = document.getElementById('mon_canvas'),
context = canvas.getContext('2d');
var uploadInput = document.getElementById("upload-input");
//var uploadForm = document.getElementById("upload-form");
var playButton = document.getElementById("play");
var timeSlider = document.getElementById("time-slider");
var timeDisplay = document.getElementById("time-value");
var t = 0;
var totalTime;
var drag = false;
var joueurSelect = null;
var relativeX, relativeY;
var play = false;
var basketCourt = new Image();
basketCourt.src = "basketcourt.png";

var joueurs = [];
var save = {};
save.joueurs = joueurs;

/*uploadInput.onchange = function() {
  uploadForm.submit();
}*/

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
  //console.log("bit loaded");
  context.drawImage(basketCourt, 0, 0, canvas.width, canvas.height);
}

canvas.load();

timeSlider.oninput = function() {
  t = +timeSlider.value;
  timeDisplay.innerHTML = "t = "+t;
  canvas.draw();
}

//canvas.ondragover(console.log("test"));

function Joueur(x, y, z, imgurl, vecteurs) {

  this.xinit=x;
  this.x=x;
  this.yinit=y;
  this.y=y;
  this.z=z;
  this.vecteurs=vecteurs;
  this.img=new Image();
  this.img.src = imgurl;
  this.width = this.img.width;
  this.height = this.img.height;

  this.draw = function() {
    //console.log("dessin du joueur");
    context.drawImage(this.img, this.x*canvas.width, this.y*canvas.height);
  }

  this.img.onload = this.draw();

}

canvas.draw = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(basketCourt, 0, 0, canvas.width, canvas.height);

  for (var i = 0; i < joueurs.length; i++) {
    calcCoordsJoueur(joueurs[i]);
    joueurs[i].draw();
  }
}

ballonImg = new Image();
ballonImg.src = "ballon.png";

j1 = new Joueur(100,100,1, "ballon.png");
j2 = new Joueur(500, 300, 2, ballonImg);


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

  console.log(joueurSelect);

  //console.log(joueurSelect);

}

/*function displayJoueurs() {
}*/

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
    
    
    var posX = e.pageX - canvas.offsetLeft;
    var posY = e.pageY - canvas.offsetTop;

    console.log("coords : "+posX + "," + posY + " " + relativeX + " " + relativeY);

    joueurSelect.x = posX - relativeX;
    joueurSelect.y = posY - relativeY;

    canvas.draw();
	
  }
}

function mouseOut(e) {
  drag = false;
}

canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mouseup', mouseUp, false);
canvas.addEventListener('mousemove', mouseMove, false);
canvas.addEventListener('mouseout', mouseOut, false);

function parseFile(fileContent) {
  totalTime = 0;
  console.log(totalTime);
  var content = JSON.parse(fileContent);
  var max = 0
  for (var i = 0; i < 5; i++) {
    for (var j=0; j<content.joueurs[i].vecteurs.length; j++){
      totalTime += content.joueurs[0].vecteurs[j].t;
    }
    for (var y=0; y<content.joueurs[i].vecteurs.length; y++){
      var wesh = content.joueurs[i].vecteurs[y].t;
      if (max < wesh){
        max = wesh;
        
      }
    }
    joueurs[i] = new Joueur(content.joueurs[i].x, content.joueurs[i].y, i, "joueur"+(i+1)+".png", content.joueurs[i].vecteurs);
    
  }
  console.log(totalTime);
  console.log(max);
  canvas.draw();

} 
//Sauvegarde par défaut
parseFile('{"joueurs":[{"x":0.08,"y":0.23,"vecteurs":[{"x":0.13,"y":0,"t":2000},{"x":0,"y":0.5,"t":5000}]},{"x":0.23,"y":0.15,"vecteurs":[{"x":0.13,"y":0.15,"t":2500},{"x":0.3,"y":0.5,"t":5000}]},{"x":0.30,"y":0.43,"vecteurs":[{"x":0.13,"y":0.15,"t":2500},{"x":0.3,"y":0.5,"t":5000}]},{"x":0.23,"y":0.65,"vecteurs":[{"x":0.13,"y":0.15,"t":2500},{"x":0.3,"y":0.5,"t":5000}]},{"x":0.05,"y":0.70,"vecteurs":[{"x":0.13,"y":0.15,"t":2500},{"x":0.3,"y":0.5,"t":5000}]}]}');

function uploadFile() {
  //console.log("upload file");
  var file = uploadInput.files[0];

  var read = new FileReader();
  read.readAsBinaryString(file);

  read.onloadend = function() {
    parseFile(read.result);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function toggleAnimation(){
  
  if (playButton.textContent == "Play") 
   {
     playButton.textContent = "Pause";
     play = true;
     playAnimation();
   }
   else 
   {
     playButton.textContent = "Play";
     play = false;
   }
}


//Cette fonction altère les coordonnées x et y du joueur en fonction de t.
function calcCoordsJoueur(joueur) {
  var temp = t;
  var i = 0;
  //console.log(joueur);
  joueur.x = joueur.xinit;
  joueur.y = joueur.yinit;
  while (joueur.vecteurs[i] != undefined) {

    if (temp >= joueur.vecteurs[i].t) {

      joueur.x += joueur.vecteurs[i].x;
      joueur.y += joueur.vecteurs[i].y;
      temp -= joueur.vecteurs[i].t;
      i++;

    } else {
      
      joueur.x += (joueur.vecteurs[i].x/joueur.vecteurs[i].t)*temp; 
      joueur.y += (joueur.vecteurs[i].y/joueur.vecteurs[i].t)*temp;
      return;
    }
  }
}

async function playAnimation(){

  while(play && t<10000) {
    t += 25;
    await sleep(25);
    canvas.draw();
    timeSlider.value = t;
    timeDisplay.innerHTML = "t = "+t;
  }
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
  download(JSON.stringify(save), "Dyson.bskt", "text/plain");

}
