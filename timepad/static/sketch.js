
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
  renderTimeline();
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


