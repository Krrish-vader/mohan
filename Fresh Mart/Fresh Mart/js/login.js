// Sample user data (replace with your backend authentication)
const users = [
    { email: 'test@example.com', password: 'password123' }
];

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');
    
    try {
        const response = await fetch('http://127.0.0.1:5521/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            loginMessage.className = 'alert alert-success';
            loginMessage.textContent = 'Login successful! Redirecting...';
            loginMessage.style.display = 'block';
            
            // Store user info in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userName', data.user.name);
            
            // Redirect to home page after successful login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            loginMessage.className = 'alert alert-danger';
            loginMessage.textContent = data.error || 'Login failed';
            loginMessage.style.display = 'block';
        }
    } catch (error) {
        loginMessage.className = 'alert alert-danger';
        loginMessage.textContent = 'An error occurred. Please try again.';
        loginMessage.style.display = 'block';
        console.error('Login error:', error);
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message function
function showMessage(message, type) {
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.textContent = message;
    messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    messageDiv.style.display = 'block';
}

// Hide message function
function hideMessage() {
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.style.display = 'none';
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Update UI for logged-in user
        const userEmail = localStorage.getItem('userEmail');
        // You can update the header or show user-specific content here
    }
}); 