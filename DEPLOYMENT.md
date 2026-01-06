# Deployment Guide - Task Dashboard

This guide covers deploying both the **Next.js frontend** (Vercel) and **Express backend** (Railway/Render).

## Architecture

- **Frontend:** Next.js → Deploy to **Vercel**
- **Backend:** Express API → Deploy to **Railway** (recommended) or **Render**
- **Database:** MongoDB Atlas (already configured)

---

## Part 1: Deploy Backend to Railway (Recommended)

Railway offers a free tier and is perfect for Express backends.

### Step 1: Prepare Backend for Production

1. **Create `server/package.json`** (separate package.json for backend):

```json
{
  "name": "task-dashboard-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "express-validator": "^7.2.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^8.8.4"
  }
}
```

2. **Update `server/index.js`** to handle Railway's PORT automatically (already done).

### Step 2: Deploy to Railway

1. **Sign up:** Go to [railway.app](https://railway.app) and sign up with GitHub.

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the **`server`** folder (or create a separate repo for backend)

3. **Set Environment Variables:**
   In Railway dashboard → Your service → Variables tab, add:
   ```
   MONGODB_URI=mongodb+srv://himanshu3141_db_user:M5bq78pkAd6qb8u5@cluster0.25rafeh.mongodb.net/my-dashboard?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
   ALLOWED_ORIGIN=https://your-frontend-domain.vercel.app
   PORT=5000
   NODE_ENV=production
   ```

4. **Configure Build:**
   - Root Directory: `server` (if deploying from monorepo)
   - Start Command: `node index.js`
   - Build Command: (leave empty)

5. **Get Backend URL:**
   - Railway will give you a URL like: `https://your-backend.up.railway.app`
   - Copy this URL - you'll need it for the frontend!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. **Update `.env.local`** (create this file, don't commit it):
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.up.railway.app
   ```

2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign up:** Go to [vercel.com](https://vercel.com) and sign up with GitHub.

2. **Import Project:**
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   In Vercel dashboard → Your project → Settings → Environment Variables, add:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.up.railway.app
   ```
   (Use the Railway backend URL from Part 1)

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://your-app.vercel.app`

5. **Update Backend CORS:**
   - Go back to Railway → Environment Variables
   - Update `ALLOWED_ORIGIN` to your Vercel URL:
     ```
     ALLOWED_ORIGIN=https://your-app.vercel.app
     ```
   - Redeploy the backend (Railway auto-redeploys on env var changes)

---

## Alternative: Deploy Backend to Render

If you prefer Render over Railway:

1. **Sign up:** [render.com](https://render.com)

2. **Create Web Service:**
   - Connect GitHub repo
   - Root Directory: `server`
   - Build Command: (leave empty)
   - Start Command: `node index.js`
   - Environment: `Node`

3. **Set Environment Variables** (same as Railway)

4. **Get URL:** Render gives you `https://your-backend.onrender.com`

---

## Post-Deployment Checklist

- [ ] Backend is accessible at `https://your-backend.up.railway.app/health`
- [ ] Frontend is accessible at `https://your-app.vercel.app`
- [ ] Can register/login from frontend
- [ ] Tasks CRUD works
- [ ] CORS is configured correctly (backend allows frontend origin)
- [ ] MongoDB Atlas network access allows Railway/Render IPs (or 0.0.0.0/0 for testing)

---

## Troubleshooting

### CORS Errors
- Make sure `ALLOWED_ORIGIN` in backend matches your Vercel frontend URL exactly
- Check for trailing slashes

### Database Connection Issues
- Verify `MONGODB_URI` is correct in Railway/Render
- Check MongoDB Atlas → Network Access → allow all IPs (0.0.0.0/0) for testing

### Environment Variables Not Working
- Vercel: Use `NEXT_PUBLIC_` prefix for client-side variables
- Railway/Render: Restart service after adding env vars

---

## Production Best Practices

1. **Change JWT_SECRET** to a long random string
2. **Restrict MongoDB Atlas IPs** to Railway/Render IPs (not 0.0.0.0/0)
3. **Enable HTTPS** (automatic on Vercel/Railway)
4. **Monitor logs** in Railway/Render dashboard
5. **Set up error tracking** (Sentry, etc.)

