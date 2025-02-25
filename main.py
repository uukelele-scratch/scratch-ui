from flask import Flask, render_template, request, jsonify
import scratchattach as sa

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/login', methods=['POST'])
def login():
    body = request.get_json()
    try:
        session = sa.login(body['username'], body['password'])
    except sa.utils.exceptions.LoginFailure:
        return jsonify({'success': False, 'error': 'Login failed'}), 401
    return jsonify({'success': True, 'session': session.id, 'username': session.username})

@app.route('/api/profile/<username>/image')
def profile(username):
    try:
        profile = sa.get_user(username)
        image_url = profile.icon_url
    except sa.utils.exceptions.UserNotFound:
        return jsonify({'success': False, 'error': 'Profile not found'}), 404

    return jsonify({'success': True, 'image': image_url})

app.run(debug=True, host='0.0.0.0', port=8080)