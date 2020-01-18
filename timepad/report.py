import functools

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
    if request.method == 'POST':
        return 'Report Post'

    return 'Report Get'
