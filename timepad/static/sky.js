
class Sky {
  constructor(settings) {
    this.settings = settings;
    this.zenith_lookup = {
      0: color(0, 3, 20),
      6: color(100, 100, 200),
      12: color(3, 5, 116),
      18: color(24, 57, 120),
      24: color(0, 3, 20)
    };
    this.horizon_lookup = {
      0: color(10, 0, 50),
      6: color(250, 140, 60),
      12: color(111, 181, 227),
      18: color(234, 214, 199),
      24: color(10, 0, 50)
    };
  }
  render() {
    if (settings.sky != true) {
      return;
    }
    var c1 = now_color(this.horizon_lookup);
    var c2 = now_color(this.zenith_lookup);
    drawGradient(c1, c2);
  }
}

//////////////////////////////////////////////////////////////////////////////
// Helpers

function now_color(lookup) {
  var n = hour() + minute()/60;
  var color1 = color(0);
  var color2 = color(0);
  var t1 = 0;
  var t2 = 0;
  var amt = 0;

  for (i in lookup) {
    if (n < i) {
      color2 = lookup[i];
      t2 = i;
      break;
    }
    color1 = lookup[i];
    t1 = i;
  }

  amt = (n - t1) / (t2 - t1);
  return lerpColor(color1, color2, amt);

}

function drawGradient(bottom, top) {
  h = height;
  w = width;
  for (let i=h; i>0; i --) {
    var c = lerpColor(top, bottom, i/h)
    strokeWeight(1);
    stroke(c);
    line(0, i, w, i);
  }
}
