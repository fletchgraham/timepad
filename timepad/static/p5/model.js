class Model {
  constructor() {
    this.context = 'mainscreen';
    this.frames = [];
    this.style = {
      background_color: color(10),
      fill_color: color(250, 100),
      stroke_color: color(255),
      active_color: color(255, 200)
    };
    this.zoom = 100;
    this.offset = now();
    this.last_offset = 0;
    this.sky = false;
  }

  loadFrames(json) {
    this.frames = [];
    for (let i of json) {
      let new_frame = new Frame(i.start);
      new_frame.stop = i.stop;
      new_frame.project = i.project;
      new_frame.selected = false;
      this.frames.push(new_frame);
    }
  }

  update() {
    this.offset = this.last_offset + now();
  }

  resetOffset() {
    this.offset = now();
    this.last_offset = 0;
  }
}

// nice green ui colors:
//background_color = color(10);
//fill_color = color(0, 255, 130, 100);
//stroke_color = color(0, 255, 130);
//active_color = color(0, 255, 130, 200);
