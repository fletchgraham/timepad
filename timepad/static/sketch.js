var OFFSET = 0;
var DOWN_Y = 0;
var DELTA_Y = 0;

function setup() {
  createCanvas(windowWidth,windowHeight);
}

function draw() {
  background(35);
  ellipse(width/2, height/2 + OFFSET, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function touchStarted() {
  START = OFFSET
  DELTA_Y = mouseY;
  DOWN_Y = mouseY;
  return false;
}

function touchMoved() {
  DELTA_Y = mouseY - DOWN_Y;
  OFFSET = START + DELTA_Y;
}
