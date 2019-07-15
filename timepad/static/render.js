// Functions that draw things. Organized top to bottom //

//////////////////////////////////////////////////////////////////////////////
// Heads up display (overlays)

/** Draw the crosshair in the middle of the window. */
function drawCrosshair() {
  var centerX = width/2;
  var centerY = height/2;
  var size = 50;
  var focus = 3; // how far in do the hairs reach
  stroke(255);
  strokeWeight(2)
  noFill()
  circle(centerX, centerY, size);
  line(centerX - size/2, centerY, centerX - size/focus, centerY);
  line(centerX + size/focus, centerY, centerX + size/2, centerY);
  line(centerX, centerY - size/2, centerX, centerY - size/focus);
  line(centerX, centerY + size/focus, centerX, centerY + size/2);
}

/** Draw helpful, yet perhaps impermanent info. */
function drawDebug() {
    // font settings
    fill(255);
    textSize(16);
    noStroke();
    textAlign(RIGHT);
    margin = 10;

    // debug redouts
    text('context: ' + CONTEXT, width - margin, height - margin - 25);
    text('offset: ' + str(OFFSET), width - margin, height - margin);

    textAlign(LEFT);
}

function drawNow() {
  var n = toPixels(now());
  var h = 30; // height of flag
  var w = 90; // width of flag
  var x = w + 10; // x point of flag

  noFill();
  stroke(255);
  strokeWeight(2);

  // verticies of the flag
  beginShape();
  vertex(x, n);
  vertex(x - h/2, n - h/2);
  vertex(x - w, n - h/2);
  vertex(x - w, n + h/2);
  vertex(x - h/2, n + h/2);
  vertex(x, n);
  vertex(width/2 - 40, n);
  endShape();

  fill(255);
  textSize(18);
  noStroke();
  textAlign(CENTER, CENTER);
  text('NOW', x - w/2 - 10, toPixels(now()));
  textAlign(LEFT);
}

//////////////////////////////////////////////////////////////////////////////
// Frame

/** Draw a representation of the given frame. */
function drawFrame(frame) {
    // frame rect
    rectMode(CORNERS);
    stroke(255);
    strokeWeight(1);
    fill(255, 100);
    if (frame.selected == true) {
        stroke(255);
        fill(255, 200);
    }
    if (frame.recording == true) {
        noFill();
    }
    rect(50, toPixels(frame.stop), width - 50, toPixels(frame.start), 5);

    // frame info
    noStroke();
    fill(255);
    textSize(12);
    text(frame.project, 60, toPixels(frame.start)-10)
}

//////////////////////////////////////////////////////////////////////////////
// Timeline

/** Draw the ruled, calendar-like background of the app */
function drawTimeline() {
  var top_date = new Date(toSeconds(0) * 1000);
  var bottom_millis = toSeconds(height) * 1000;
  draw_time = roundToHour(top_date);
  for (var i = draw_time.getTime(); i > bottom_millis; i -= (60 * 60 * 1000)) {
    draw_time.setTime(i);
    px = toPixels(draw_time.getTime() / 1000);
    opacity = px / height * 80;

    stroke(255, opacity);
    fill(255, opacity);

    if (draw_time.getHours() == 0) {
      strokeWeight(5);
      line(0, px, width, px);
      noStroke();
      textSize(18);
      text(str(draw_time), 10, px - 5);
    } else if (ZOOM < 200) {

      // hour lines
      strokeWeight(1);
      line(0, px, width, px);

      // hour labels
      noStroke();
      textSize(12);
      text(str(draw_time), 10, px);
    }
  }
}

//////////////////////////////////////////////////////////////////////////////
// Sky

function drawSky() {
  var horizon = color(234, 214, 199);
  var zenith = color(24, 57, 120);
  var r = height*1.6; // pythagorus helps cover the screen
  drawGradient(horizon, zenith);
}

function drawGradient(horizon, zenith) {
  h = height;
  w = width;
  for (let i=h; i>0; i --) {
    var c = lerpColor(zenith, horizon, i/h)
    strokeWeight(1);
    stroke(c);
    line(0, i, w, i);
  }
}
