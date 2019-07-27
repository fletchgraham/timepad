
//////////////////////////////////////////////////////////////////////////////
// Frameset (collection of frames)

class Frameset {
  constructor(model) {
    this.model = model; // bind to the model
  }

  /** Draw all of the frames */
  render() {
    for (let frame of this.model.frames) {
      if (frame.recording == true) {
        frame.stop = this.model.offset;
      }
      frame.render();
    }
  }

  /** Leave only the frame that's directly under the cursor selected. */
  touched() {
    this.deselectAll();
    // reverse loop so the top ones are seleced first
    for (let i = this.model.frames.length; i--;) {
      let frame = this.model.frames[i];
      if (frame.over(mouseX, mouseY)) {
        frame.selected = true;
      }
    }
  }

  /** Return the selected frame */
  selected() {
    for (let frame of this.model.frames) {
      if (frame.selected == true) {
        return frame;
      }
    }
  }

  /** Set the selected attribute of all frames to false */
  deselectAll() {
    for (let frame of this.model.frames) {
      frame.selected = false;
    }
  }

  /** Loop through frames and remove those that are selected. */
  deleteSelected() {
    for (let f in this.model.frames) {
      let frame = this.model.frames[f];
      if (frame.selected == true) {
        this.model.frames.splice(f, 1);
      }
    }
  }

  /** Start recording a new frame at the crosshair's offset */
  start() {
    this.deselectAll();
    let new_frame = new Frame(toSeconds(height / 2));
    new_frame.recording = true;
    this.model.frames.push(new_frame);
  }

  stop() {
    this.deselectAll();
    for (let frame of this.model.frames) {
      if (frame.recording == true) {
        if (frame.stop - frame.start < 60) {
          this.model.frames.splice(f, 1);
        } else {
        frame.recording = false;
      }
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////////////
// Frame (single frame)

class Frame {
  constructor(start) {
    this.start = start;
    this.stop = start + 100;
    this.project = 'project';
    this.selected = true;
    this.recording = false;
  }

  /** Return true if the given x and y are within the frame */
  over(x, y) {
    var x1 = width/4; // left side of frame
    var x2 = width - width/4; // right side of frame
    var y1 = toPixels(this.stop);
    var y2 = toPixels(this.start);

    if (x1 < x && x < x2 && y1 < y && y < y2) {
      return true;
    } else {
      return false;
    }
  }

  /** Draw a representation of the frame. */
  render() {
    let sc = model.style.stroke_color;
    let fc = model.style.fill_color;
    let ac = model.style.active_color;

    let bottom = toPixels(this.start);
    let top = toPixels(this.stop);

    // rectangle
    rectMode(CORNERS);
    stroke(sc);
    strokeWeight(2);
    fill(fc);
    var margin = width/4;
    if (this.selected == true) {
      fill(ac);
    }
    if (this.recording == true) {
      noFill();
    }
    rect(margin, top, width - margin, bottom);

    // info
    noStroke();
    fill(sc);
    textSize(16);
    text(this.project, margin + 10, bottom - 10)
  }
}

// watson frame object format:
// [start, stop, project, uid, tags, edited?]