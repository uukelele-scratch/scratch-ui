from flask import Flask, render_template, request, jsonify
import scratchattach as sa

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/users/<username>')
def user(username):
    return render_template('user.html', username=username)

@app.route('/api/login', methods=['POST'])
def login():
    body = request.get_json()
    try:
        session = sa.login(body['username'], body['password'])
    except sa.utils.exceptions.LoginFailure:
        return jsonify({'success': False, 'error': 'Login failed'}), 401
    return jsonify({'success': True, 'session': session.id, 'username': session.username})

@app.route('/api/user/<username>/image')
def profile(username):
    try:
        profile = sa.get_user(username)
        image_url = profile.icon_url
    except sa.utils.exceptions.UserNotFound:
        return jsonify({'success': False, 'error': 'Profile not found'}), 404

    return jsonify({'success': True, 'image': image_url})

@app.route('/api/user/<username>')
def user_info(username):
    try:
        user = sa.get_user(username)
        user_dict = {
            "success": True,
            "username": user.username,
            "id": user.id,
            "join_date": user.join_date,
            "country": user.country,
            "about": user.about_me,
            "wiwo": user.wiwo,
            "admin": user.scratchteam,
            "new_scratcher": "New Scratcher" if user.is_new_scratcher() else "Scratcher",
            "image": user.icon_url,
            "messages": user.message_count()
        }
        return jsonify(user_dict)

    except sa.utils.exceptions.UserNotFound:
        return jsonify({'success': False, 'error': f'{username} does not exist.'}), 404

app.run(debug=True, host='0.0.0.0', port=8080)