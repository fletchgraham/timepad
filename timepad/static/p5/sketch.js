
//////////////////////////////////////////////////////////////////////////////
// Global Variables

// view transforms
var LAST_OFFSET = 0;
var OFFSET = 0;
var ZOOM = 100;

// for calculating drag deltas
var DOWN_Y = 0;
var DELTA_Y = 0;
var START = 0;

// model
let FRAMES = [];

// ui
var CONTEXT;
var BUTTON_PRESSED;
var UI_A;
var settings;
var sky;
let timeline;
var del_btn;
var start_btn;
var now_btn;
var done_btn;

//////////////////////////////////////////////////////////////////////////////
// Setup and Draww

p5.disableFriendlyErrors = true; // disables FES for performance

function setup() {
  frameRate(1);
  createCanvas(windowWidth,windowHeight);

  settings = new Settings();
  timeline = new Timeline();
  sky = new Sky(settings);

  CONTEXT = 'TIMELINE';
  BUTTON_PRESSED = false;
  reset_offset();

  define_the_buttons();
  style_the_dom();
  loadFrames();

  // style
  strokeJoin(ROUND);
  strokeCap(ROUND);
}

function draw() {
  OFFSET = LAST_OFFSET + now();

  background(settings.background_color);

  sky.render();

  if (CONTEXT == 'TIMELINE') {
    timeline.render();

    // draw frames
    for (f in FRAMES) {
      frame = FRAMES[f];
      if (frame.recording == true) {
        frame.stop = OFFSET;
      }
      drawFrame(frame);
    }

    drawNow();
    drawCrosshair();

    for (let touch of touches) {
      ellipse(touch.x, touch.y, 100);
    }
  }

  drawDebug();

}

//////////////////////////////////////////////////////////////////////////////
// p5 Events

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function touchStarted() {
  if (BUTTON_PRESSED == true) {
    return;
  }
  if (CONTEXT != 'TIMELINE') {
    return;
  }
  else {
    framesTouch();
    timeline.touched();
    redraw();
  }
}

function touchEnded() {
  BUTTON_PRESSED = false;
  redraw();
}

function touchMoved() {
  if (BUTTON_PRESSED == true) {
    return false;
  }
  if (CONTEXT != 'TIMELINE') {
    return;
  }
  else {
    timeline.dragged();
    redraw();
    return false;
  }
}

function mouseWheel(event) {
  //console.log(ZOOM);
  var dampening = 1 / (1000 / ZOOM);
  ZOOM = constrain(ZOOM + event.delta * dampening, 10, 1000);
  redraw();
  //return false;
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

function selectedFrame() {
  for (let frame of FRAMES) {
    if (frame.selected == true) {
      return frame;
    }
  }
}

/** Returns true if the mouse is over the given frame. */
function overFrame(frame) {
  var x = mouseX;
  var y = mouseY;
  var x1 = width/4;
  var x2 = width - width/4;
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
      if (frame.stop - frame.start < 60) {
        FRAMES.splice(f, 1);
      } else {
      frame.recording = false;
    }
    }
  }
  sync();
}

function deselectFrames() {
  edit_btn.hide();
  del_btn.hide();
  for (f in FRAMES) {
    FRAMES[f].selected = false;
  }
}

/** Leave only the frame that's directly under the cursor selected. */
function framesTouch() {
  deselectFrames();
  // reverse loop so the top ones are seleced first
  for (var i = FRAMES.length; i--;) {
    var frame = FRAMES[i];
    if (overFrame(frame)) {
      frame.selected = true;
      edit_btn.show();
      del_btn.show();
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
