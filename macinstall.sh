python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=timepad
export FLASK_ENV=development
flask init-db
flask run --host=0.0.0.0
