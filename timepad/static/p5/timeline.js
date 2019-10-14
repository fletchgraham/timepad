class Timeline {
  constructor(model) {
    this.model = model;
    this.start = 0;
    this.deltaY = 0;
    this.downY = 0
  }

  touched() {
    this.start = this.model.offset;
    this.deltaY = mouseY;
    this.downY = mouseY;
  }

  dragged() {
    this.deltaY = mouseY - this.downY;
    this.model.offset = this.start + this.deltaY * this.model.zoom;
    this.model.last_offset = this.model.offset - now();
  }

  render() {
    var top_date = new Date(toSeconds(0) * 1000);
    var bottom_millis = toSeconds(height) * 1000;
    var draw_time = roundToHour(top_date);
    var last_marker = 0;
    for (var i = draw_time.getTime(); i > bottom_millis; i -= (60 * 60 * 1000)) {
      draw_time.setTime(i);
      var px = toPixels(draw_time.getTime() / 1000);

      var fg = color(settings.stroke_color.toString());
      var fg_light = color(fg.toString())
      fg_light.setAlpha(20)

      stroke(fg);
      fill(fg);

      if (draw_time.getHours() == 0) {
        strokeWeight(2);
        line(0, px, width, px);
        noStroke();
        textSize(18);

        // current day
        push();
        translate(15, (last_marker + px)/2);
        rotate(-3.141/2);
        textAlign(CENTER, CENTER);
        text(str(draw_time).substring(0, 10), 0, 0);
        pop();

        textAlign(LEFT, BOTTOM);
        last_marker = px;

      } else if (this.model.zoom < 200) {

        // hour lines
        textAlign(LEFT, BOTTOM);
        strokeWeight(2);
        stroke(fg_light)
        line(30, px, width, px);

        // hour labels
        noStroke();
        textSize(12);
        text(str(draw_time.getHours()), 40, px);
      }
      if (i < bottom_millis + (60 * 60 * 1000)) {
        // previous day's date
        push();
        translate(15, (last_marker + height)/2);
        rotate(-3.141/2);
        textAlign(CENTER, CENTER);
        noStroke();
        textSize(18);
        text(str(draw_time).substring(0, 10), 0, 0);
        pop();
      }
    }
    // rulers
    stroke(fg);
    strokeWeight(2);
    line(30, 0, 30, height);
  }
}
