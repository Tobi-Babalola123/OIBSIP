from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a strong random value for production

# Mock database to store users (username: password)
users_db = {}

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if username in users_db:
            flash('Username already exists!', 'error')
        else:
            users_db[username] = password
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if username in users_db and users_db[username] == password:
            session['username'] = username
            flash('Login successful!', 'success')
            return redirect(url_for('secured'))
        else:
            flash('Invalid username or password.', 'error')
    return render_template('login.html')

@app.route('/secured')
def secured():
    if 'username' in session:
        return render_template('secured.html', username=session['username'])
    flash('You need to log in first.', 'error')
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('You have been logged out.', 'success')
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
