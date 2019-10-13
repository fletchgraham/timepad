class Settings {
  constructor() {
    this.background_color = color(10);
    this.fill_color = color(250, 100);
    this.stroke_color = color(255);
    this.active_color = color(255, 200);
    this.sky= false;
    this.project_colors = {};
  }

  load(json) {
    this.background_color = color(json.background_color);
    this.fill_color = color(json.fill_color);
    this.stroke_color = color(json.stroke_color);
    this.active_color = color(json.active_color);
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
