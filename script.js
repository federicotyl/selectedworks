let images = [];

function preload(){
images[0] = loadImage("images/project1.jpg");
images[1] = loadImage("images/project2.jpg");
images[2] = loadImage("images/project3.jpg");
}

function setup(){
let canvas = createCanvas(windowWidth, windowHeight);
canvas.parent("canvas-container");
background(244);
}

function draw(){}

function mouseMoved(){
spawnImage(mouseX, mouseY);
}

function touchStarted(){
spawnImage(mouseX, mouseY);
}

function spawnImage(x,y){

let img = random(images);

let w = random(220,380);
let h = img.height/img.width * w;

push();
translate(x,y);
rotate(random(-0.2,0.2));
imageMode(CENTER);
image(img,0,0,w,h);
pop();

}

function windowResized(){
resizeCanvas(windowWidth,windowHeight);
}
