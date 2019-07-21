// Functions that draw things. Organized top to bottom //

//////////////////////////////////////////////////////////////////////////////
// Heads up display (overlays)

/** Draw the crosshair in the middle of the window. */
function drawCrosshair() {
  var centerX = width/2;
  var centerY = height/2;
  var size = 50;
  var focus = 3; // how far in do the hairs reach
  stroke(settings.stroke_color);
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
    fill(settings.stroke_color);
    textSize(16);
    noStroke();
    textAlign(RIGHT);
    margin = 10;

    // debug redouts
    text('context: ' + CONTEXT, width - margin, height - margin - 25);
    text('offset: ' + str(OFFSET), width - margin, height - margin);
    if (BUTTON_PRESSED == true) {
      text('BUTTON PRESSED', width - margin, height - margin - 50);
    }

    textAlign(LEFT);
}

function drawNow() {
  var n = toPixels(now());
  var h = 30; // height of flag
  var w = 90; // width of flag
  var x = w + 10; // x point of flag

  fill(settings.fill_color);
  stroke(settings.stroke_color);
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

  fill(settings.stroke_color);
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
    stroke(settings.stroke_color);
    strokeWeight(2);
    fill(settings.fill_color);
    var margin = width/4;
    if (frame.selected == true) {
        fill(settings.active_color);
    }
    if (frame.recording == true) {
        noFill();
    }
    rect(margin, toPixels(frame.stop), width - margin, toPixels(frame.start));

    // frame info
    noStroke();
    fill(settings.stroke_color);
    textSize(16);
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

    var fg = color(settings.stroke_color.toString());
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
