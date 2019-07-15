
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
var FOREGROUND;
let timeline;
var del_btn;
var start_btn;
var now_btn;
var done_btn;

// sky gradient
var horizon, zenith;

//////////////////////////////////////////////////////////////////////////////
// Setup and Draww

p5.disableFriendlyErrors = true; // disables FES for performance

function setup() {
  initSky(new Date().getHours());
  frameRate(1);
  reset_offset();
  CONTEXT = 'TIMELINE';
  FOREGROUND = color(100, 255, 100);
  FOREGROUND_ALPHA = color(FOREGROUND.toString());
  FOREGROUND_ALPHA.setAlpha(100);
  BUTTON_PRESSED = false;
  strokeJoin(ROUND);
  strokeCap(ROUND);

  // style
  fg = FOREGROUND.toString();
  select('html').style('color', fg);
  select('a').style('color', fg);
  for(let b of selectAll('button')) {
    b.style('border', '2px solid ' + fg);
    b.style('color', fg);
  }
  createCanvas(windowWidth,windowHeight);

  // buttons
  del_btn = select('#delete_btn');
  del_btn.hide();
  del_btn.mousePressed(delete_btn_callback);
  del_btn.touchStarted(delete_btn_callback);

  start_btn = select('#start_btn');
  start_btn.mousePressed(start_btn_callback);

  now_btn = select('#now_btn');
  now_btn.mousePressed(jumpt_to_now);

  edit_btn = select('#edit_btn');
  edit_btn.hide();
  edit_btn.mousePressed(edit_btn_callback);

  done_btn = select('#done_edit_btn');
  done_btn.mousePressed(done_edit_callback);

  timeline = new Timeline();

  loadFrames();
}

function draw() {
  OFFSET = LAST_OFFSET + now();

  background(24);
  drawSky();

  if (CONTEXT == 'TIMELINE') {
    drawTimeline();

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
// Button Callbacks

function start_btn_callback() {
  BUTTON_PRESSED = true;
  startFrame();
  start_btn.html('Stop')
  start_btn.style('background', FOREGROUND_ALPHA);
  start_btn.mousePressed(stop_btn_callback);
}

function stop_btn_callback() {
  BUTTON_PRESSED = true;
  stopFrame();
  start_btn.html('Start')
  start_btn.style('background', 'none');
  start_btn.mousePressed(start_btn_callback);
}

function jumpt_to_now() {
  BUTTON_PRESSED = true;
  reset_offset();
  redraw();
}

function edit_btn_callback() {
  BUTTON_PRESSED = true;
  CONTEXT = 'EDITING'
  var form = select('#edit_frame_form');
  select('#toolbar').hide();
  //form.center();
  form.style('display', 'flex');
  redraw();
}

function done_edit_callback() {
  BUTTON_PRESSED = true;
  CONTEXT = 'TIMELINE';
  var form = select('#edit_frame_form');
  form.hide();
  select('#toolbar').show();
  return false;
}

function delete_btn_callback() {
  BUTTON_PRESSED = true;
  deleteFrame();
}

//////////////////////////////////////////////////////////////////////////////
// p5 Events

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function touchStarted() {
  if (CONTEXT != 'TIMELINE') {
    return;
  } else {
    framesTouch();
    timeline.touched();
    redraw();
  }
}

function touchEnded() {
  BUTTON_PRESSED = false;
}

function touchMoved() {
  if (BUTTON_PRESSED == true) {
    return false;
  } else {
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
