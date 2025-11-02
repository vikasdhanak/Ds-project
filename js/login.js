// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Use API_BASE from config.js
    const API_URL = typeof API_BASE !== 'undefined' ? API_BASE : 'http://localhost:3000';
    
    const signupModal = document.getElementById('signupModal');
    const loginModal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModal');
    const showLoginLink = document.getElementById('showLogin');
    const showSignupLink = document.getElementById('showSignup');
    
    const screenNameInput = document.getElementById('screenName');
    const urlPreview = document.getElementById('urlPreview');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const loginPasswordInput = document.getElementById('loginPassword');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    // Close modal (optional - you can remove this if you don't want close functionality)
    closeModalBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to close?')) {
            window.close();
        }
    });

    // Switch to login from signup
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'grid';
    });

    // Switch to signup from login
    showSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'grid';
    });

    // Update URL preview as user types
    screenNameInput.addEventListener('input', function() {
        const value = this.value.trim() || 'screenname';
        urlPreview.textContent = value;
    });

    // Toggle password visibility for signup
    togglePassword.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });

    // Toggle password visibility for login
    toggleLoginPassword.addEventListener('click', function() {
        if (loginPasswordInput.type === 'password') {
            loginPasswordInput.type = 'text';
        } else {
            loginPasswordInput.type = 'password';
        }
    });

    // Signup form submission
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('email').value,
            screenName: document.getElementById('screenName').value,
            password: document.getElementById('password').value,
            newsletter: document.getElementById('newsletter').checked,
            disability: document.getElementById('disability').checked
        };
        
        try {
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('Sign up successful! Please login.');
                signupModal.style.display = 'none';
                loginModal.style.display = 'grid';
            } else {
                alert(`Sign up failed: ${result.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Sign up failed. Please try again.');
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : false;
        
        const formData = {
            email: email,
            password: password,
            rememberMe: rememberMe
        };
        
        console.log('Attempting login with:', { email, password: '***' });
        
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                alert(`Login failed: ${errorText}`);
                return;
            }
            
            const result = await response.json();
            console.log('Response data:', result);

            if (result && result.success && result.token) {
                // Save token to localStorage
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                
                console.log('Login successful, redirecting...');
                alert('Login successful!');
                
                // Redirect to main page (adjust path based on where login.html is)
                window.location.href = '../main.html';
            } else {
                console.error('Login failed:', result);
                alert(`Login failed: ${result?.message || 'Invalid response from server'}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again. Check console for details.');
        }
    });
});