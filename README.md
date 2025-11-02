# 📚 E-Book Reading Platform

A full-stack online book reading platform where users can upload, browse, and read PDF books with a beautiful interface.

## ✨ Features

- 🔐 **User Authentication**: Secure login/signup with JWT tokens
- 📖 **Book Management**: Upload PDF books with cover images
- 🖼️ **Cover Images**: Display beautiful book covers
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔍 **Search Functionality**: Find books quickly
- 👤 **User Profiles**: Track your uploaded books
- 🎨 **Modern UI**: Clean and intuitive interface

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive design
- Local storage for auth tokens

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite database
- JWT authentication
- Multer for file uploads

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vikasdhanak/Ds-project.git
cd Ds-project
```

### 2. Backend Setup

```bash
cd ebook-backend

# Install dependencies
npm install

# Create .env file
# Copy the following content:
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
UPLOADS_DIR=storage/uploads
TMP_DIR=storage/tmp
PDF_DIR=storage/pdf
LOG_LEVEL=info

# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed database with sample data
npx ts-node prisma/seed.ts

# Start backend server
npx nodemon --exec "ts-node --transpile-only src/server.ts"
```

Backend will run on: **http://localhost:3000**

### 3. Frontend Setup

Open a new terminal:

```bash
# From project root directory
npx http-server -p 5500 -c-1
```

Frontend will run on: **http://localhost:5500**

## 🎯 Usage

1. Open your browser and go to: **http://localhost:5500/main.html**

2. **Login** with the default admin account:
   - Email: `admin@example.com`
   - Password: `admin123`

3. **Browse Books**: View all available books with cover images

4. **Upload Books**: Click the "Upload" button to add new PDF books

5. **Read Books**: Click "Open PDF" to view any book

## 📁 Project Structure

```
Ds-project/
├── ebook-backend/          # Backend API
│   ├── prisma/            # Database schema and migrations
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middlewares/   # Express middlewares
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
│   └── storage/           # File uploads (not in git)
├── assets/                # Frontend images
├── css/                   # Stylesheets
├── js/                    # Frontend JavaScript
│   ├── login.js          # Authentication logic
│   ├── main.js           # Main page logic
│   ├── upload.js         # Upload functionality
│   └── search.js         # Search functionality
├── pages/                 # HTML pages
│   ├── login.html
│   └── upload.html
└── main.html             # Home page
```

## 🔑 Default Credentials

After seeding the database, you can login with:

- **Email**: admin@example.com
- **Password**: admin123

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Upload new book (requires auth)
- `GET /api/books/:id/file` - Download/view PDF

### Health
- `GET /health` - Check server status

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- CORS protection
- Helmet security headers
- Rate limiting (configured)
- Input validation

## 📦 Database Schema

- **Users**: User accounts with authentication
- **Books**: Book metadata (title, author, description, file paths)
- **UserLibrary**: User's personal library (many-to-many)

## 🎨 Features in Detail

### File Upload
- Supports PDF files
- Optional cover image (JPG, PNG)
- Automatic file validation
- Secure file storage

### Authentication
- JWT tokens stored in localStorage
- Protected routes require login
- Automatic token refresh
- Logout functionality

### User Interface
- Image carousel on home page
- Book cards with covers
- Search functionality
- Responsive design

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process if needed
taskkill /PID <process_id> /F

# Restart backend
npx nodemon --exec "ts-node --transpile-only src/server.ts"
```

### Database issues
```bash
# Reset database
cd ebook-backend
rm prisma/dev.db
npx prisma db push
npx ts-node prisma/seed.ts
```

### CORS errors
- Make sure backend is running on port 3000
- Frontend should be on port 5500
- Check browser console for specific errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

- **Vikas Dhanak** - [GitHub](https://github.com/vikasdhanak)

## 🙏 Acknowledgments

- Built as a semester project for DS Course
- Thanks to all contributors and testers

---

**Note**: The uploaded PDFs and database are not included in the repository. Each user needs to:
1. Run the seed script to create sample books
2. Upload their own PDF files through the application

**Happy Reading! 📚**
