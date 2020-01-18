import functools
import json

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from timepad.db import get_db
from .auth import login_required

bp = Blueprint('report', __name__, url_prefix='/report')

@bp.route('/overview', methods=('GET', 'POST'))
@login_required
def report():
    user_id = session.get('user_id')
    if request.method == 'POST':
        return 'Report Post'

    db = get_db()
    frames = db.execute('select * from timeline where author_id=?', (user_id,)).fetchone()['frames']
    res = '<h1>Report Get</h1>\n'
    for frame in json.loads(frames):
        try:
            res += f"<p>{frame.get('project')}: {frame.get('stop') - frame.get('start')}</p>"
        except:
            pass
    return res
