# 📚 E-Book Platform - User Guide

## 🎯 Quick Start Guide

### 1️⃣ DELETE SAMPLE BOOKS

You have **3 easy options** to delete the sample books:

#### **Option A: Admin Page (EASIEST!)**
1. Open browser: `http://localhost:5500/pages/admin.html`
2. Login with: `admin@example.com` / `admin123`
3. See all books in a table
4. Click red "Delete" button on any book
5. Confirm deletion
6. Done! ✅

#### **Option B: PowerShell Commands**
```powershell
# Step 1: Login and get token
$loginData = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $response.data.token

# Step 2: Get all books
$books = Invoke-RestMethod -Uri "http://localhost:3000/api/books?limit=100" -Headers @{Authorization="Bearer $token"}
$books.data.books | Format-Table id, title, author

# Step 3: Delete a book (copy book ID from above)
Invoke-RestMethod -Uri "http://localhost:3000/api/books/BOOK_ID_HERE" -Method DELETE -Headers @{Authorization="Bearer $token"}
```

#### **Option C: Delete All Sample Books**
```powershell
# Login first
$loginData = @{ email = "admin@example.com"; password = "admin123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $response.data.token

# Get and delete all books
$books = Invoke-RestMethod -Uri "http://localhost:3000/api/books?limit=100" -Headers @{Authorization="Bearer $token"}
foreach ($book in $books.data.books) {
    Write-Host "Deleting: $($book.title)"
    Invoke-RestMethod -Uri "http://localhost:3000/api/books/$($book.id)" -Method DELETE -Headers @{Authorization="Bearer $token"}
}
Write-Host "All books deleted!" -ForegroundColor Green
```

---

### 2️⃣ ADD REAL BOOKS WITH PDF FILES

#### **Upload Your Own Books:**
1. **Login** to your account
   - Go to: `http://localhost:5500/pages/login.html`
   - Enter: `admin@example.com` / `admin123`

2. **Go to Upload Page**
   - From main page, click "Upload" button
   - Or go directly: `http://localhost:5500/pages/upload.html`

3. **Upload Your PDF**
   - Click or drag your PDF file to the upload area
   - Select a cover image (JPG/PNG) - optional
   - Fill in details:
     - **Title**: Book name
     - **Author**: Author name
     - **Description**: Brief summary
     - **Category**: Fiction, Non-Fiction, etc.
     - **Tags**: Keywords (comma separated)

4. **Click "Upload Book" button** 📚
   - Book will be saved with the actual PDF
   - Cover image will be displayed
   - Book appears on main page immediately!

#### **Supported File Types:**
- **PDF Files**: Any .pdf file up to 100MB
- **Cover Images**: .jpg, .jpeg, .png up to 5MB

---

### 3️⃣ USER SIGNUP - Create New Accounts

Your platform **already has signup working!** Other users can register:

#### **For New Users:**
1. Go to: `http://localhost:5500/pages/login.html`
2. Look for two tabs at the top: **"Sign Up"** and **"Log In"**
3. Click **"Sign Up"** tab
4. Fill in the form:
   - **Email**: Their email address
   - **Screen Name**: Display name (username)
   - **Password**: Secure password
   - Check "I agree to terms"
5. Click **"Sign Up"** button
6. Account created! ✅
7. They can now login and use the platform

#### **What New Users Can Do:**
- ✅ Browse all books
- ✅ Search for books
- ✅ Upload their own books
- ✅ Download PDFs
- ✅ Add books to their library
- ✅ Delete their own uploaded books (not others)

---

## 🔐 Current Admin Account

**Email:** `admin@example.com`  
**Password:** `admin123`

This account can:
- Upload books
- Delete their own books
- View all books
- Access admin page

---

## 🌐 Important URLs

| Page | URL | Description |
|------|-----|-------------|
| Main Page | `http://localhost:5500/main.html` | Browse books |
| Login/Signup | `http://localhost:5500/pages/login.html` | User authentication |
| Upload Books | `http://localhost:5500/pages/upload.html` | Upload new books |
| Admin Panel | `http://localhost:5500/pages/admin.html` | Manage/delete books |
| API Base | `http://localhost:3000/api` | Backend API |

---

## 🔧 Testing the System

### Test Signup:
```
1. Go to login page
2. Click "Sign Up" tab
3. Enter test credentials:
   - Email: test@example.com
   - Screen Name: TestUser
   - Password: test123
4. Click Sign Up
5. Should see success message
6. Can now login with these credentials
```

### Test Book Upload:
```
1. Login with admin or any user account
2. Go to upload page
3. Prepare a test PDF file
4. Drag PDF to upload area
5. Add cover image (optional)
6. Fill form and upload
7. Check main page - book should appear!
```

### Test Book Deletion:
```
1. Login with the account that uploaded the book
2. Go to admin page
3. Find your book in the table
4. Click Delete button
5. Confirm deletion
6. Book removed from database!
```

---

## 📝 Notes

- **Only the uploader** can delete their own books (for security)
- To make anyone delete any book, you'd need to add an "admin role" system
- Sample books are uploaded by "admin@example.com", so admin can delete them
- New users can create accounts anytime via the signup form
- All uploaded PDFs are stored in `ebook-backend/storage/pdf/`
- All cover images are stored in `ebook-backend/storage/uploads/`

---

## 🚀 Quick Actions

**Delete all sample books and start fresh:**
```powershell
# Run this in PowerShell (in project directory)
cd ebook-backend
npm run seed  # This will reset database (optional)
```

**Or just use the Admin Page:**
`http://localhost:5500/pages/admin.html` 😊

---

Enjoy your E-Book Platform! 📚✨
