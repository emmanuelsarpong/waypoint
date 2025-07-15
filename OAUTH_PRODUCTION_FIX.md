# OAuth Production Fix Guide

## ⚠️ Current Issue

Google and Microsoft OAuth work in localhost but fail in production because:

1. **Hard-coded localhost callback URLs** in OAuth provider configurations
2. **Missing environment variables** for production backend URL
3. **OAuth apps not configured** with production callback URLs

## 🔧 Required Fixes

### 1. Add Environment Variables to Railway (Backend)

Add these to your Railway backend environment variables:

```bash
# Backend URL (your Railway backend URL)
BACKEND_URL=https://waypoint-production-5b75.up.railway.app

# Frontend URL (your Vercel frontend URL)
FRONTEND_URL=https://waypoint-lemon.vercel.app

# Node Environment
NODE_ENV=production

# OAuth Credentials (if not already set)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
```

### 2. Update Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. In **Authorized redirect URIs**, add:
   ```
   https://waypoint-production-5b75.up.railway.app/auth/google/callback
   ```
5. Keep the localhost URL for development:
   ```
   http://localhost:3000/auth/google/callback
   ```

### 3. Update Microsoft OAuth Configuration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Select your Waypoint app
4. Go to **Authentication**
5. In **Redirect URIs**, add:
   ```
   https://waypoint-production-5b75.up.railway.app/auth/microsoft/callback
   ```
6. Keep the localhost URL for development:
   ```
   http://localhost:3000/auth/microsoft/callback
   ```

### 4. Verify Frontend OAuth Button URLs

The frontend should be calling:

- Google: `https://waypoint-production-5b75.up.railway.app/auth/google`
- Microsoft: `https://waypoint-production-5b75.up.railway.app/auth/microsoft`

### 5. Test the OAuth Flow

1. Deploy the updated backend code to Railway
2. Test OAuth from your production frontend
3. Check Railway logs for any errors

## 🐛 Debugging Steps

If OAuth still doesn't work:

1. **Check Railway Logs**:

   - Look for environment variable errors
   - Check for OAuth strategy initialization messages

2. **Verify Environment Variables**:

   ```bash
   # In Railway console, check if these are set:
   echo $BACKEND_URL
   echo $FRONTEND_URL
   echo $NODE_ENV
   ```

3. **Test Callback URLs**:

   - Visit: `https://waypoint-production-5b75.up.railway.app/auth/google`
   - Should redirect to Google OAuth consent screen
   - After consent, should callback to your Railway backend

4. **Check Network Tab**:
   - Look for CORS errors
   - Verify the OAuth redirect URLs are correct

## ✅ Success Indicators

✅ Google OAuth redirects to consent screen  
✅ After consent, redirects back to Railway backend  
✅ Backend generates JWT token  
✅ Frontend receives token and logs user in  
✅ Same flow works for Microsoft OAuth

## 🚨 Common Issues

**CORS Errors**: Make sure your frontend URL is in CORS configuration  
**Missing Environment Variables**: Double-check Railway environment variables  
**Wrong Callback URLs**: Must match exactly in OAuth provider settings  
**HTTPS Required**: OAuth providers require HTTPS in production

## 📞 If Still Not Working

Share the specific error messages from:

1. Railway backend logs
2. Browser console errors
3. Network tab (failed requests)

This will help identify the exact issue.
