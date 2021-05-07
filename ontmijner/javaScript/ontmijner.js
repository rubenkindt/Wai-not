/*
*---------------------------- Ontmijner.js---------------------------------------------*
| 				 		  Made By Ruben Kindt 										   |
|as an assignment by Ku Leuven for Webtechnologie: theorie (B-KUL-YI6699), for Wai-not |
|																					   |
*--------------------------------------------------------------------------------------*
*/
var db=false;//turn on false to disable the databank
var aantalbommen=5;
var moeilijkheidsgraad=1.0;// best tussen 1 en 0.5


var canvasLeft=0;
var canvasTop=0;
var ctx;
var canvas;
var bommen=[];
var ontploft=[];
var playAgain=0;
var time_score=0;
var gestart=0;
var stopTimer=0;
var bomImg,explosieImg,goedGedaanImg,achtergrondImg;
var audioBom = new Audio();
var audiogoedGedaan = new Audio();
var scoretimer,bomtimer;

function bouw(){
	bouwCanvas();
	bouwGame();
}
function bouwCanvas(){
	canvas=document.getElementById("tekenvenster");
	canvas.width=window.innerWidth-30;	//voorkomt scoll-balkjes in de iframe
	canvas.height=window.innerHeight-30;
	canvasTop=canvas.offsetTop;
	canvasLeft=canvas.offsetLeft;

	ctx = canvas.getContext("2d");
	achtergrondImg=document.getElementById("achtergrond");
	bomImg=document.getElementById("bom");
	explosieImg=document.getElementById("explosie");
	goedGedaanImg=document.getElementById("goedGedaan");	
	audioBom = document.getElementById("boem_mp3");
	audiogoedGedaan= document.getElementById("goedGedaan_mp3");
	canvas.addEventListener('click', clicked);
}
function bouwGame(){
	for(i=0;i<aantalbommen;i++){
		bommen.push(new rechtH(canvas.width*Math.random(), canvas.height*Math.random(), size=(canvas.width*getRandom()),size));//gebruikte foto's zijn hebben 1 op 1 ratio
		if(bommen[i].isBuiten()){
			bommen.splice(i,1);//bom weg gooien
			i--;	//bom maken
		}
	}
	//ajax();
	draw();
}

function getRandom() {
	var max=0.30*moeilijkheidsgraad;
	var min=0.10*moeilijkheidsgraad;
	return Math.random() * (max - min) + min;
}
function clear(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function draw(){
	clear();
	ctx.drawImage(achtergrondImg,0,0,canvas.width,canvas.height);

	for(i=0;i<bommen.length;i++){
		bommen[i].print();
	}
	var allemaalOntploft=true;
	for (i=0;i<bommen.length;i++){
		if (!bommen[i].ontploft){
			allemaalOntploft=false;
		}
	}
	ctx.stroke();
	if(allemaalOntploft) stopTimer=1;
	
}
function rechtH(x,y,w,h) {//linkerbovenhoek =X en Y,widht, height
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
	this.ontploft=0;

    this.bevat = function(x, y) {
        return (x > this.x && x <= (this.x + this.w) && y > this.y && y <= (this.y + this.h));
    }
	
	this.print = function(){
		switch(this.ontploft){
			case 0: ctx.drawImage(bomImg, x,y,w,this.h);break;
			case 1: ctx.drawImage(explosieImg, x,y,w,this.h); break;			
			default:
			case 2: break;
		}
	}
	
	this.isBuiten= function (){
		
		if(canvasLeft>this.x || (this.x+this.w)>canvas.width || (canvasTop)>this.y || (this.y+this.h)>canvas.height){
			return true;
		}
		return false;
	}
}
function clicked(event){
	var x,y;
	x = event.pageX - canvasLeft;
    y = event.pageY - canvasTop;
	//console.log(x+" "+y);
	if(gestart==0){
		score();
		wegExplosie();
		gestart=1;
	}	
	for(i=bommen.length-1;i>=0;i--){	//bovenste bom eerst weg halen
		if(bommen[i].bevat(x,y)&&bommen[i].ontploft==0){
			bommen[i].ontploft=1;
			audioBom.pause();
			audioBom.currentTime = 0;
			audioBom.play();
			break;
		}
	}
	if(playAgain){
		if(resetButton.bevat(x,y)){
			resetSpel();
		}
	}
}
function wegExplosie(){	//na een bepaalde tijd de geexplodeerde bommen niet meer tekenen
	for(i=0;i<bommen.length;i++){
		if(bommen[i].ontploft==1){
			bommen[i].ontploft=2;
		}
		if(stopTimer){bommen[i].ontploft=2;}//alles clear
	}
	draw();
	if(!stopTimer){
		bomtimer=setTimeout(wegExplosie, 500);	
	}
}
function score (){
	if(!stopTimer){
		time_score++;
		draw();
		scoretimer= setTimeout(score, 50);
	}else{
		endscreen();
	}
}
function endscreen(){// parts copied form Pieter-Jan's template
	clearTimeout(scoretimer);
	clearTimeout(bomtimer);
	
	clear();
	ctx.drawImage(achtergrondImg,0,0,canvas.width,canvas.height);
	ctx.globalAlpha = 0.20;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);// achtergrond donkerder maken
	ctx.globalAlpha = 1;	
	
	audiogoedGedaan.pause();
	audiogoedGedaan.currentTime = 0;
	audiogoedGedaan.play();
	
	ctx.fillStyle = "white";
	ctx.roundRect(canvas.width/4,canvas.height/3,canvas.width/2,canvas.height/5,10).fill();
	ctx.fillStyle = "#F78897";
	resetButton=new rechtH(canvas.width*2/7,canvas.height/2,canvas.width*3/7,canvas.height/10);
	ctx.roundRect(resetButton.x,resetButton.y,resetButton.w,resetButton.h,10).fill();
	playAgain=1;
	ctx.roundRect(0,0,0,0,10).fill();//bug remover

	ctx.fillStyle = "white";
	ctx.font="small-caps 40px arial";
	ctx.fillText("SPEEL OPNIEUW", canvas.width/3,canvas.height*11/19,canvas.width/3);
	ctx.font="small-caps 20px arial";
	normaliseerdeSore=((100-(time_score/aantalbommen))*aantalbommen);
	document.getElementById("score").innerHTML = normaliseerdeSore.toString();
	ctx.fillStyle = "black";
	if (normaliseerdeSore<50){
		ctx.fillText("Goed zo!!", canvas.width*2/5,canvas.height*9/20,canvas.width/2);
	}else{		
		ctx.fillText("Goed zo!! jouw score is "+normaliseerdeSore.toFixed(0), canvas.width*4/15,canvas.height*9/20,canvas.width/2);
	}
}
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  this.beginPath();
  this.moveTo(x+r,y);
  this.arcTo(x+w,y,x+w,y+h,r);
  this.arcTo(x+w,y+h,x,y+h,r);
  this.arcTo(x,y+h,x,y,r);
  this.arcTo(x,y,x+w,y,r);
  this.closePath();
  return this;
}
function resetSpel(){
	if (db){
		databank();
	}
	clear();
	if(aantalbommen<10){
		aantalbommen+=5;
		//console.log("aantal bommen: "+aantalbommen);
	}
	
	if (moeilijkheidsgraad.toFixed(1)>0.5){
			moeilijkheidsgraad-=0.05;
			//console.log("moeilijkheidsgraad "+moeilijkheidsgraad);
	}
	bommen.splice(0,bommen.length);
	ontploft.splice(0,ontploft.lenght);
	allemaalOntploft=false;
	stopTimer=0;
	gestart=0;
	playAgain=0;
	clearTimeout(scoretimer);
	clearTimeout(bomtimer);
	bouwGame();
}