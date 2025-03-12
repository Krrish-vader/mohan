from flask import Flask, request, jsonify, render_template, redirect, url_for, session, flash
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/freshmart"
app.secret_key = 'your-secret-key-here'  # Change this to a secure secret key

# Initialize MongoDB
try:
    mongo = PyMongo(app)
    # Test the connection
    mongo.db.command('ping')
    logger.info("MongoDB connected successfully!")
except Exception as e:
    logger.error(f"MongoDB connection error: {str(e)}")
    raise

@app.route('/')
def home():
    if 'user_id' in session:
        return redirect(url_for('index'))
    return redirect(url_for('login'))

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    
    if request.method == 'POST':
        try:
            # Get form data
            name = request.form.get('name')
            email = request.form.get('email')
            password = request.form.get('password')
            confirm_password = request.form.get('confirm_password')
            phone = request.form.get('phone')
            
            # Validate required fields
            if not all([name, email, password, confirm_password, phone]):
                flash('All fields are required', 'danger')
                return redirect(url_for('register'))
            
            # Check if passwords match
            if password != confirm_password:
                flash('Passwords do not match', 'danger')
                return redirect(url_for('register'))
            
            # Check if user already exists
            if mongo.db.users.find_one({'email': email}):
                flash('Email already registered', 'danger')
                return redirect(url_for('register'))
            
            # Create new user
            new_user = {
                'name': name,
                'email': email,
                'password': generate_password_hash(password),
                'phone': phone,
                'created_at': datetime.utcnow()
            }
            
            mongo.db.users.insert_one(new_user)
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            flash('Registration failed. Please try again.', 'danger')
            return redirect(url_for('register'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    
    if request.method == 'POST':
        try:
            email = request.form.get('email')
            password = request.form.get('password')
            
            # Find user
            user = mongo.db.users.find_one({'email': email})
            
            if user and check_password_hash(user['password'], password):
                # Create session
                session['user_id'] = str(user['_id'])
                session['email'] = user['email']
                session['name'] = user['name']
                
                flash('Login successful!', 'success')
                return redirect(url_for('index'))
            else:
                flash('Invalid email or password', 'danger')
                return redirect(url_for('login'))
                
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            flash('Login failed. Please try again.', 'danger')
            return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

@app.route('/check-auth')
def check_auth():
    if 'user_id' in session:
        return jsonify({
            'authenticated': True,
            'user': {
                'email': session.get('email'),
                'name': session.get('name')
            }
        })
    return jsonify({'authenticated': False}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5521)
