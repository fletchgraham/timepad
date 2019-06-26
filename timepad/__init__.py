from flask import Flask

###############################################################################
# App Factory

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    configure(app, test_config=test_config)

    @app.route('/')
    def hello(): # a simple hello world
        return 'Hello, I am Timepad.'

    return app

###############################################################################
# Helpers

def configure(app, test_config=None):
    app.config.from_mapping(
	   SECRET_KEY='dev',
       )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)
