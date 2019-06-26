from timepad import create_app

def test_config():
    # app created with no test config
    assert create_app().config['SECRET_KEY'] == 'dev'

    # app created with test config
    app = create_app(test_config={'TESTING':True})
    assert app.config['TESTING'] == True

def test_hello(client):
    assert b'Hello' in client.get('/').data
