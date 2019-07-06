from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from .auth import login_required
from .db import get_db

bp = Blueprint('data', __name__, url_prefix='/data')

@bp.route('/frames', methods=('GET', 'POST'))
@login_required
def register():
    if request.method == 'POST':
        return 'hello'

    db = get_db()
    frames = db.execute('select * from timeline where author_id=?', (session.get('user_id'),)).fetchone()['frames']
    return str(frames)
