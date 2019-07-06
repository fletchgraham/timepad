
///// Global Variales /////

var OFFSET = 0;
var DOWN_Y = 0;
var DELTA_Y = 0;

let FILE = 'Try dropping a file anywhere.';
let FRAMES = [];

///// Setup and Draw /////

function setup() {
  const c = createCanvas(windowWidth,windowHeight);
  background(24);
  c.drop(gotFile);
  textSize(20)
}

function draw() {
  background(24);
  noFill();
  stroke(255);
  ellipse(width/2, height/2 + OFFSET, 200);
  fill(255);
  noStroke();
  text(FILE, 50, 200)
  noLoop();
}

///// Events /////

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function touchStarted() {
  START = OFFSET
  DELTA_Y = mouseY;
  DOWN_Y = mouseY;
  redraw();
}

function touchMoved() {
  DELTA_Y = mouseY - DOWN_Y;
  OFFSET = START + DELTA_Y;
  redraw();
  return false;
}

function gotFile(file) {
  FILE = 'Got that file :)';
  redraw();
}

///// Models /////

// frame array: [start, stop, project, uid, tags, edited?]


