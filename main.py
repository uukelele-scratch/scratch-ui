from flask import Flask, render_template, request, jsonify
import scratchattach as sa

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    try:
        session = sa.login(body['username'], body['password'])
    except sa.exceptions.LoginFailure:
        return jsonify({'success': False, 'error': 'Login failed'}), 401
    return jsonify({'success': True, 'session': session.id, 'username': session.username})

app.run(debug=True, host='0.0.0.0', port=8080)