var CENTRE = -1;
var PANIER_GAUCHE = -2;
var PANIER_DROIT = -3;

var canvas = document.getElementById('mon_canvas'),
context = canvas.getContext('2d');
var uploadInput = document.getElementById("upload-input");
//var uploadForm = document.getElementById("upload-form");
var container = document.getElementById("container");
var playButton = document.getElementById("play");
var playLabel = document.getElementById("play-label");
var timeSlider = document.getElementById("time-slider");
var timeDisplay = document.getElementById("time-value");
var timeMaxInput = document.getElementById("time-max-input");
var vitesseInput = document.getElementById("input-vitesse");
var t = 0;
var maxTime = 10000;
var vitesse = 1;
var drag = false;
var joueurSelect = null;
var joueurBallon = null;
var relativeX, relativeY;
var dragX = -1, dragY = -1, dragInitialT = 0;
var play = false;
var basketCourt = new Image();
basketCourt.src = "images/basketcourt.png";
basketCourt.onload = function() {
	canvas.draw();
}
var ballonImg = new Image();
ballonImg.src = "images/ballon.png";
var ballonTimeline = [];

var joueurs = [];

canvas.onload = function() {
	//console.log("bit loaded");
	//context.drawImage(basketCourt, 0, 0, canvas.width, canvas.height);
	canvas.draw();
}

canvas.load = function() {
	canvas.onload();
}


function setTime(time) {
	if (time < dragInitialT) {
		t = dragInitialT;
	} else if (time > maxTime) {
		t = maxTime;
	} else {
		t = time;
	}
	t = Math.floor(t);
	timeSlider.value = t;
	timeDisplay.innerHTML = "t = "+t+"/"+maxTime;
	
	joueurBallon = null;
	for (var i = 0; i < ballonTimeline.length; i++) {
		if (ballonTimeline[i].tStart <= t && (ballonTimeline[i].tEnd >= t || ballonTimeline[i].tEnd === -1)) {
			joueurBallon = joueurs[ballonTimeline[i].joueur];
		}
	}
	
	canvas.draw();
}

function setMaxTime(time) {
	if (!(time >= 1000 && time <= 1000000)) {
		//alert("Le temps doit être entre 1 000 et 1 000 000");
		return;
	}
	
	maxTime = time;
	timeSlider.max = time;
	setTime(t);
}

timeSlider.oninput = function() {
	setTime(+timeSlider.value);
}

/*timeMaxInput.onkeypress = function(e) {
	if (e.keyCode === 13) {
		setMaxTime(+timeMaxInput.value);
	}
}*/

timeMaxInput.oninput = function(e) {
	setMaxTime(+timeMaxInput.value);
}

/*vitesseInput.onkeypress = function(e) {
	if (e.keyCode === 13) {
		vitesse = +vitesseInput.value;
		if (!(vitesse > 0)) {
			alert("Vitesse invalide");
			vitesse = 1;
		}
	}
}*/
vitesseInput.oninput = function(e) {
	vitesse = +vitesseInput.value;
	if (!(vitesse > 0)) {
		//alert("Vitesse invalide");
		vitesse = 1;
	}
}


//canvas.ondragover(console.log("test"));

function Joueur(x, y, id, imgurl, vecteurs) {
	
	this.xInit=x;
	this.x=x;
	this.yInit=y;
	this.y=y;
	this.id=id;
	this.vecteurs=vecteurs;
	this.img=new Image();
	this.img.src = imgurl;
	this.width = this.img.width;
	this.height = this.img.height;

	this.drawToCoords = function(x, y) {
		context.drawImage(this.img, x-this.width/2, y-this.height/2);
	}
	
	this.draw = function() {
		this.drawToCoords(this.x, this.y);
	}
	
	this.setCoords = function(coords) {
		this.x = coords.x;
		this.y = coords.y;
	}
}


function drawBallon(x, y) {
	var ballonWidth = 75;
	context.drawImage(ballonImg, x-ballonWidth/2, y-ballonWidth/2, ballonWidth, ballonWidth);
}

context.drawArrow = function(fromx, fromy, tox, toy) {
	var headlen = 10;

	var angle = Math.atan2(toy-fromy,tox-fromx);

	//starting path of the arrow from the start square to the end square and drawing the stroke
	context.beginPath();
	context.moveTo(fromx, fromy);
	context.lineTo(tox, toy);
	context.strokeStyle = "#cc0000";
	context.lineWidth = 15;
	context.stroke();

	//starting a new path from the head of the arrow to one of the sides of the point
	context.beginPath();
	context.moveTo(tox, toy);
	context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));

	//path from the side point of the arrow, to the other side point
	context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));

	//path from the side point back to the tip of the arrow, and then again to the opposite side point
	context.lineTo(tox, toy);
	context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));

	//draws the paths created above
	context.strokeStyle = "#cc0000";
	context.lineWidth = 15;
	context.stroke();
	context.fillStyle = "#cc0000";
	context.fill();
}

canvas.draw = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(basketCourt, 0, 0, canvas.width, canvas.height);
	
	for (var i = 0; i < joueurs.length; i++) {
		joueurs[i].setCoords(calcCoordsJoueur(joueurs[i], t));
	}
	
	if (joueurBallon !== null) {
		if (joueurSelect !== joueurBallon) {
			drawBallon(joueurBallon.x, joueurBallon.y);
			if (!play) {
				context.lineWidth = 2;
				context.strokeStyle = "rgba(73, 188, 255, 1)";
				context.strokeRect(joueurBallon.x-joueurBallon.width/2, joueurBallon.y-joueurBallon.height/2, joueurBallon.width, joueurBallon.height);
			}
		}
		
	} else {
		
		var sender, receiver;
		var tPasseStart, tPasseEnd;
		
		for (var i = 0; i < ballonTimeline.length; i++) {
			if (ballonTimeline[i].tStart < t && ballonTimeline[i].tEnd < t) {
				sender = joueurs[ballonTimeline[i].joueur];
				tPasseStart = ballonTimeline[i].tEnd;
			}
			if (ballonTimeline[i].tStart > t) {
				receiver = joueurs[ballonTimeline[i].joueur];
				tPasseEnd = ballonTimeline[i].tStart;
				break;
			}
		}
		
		if (sender !== undefined) {
			if (receiver === undefined) {
				context.globalAlpha = 0.4;
				drawBallon(sender.x, sender.y);
				context.globalAlpha = 1;
				
			} else {
				
				console.log("sender "+sender.id + " receiver "+receiver.id);
				
				senderCoords = calcCoordsJoueur(sender, tPasseStart);
				receiverCoords = calcCoordsJoueur(receiver, tPasseEnd);
				
				drawBallon(senderCoords.x+(receiverCoords.x-senderCoords.x)*(t-tPasseStart)/(tPasseEnd-tPasseStart), senderCoords.y+(receiverCoords.y-senderCoords.y)*(t-tPasseStart)/(tPasseEnd-tPasseStart));
			}
		}
	}
	
	for (var i = 0; i < joueurs.length; i++) {
		if (joueurs[i] === joueurSelect) {
			context.globalAlpha = 0.5;
			joueurs[i].draw();
			if (joueurSelect === joueurBallon) {
				drawBallon(joueurBallon.x, joueurBallon.y);
			}
			context.globalAlpha = 1;
		} else {
			joueurs[i].draw();
			
		}
	}
	
	if (drag && joueurSelect !== null) {
		//context.globalAlpha = 0.4;
		if (joueurSelect === joueurBallon) {
			drawBallon(dragX, dragY);
		}
		joueurSelect.drawToCoords(dragX, dragY);
		context.drawArrow(joueurSelect.x, joueurSelect.y, dragX, dragY);
		var pxPerM = canvas.height/15;
		var dist = Math.sqrt(Math.pow(Math.abs(joueurSelect.x-dragX),2)+Math.pow(Math.abs(joueurSelect.y-dragY),2));
		var meters = dist/pxPerM;
		var time = t-dragInitialT;
		var text = (meters/time*1000).toFixed(3) + " m/s";
		
		context.fillStyle = "black";
		context.font = "bold 16px Arial";
		context.fillText(text, joueurSelect.x+(dragX-joueurSelect.x)/2-context.measureText(text).width/2, joueurSelect.y+(dragY-joueurSelect.y)/2+6);
	}
	
}

//Détermine le joueur sur lequel la souris clique en fonction des coordonnées et du Z-index (id)
function getJoueur(e) {
	var x = e.pageX - container.offsetLeft;
	var y = e.pageY - container.offsetTop;

	result = null;

	for (var i = -3; i < joueurs.length; i++) {

		//console.log(joueurs[i].x + " " + x + " " + joueurs[i].width);

		if (joueurs[i].x-joueurs[i].width/2 <= x && joueurs[i].x+joueurs[i].width/2 > x
				&& joueurs[i].y-joueurs[i].height/2 <= y && joueurs[i].y+joueurs[i].height/2 > y
				&& (result === null || result.id < joueurs[i].id)
				) {

			result = joueurs[i];
		
			//console.log("joueur sélectionné : "+i);
		}
	}
	return result;

	//console.log(joueurSelect);

}


function stopDrag() {
	
	drag = false;
	if (joueurSelect !== null && dragX !== -1 && dragY !== -1) {
		
		//On padde les vecteurs pour éviter qu'il y ait un trou dans la timeline
		var sumT = 0;
		for (var i = 0; i < joueurSelect.vecteurs.length; i++) {
			sumT += joueurSelect.vecteurs[i].t;
		}
		if (sumT !== dragInitialT) {
			joueurSelect.vecteurs.push({
				x: 0,
				y: 0,
				t: dragInitialT-sumT
			});
		}
		
		if (t-dragInitialT !== 0 || joueurSelect.vecteurs.length === 0) {
			joueurSelect.vecteurs.push({
				x: dragX-joueurSelect.x,
				y: dragY-joueurSelect.y,
				t: t-dragInitialT
			});
		} else {
			//On modifie le dernier vecteur
			joueurSelect.vecteurs[joueurSelect.vecteurs.length-1].x += dragX-joueurSelect.x;
			joueurSelect.vecteurs[joueurSelect.vecteurs.length-1].y += dragY-joueurSelect.y;
		}
	}
	
	joueurSelect = null;
	canvas.draw();
	dragInitialT = 0; 
}

function mouseDown(e) {
	
	console.log("mouse down");
	
	if (e.which === 1) {
		
		//Left click
		
		joueurSelect = getJoueur(e);
		if (joueurSelect === null || joueurSelect.id < 0) return;
		
		var posX = e.pageX - container.offsetLeft;
		var posY = e.pageY - container.offsetTop;
		drag = true;
		console.log(drag);
		dragX = -1;
		dragY = -1;
		dragInitialT = t;
		joueurSelect = getJoueur(e);
		relativeX = posX-joueurSelect.x;
		relativeY = posY-joueurSelect.y
		
		//On supprime les vecteurs postérieurs au temps du drag
		var temp = 0;
		var i;
		for (i = 0; joueurSelect.vecteurs[i] !== undefined && temp+joueurSelect.vecteurs[i].t <= t; i++) {
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
			
		
	} else if (e.which === 2 || e.which === 3) {
		
		//Right click
		
		joueurClicDroit = getJoueur(e);
		
		if (joueurClicDroit === null) return;
		
		if (joueurBallon === joueurClicDroit) {
			joueurBallon = null;
		} else if (joueurBallon === null || joueurBallon.id < 0) {
			/*if (ballonTimeline.length > 0 && t - ballonTimeline[ballonTimeline.length-1].tEnd < 200) {
				alert("Il faut au minimum 200 ms pour une passe !");
				return;
			}*/
			joueurBallon = joueurClicDroit;
		} else {
			alert("Le joueur n°"+(joueurBallon.id+1)+" est toujours en possession de la balle !");
			return;
		}
		
		//On enlève le futur de la timeline
		for (var i = 0; i < ballonTimeline.length; i++) {
			if (ballonTimeline[i].tStart >= t) {
				ballonTimeline.splice(i, 1);
			}
		}
		
		if (ballonTimeline.length > 0 && (ballonTimeline[ballonTimeline.length-1].tEnd === -1 || ballonTimeline[ballonTimeline.length-1].tEnd >= t)) {
			ballonTimeline[ballonTimeline.length-1].tEnd = t-1;
		}
		
		if (joueurBallon !== null) {
			ballonTimeline.push({
				joueur: joueurBallon.id,
				tStart: t,
				tEnd: -1
			});
		}
		
		console.log(ballonTimeline);
		
	}
}

function mouseUp() {
	stopDrag();
}

function mouseMove(e) {
	if (drag) {
	
		
		if (joueurSelect === null || joueurSelect.id < 0) return;
		
		var posX = e.pageX - container.offsetLeft;
		var posY = e.pageY - container.offsetTop;


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
	
	setTime(100*Math.floor(t/100) + 100*-e.deltaY/3);
		
}

canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mouseup', mouseUp, false);
canvas.addEventListener('mousemove', mouseMove, false);
canvas.addEventListener('mouseout', mouseOut, false);
canvas.addEventListener('wheel', mouseScroll, false);

function parseFile(fileContent) {
	var content = JSON.parse(fileContent);
	setMaxTime(content.maxTime);
	for (var i = 0; i < content.joueurs.length; i++) {
		
		joueurs[i] = new Joueur(content.joueurs[i].x, content.joueurs[i].y, i, "images/joueur"+(i+1)+".png", content.joueurs[i].vecteurs);
		
	}
	
	ballonTimeline = content.ballonTimeline;
	
	joueurs[CENTRE] = new Joueur(canvas.width/2, canvas.height/2, CENTRE, "", []);
	joueurs[CENTRE].width = 100;
	joueurs[CENTRE].height = 100;
	
	joueurs[PANIER_GAUCHE] = new Joueur(canvas.width*0.06379, canvas.height/2, PANIER_GAUCHE, "", []);
	joueurs[PANIER_GAUCHE].width = 100;
	joueurs[PANIER_GAUCHE].height = 100;
	
	joueurs[PANIER_DROIT] = new Joueur(canvas.width*0.9367, canvas.height/2, PANIER_DROIT, "", []);
	joueurs[PANIER_DROIT].width = 100;
	joueurs[PANIER_DROIT].height = 100;
	
	joueurBallon = joueurs[CENTRE];
	
	setTime(0);
	//canvas.draw();

}

//Default save
parseFile('{"maxTime":10000,"ballonTimeline":[{"joueur":-1,"tStart":0,"tEnd":-1}],"joueurs":[{"xInit":152,"x":152,"yInit":152,"y":152,"id":0,"vecteurs":[],"img":{},"width":101,"height":101},{"xInit":344,"x":344,"yInit":158,"y":158,"id":1,"vecteurs":[],"img":{},"width":101,"height":101},{"xInit":434,"x":434,"yInit":359,"y":359,"id":2,"vecteurs":[],"img":{},"width":101,"height":101},{"xInit":344,"x":344,"yInit":518,"y":518,"id":3,"vecteurs":[],"img":{},"width":101,"height":101},{"xInit":114,"x":114,"yInit":554,"y":554,"id":4,"vecteurs":[],"img":{},"width":101,"height":101},{"xInit":1127,"x":1127,"yInit":152,"y":152,"id":5,"vecteurs":[],"img":{},"width":101,"height":101},{"xInit":935,"x":935,"yInit":158,"y":158,"id":6,"vecteurs":[],"img":{},"width":101,"height":101},{"xInit":845,"x":845,"yInit":359,"y":359,"id":7,"vecteurs":[],"img":{},"width":101,"height":101},{"xInit":935,"x":935,"yInit":518,"y":518,"id":8,"vecteurs":[],"img":{},"width":101,"height":101},{"xInit":1165,"x":1165,"yInit":554,"y":554,"id":9,"vecteurs":[],"img":{},"width":101,"height":101}]}');

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
	 
	canvas.draw();
}


//Cette fonction altère les coordonnées x et y du joueur en fonction de t.
function calcCoordsJoueur(joueur, t) {
	var temp = t;
	var i = 0;
	//console.log(joueur);
	var coords = {};
	coords.x = joueur.xInit;
	coords.y = joueur.yInit;
	while (joueur.vecteurs[i] !== undefined) {

		if (temp >= joueur.vecteurs[i].t) {

			coords.x += joueur.vecteurs[i].x;
			coords.y += joueur.vecteurs[i].y;
			temp -= joueur.vecteurs[i].t;
			i++;

		} else {
			
			coords.x += (joueur.vecteurs[i].x/joueur.vecteurs[i].t)*temp; 
			coords.y += (joueur.vecteurs[i].y/joueur.vecteurs[i].t)*temp;
			return coords;
		}
	}
	return coords;
}

async function playAnimation(){
	var step = 24;
	while(play) {
		setTime(t+step*vitesse);
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
	
	var save = {};
	save.maxTime = maxTime;
	save.ballonTimeline = ballonTimeline;
	save.joueurs = joueurs;
	
	download(JSON.stringify(save, null, 4), "Schema.bskt", "text/plain");

}

window.onload = function() {
	for (var i = 0; i < joueurs.length; i++) {
		joueurs[i].width = joueurs[i].img.width;
		joueurs[i].height = joueurs[i].img.height;
	}
	canvas.draw();
}
