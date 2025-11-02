# Deployment Guide - Make Your E-Book Platform Live! 🚀

## Option 1: Render.com (FREE & Easy) ⭐ RECOMMENDED

### Steps:

1. **Go to [Render.com](https://render.com)** and sign up (free)

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**: `vikasdhanak/Ds-project`

4. **Configure the backend**:
   - **Name**: `ebook-backend`
   - **Root Directory**: `ebook-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `npx ts-node src/server.ts`
   - **Add Environment Variables**:
     ```
     DATABASE_URL=file:./dev.db
     JWT_SECRET=your-secret-key-here-change-this
     PORT=3000
     NODE_ENV=production
     ```

5. **Click "Create Web Service"** - Wait 5-10 minutes for deployment

6. **Deploy Frontend (Static Site)**:
   - Click "New +" → "Static Site"
   - Connect same repository
   - **Build Command**: Leave empty
   - **Publish Directory**: `.`
   
7. **Your app will be live at**:
   - Backend: `https://ebook-backend-xxx.onrender.com`
   - Frontend: `https://your-app-xxx.onrender.com`

8. **Update frontend URLs**: In your frontend JavaScript files, replace:
   ```javascript
   // Change from:
   http://localhost:3000
   
   // To:
   https://your-backend-url.onrender.com
   ```

---

## Option 2: Railway.app (FREE & Simple)

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `Ds-project`
5. Railway will auto-detect and deploy
6. Add environment variables in settings
7. Get your live URL!

---

## Option 3: Vercel (Best for Static Sites)

### For Frontend:

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy - it's automatic!
4. You'll get: `https://ds-project-xxx.vercel.app`

### For Backend - Use Vercel Serverless:

1. Your `vercel.json` is already created
2. Just push to GitHub
3. Connect to Vercel
4. It will deploy both!

---

## Option 4: Netlify (Frontend) + Render (Backend)

### Frontend on Netlify:
1. Go to [Netlify.com](https://netlify.com)
2. Import from GitHub
3. Build settings: Leave empty
4. Deploy!

### Backend on Render:
- Follow Render steps above

---

## 🔧 Important: Update Frontend API URLs

Before deploying, you need to update your API URLs in the frontend:

### Files to update:
- `js/login.js`
- `js/main.js`
- `js/upload.js`

Change all instances of:
```javascript
'http://localhost:3000'
```

To:
```javascript
'https://your-backend-url.onrender.com'  // or your deployed URL
```

---

## 📝 Quick Deploy Checklist:

- [ ] Create account on Render/Railway/Vercel
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Update API URLs in frontend
- [ ] Test login with admin@example.com / admin123
- [ ] Share your live link! 🎉

---

## 🌐 After Deployment:

You'll get URLs like:
- **Backend**: `https://ebook-backend-abc123.onrender.com`
- **Frontend**: `https://ds-project.onrender.com`

Share the **frontend URL** with others, and they can:
- Browse books
- Create accounts
- Upload PDFs
- Read books online

**No installation required!** Just share the link! 🚀

---

## 💡 Pro Tips:

1. **Free tier limitations**:
   - Render: App sleeps after 15 min of inactivity (wakes on request)
   - Railway: 500 hours/month free
   - Vercel: Unlimited deployments

2. **Database**: SQLite works on Render, but consider PostgreSQL for production

3. **File uploads**: May need external storage (AWS S3, Cloudinary) for production

4. **Custom domain**: Most services offer free custom domains!

---

Would you like me to help you deploy to one of these services?
