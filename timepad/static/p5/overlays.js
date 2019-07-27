class Crosshair {
  constructor(model) {
    this.model = model;
  }
  render() {
    var centerX = width/2;
    var centerY = height/2;
    var size = 50;
    var focus = 3; // how far in do the hairs reach
    stroke(this.model.style.stroke_color);
    strokeWeight(2)
    noFill()
    circle(centerX, centerY, size);
    line(centerX - size/2, centerY, centerX - size/focus, centerY);
    line(centerX + size/focus, centerY, centerX + size/2, centerY);
    line(centerX, centerY - size/2, centerX, centerY - size/focus);
    line(centerX, centerY + size/focus, centerX, centerY + size/2);

    var d = new Date(this.model.offset * 1000);
    var readout = d.toString().substr(16, 5);

    noStroke();
    fill(this.model.style.stroke_color);
    textSize(18);
    textAlign(CENTER, TOP);
    text(readout, centerX, centerY + size/2 + 10);
  }
}

class NowMarker {
  constructor(model) {
    this.model = model;
  }
  render() {
    var n = toPixels(now());
    var h = 30; // height of flag
    var w = 90; // width of flag
    var x = w + 10; // x point of flag

    fill(this.model.style.fill_color);
    stroke(this.model.style.stroke_color);
    strokeWeight(2);

    // verticies of the flag
    beginShape();
    vertex(x, n);
    vertex(x - h/2, n - h/2);
    vertex(x - w, n - h/2);
    vertex(x - w, n + h/2);
    vertex(x - h/2, n + h/2);
    vertex(x, n);
    vertex(width/2 - 40, n);
    endShape();

    fill(this.model.style.stroke_color);
    textSize(18);
    noStroke();
    textAlign(CENTER, CENTER);
    text('NOW', x - w/2 - 10, toPixels(now()));
    textAlign(LEFT);
  }
}

class ElapsedTime {
  constructor(model) {
    this.model = model;
  }
  render() {
    if (frameset.recording() == null) {
      return;
    }
    let t = this.model.offset - frameset.recording().start;
    let minutes = Math.round(t / 60);
    let hours = Math.round(minutes * 100 / 60) / 100;

    textSize(width/10);
    textAlign(CENTER, CENTER);

    if (hours < 1) {
      text(minutes + ' MINUTES', width/2, height/4);
    } else {
      text(hours + ' HOURS', width/2, height/4);
    }
  }
}
