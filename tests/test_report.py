def test_report_loggedout(client):
    res = client.get('report/overview', follow_redirects=True).data
    assert b'Sign In' in res

def test_report_loggedin(client, auth):
    auth.login()
    res = client.get('report/overview').data
    assert b'Report' in res
