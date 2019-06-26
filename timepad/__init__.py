from flask import Flask

# factory
def create_app():
    app = Flask(__name__)
    
    @app.route('/')
    def hello():
        return 'Hello, I am Timepad.'

    return app


