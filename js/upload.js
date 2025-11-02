// ==========================================
// UPLOAD MODAL POPUP FUNCTIONALITY
// ==========================================

console.log('📤 Upload.js loaded!');

// Check if user is logged in
const authToken = localStorage.getItem('authToken');
if (!authToken) {
    alert('Please login first to upload books!');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.upload-close-btn');
    const uploadForm = document.getElementById('uploadBookForm');
    const pdfUploadArea = document.getElementById('pdfUploadArea');
    const pdfInput = document.getElementById('bookPDF');
    const pdfFileName = document.getElementById('pdfFileName');

    // Open modal when Upload button is clicked
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            uploadModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            uploadModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            uploadModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // PDF Upload Area - Click to browse
    if (pdfUploadArea) {
        pdfUploadArea.addEventListener('click', function() {
            pdfInput.click();
        });

        // Drag & Drop functionality
        pdfUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            pdfUploadArea.classList.add('drag-over');
        });

        pdfUploadArea.addEventListener('dragleave', function() {
            pdfUploadArea.classList.remove('drag-over');
        });

        pdfUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            pdfUploadArea.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length) {
                pdfInput.files = e.dataTransfer.files;
                displayFileName(e.dataTransfer.files[0]);
            }
        });

        // File input change
        pdfInput.addEventListener('change', function() {
            if (this.files.length) {
                displayFileName(this.files[0]);
            }
        });
    }

    function displayFileName(file) {
        pdfFileName.textContent = `Selected: ${file.name}`;
        pdfFileName.style.display = 'block';
    }

    // Form submission
    if (uploadForm) {
        console.log('✅ Upload form found, attaching submit handler');
        
        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('📤 Form submitted!');
            
            // Get token from localStorage (you need to login first)
            const token = localStorage.getItem('authToken');
            console.log('Token:', token ? 'Present' : 'Missing');
            
            if (!token) {
                alert('Please login first to upload books!');
                window.location.href = '../pages/login.html';
                return;
            }

            // Check if files are selected
            if (!pdfInput.files[0]) {
                alert('❌ Please select a PDF file!');
                pdfUploadArea.style.border = '2px solid red';
                return;
            }
            
            pdfUploadArea.style.border = ''; // Reset border

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('pdf', pdfInput.files[0]);
            formData.append('cover', document.getElementById('bookCover').files[0]);
            formData.append('title', document.getElementById('bookTitle').value);
            formData.append('author', document.getElementById('author').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('category', document.getElementById('category').value);
            formData.append('tags', document.getElementById('tags').value);

            console.log('Uploading book:', document.getElementById('bookTitle').value);

            try {
                // Show loading state
                const submitBtn = uploadForm.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.textContent : '';
                if (submitBtn) {
                    submitBtn.textContent = '⏳ Uploading...';
                    submitBtn.disabled = true;
                }

                console.log('Sending request to:', 'http://localhost:3000/api/books');

                // Upload to backend
                const response = await fetch('http://localhost:3000/api/books', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                console.log('Response status:', response.status);
                const result = await response.json();
                console.log('Response:', result);

                if (response.ok && result.success) {
                    alert('✅ Book uploaded successfully!');
                    uploadForm.reset();
                    if (pdfFileName) pdfFileName.style.display = 'none';
                    
                    // Redirect to main page after 1 second
                    setTimeout(() => {
                        window.location.href = '../main.html';
                    }, 1000);
                } else {
                    alert(`❌ Upload failed: ${result.message || 'Unknown error'}`);
                }

                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('❌ Upload error:', error);
                alert('Upload failed. Please try again. Check console for details.');
                const submitBtn = uploadForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.textContent = '📤 Upload Book';
                    submitBtn.disabled = false;
                }
            }
        });
    } else {
        console.error('❌ Upload form not found!');
    }
});
