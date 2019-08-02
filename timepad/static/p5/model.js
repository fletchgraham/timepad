class Model {
  constructor() {
    this.context = 'mainscreen';
    this.frames = [];
    this.settings = {
      background_color: color(10),
      fill_color: color(250, 100),
      stroke_color: color(255),
      active_color: color(255, 200),
      sky: false
    };
    this.zoom = 100;
    this.offset = now();
    this.last_offset = 0;
  }

  duration(project) {
    var total = 0;
    for (let f of this.frames) {
      if (f.project == project) {
        total += f.duration();
      }
    }
    return total;
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

  loadSettings(json) {
    this.settings.background_color = color(json.background_color);
    this.settings.fill_color = color(json.fill_color);
    this.settings.stroke_color = color(json.stroke_color);
    this.settings.active_color = color(json.active_color);
    this.settings.sky = json.sky;
  }

  saveSettings() {
    var ob = {
      background_color: this.settings.background_color.toString(),
      fill_color: this.settings.fill_color.toString(),
      stroke_color: this.settings.stroke_color.toString(),
      active_color: this.settings.active_color.toString(),
      sky: this.settings.sky
    };
    var msg =  JSON.stringify(ob);
    httpPost('/data/settings', msg, function(result) {
      redraw();
    });
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
