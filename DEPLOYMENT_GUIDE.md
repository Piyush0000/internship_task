# Backend Deployment Guide

The mobile app is currently configured to connect to `http://192.168.1.8:5000` which only works on your local network. To make the APK work on your phone, you need to deploy the backend to a publicly accessible server.

## Quick Fix Options

### Option 1: Use Your Computer's Public IP (Free but requires setup)

1. **Find your public IP**:
   ```bash
   # On your computer
   curl ifconfig.me
   ```

2. **Forward port 5000 on your router**:
   - Access your router admin panel (usually 192.168.1.1 or 192.168.0.1)
   - Find "Port Forwarding" or "Virtual Server" settings
   - Forward external port 5000 to your computer's local IP (192.168.1.8) port 5000

3. **Update mobile app API URL**:
   - Change `API_URL` in both stores to: `http://YOUR_PUBLIC_IP:5000`
   - Rebuild the APK

### Option 2: Use ngrok (Easiest for testing)

1. **Install ngrok**:
   ```bash
   # Download from https://ngrok.com/download
   # Or use npm: npm install -g ngrok
   ```

2. **Start your backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **In another terminal, start ngrok**:
   ```bash
   ngrok http 5000
   ```

4. **Copy the https URL** from ngrok (e.g., `https://abc123.ngrok.io`)

5. **Update mobile app API URL**:
   - Change `API_URL` in both stores to the ngrok URL
   - Rebuild the APK

### Option 3: Deploy to Free Cloud Services (Recommended for production)

#### A. Render.com (Free tier available)

1. **Create account** at https://render.com

2. **Prepare your backend**:
   ```bash
   cd backend
   # Add .gitignore if not present
   echo "node_modules/" >> .gitignore
   echo ".env" >> .gitignore
   echo "dist/" >> .gitignore
   ```

3. **Push backend to GitHub** (separate repo or as part of current repo)

4. **Create Web Service on Render**:
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the backend folder or configure root directory
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Generate a secure random string
     - `JWT_REFRESH_SECRET`: Generate another secure random string
     - `PORT`: 5000
   - Click "Create Web Service"

5. **Get your API URL** from Render (e.g., `https://your-app.onrender.com`)

6. **Update mobile app and rebuild APK**

#### B. Railway.app (Free tier available)

1. **Create account** at https://railway.app

2. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Deploy your backend**:
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Add environment variables** in Railway dashboard

5. **Get your API URL** from Railway

6. **Update mobile app and rebuild APK**

#### C. Vercel (Free tier available)

1. **Create account** at https://vercel.com

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Deploy backend**:
   ```bash
   cd backend
   vercel
   ```

4. **Configure environment variables** in Vercel dashboard

5. **Get your API URL** from Vercel

6. **Update mobile app and rebuild APK**

### Option 4: MongoDB Atlas + Free Hosting

1. **Set up MongoDB Atlas** (free tier):
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string

2. **Deploy backend using any of the above services**

## Updating Mobile App API URL

### Method 1: Using Environment Variables (Recommended)

1. **Create .env file in mobile directory**:
   ```env
   EXPO_PUBLIC_API_URL=https://your-deployed-backend.com
   ```

2. **Update the stores to use the env var** (already configured):
   ```typescript
   const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.8:5000';
   ```

3. **Rebuild the APK**:
   ```bash
   cd mobile/android
   ./gradlew.bat assembleRelease
   ```

### Method 2: Hardcode the URL (Quick testing)

1. **Edit `src/stores/authStore.ts`**:
   ```typescript
   const API_URL = 'https://your-deployed-backend.com';
   ```

2. **Edit `src/stores/taskStore.ts`**:
   ```typescript
   const API_URL = 'https://your-deployed-backend.com';
   ```

3. **Rebuild the APK**

## Database Setup

### MongoDB Atlas (Free tier recommended)

1. **Create MongoDB Atlas account**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create cluster**:
   - Click "Build a Database"
   - Choose "Free" tier
   - Select a region (choose closest to your users)
   - Name your cluster
   - Click "Create"

3. **Get connection string**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Configure backend .env**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   PORT=5000
   ```

## Quick Start with ngrok (Fastest for testing)

If you want to test the APK quickly without full deployment:

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start ngrok
ngrok http 5000

# Copy the https URL from ngrok output
# Update mobile app API URL
# Rebuild APK
```

## Recommended Approach

For a reliable solution that works long-term:

1. **Deploy backend to Render.com** (free tier)
2. **Use MongoDB Atlas** (free tier)  
3. **Update mobile app with new API URL**
4. **Rebuild and distribute the APK**

This gives you:
- ✅ 24/7 backend availability
- ✅ HTTPS security
- ✅ Free hosting
- ✅ Works from anywhere
- ✅ Scalable if needed
