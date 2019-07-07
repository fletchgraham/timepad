import json
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from .auth import login_required
from .db import get_db

bp = Blueprint('data', __name__, url_prefix='/data')

@bp.route('/frames', methods=('GET', 'POST'))
@login_required
def register():
    user_id = session.get('user_id')
    if request.method == 'POST':
        sql = 'update timeline set frames=? where author_id=?'
        db = get_db() 
        db.execute(sql, (request.data, user_id,))
        db.commit()
        return request.data

    db = get_db()
    frames = db.execute('select * from timeline where author_id=?', (user_id,)).fetchone()['frames']
    return frames
