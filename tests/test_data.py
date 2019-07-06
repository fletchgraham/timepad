def test_data_loggedout(client):
    res = client.get('data/frames', follow_redirects=True).data
    assert b'Log In' in res

def test_data_loggedin(client, auth):
    auth.login()
    res = client.get('data/frames').data
    assert b'[[],[]]' in res