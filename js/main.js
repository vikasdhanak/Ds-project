console.log('🚀 Main.js loaded!');

const images = document.querySelectorAll('.banner_image');
let currentIndex = 0;

function showNextImage() {
  if (images.length === 0) return; // No images on this page
  images[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.add('active');
}

if (images.length > 0) {
  setInterval(showNextImage, 5000);
  images[currentIndex].classList.add('active');
}

// Check if user is logged in
const authToken = localStorage.getItem('authToken');
const user = JSON.parse(localStorage.getItem('user') || 'null');

const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const uploadBtn = document.querySelector('.Upload');

console.log('Auth token:', authToken ? 'Present' : 'Not found');
console.log('User:', user);

if (user && authToken) {
  // User is logged in - show user name and logout button
  console.log('User is logged in');
  
  if (signInBtn) {
    signInBtn.textContent = `👤 ${user.screenName || user.email}`;
    signInBtn.parentElement.href = '#';
    signInBtn.style.cursor = 'default';
  }
  
  if (signUpBtn) {
    signUpBtn.textContent = 'Logout';
    signUpBtn.parentElement.href = '#';
    signUpBtn.parentElement.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        alert('Logged out successfully!');
        window.location.href = 'main.html';
      }
    });
  }
  
  // Enable upload button
  if (uploadBtn) {
    uploadBtn.href = 'pages/upload.html';
    uploadBtn.style.opacity = '1';
    uploadBtn.style.cursor = 'pointer';
  }
} else {
  // User not logged in
  console.log('User not logged in');
  
  // Disable upload button
  if (uploadBtn) {
    uploadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Please login first to upload books!');
      window.location.href = 'pages/login.html';
    });
  }
}

// Use API_BASE from config.js (automatically detects localhost vs production)
const API_URL = typeof API_BASE !== 'undefined' ? API_BASE : 'http://localhost:3000';
const API_BASE_URL = `${API_URL}/api`;

async function loadBooks() {
  const container = document.getElementById('category_items');
  if (!container) return;
  container.innerHTML = '<p>Loading books…</p>';

  try {
    const res = await fetch(`${API_BASE_URL}/books`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} - ${text}`);
    }
    const response = await res.json();
    const books = response.data?.books || [];
    if (!Array.isArray(books) || books.length === 0) {
      container.innerHTML = '<p>No books found.</p>';
      return;
    }

    container.innerHTML = '';
    books.forEach(b => {
      const card = document.createElement('div');
      card.className = 'book-card';
      
      // Use backend cover image if available, otherwise use placeholder
      // Replace backslashes with forward slashes for URL
      const coverPath = b.coverPath ? b.coverPath.replace(/\\/g, '/') : null;
      const coverUrl = coverPath
        ? `${API_URL}/${coverPath}` 
        : 'assets/images/img1.webp';
      
      console.log(`Book: ${b.title}, Cover URL: ${coverUrl}`);
      
      card.innerHTML = `
        <img src="${coverUrl}" 
             alt="${escapeHtml(b.title)}" 
             class="trending-books" 
             onerror="console.error('Failed to load:', this.src); this.src='assets/images/img1.webp'" 
             onload="console.log('Loaded:', this.src)" />
        <div class="book-description">
          <p><strong>Title:</strong> ${escapeHtml(b.title)}</p>
          <p><strong>Author:</strong> ${escapeHtml(b.author)}</p>
          <p><strong>Category:</strong> ${escapeHtml(b.category || '')}</p>
          <p><strong>Description:</strong> ${escapeHtml(b.description || '')}</p>
        </div>
        <div class="book-actions">
          <a class="read-btn" href="${API_URL}/api/books/${b.id}/file" target="_blank">Open PDF</a>
          <button class="add-library-btn">Add to Library</button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('loadBooks error', err);
    container.innerHTML = `<p style="color:red">Error loading books: ${escapeHtml(err.message || err)}</p>`;
  }
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

document.addEventListener('DOMContentLoaded', loadBooks);
