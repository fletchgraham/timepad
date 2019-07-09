
//////////////////////////////////////////////////////////////////////////////
// Global Variables

// view transforms
var LAST_OFFSET = 0;
var OFFSET = 0;
var ZOOM = 1;

// for calculating drag deltas
var DOWN_Y = 0;
var DELTA_Y = 0;
var START = 0;

// dropfile indicator
let FILE = '';

// model
let FRAMES = [];

// ui
var CONTEXT;
let start_btn;
let delete_btn;
let timeline;


//////////////////////////////////////////////////////////////////////////////
// Setup and Draww

function setup() {
  frameRate(1);
  OFFSET = now();
  LAST_OFFSET = 0;
  CONTEXT = 'SCRUB';
  const c = createCanvas(windowWidth,windowHeight);
  c.drop(gotFile); // dropfile event triggers callback

  // delet frame button
  delete_btn = createButton('Delete Frame');
  delete_btn.style('color', 'red')
  delete_btn.position(10, 45);
  delete_btn.mousePressed(delete_btn_callback);
  delete_btn.touchStarted(delete_btn_callback);
  delete_btn.addClass('button')
  
  // add frame button
  start_btn = createButton('Start / Stop');
  start_btn.position(10, 100);
  start_btn.mousePressed(start_btn_callback);
  start_btn.addClass('button')

  timeline = new Timeline();

  loadFrames();
}

function draw() {
  OFFSET = LAST_OFFSET + now();
  background(24);
  timeline.render();
  for (f in FRAMES) {
    frame = FRAMES[f];
    if (frame.recording == true) {
      frame.stop = OFFSET;
    }
    renderFrame(frame);
  }
  renderCrosshair();
  renderDebug();
  //noLoop();
}

//////////////////////////////////////////////////////////////////////////////
// Button Callbacks

function start_btn_callback() {
  CONTEXT = 'BTN_PRESSED';
  startFrame();
  start_btn.mousePressed(stop_btn_callback);
}

function stop_btn_callback() {
  CONTEXT = 'BTN_PRESSED';
  stopFrame();
  start_btn.mousePressed(start_btn_callback);
}


function delete_btn_callback() {
  CONTEXT = 'BTN_PRESSED';
  deleteFrame();
}

//////////////////////////////////////////////////////////////////////////////
// p5 Events

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function touchStarted() {
  if (CONTEXT == 'BTN_PRESSED') {
    return;
  } else {
    framesTouch();
    timeline.touched();
    redraw();
  }
}

function touchEnded() {
  CONTEXT = 'SCRUB';
}

function touchMoved() {
  if (CONTEXT == 'BTN_PRESSED') {
    return false;
  } else {
    timeline.dragged();
    redraw();
    return false;
  }
}

function gotFile(file) {
  FILE = 'You dropped a file! Good Job!';
  redraw();
}

//////////////////////////////////////////////////////////////////////////////
// Timeline

class Timeline {

  touched() {
    START = OFFSET;
    DELTA_Y = mouseY;
    DOWN_Y = mouseY;
  }

  dragged() {
    DELTA_Y = mouseY - DOWN_Y;
    OFFSET = START + DELTA_Y * ZOOM;
    LAST_OFFSET = OFFSET - now();
  }

  render() {
    for (var i = 0; i < height; i++) {
      if ((toSeconds(i)) % 100 == 0) {
        stroke(50);
        fill(50);
        line(0, i, width, i);
        textSize(12);
        text(str(toSeconds(i)), 10, i);
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////////////
// Frame Controls

// frame array: [start, stop, project, uid, tags, edited?]

class Frame {
  constructor(start) {
    this.start = start;
    this.stop = start + 100;
    this.project = 'project';
    this.selected = true;
    this.recording = false;
  }
}

/** Returns true if the mouse is over the given frame. */
function overFrame(frame) {
  var x = mouseX;
  var y = mouseY;
  var x1 = 50;
  var x2 = width - 50;
  var y1 = toPixels(frame.stop);
  var y2 = toPixels(frame.start);

  if (x1 < x && x < x2 && y1 < y && y < y2) {
    return true;
  } else {
    return false;
  }
}

/** Draw the a representation of the given frame. */
function renderFrame(frame) {
  // frame rect
  rectMode(CORNERS);
  stroke(0, 0 , 255)
  if (frame.selected == true) {
    stroke(255);
  }
  fill(0,0,100);
  if (frame.recording == true) {
    noFill();
  }
  rect(50, toPixels(frame.stop), width - 50, toPixels(frame.start), 10);

  // frame info
  noStroke();
  fill(255);
  text(frame.project, 60, toPixels(frame.start)-10)
}

/** Loop through frames and remove those that are selected. */
function deleteFrame() {
  for (f in FRAMES) {
    if (FRAMES[f].selected == true) {
      FRAMES.splice(f, 1);
    }
  }
  sync();
}

function startFrame() {
  deselectFrames();
  new_frame = new Frame(toSeconds(height / 2));
  new_frame.recording = true;
  FRAMES.push(new_frame);
}

function stopFrame() {
  deselectFrames();
  for (f in FRAMES) {
    frame = FRAMES[f];
    if (frame.recording == true) {
      frame.recording = false;
    }
  }
  sync();
}

function deselectFrames() {
  for (f in FRAMES) {
    FRAMES[f].selected = false;
  }
}

/** Leave only the frame that's directly under the cursor selected. */
function framesTouch() {
  for (f in FRAMES) {
    FRAMES[f].selected = false;
  }
  // reverse loop so the top ones are seleced first
  for (var i = FRAMES.length; i--;) {
    var frame = FRAMES[i];
    if (overFrame(frame)) {
      frame.selected = true;
      return true;
    }
  }
}

function loadFrames() {
  httpGet('data/frames', function(response) {
    json_response = JSON.parse(str(response));
    FRAMES = [];
    for (j in json_response) {
      new_frame = new Frame(json_response[j].start);
      new_frame.stop = json_response[j].stop;
      new_frame.project = json_response[j].project;
      new_frame.selected = false;
      FRAMES.push(new_frame);
    }
    redraw();
  });
}


//////////////////////////////////////////////////////////////////////////////
// Helpful Utilities

function sync() {
  var response;
  httpPost('/data/frames', JSON.stringify(FRAMES), function(result) {
    response = result;
    redraw();
  });
  return response;
}

function now() {
  n = Math.round(new Date() / 1000);
  return n;
}

function toSeconds(pixels) {
  secs = Math.round(-(pixels - height/2) * ZOOM + OFFSET);
  return secs;
}

function toPixels(seconds) {
  px = -((seconds - OFFSET) / ZOOM) + height/2;
  return px;
}

//////////////////////////////////////////////////////////////////////////////
// Debug Info

function renderCrosshair() {
  var size = 15;
  stroke(255);
  var mid = height/2;
  line(width/2 - size, mid, width/2 + size, mid);
  mid = width/2;
  line(mid, height/2 - size, mid, height/2 + size);
}

function renderDebug() {
  // font settings
  fill(255);
  textSize(16);
  noStroke();
  textAlign(RIGHT);
  margin = 10;

  // debug redouts
  text(FILE, width - margin, height - margin - 50);
  text('context: ' + CONTEXT, width - margin, height - margin - 25);
  text('offset: ' + str(OFFSET), width - margin, height - margin);

  // draw now marker
  text('NOW', width - margin, toPixels(now()));

  textAlign(LEFT);

}

