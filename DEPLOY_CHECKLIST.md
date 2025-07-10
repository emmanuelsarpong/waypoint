# 🚀 Deployment Checklist

## Pre-Deployment Setup (15 minutes)

### ✅ 1. MongoDB Atlas

- [ ] Create free MongoDB Atlas account
- [ ] Set up cluster (M0 Sandbox - FREE)
- [ ] Create database user
- [ ] Whitelist all IP addresses (0.0.0.0/0)
- [ ] Get connection string
- [ ] Test connection (optional)

### ✅ 2. OAuth Setup (Optional - can skip for now)

- [ ] Google OAuth credentials
- [ ] Microsoft OAuth credentials
- [ ] Save Client IDs and Secrets

### ✅ 3. Stripe Setup (Optional - can skip for now)

- [ ] Create Stripe account
- [ ] Get test API keys
- [ ] Save publishable and secret keys

## Deployment (5 minutes)

### ✅ 4. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### ✅ 5. Deploy to Vercel

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Import GitHub repository
- [ ] Add environment variables:
  ```
  NODE_ENV=production
  MONGODB_URI=your_connection_string
  JWT_SECRET=any-random-secret-key
  SESSION_SECRET=another-random-secret-key
  ```
- [ ] Click Deploy!

### ✅ 6. Test Your Live App

- [ ] Visit your Vercel URL
- [ ] Test homepage loads
- [ ] Test map functionality
- [ ] Test basic navigation

## Post-Deployment (When Ready)

### ✅ 7. Configure OAuth Redirects

- [ ] Update Google OAuth with your Vercel URL
- [ ] Update Microsoft OAuth with your Vercel URL
- [ ] Test OAuth login

### ✅ 8. Configure Stripe

- [ ] Add Stripe environment variables
- [ ] Set up webhook endpoints
- [ ] Test payment flows

### ✅ 9. Custom Domain (Optional)

- [ ] Purchase domain
- [ ] Configure DNS
- [ ] Update OAuth redirects

---

## 🎉 You're Live!

Your app will be available at: `https://waypoint-[random].vercel.app`

**Next Git Push = Automatic Deployment** 🔄
