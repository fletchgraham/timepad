class Timeline {

  touched() {
    START = OFFSET;
    DELTA_Y = mouseY;
    DOWN_Y = mouseY;
  }

  dragged() {
    DELTA_Y = mouseY - DOWN_Y;
    OFFSET = START + DELTA_Y * ZOOM;
    LAST_OFFSET = OFFSET - now();
  }

  render() {
    var top_date = new Date(toSeconds(0) * 1000);
    var bottom_millis = toSeconds(height) * 1000;
    var draw_time = roundToHour(top_date);
    for (var i = draw_time.getTime(); i > bottom_millis; i -= (60 * 60 * 1000)) {
      draw_time.setTime(i);
      var px = toPixels(draw_time.getTime() / 1000);
      var opacity = px / height * 150;

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
}
