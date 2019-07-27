// buttons

function define_the_buttons(model) {
  start_btn = select('#start_btn');
  stop_btn = select('#stop_btn');

  now_btn = select('#now_btn');

  edit_btn = select('#edit_btn');

  del_btn = select('#delete_btn');
}

function style_the_dom(model) {
  var stroke_color = model.style.stroke_color.toString();
  var fill_color = model.style.fill_color.toString();

  select('html').style('color', stroke_color);
  select('a').style('color', stroke_color);

  stop_btn.style('background', model.style.active_color.toString());
  stop_btn.hide();

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
  frameset.start();
  stop_btn.show();
  start_btn.hide();
  redraw()
}

function stop_btn_callback() {
  frameset.stop();
  start_btn.show();
  stop_btn.hide();
  redraw()
  sync();
}

function jumpt_to_now() {
  model.resetOffset();
  redraw();
}

function edit_btn_callback() {
  select('#project_input').value(frameset.selected().project);
  var form = select('#edit_frame_form');
  select('#toolbar').hide();
  form.style('display', 'flex');
  redraw();
  sync();
}

function done_edit_callback() {
  frameset.selected().project = select('#project_input').value();
  var form = select('#edit_frame_form');
  form.hide();
  select('#toolbar').show();
  redraw();
  sync();
}

function delete_btn_callback() {
  frameset.deleteSelected();
  redraw();
  sync();
}
