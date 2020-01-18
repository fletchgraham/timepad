import os
from flask import Flask, render_template
from .auth import login_required

###############################################################################
# App Factory

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    configure(app, test_config=test_config)

    register_blueprints(app)

    create_structure(app)

    @app.route('/')
    @login_required
    def timeline(): # a simple hello world
        return render_template('timeline.html')

    from . import db
    db.init_app(app)

    return app

###############################################################################
# Helpers

def configure(app, test_config=None):
    app.config.from_mapping(
	   SECRET_KEY='dev',
       DATABASE=os.path.join(app.instance_path, 'timepad.sqlite'),
       )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

def register_blueprints(app):
    from . import auth
    app.register_blueprint(auth.bp)

    from . import data
    app.register_blueprint(data.bp)

    from . import report
    app.register_blueprint(report.bp)

def create_structure(app):
    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
