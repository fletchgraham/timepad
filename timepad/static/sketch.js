var OFFSET = 0;
var DOWN_Y = 0;
var DELTA_Y = 0;

function setup() {
  const c = createCanvas(windowWidth,windowHeight);
  background(24);
  c.drop(gotFile);
}

function draw() {
  background(24);
  noFill();
  stroke(255);
  ellipse(width/2, height/2 + OFFSET, 200);
  noLoop();
}

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
  frames = loadJSON(file.data);
  console.log(file.name);
  console.log(file.size);
  console.log(frames);
}
