// ==========================================
// UPLOAD MODAL POPUP FUNCTIONALITY
// ==========================================

console.log('📤 Upload.js loaded!');

// Use API_BASE from config.js (already loaded in HTML)
// Don't redeclare - config.js already exports API_BASE
console.log('API_BASE from config:', typeof API_BASE !== 'undefined' ? API_BASE : 'Not found');

// Check if user is logged in (don't declare globally - use inside function)
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Please login first to upload books!');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Run auth check on page load
if (!checkAuth()) {
    // Will redirect if not authenticated
}

// CRITICAL: Prevent browser from opening PDFs when dragged anywhere on the page
window.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
}, false);

window.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
}, false);

// Also prevent on document level
document.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
}, false);

document.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
}, false);

console.log('🛡️ Drag & drop prevention active on entire page');

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

    // PDF Upload Area - Drag and Drop only (button handles click)
    if (pdfUploadArea) {
        // Remove click event from the area itself
        // pdfUploadArea.addEventListener('click', ...) - REMOVED
        
        // Prevent default drag behaviors on the entire document
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.body.addEventListener(eventName, function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Drag & Drop functionality for the upload area
        pdfUploadArea.addEventListener('dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
            pdfUploadArea.classList.add('drag-over');
        });

        pdfUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            pdfUploadArea.classList.add('drag-over');
        });

        pdfUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            pdfUploadArea.classList.remove('drag-over');
        });

        pdfUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            pdfUploadArea.classList.remove('drag-over');
            
            console.log('📥 File dropped in upload area!');
            
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
                const file = e.dataTransfer.files[0];
                console.log('File type:', file.type);
                console.log('File name:', file.name);
                
                // Validate it's a PDF
                if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                    alert('⚠️ Please upload a PDF file only!');
                    console.error('Invalid file type:', file.type);
                    return false;
                }
                
                try {
                    // Set the file to the input
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    pdfInput.files = dataTransfer.files;
                    
                    displayFileName(file);
                    console.log('✅ PDF file accepted:', file.name);
                } catch (error) {
                    console.error('Error setting file:', error);
                    alert('Error processing file. Please try using the "Choose PDF File" button instead.');
                }
            } else {
                console.error('No files in drop event');
            }
            
            return false;
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
            
            // Only append cover if a file is selected
            const coverInput = document.getElementById('bookCover');
            if (coverInput.files && coverInput.files[0]) {
                formData.append('cover', coverInput.files[0]);
                console.log('📷 Cover image selected:', coverInput.files[0].name);
            } else {
                console.log('⚠️ No cover image selected');
            }
            
            formData.append('title', document.getElementById('bookTitle').value);
            formData.append('author', document.getElementById('author').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('category', document.getElementById('category').value);
            formData.append('tags', document.getElementById('tags').value);

            console.log('Uploading book:', document.getElementById('bookTitle').value);

            // Make sure API_BASE is defined
            const apiUrl = typeof API_BASE !== 'undefined' ? API_BASE : 'http://localhost:3000';
            console.log('API URL:', apiUrl);

            try {
                // Show loading state
                const submitBtn = uploadForm.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.textContent : '';
                if (submitBtn) {
                    submitBtn.textContent = '⏳ Uploading...';
                    submitBtn.disabled = true;
                }

                console.log('Sending request to:', `${apiUrl}/api/books`);

                // Upload to backend
                const response = await fetch(`${apiUrl}/api/books`, {
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
                    
                    // Redirect to home page after 1 second
                    setTimeout(() => {
                        window.location.href = '../home.html';
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
                
                let errorMessage = 'Upload failed. ';
                if (error.message === 'Failed to fetch') {
                    errorMessage += 'Cannot connect to server. Make sure backend is running on http://localhost:3000';
                } else {
                    errorMessage += error.message || 'Unknown error';
                }
                
                alert(errorMessage + '\n\nCheck console (F12) for details.');
                console.error('Full error:', error);
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                    apiUrl: typeof API_BASE !== 'undefined' ? API_BASE : 'undefined'
                });
                
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
