# Quick Deployment Guide

## 🚀 Step-by-Step Deployment

### Prerequisites
- GitHub account
- MongoDB Atlas account (already set up ✅)
- Railway account (free) - [railway.app](https://railway.app)
- Vercel account (free) - [vercel.com](https://vercel.com)

---

## Part 1: Deploy Backend (Railway) - 5 minutes

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)** → Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `my-app` repository
   - Railway will detect the project

3. **Configure Service:**
   - Click on the service → Settings
   - Set **Root Directory** to: `server`
   - Set **Start Command** to: `node index.js`
   - Set **Build Command** to: (leave empty)

4. **Add Environment Variables:**
   - Go to Variables tab
   - Add these variables:
     ```
     MONGODB_URI=mongodb+srv://himanshu3141_db_user:M5bq78pkAd6qb8u5@cluster0.25rafeh.mongodb.net/my-dashboard?retryWrites=true&w=majority
     JWT_SECRET=change-this-to-a-random-secret-string-min-32-chars
     ALLOWED_ORIGIN=https://your-frontend.vercel.app
     NODE_ENV=production
     ```
   - **Note:** You'll update `ALLOWED_ORIGIN` after deploying frontend

5. **Get Backend URL:**
   - Railway will deploy automatically
   - Click on your service → Settings → Generate Domain
   - Copy the URL (e.g., `https://my-app-production.up.railway.app`)
   - Test: Visit `https://your-backend-url/health` → Should see `{"status":"ok"}`

---

## Part 2: Deploy Frontend (Vercel) - 3 minutes

### Step 1: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** → Sign up with GitHub

2. **Import Project:**
   - Click "Add New Project"
   - Import your `my-app` GitHub repository
   - Vercel auto-detects Next.js ✅

3. **Configure Environment Variables:**
   - Before deploying, go to "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.up.railway.app
     ```
   - Replace with your actual Railway backend URL from Part 1

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `https://my-app-xyz.vercel.app`

### Step 2: Update Backend CORS

1. **Go back to Railway:**
   - Service → Variables
   - Update `ALLOWED_ORIGIN` to your Vercel URL:
     ```
     ALLOWED_ORIGIN=https://my-app-xyz.vercel.app
     ```
   - Railway will auto-redeploy

2. **Test:**
   - Visit your Vercel URL
   - Try registering/logging in
   - Should work! 🎉

---

## ✅ Verification Checklist

- [ ] Backend health check works: `https://your-backend.railway.app/health`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Can register new account
- [ ] Can login
- [ ] Dashboard loads
- [ ] Can create/update/delete tasks
- [ ] No CORS errors in browser console

---

## 🔧 Troubleshooting

### "Cannot connect to the server"
- Check `NEXT_PUBLIC_API_BASE_URL` in Vercel matches Railway backend URL
- Make sure Railway backend is running (check logs)

### CORS Errors
- Verify `ALLOWED_ORIGIN` in Railway matches Vercel URL exactly
- No trailing slash: `https://app.vercel.app` ✅ (not `https://app.vercel.app/` ❌)
- Redeploy backend after changing CORS

### MongoDB Connection Issues
- Check `MONGODB_URI` in Railway is correct
- MongoDB Atlas → Network Access → Add IP: `0.0.0.0/0` (allow all) for testing

### Environment Variables Not Working
- **Vercel:** Must use `NEXT_PUBLIC_` prefix for client-side vars
- **Railway:** Restart service after adding env vars (auto-restarts)

---

## 📝 Important Notes

1. **JWT_SECRET:** Change to a long random string (use: `openssl rand -base64 32`)
2. **MongoDB Atlas:** Restrict IPs in production (not `0.0.0.0/0`)
3. **Free Tier Limits:**
   - Railway: 500 hours/month free
   - Vercel: Unlimited (with limits on bandwidth)
4. **Custom Domains:** Both Railway and Vercel support custom domains (paid plans)

---

## 🎯 Next Steps

- Set up custom domain (optional)
- Add error tracking (Sentry)
- Set up CI/CD (automatic with GitHub)
- Monitor logs in Railway/Vercel dashboards

