// API Configuration
const API_URL = typeof API_BASE !== 'undefined' ? API_BASE : 'http://localhost:3000';
const API_BASE_URL = `${API_URL}/api`;

// Check if user is admin on page load
window.addEventListener('DOMContentLoaded', async () => {
  await checkAdminAccess();
  await loadDashboardData();
});

async function checkAdminAccess() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('❌ Please login first!');
      window.location.href = 'login.html';
      return;
    }

    const res = await fetch(`${API_BASE_URL}/admin/check`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const response = await res.json();

    if (!response.success || !response.data.isAdmin) {
      alert('❌ Access Denied! Admin only.');
      window.location.href = '../home.html';
      return;
    }

    // Set admin name
    document.getElementById('admin-name').textContent = response.data.user.screenName;
  } catch (error) {
    console.error('Admin check error:', error);
    alert('❌ Error checking admin status');
    window.location.href = '../home.html';
  }
}

async function loadDashboardData() {
  try {
    const token = localStorage.getItem('authToken');
    
    // Load dashboard stats
    const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to load dashboard data');

    const response = await res.json();
    const { stats, users } = response.data;

    // Update stats
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('total-books').textContent = stats.totalBooks;
    document.getElementById('total-library').textContent = stats.totalLibraryItems;

    // Store users data
    window.usersData = users;

    // Load users table
    loadUsersTable(users);

    // Load top users rankings
    await loadTopUsers();

    // Load books
    await loadAllBooks();
  } catch (error) {
    console.error('Dashboard load error:', error);
  }
}

function loadUsersTable(users) {
  const tbody = document.getElementById('users-table-body');
  
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading">No users found</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td><strong>${escapeHtml(user.screenName)}</strong></td>
      <td>${escapeHtml(user.email)}</td>
      <td><span class="role-badge role-${user.role}">${user.role.toUpperCase()}</span></td>
      <td><strong>${user.booksUploaded}</strong> books</td>
      <td>${user.libraryItems} items</td>
      <td>${new Date(user.joinedAt).toLocaleDateString()}</td>
    </tr>
  `).join('');
}

async function loadTopUsers() {
  try {
    const token = localStorage.getItem('authToken');
    
    const res = await fetch(`${API_BASE_URL}/admin/top-users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to load top users');

    const response = await res.json();
    const topUsers = response.data.topUsers;

    const grid = document.getElementById('top-users-grid');
    
    if (topUsers.length === 0) {
      grid.innerHTML = '<p class="loading">No users with uploads yet</p>';
      return;
    }

    grid.innerHTML = topUsers.map(user => {
      // Get medal emoji based on rank
      let rankBadgeClass = '';
      let rankEmoji = '';
      
      if (user.rank === 1) {
        rankBadgeClass = 'rank-1';
        rankEmoji = '🥇';
      } else if (user.rank === 2) {
        rankBadgeClass = 'rank-2';
        rankEmoji = '🥈';
      } else if (user.rank === 3) {
        rankBadgeClass = 'rank-3';
        rankEmoji = '🥉';
      }

      return `
        <div class="user-rank-card">
          <div class="rank-badge ${rankBadgeClass}">
            ${rankEmoji} #${user.rank}
          </div>
          <div class="rank-user-info">
            <h3>${escapeHtml(user.screenName)}</h3>
            <p class="rank-email">${escapeHtml(user.email)}</p>
            <div class="rank-stats">
              <span class="book-count">📚 ${user.bookCount} books</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Top users load error:', error);
    const grid = document.getElementById('top-users-grid');
    grid.innerHTML = '<p class="error">Failed to load rankings</p>';
  }
}

async function loadAllBooks() {
  try {
    const token = localStorage.getItem('authToken');
    
    const res = await fetch(`${API_BASE_URL}/admin/books`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to load books');

    const response = await res.json();
    const books = response.data.books;

    // Store books data
    window.booksData = books;

    const grid = document.getElementById('admin-books-grid');
    
    if (books.length === 0) {
      grid.innerHTML = '<p class="loading">No books found</p>';
      return;
    }

    grid.innerHTML = books.map(book => {
      // Fix cover path - use same logic as main.js
      const coverPath = book.coverPath ? book.coverPath.replace(/\\/g, '/') : null;
      const coverUrl = coverPath
        ? `${API_URL}/${coverPath}` 
        : '../assets/images/img1.webp';
      
      console.log(`Admin - Book: ${book.title}, Cover URL: ${coverUrl}`);

      return `
        <div class="admin-book-card">
          <img src="${coverUrl}" alt="${escapeHtml(book.title)}" onerror="this.src='../assets/images/img1.webp'">
          <div class="admin-book-info">
            <h3>${escapeHtml(book.title)}</h3>
            <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
            <p><strong>Category:</strong> ${escapeHtml(book.category)}</p>
            <p><strong>Uploaded by:</strong> ${escapeHtml(book.user.screenName)}</p>
            <p><strong>Views:</strong> ${book.views}</p>
          </div>
          <div class="admin-book-actions">
            <button class="btn-edit" onclick="editBookAdmin('${book.id}')">✏️ Edit</button>
            <button class="btn-delete" onclick="deleteBookAdmin('${book.id}', '${escapeHtml(book.title).replace(/'/g, "\\'")}')">🗑️ Delete</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Books load error:', error);
  }
}

async function editBookAdmin(bookId) {
  try {
    const token = localStorage.getItem('authToken');
    
    // Fetch book details
    const res = await fetch(`${API_BASE_URL.replace('/admin', '')}/books/${bookId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) throw new Error('Failed to fetch book details');
    
    const response = await res.json();
    const book = response.data;

    // Create edit modal (reusing the editBook function from main.js)
    const modal = document.createElement('div');
    modal.id = 'editBookModal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; align-items: center;
      justify-content: center; z-index: 10000; backdrop-filter: blur(5px);
    `;
    
    modal.innerHTML = `
      <div style="background: #fff; padding: 30px; border-radius: 15px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <h2 style="margin: 0 0 20px 0; color: #1b1f39; font-size: 24px;">✏️ Edit Book (Admin)</h2>
        
        <form id="editBookForm">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1b1f39;">Title:</label>
            <input type="text" id="editTitle" value="${escapeHtml(book.title)}" 
                   style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px;" required>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1b1f39;">Author:</label>
            <input type="text" id="editAuthor" value="${escapeHtml(book.author)}" 
                   style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px;" required>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1b1f39;">Category:</label>
            <select id="editCategory" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px;" required>
              <option value="Fiction" ${book.category === 'Fiction' ? 'selected' : ''}>Fiction</option>
              <option value="Non-Fiction" ${book.category === 'Non-Fiction' ? 'selected' : ''}>Non-Fiction</option>
              <option value="Science" ${book.category === 'Science' ? 'selected' : ''}>Science</option>
              <option value="Technology" ${book.category === 'Technology' ? 'selected' : ''}>Technology</option>
              <option value="Business" ${book.category === 'Business' ? 'selected' : ''}>Business</option>
              <option value="Self-Help" ${book.category === 'Self-Help' ? 'selected' : ''}>Self-Help</option>
              <option value="Other" ${book.category === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1b1f39;">Description:</label>
            <textarea id="editDescription" rows="4" 
                      style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; resize: vertical;">${escapeHtml(book.description || '')}</textarea>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1b1f39;">📄 Update PDF (optional):</label>
            <input type="file" id="editPDF" accept=".pdf" 
                   style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px;">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #1b1f39;">📷 Update Cover Image (optional):</label>
            <input type="file" id="editCover" accept="image/*" 
                   style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px;">
          </div>
          
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" onclick="document.getElementById('editBookModal').remove()" 
                    style="padding: 12px 24px; background: #ccc; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
              Cancel
            </button>
            <button type="submit" 
                    style="padding: 12px 24px; background: linear-gradient(135deg, #9c27b0, #ba68c8); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('editBookForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData();
      formData.append('title', document.getElementById('editTitle').value);
      formData.append('author', document.getElementById('editAuthor').value);
      formData.append('category', document.getElementById('editCategory').value);
      formData.append('description', document.getElementById('editDescription').value);
      
      const pdfFile = document.getElementById('editPDF').files[0];
      if (pdfFile) formData.append('pdf', pdfFile);
      
      const coverFile = document.getElementById('editCover').files[0];
      if (coverFile) formData.append('cover', coverFile);
      
      try {
        const updateRes = await fetch(`${API_BASE_URL.replace('/admin', '')}/books/${bookId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        if (!updateRes.ok) throw new Error('Failed to update book');
        
        alert('✅ Book updated successfully!');
        modal.remove();
        await loadAllBooks(); // Reload books
      } catch (error) {
        console.error('Update error:', error);
        alert('❌ Failed to update book: ' + error.message);
      }
    });
    
  } catch (error) {
    console.error('Edit book error:', error);
    alert('❌ Failed to load book details: ' + error.message);
  }
}

async function deleteBookAdmin(bookId, title) {
  if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

  try {
    const token = localStorage.getItem('authToken');
    
    const res = await fetch(`${API_BASE_URL.replace('/admin', '')}/books/${bookId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to delete book');

    alert('✅ Book deleted successfully!');
    await loadDashboardData(); // Reload all data
  } catch (error) {
    console.error('Delete error:', error);
    alert('❌ Failed to delete book: ' + error.message);
  }
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });

  // Remove active class from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Show selected section
  document.getElementById(`${sectionName}-section`).classList.add('active');

  // Add active class to clicked nav item
  event.target.closest('.nav-item').classList.add('active');

  // Update page title
  const titles = {
    'dashboard': 'Dashboard',
    'users': 'All Users',
    'books': 'All Books'
  };
  document.getElementById('page-title').textContent = titles[sectionName] || sectionName;
}

// Search functionality
document.getElementById('userSearch')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredUsers = window.usersData.filter(user => 
    user.screenName.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm)
  );
  loadUsersTable(filteredUsers);
});

document.getElementById('bookSearch')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredBooks = window.booksData.filter(book => 
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm) ||
    book.category.toLowerCase().includes(searchTerm)
  );
  
  const grid = document.getElementById('admin-books-grid');
  if (filteredBooks.length === 0) {
    grid.innerHTML = '<p class="loading">No books found</p>';
    return;
  }

  grid.innerHTML = filteredBooks.map(book => {
    const coverUrl = book.coverPath ? 
      `${API_BASE_URL.replace('/api', '')}/storage/${book.coverPath}` : 
      '../assets/images/img1.webp';

    return `
      <div class="admin-book-card">
        <img src="${coverUrl}" alt="${escapeHtml(book.title)}" onerror="this.src='../assets/images/img1.webp'">
        <div class="admin-book-info">
          <h3>${escapeHtml(book.title)}</h3>
          <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
          <p><strong>Category:</strong> ${escapeHtml(book.category)}</p>
          <p><strong>Uploaded by:</strong> ${escapeHtml(book.user.screenName)}</p>
          <p><strong>Views:</strong> ${book.views}</p>
        </div>
        <div class="admin-book-actions">
          <button class="btn-edit" onclick="editBookAdmin('${book.id}')">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteBookAdmin('${book.id}', '${escapeHtml(book.title).replace(/'/g, "\\'")}')">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
});

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
  }
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
