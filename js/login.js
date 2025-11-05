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
        
        console.log('🔐 Login form submitted!');
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : false;
        
        console.log('📧 Email:', email);
        console.log('🔒 Password length:', password.length);
        
        const formData = {
            email: email,
            password: password,
            rememberMe: rememberMe
        };
        
        console.log('📤 Sending login request to:', `${API_URL}/api/auth/login`);
        console.log('📦 Form data:', { email, password: '***', rememberMe });
        
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log('✅ Response received!');
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Login failed!');
                console.error('Status:', response.status);
                console.error('Error response:', errorText);
                alert(`❌ Login failed: ${errorText || 'Please check your email and password'}`);
                return;
            }
            
            const result = await response.json();
            console.log('✅ Response data:', result);

            if (result && result.success && result.token) {
                // Save token to localStorage
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                
                console.log('Login successful, redirecting...');
                console.log('Current path:', window.location.pathname);
                alert('Login successful!');
                
                // Redirect to home page (adjust path based on where login.html is)
                // Check if we're on index.html (root) or pages/login.html
                const currentPath = window.location.pathname;
                const isIndexPage = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/');
                const isPagesFolder = currentPath.includes('/pages/');
                
                console.log('Is index page?', isIndexPage);
                console.log('Is pages folder?', isPagesFolder);
                
                if (isPagesFolder) {
                    window.location.href = '../home.html';
                } else {
                    window.location.href = 'home.html';
                }
            } else {
                console.error('❌ Login failed - Invalid response:', result);
                alert(`❌ Login failed: ${result?.message || 'Invalid response from server'}`);
            }
        } catch (error) {
            console.error('❌❌❌ LOGIN ERROR CAUGHT:');
            console.error('Error object:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            alert(`❌ Login failed!\n\nError: ${error.message}\n\nCheck browser console (F12) for details.`);
        }
    });
});