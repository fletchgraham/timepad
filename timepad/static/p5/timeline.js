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
    for (var i = draw_time.getTime(); i > bottom_millis; i -= (60 * 60 * 1000)) {
      draw_time.setTime(i);
      var px = toPixels(draw_time.getTime() / 1000);
      var opacity = px / height * 150;

      var fg = color(SETTINGS.stroke_color.toString());
      fg.setAlpha(opacity);

      stroke(fg);
      fill(fg);

      if (draw_time.getHours() == 0) {
        strokeWeight(2);
        line(0, px, width, px);
        noStroke();
        textSize(18);
        text(str(draw_time), 10, px - 5);
      } else if (this.model.zoom < 200) {

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
}
