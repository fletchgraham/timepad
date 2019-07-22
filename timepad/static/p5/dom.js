// buttons

function define_the_buttons() {
  del_btn = select('#delete_btn');
  del_btn.hide();
  del_btn.mousePressed(delete_btn_callback);
  del_btn.touchStarted(delete_btn_callback);

  start_btn = select('#start_btn');
  start_btn.mousePressed(start_btn_callback);
  start_btn.touchStarted(start_btn_callback);

  now_btn = select('#now_btn');
  now_btn.mousePressed(jumpt_to_now);
  now_btn.touchStarted(jumpt_to_now);

  edit_btn = select('#edit_btn');
  edit_btn.hide();
  edit_btn.mousePressed(edit_btn_callback);
  edit_btn.touchStarted(edit_btn_callback);

  done_btn = select('#done_edit_btn');
  done_btn.mousePressed(done_edit_callback);
  done_btn.touchStarted(done_edit_callback);
}

function style_the_dom() {
  var stroke_color = settings.stroke_color.toString();
  var fill_color = settings.fill_color.toString();
  select('html').style('color', stroke_color);
  select('a').style('color', stroke_color);
  for(let b of selectAll('input')) {
    b.style('background', fill_color);
    b.style('border', '2px solid ' + stroke_color);
    b.style('color', stroke_color);
  }
  for(let b of selectAll('button')) {
    b.style('background', fill_color);
    b.style('border', '2px solid ' + stroke_color);
    b.style('color', stroke_color);
  }
}

//////////////////////////////////////////////////////////////////////////////
// Button Callbacks

function start_btn_callback() {
  BUTTON_PRESSED = true;
  startFrame();
  start_btn.html('Stop')
  start_btn.style('background', settings.active_color);
  start_btn.mousePressed(stop_btn_callback);
}

function stop_btn_callback() {
  BUTTON_PRESSED = true;
  stopFrame();
  start_btn.html('Start')
  start_btn.style('background', settings.fill_color);
  start_btn.mousePressed(start_btn_callback);
}

function jumpt_to_now() {
  BUTTON_PRESSED = true;
  reset_offset();
  redraw();
}

function edit_btn_callback() {
  BUTTON_PRESSED = true;
  CONTEXT = 'EDITING'
  select('#project_input').value(selectedFrame().project);
  var form = select('#edit_frame_form');
  select('#toolbar').hide();
  //form.center();
  form.style('display', 'flex');
  redraw();
}

function done_edit_callback() {
  BUTTON_PRESSED = true;
  CONTEXT = 'TIMELINE';
  selectedFrame().project = select('#project_input').value();
  var form = select('#edit_frame_form');
  form.hide();
  select('#toolbar').show();
  sync();
  return false;
}

function delete_btn_callback() {
  BUTTON_PRESSED = true;
  deleteFrame();
}
