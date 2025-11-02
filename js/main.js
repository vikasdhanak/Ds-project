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
      
      // ALWAYS show delete button (backend will handle permissions)
      console.log('�️ Adding delete button for book:', b.id);
      
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
          <a class="read-btn" href="pages/pdf-reader.html?id=${b.id}">📖 Read</a>
          <button class="add-library-btn" onclick="addToLibrary('${b.id}', '${escapeHtml(b.title).replace(/'/g, "\\'")}')">Add to Library</button>
          <button class="delete-book-btn" onclick="deleteBook('${b.id}', '${escapeHtml(b.title).replace(/'/g, "\\'")}')">🗑️ Delete</button>
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

// Delete book function
async function deleteBook(bookId, bookTitle) {
  // Check both 'token' and 'authToken' for compatibility
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  
  console.log('🔑 Checking token...', token ? 'FOUND' : 'NOT FOUND');
  
  if (!token) {
    alert('Please login first!');
    window.location.href = '/pages/login.html';
    return;
  }

  if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
    return;
  }

  try {
    console.log('🗑️ Deleting book:', bookId);
    const response = await fetch(`${API_URL}/api/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    console.log('Delete response:', result);

    if (result.success) {
      alert('✅ Book deleted successfully!');
      loadBooks(); // Reload the books
    } else {
      alert('❌ ' + (result.message || 'Failed to delete book'));
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    alert('❌ Error deleting book. Please try again.');
  }
}

// Add to library function
async function addToLibrary(bookId, bookTitle) {
  console.log('=== ADD TO LIBRARY CLICKED ===');
  console.log('Book ID:', bookId);
  console.log('Book Title:', bookTitle);
  console.log('API_URL:', API_URL);
  
  // Check both 'token' and 'authToken' for compatibility
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  
  console.log('📚 Token check:', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'NULL'
  });
  
  if (!token) {
    console.error('❌ No authentication token found!');
    alert('Please login first to add books to your library!');
    window.location.href = '/pages/login.html';
    return;
  }

  try {
    const requestUrl = `${API_URL}/api/library`;
    console.log('📚 Making request to:', requestUrl);
    console.log('📚 Request body:', { bookId: bookId });
    
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bookId: bookId })
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const result = await response.json();
    console.log('Add to library response:', result);

    if (result.success) {
      alert(`✅ "${bookTitle}" added to your library!`);
    } else {
      if (result.message && result.message.includes('already in library')) {
        alert(`📚 "${bookTitle}" is already in your library!`);
      } else {
        alert('❌ ' + (result.message || 'Failed to add book to library'));
      }
    }
  } catch (error) {
    console.error('❌ Error adding to library:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    alert('❌ Error adding book to library. Please try again.');
  }
  console.log('=== ADD TO LIBRARY FINISHED ===');
}

// Make functions available globally
window.deleteBook = deleteBook;
window.addToLibrary = addToLibrary;

// Load My Library function
async function loadMyLibrary() {
  console.log('=== LOAD MY LIBRARY CLICKED ===');
  console.log('API_URL:', API_URL);
  
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  console.log('Token check:', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0
  });
  
  if (!token) {
    console.error('❌ No token found!');
    alert('Please login first to view your library!');
    window.location.href = '/pages/login.html';
    return;
  }

  try {
    const requestUrl = `${API_URL}/api/library`;
    console.log('📚 Fetching library from:', requestUrl);
    
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const result = await response.json();
    console.log('Library response:', result);

    if (!response.ok) {
      console.error('❌ Response not OK:', result);
      alert('Failed to load library: ' + (result.message || 'Server error'));
      return;
    }

    if (result.success && result.data && result.data.books) {
      const books = result.data.books;
      console.log('📚 Found books:', books.length);
      
      if (books.length === 0) {
        alert('📚 Your library is empty! Add some books to get started.');
        // Still reload all books
        loadBooks();
        return;
      }

      // Display library books
      displayLibraryBooks(books);
    } else {
      console.error('❌ Unexpected response format:', result);
      alert('Failed to load library: ' + (result.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('❌ Error loading library:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    alert('Error loading your library. Please try again.');
  }
  console.log('=== LOAD MY LIBRARY FINISHED ===');
}

function displayLibraryBooks(books) {
  console.log('=== DISPLAY LIBRARY BOOKS ===');
  console.log('Books to display:', books);
  
  const container = document.getElementById('category_items');
  console.log('Container element:', container);
  
  if (!container) {
    console.error('❌ Category items container not found!');
    alert('Error: Could not find books display area');
    return;
  }

  // Scroll to books section
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Clear and show library books
  container.innerHTML = '<h2 style="grid-column: 1/-1; color: #333; font-size: 2rem; margin: 20px 0; text-align: center;">📚 My Library (' + books.length + ' books)</h2>';

  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    
    // Use same logic as loadBooks for cover images
    const coverPath = book.coverPath ? book.coverPath.replace(/\\/g, '/') : null;
    const coverUrl = coverPath
      ? `${API_URL}/${coverPath}` 
      : 'assets/images/img1.webp';
    
    bookCard.innerHTML = `
      <img src="${coverUrl}" 
           alt="${escapeHtml(book.title)}" 
           class="trending-books" 
           onerror="this.src='assets/images/img1.webp'" />
      <div class="book-description">
        <p><strong>Title:</strong> ${escapeHtml(book.title)}</p>
        <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
        <p><strong>Category:</strong> ${escapeHtml(book.category || '')}</p>
        <p><strong>Description:</strong> ${escapeHtml(book.description || '')}</p>
      </div>
      <div class="book-actions">
        <a class="read-btn" href="pages/pdf-reader.html?id=${book.id}">📖 Read</a>
        <button class="remove-library-btn" onclick="removeFromLibrary('${book.id}', '${escapeHtml(book.title).replace(/'/g, "\\'")}')">❌ Remove</button>
      </div>
    `;
    
    container.appendChild(bookCard);
  });

  // Add a button to show all books again
  const showAllBtn = document.createElement('button');
  showAllBtn.textContent = '🔙 Show All Books';
  showAllBtn.style.cssText = 'grid-column: 1/-1; padding: 15px 30px; font-size: 1.1rem; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 20px auto; width: fit-content;';
  showAllBtn.onclick = loadBooks;
  container.appendChild(showAllBtn);
  
  console.log('=== DISPLAY COMPLETE ===');
}

async function removeFromLibrary(bookId, bookTitle) {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  
  if (!token) {
    alert('Please login first!');
    return;
  }

  if (!confirm(`Remove "${bookTitle}" from your library?`)) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/library/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (result.success) {
      alert(`✅ "${bookTitle}" removed from your library!`);
      loadMyLibrary(); // Reload library
    } else {
      alert('❌ ' + (result.message || 'Failed to remove book'));
    }
  } catch (error) {
    console.error('Error removing from library:', error);
    alert('❌ Error removing book. Please try again.');
  }
}

// Add event listener for My Library link
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
  
  const myLibraryLink = document.getElementById('myLibraryLink');
  if (myLibraryLink) {
    myLibraryLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadMyLibrary();
    });
  }
  
  // Add category filter listeners
  const categoryLinks = document.querySelectorAll('[data-category]');
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = link.getAttribute('data-category');
      console.log('Category clicked:', category);
      
      if (category === 'all') {
        loadBooks(); // Load all books
      } else {
        loadBooksByCategory(category);
      }
    });
  });
  
  // Home button - load all books
  const homeLink = document.querySelector('.Home');
  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadBooks();
    });
  }
});

// Load books by category
async function loadBooksByCategory(category) {
  const container = document.getElementById('category_items');
  if (!container) return;
  
  container.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Loading books...</p>';

  try {
    console.log('Loading category:', category);
    const res = await fetch(`${API_BASE_URL}/books`);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const response = await res.json();
    const allBooks = response.data?.books || [];
    
    // Filter books by category
    const filteredBooks = allBooks.filter(book => {
      const bookCategory = (book.category || '').toLowerCase().trim();
      const searchCategory = category.toLowerCase().trim();
      
      // Handle special cases
      if (searchCategory === 'trending') {
        // You can define trending logic here (e.g., most recent, most popular)
        return true; // For now, show all as trending
      }
      
      if (searchCategory === 'self-help') {
        return bookCategory === 'self-help' || bookCategory === 'self help';
      }
      
      return bookCategory === searchCategory;
    });
    
    console.log(`Found ${filteredBooks.length} books in category "${category}"`);
    
    if (filteredBooks.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <h3 style="color: #666; font-size: 24px; margin-bottom: 16px;">📚 No books found in "${category}" category</h3>
          <p style="color: #999; font-size: 16px; margin-bottom: 24px;">Upload some books in this category or browse all books.</p>
          <button onclick="loadBooks()" style="padding: 12px 30px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
            View All Books
          </button>
        </div>
      `;
      return;
    }

    // Display header
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    container.innerHTML = `
      <div style="grid-column: 1/-1; margin-bottom: 20px;">
        <h2 style="color: #333; font-size: 28px; margin-bottom: 8px;">📚 ${categoryName}</h2>
        <p style="color: #666; font-size: 14px;">${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''} found</p>
      </div>
    `;

    // Display filtered books
    filteredBooks.forEach(b => {
      const card = document.createElement('div');
      card.className = 'book-card';
      
      const coverPath = b.coverPath ? b.coverPath.replace(/\\/g, '/') : null;
      const coverUrl = coverPath
        ? `${API_URL}/${coverPath}` 
        : 'assets/images/img1.webp';
      
      card.innerHTML = `
        <img src="${coverUrl}" 
             alt="${escapeHtml(b.title)}" 
             class="trending-books" 
             onerror="this.src='assets/images/img1.webp'" />
        <div class="book-description">
          <p><strong>Title:</strong> ${escapeHtml(b.title)}</p>
          <p><strong>Author:</strong> ${escapeHtml(b.author)}</p>
          <p><strong>Category:</strong> ${escapeHtml(b.category || '')}</p>
          <p><strong>Description:</strong> ${escapeHtml(b.description || '')}</p>
        </div>
        <div class="book-actions">
          <a class="read-btn" href="pages/pdf-reader.html?id=${b.id}">📖 Read</a>
          <button class="add-library-btn" onclick="addToLibrary('${b.id}', '${escapeHtml(b.title).replace(/'/g, "\\'")}')">Add to Library</button>
          <button class="delete-book-btn" onclick="deleteBook('${b.id}', '${escapeHtml(b.title).replace(/'/g, "\\'")}')">🗑️ Delete</button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading category:', err);
    container.innerHTML = `<p style="color:red; grid-column: 1/-1; text-align: center; padding: 40px;">Error loading books: ${escapeHtml(err.message || err)}</p>`;
  }
}

window.loadMyLibrary = loadMyLibrary;
window.removeFromLibrary = removeFromLibrary;
