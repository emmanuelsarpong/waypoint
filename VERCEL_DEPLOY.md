# Quick Vercel Deployment Guide

## 🚀 Deploy in 15 Minutes

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `waypoint` repository
5. Vercel will auto-detect the configuration

### Step 3: Add Environment Variables

In Vercel dashboard, add these variables:

#### Required:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_url
JWT_SECRET=your-secret-key
SESSION_SECRET=another-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

#### OAuth (if using):

```
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
MICROSOFT_CLIENT_ID=your_microsoft_id
MICROSOFT_CLIENT_SECRET=your_microsoft_secret
```

### Step 4: Deploy!

Click "Deploy" - Vercel will:

- Build your React frontend
- Set up your Express backend as serverless functions
- Give you a live URL in 2-3 minutes

### Step 5: Test Your Live App

- Visit your Vercel URL
- Test login/signup
- Test map functionality
- Verify everything works

## 🔄 Continuous Deployment

Every `git push` will automatically deploy:

- New features go live in minutes
- Zero downtime deployments
- Automatic rollback if errors

## ✅ You're Live!

Your app will be available at:
`https://waypoint-[random].vercel.app`

### Next Steps:

- [ ] Add custom domain (optional)
- [ ] Set up MongoDB Atlas (if not done)
- [ ] Configure OAuth redirect URLs
- [ ] Test payment flows

Need help? The `vercel.json` and updated `package.json` are already configured!
