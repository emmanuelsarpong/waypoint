# OAuth Setup Guide

## Google OAuth Setup

### Step 1: Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Google+ API**:
   - APIs & Services → Library
   - Search "Google+ API" → Enable

### Step 2: Create OAuth Credentials

1. **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth 2.0 Client IDs**
3. Configure consent screen if prompted
4. Application type: **Web application**
5. **Authorized redirect URIs**:
   ```
   http://localhost:5173/api/auth/google/callback
   https://your-app.vercel.app/api/auth/google/callback
   ```
6. Save **Client ID** and **Client Secret**

---

## Microsoft OAuth Setup

### Step 1: Azure App Registrations

1. Go to [portal.azure.com](https://portal.azure.com)
2. **Azure Active Directory** → **App registrations**
3. **New registration**

### Step 2: Configure App

1. **Name**: Waypoint App
2. **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
3. **Redirect URI**:
   ```
   http://localhost:5173/api/auth/microsoft/callback
   https://your-app.vercel.app/api/auth/microsoft/callback
   ```

### Step 3: Get Credentials

1. **Overview** → Copy **Application (client) ID**
2. **Certificates & secrets** → **New client secret**
3. Save the **Value** (this is your client secret)

---

## Environment Variables for Vercel

Add these to your Vercel dashboard:

```
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string

# Security
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-key-here

# Stripe (get from Stripe dashboard)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## ✅ Update Redirect URIs After Deployment

Once deployed, update both Google and Microsoft OAuth apps with your actual Vercel URL!
