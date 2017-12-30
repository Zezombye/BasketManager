//console.log("test");

var canvas = document.getElementById('mon_canvas'),
context = canvas.getContext('2d');
var uploadInput = document.getElementById("upload-input");
//var uploadForm = document.getElementById("upload-form");
var playButton = document.getElementById("play");
var playLabel = document.getElementById("play-label");
var timeSlider = document.getElementById("time-slider");
var timeDisplay = document.getElementById("time-value");
var t = 0;
var totalTime;
var maxTime = 10000;
var drag = false;
var joueurSelect = null;
var relativeX, relativeY;
var dragX, dragY, dragInitialT = 0;
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

function setTime(time) {
	if (time < dragInitialT) {
		t = dragInitialT;
	} else if (time > maxTime) {
		t = maxTime;
	} else {
		t = time;
	}
	timeSlider.value = t;
	timeDisplay.innerHTML = "t = "+t;
	canvas.draw();
}

timeSlider.oninput = function() {
	setTime(+timeSlider.value);
}

//canvas.ondragover(console.log("test"));

function Joueur(x, y, z, imgurl, vecteurs) {

	this.xInit=x;
	this.x=x;
	this.yInit=y;
	this.y=y;
	this.z=z;
	this.vecteurs=vecteurs;
	this.img=new Image();
	this.img.src = imgurl;
	this.width = this.img.width;
	this.height = this.img.height;

	this.draw = function() {
		//console.log("dessin du joueur");
		context.drawImage(this.img, this.x, this.y);
	}

	this.img.onload = this.draw();

}

canvas.draw = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(basketCourt, 0, 0, canvas.width, canvas.height);

	for (var i = 0; i < joueurs.length; i++) {
		calcCoordsJoueur(joueurs[i]);
		if (joueurs[i] === joueurSelect) {
			context.globalAlpha = 0.4;
			joueurs[i].draw();
			context.globalAlpha = 1;
		} else {
			joueurs[i].draw();
		}
	}
	
	if (drag && joueurSelect !== null) {
		//context.globalAlpha = 0.4;
		context.drawImage(joueurSelect.img, dragX, dragY);
		//context.globalAlpha = 1;
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

		//console.log(joueurs[i].x + " " + x + " " + joueurs[i].width);

		if (joueurs[i].x <= x && joueurs[i].x+joueurs[i].width > x
				&& joueurs[i].y <= y && joueurs[i].y+joueurs[i].height > y
				&& (joueurSelect === null || joueurSelect.z < joueurs[i].z)
				) {

			joueurSelect = joueurs[i];
		
			//console.log("joueur sélectionné : "+i);
		}
	}


	//console.log(joueurSelect);

}

/*function displayJoueurs() {
}*/

function stopDrag() {
	
	drag = false;
	joueurSelect.vecteurs.add(
	
	joueurSelect = null;
	canvas.draw();
	dragInitialT = 0; 
}

function mouseDown(e) {
	var posX = e.pageX - canvas.offsetLeft;
	var posY = e.pageY - canvas.offsetTop;
	drag = true;
	dragInitialT = t;
	console.log("mouse down");
	getJoueur(e);
	if (joueurSelect != null) {
		relativeX = posX-joueurSelect.x;
		relativeY = posY-joueurSelect.y
		
		//On supprime les vecteurs postérieurs au temps du drag
		var temp = 0;
		var i;
		for (i = 0; joueurSelect.vecteurs[i] !== undefined && temp+joueurSelect.vecteurs[i].t < t; i++) {
			temp += joueurSelect.vecteurs[i].t;
		}
		//console.log("temp = "+temp);
		if (joueurSelect.vecteurs[i] !== undefined) {
			if (t-temp < joueurSelect.vecteurs[i].t) {
		
				joueurSelect.vecteurs[i].x *= (t-temp)/joueurSelect.vecteurs[i].t;
				joueurSelect.vecteurs[i].y *= (t-temp)/joueurSelect.vecteurs[i].t;
				joueurSelect.vecteurs[i].t = t-temp;
			}
			if (t-temp === 0) {
				joueurSelect.vecteurs.splice(i, 1)
				i--;
			}
		}
		i++;
		while (joueurSelect.vecteurs[i] !== undefined) {
			joueurSelect.vecteurs.splice(i, 1)
		}
		//console.log(joueurSelect.vecteurs);
		
	}
}

function mouseUp() {
	stopDrag();
}

function mouseMove(e) {
	if (drag) {
	
		//getJoueur(e);
		
		if (joueurSelect === null) return;
		
		var posX = e.pageX - canvas.offsetLeft;
		var posY = e.pageY - canvas.offsetTop;


		dragX = posX - relativeX;
		dragY = posY - relativeY;

		//console.log("coords : "+posX + "," + posY + " relative: " + relativeX + " " + relativeY + " init: "+joueurSelect.xInit + " " + joueurSelect.yInit);
		//console.log(joueurs[2].xInit + " " + joueurs[2].yInit);
		canvas.draw();
	
	}
}

function mouseOut(e) {
	stopDrag();
}

function mouseScroll(e) {
	
	//if (drag) {
		
		setTime(t + 10*e.deltaY);
		
	//}
}

canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mouseup', mouseUp, false);
canvas.addEventListener('mousemove', mouseMove, false);
canvas.addEventListener('mouseout', mouseOut, false);
canvas.addEventListener('wheel', mouseScroll, false);

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
		joueurs[i] = new Joueur(content.joueurs[i].x*canvas.width, content.joueurs[i].y*canvas.height, i, "joueur"+(i+1)+".png", content.joueurs[i].vecteurs);
		
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
	
	if (playLabel.textContent == "Play") 
	 {
		 playLabel.textContent = "Pause";
		 play = true;
		 playAnimation();
	 }
	 else 
	 {
		 playLabel.textContent = "Play";
		 play = false;
	 }
}


//Cette fonction altère les coordonnées x et y du joueur en fonction de t.
function calcCoordsJoueur(joueur) {
	var temp = t;
	var i = 0;
	//console.log(joueur);
	joueur.x = joueur.xInit;
	joueur.y = joueur.yInit;
	while (joueur.vecteurs[i] !== undefined) {

		if (temp >= joueur.vecteurs[i].t) {

			joueur.x += joueur.vecteurs[i].x*canvas.width;
			joueur.y += joueur.vecteurs[i].y*canvas.height;
			temp -= joueur.vecteurs[i].t;
			i++;

		} else {
			
			joueur.x += (joueur.vecteurs[i].x*canvas.width/joueur.vecteurs[i].t)*temp; 
			joueur.y += (joueur.vecteurs[i].y*canvas.height/joueur.vecteurs[i].t)*temp;
			return;
		}
	}
}

async function playAnimation(){
	var step = 24;
	while(play) {
		setTime(t+step);
		await sleep(step);
		/*if (t>10000){
			t=10000;
		}*/
	}

}


function download(strData, strFileName, strMimeType) {
	
	var D = document,
		A = arguments,
		b = D.createElement("a"),
		
		d = A[0],
		n = A[1],
		t = A[2] || "text/plain";

	//build download link:
	b.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


	if (window.MSBlobBuilder) { // IE10
			var bb = new MSBlobBuilder();
			bb.append(strData);
			return navigator.msSaveBlob(bb, strFileName);
	} /* end if(window.MSBlobBuilder) */



	if ('download' in b) { //FF20, CH19
			b.setAttribute("download", n);
			//b.innerHTML = "downloading...";
			D.body.appendChild(b);
			setTimeout(function() {
					var e = D.createEvent("MouseEvents");
					e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					b.dispatchEvent(e);
					D.body.removeChild(b);
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
