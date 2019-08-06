// buttons

function define_the_buttons(model) {
  start_btn = select('#start_btn');
  stop_btn = select('#stop_btn');
  now_btn = select('#now_btn');
  edit_btn = select('#edit_btn');
  del_btn = select('#delete_btn');

  background_input = document.getElementById('background_input');
  fill_input = document.getElementById('fill_input');
  stroke_input = document.getElementById('stroke_input');
  active_input = document.getElementById('active_input');
  sky_checkbox = document.getElementById('sky_checkbox');
}

function style_the_dom() {
  var stroke_color = SETTINGS.stroke_color.toString();
  var fill_color = SETTINGS.fill_color.toString();
  var active_color = SETTINGS.active_color.toString();

  select('html').style('color', stroke_color);
  select('a').style('color', stroke_color);

  if (frameset.recording() == null) {
    stop_btn.hide();
  } else {
    start_btn.hide();
  }

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

  stop_btn.style('background', active_color);
}

//////////////////////////////////////////////////////////////////////////////
// Button Callbacks

function start_btn_callback() {
  frameset.start();
  stop_btn.show();
  start_btn.hide();
  sync();
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
  if (frameset.selected() == null) {
    return;
  }
  model.context = 'form';
  var project_input = select('#project_input');
  project_input.value(frameset.selected().project);
  var form = select('#edit_frame_form');
  select('#toolbar').hide();
  form.style('display', 'flex');
  project_input.elt.focus();
  project_input.elt.select();
  redraw();
}

function done_edit_callback() {
  model.context = 'mainscreen';
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

function settings_btn_callback() {
  model.context = 'form';
  var form = select('#settings_form');

  background_input.value = SETTINGS.background_color.toString();
  fill_input.value = SETTINGS.fill_color.toString();
  stroke_input.value = SETTINGS.stroke_color.toString();
  active_input.value = SETTINGS.active_color.toString();
  sky_checkbox.checked = SETTINGS.sky;

  select('#toolbar').hide();
  form.style('display', 'flex');
  redraw();
}

function done_settings_callback() {
  model.context = 'mainscreen';
  var form = select('#settings_form');

  SETTINGS.background_color = color(background_input.value)
  SETTINGS.fill_color = color(fill_input.value)
  SETTINGS.stroke_color = color(stroke_input.value)
  SETTINGS.active_color = color(active_input.value)
  SETTINGS.sky = sky_checkbox.checked;

  SETTINGS.save();

  form.hide();

  select('#toolbar').show();
  redraw();
  style_the_dom(model);
  sync();
}


















//
