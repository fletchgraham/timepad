// Utilitie functions //

function sync() {
    var response;
    httpPost('/data/frames', JSON.stringify(FRAMES), function(result) {
      response = result;
      redraw();
    });
    return response;
}

function now() {
  n = Math.round(new Date() / 1000);
  return n;
}

function roundToHour(date) {
  p = 60 * 60 * 1000; // milliseconds in an hour
  return new Date(Math.round(date.getTime() / p ) * p);
}

function toSeconds(pixels) {
  secs = Math.round(-(pixels - height/2) * ZOOM + OFFSET);
  return secs;
}

function toPixels(seconds) {
  px = -((seconds - OFFSET) / ZOOM) + height/2;
  return px;
}

function reset_offset() {
  OFFSET = now();
  LAST_OFFSET = 0;
}