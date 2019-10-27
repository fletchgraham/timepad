class Settings {
  constructor() {
    this.background_color = color('rgb(200,200,200)');
    this.fill_color = color('rgb(255,255,255)');
    this.stroke_color = color('rgb(0,0,0)');
    this.active_color = color('rgb(0,255,255)');
    this.sky= false;
    this.project_colors = {};
  }

  load(json) {
    try {
      this.background_color = color(json.background_color);
      this.fill_color = color(json.fill_color);
      this.stroke_color = color(json.stroke_color);
      this.active_color = color(json.active_color);
    }
    catch(err) {
      this.background_color = color('rgb(200,200,200)');
      this.fill_color = color('rgb(255,255,255)');
      this.stroke_color = color('rgb(0,0,0)');
      this.active_color = color('rgb(0,255,255)');
    }
    this.sky = json.sky;
    this.project_colors = json.project_colors;
    if (this.project_colors == undefined) {
      this.project_colors = {};
    }
  }

  save() {
    var ob = {
      background_color: this.background_color.toString(),
      fill_color: this.fill_color.toString(),
      stroke_color: this.stroke_color.toString(),
      active_color: this.active_color.toString(),
      sky: this.sky,
      project_colors : this.project_colors
    };
    var msg =  JSON.stringify(ob);
    httpPost('/data/settings', msg, function(result) {
      redraw();
    });
  }
}
