
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
      if (frame.start > TOP || frame.stop < BOTTOM) {
        continue;
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
        return;
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

  /** Return the frame that is being recorded */
  recording() {
    var frame = null;
    for (let f of this.model.frames) {
      if (f.recording == true) {
        frame = f;
      }
    }
    return frame;
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

  selectNext() {
    var frames = this.model.frames;
    for (var i in frames) {
      if (frames[i].selected == true) {
        if (i == 0) {
          return;
        }
        frames[i].selected = false;
        console.log(i - 1);
        frames[i - 1].selected = true;
        return;
      }
    }
  }

  /** Start recording a new frame at the crosshair's offset */
  start() {
    this.deselectAll();
    let new_frame = new Frame(toSeconds(height / 2));
    new_frame.recording = true;
    new_frame.selected = true;
    this.model.frames.push(new_frame);
  }

  /** Stop recording */
  stop() {
    this.deselectAll();
    for (let f in this.model.frames) {
      let frame = this.model.frames[f];
      if (frame.recording == true) {
        if (frame.stop - frame.start < 60) {
          this.model.frames.splice(f, 1);
        } else {
        frame.recording = false;
        frame.selected = true;
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

  duration() {
    return this.stop - this.start;
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
    let sc = settings.stroke_color;
    let fc = settings.fill_color;
    let ac = settings.active_color;

    let bottom = toPixels(this.start);
    let top = toPixels(this.stop);
    let project_color = settings.project_colors[this.project]

    if (project_color == undefined) {
      project_color = color(255)
    } else {
      project_color = color(project_color)
    }

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

    // color blob
    fill(project_color)
    rect(width - margin - 50, top, width-margin, bottom)

    // info
    noStroke();
    fill(sc);
    textSize(16);
    textAlign(LEFT, TOP);
    //var wide_enough = textWidth(this.notes) < width - margin * 2;
    var one_line_high = bottom - top > 30;
    var two_lines_high = bottom - top > 60;

    var dur = secondsToDurHours(this.duration());
    var total = secondsToDurHours(model.duration(this.project));
    var readout = this.project;
    if (this.recording == false) {
      readout += ' ' + dur + ' / ' + total;
    }

    if (one_line_high == false) {
      return;
    } else if (two_lines_high == false) {
      text(readout, margin + 10, top + 10);
    } else {
      text(readout, margin + 10, top + 10);
      text(this.notes, margin + 10, top + 30, width - margin * 2 - 60, bottom - top - 40)
    }

  }
}

// watson frame object format:
// [start, stop, project, uid, tags, edited?]
