 

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  📚 E-BOOK LIBRARY STARTER  " -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Start Backend
Write-Host "⚡ Step 1: Starting Backend Server..." -ForegroundColor Green
Write-Host ""

Set-Location "d:\ds_project(sem-3)\Ds-project\ebook-backend"

Write-Host "📦 Installing dependencies (if needed)..." -ForegroundColor Yellow
npm install --silent

Write-Host ""
Write-Host "🚀 Starting server on http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BACKEND IS RUNNING!  " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Keep this window OPEN" -ForegroundColor White
Write-Host "   2. Open VS Code" -ForegroundColor White
Write-Host "   3. Right-click 'home.html' → Open with Live Server" -ForegroundColor White
Write-Host "   4. OR visit: http://127.0.0.1:5501/home.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  To STOP the server: Press Ctrl+C" -ForegroundColor Red
Write-Host ""

# Run the backend
npm run dev
