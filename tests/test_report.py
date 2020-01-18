import json

def test_report_loggedout(client):
    res = client.get('report/overview', follow_redirects=True).data
    assert b'Sign In' in res

def test_report_loggedin(client, auth):
    auth.login()
    res = client.get('report/overview').data
    assert b'Report' in res

def test_overview(client, auth):
    auth.login()
    post_data = [
        {'project':'project1','start':200,'stop':300},
        {'project':'project2','start':500,'stop':1000},
        ]
    post_data = json.dumps(post_data)
    client.post('data/frames', data=post_data).data
    res = client.get('report/overview').data
    assert b'project1' in res
