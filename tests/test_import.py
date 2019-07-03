

def test_import_button_exists(client, auth):
    auth.login()
    assert b'Import' in client.get('/').data

