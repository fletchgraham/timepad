// Utilitie functions //

function sync() {
  var msg = JSON.stringify(model.frames)
  var response;
  httpPost('/data/frames', msg, function(result) {
    response = result;
    redraw();
  });
  return response;
}

function now() {
  let n = Math.round(new Date() / 1000);
  return n;
}

function roundToHour(date) {
  let p = 60 * 60 * 1000; // milliseconds in an hour
  return new Date(Math.round(date.getTime() / p ) * p);
}

function toSeconds(pixels) {
  let secs = Math.round(-(pixels - height/2) * model.zoom + model.offset);
  return secs;
}

function toPixels(seconds) {
  let px = -((seconds - model.offset) / model.zoom) + height/2;
  return px;
}
