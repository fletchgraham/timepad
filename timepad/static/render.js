// Functions that draw things. Organized top to bottom //

//////////////////////////////////////////////////////////////////////////////
// Heads up display (overlays)

/** Draw the crosshair in the middle of the window. */
function drawCrosshair() {
  var centerX = width/2;
  var centerY = height/2;
  var size = 50;
  var focus = 3; // how far in do the hairs reach
  stroke(FOREGROUND);
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
    fill(FOREGROUND);
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
  stroke(FOREGROUND);
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

  fill(FOREGROUND);
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
    stroke(FOREGROUND);
    strokeWeight(2);
    var f = color(FOREGROUND.toString());
    f.setAlpha(100);
    fill(f);
    var margin = width/4;
    if (frame.selected == true) {
        stroke(FOREGROUND);
        f.setAlpha(200);
        fill(f);
    }
    if (frame.recording == true) {
        noFill();
    }
    rect(margin, toPixels(frame.stop), width - margin, toPixels(frame.start));

    // frame info
    noStroke();
    fill(FOREGROUND);
    textSize(12);
    text(frame.project, margin + 10, toPixels(frame.start)-10)
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
    opacity = px / height * 150;

    var fg = color(FOREGROUND.toString());
    fg.setAlpha(opacity);

    stroke(fg);
    fill(fg);

    if (draw_time.getHours() == 0) {
      strokeWeight(2);
      line(0, px, width, px);
      noStroke();
      textSize(18);
      text(str(draw_time), 10, px - 5);
    } else if (ZOOM < 200) {

      // hour lines
      textAlign(LEFT, BOTTOM);
      strokeWeight(2);
      line(10, px, width/2, px);

      // hour labels

      noStroke();
      textSize(12);
      text(str(draw_time.getHours()), 105, px);
    }
  }
}

//////////////////////////////////////////////////////////////////////////////
// Sky

/** take and hour btwn 0 and 24 and set the global sky gradient accordingly. */
function initSky(h) {
  var morning, midday, evening, night;
  var times = [0, 6, 12, 18, 24];
  morning = [color(250, 140, 60), color(100, 100, 200)];
  midday = [color(111, 181, 227), color(3, 5, 116)];
  evening = [color(234, 214, 199), color(24, 57, 120)];
  night = [color(10, 0, 50), color(0, 3, 20)];
  if (times[0] < h && h <= times[1]) {
    amt = (h - times[0])/times[1];
    horizon = lerpColor(night[0], morning[0], amt);
    zenith = lerpColor(night[1], morning[1], amt);
  }
  else if (times[1] < h && h <= times[2]) {
    amt = (h - times[1])/times[2];
    horizon = lerpColor(morning[0], midday[0], amt);
    zenith = lerpColor(morning[1], midday[1], amt);
  }
  else if (times[2] < h && h <= times[3]) {
    amt = (h - times[2])/times[3];
    horizon = lerpColor(midday[0], evening[0], amt);
    zenith = lerpColor(midday[1], evening[1], amt);
  }
  else if (times[3] < h && h <= times[4] ) {
    amt = (h - times[3])/times[4];
    horizon = lerpColor(evening[0], night[0], amt);
    zenith = lerpColor(evening[1], night[1], amt);
  }
  else {
    horizon = night[0];
    zenith = night[1];
  }
}

function drawSky() {
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
