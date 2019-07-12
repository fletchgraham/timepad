// Functions that draw things. Organized top to bottom //

//////////////////////////////////////////////////////////////////////////////
// Heads up display (overlays)

/** Draw the crosshair in the middle of the window. */
function renderCrosshair() {
    var size = 15;
    stroke(255);
    var mid = height/2;
    line(width/2 - size, mid, width/2 + size, mid);
    mid = width/2;
    line(mid, height/2 - size, mid, height/2 + size);
  }

/** Draw helpful, yet perhaps impermanent info. */
function renderDebug() {
    // font settings
    fill(255);
    textSize(16);
    noStroke();
    textAlign(RIGHT);
    margin = 10;

    // debug redouts
    text('context: ' + CONTEXT, width - margin, height - margin - 25);
    text('offset: ' + str(OFFSET), width - margin, height - margin);

    // draw now marker
    text('NOW', width - margin, toPixels(now()));

    textAlign(LEFT);
}

//////////////////////////////////////////////////////////////////////////////
// Frame

/** Draw a representation of the given frame. */
function renderFrame(frame) {
    // frame rect
    rectMode(CORNERS);
    stroke(0, 0 , 255);
    strokeWeight(2);
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

//////////////////////////////////////////////////////////////////////////////
// Timeline

/** Draw the ruled, calendar-like background of the app */
function renderTimeline() {
    for (var i = 0; i < height; i++) {
      if ((toSeconds(i)) % 100 == 0) {
        stroke(50);
        fill(50);
        line(0, i, width, i);
        noStroke();
        textSize(12);
        text(str(toSeconds(i)), 10, i);
      }
    }
  }
