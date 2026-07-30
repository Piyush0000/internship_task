# Expo Network Issue - Solutions

## Problem
Expo is failing to fetch native modules from `https://api.expo.dev/v2/sdks/50.0.0/native-modules`

## Quick Solutions

### Option 1: Use the Pre-built APK (Recommended)
Since you already have a working APK with the deployed backend:
```bash
# Install this APK on your phone:
D:\todo\releases\TodoFlow-v1.0.0.apk
```
This avoids Expo development server issues entirely.

### Option 2: Start Backend Locally + Use APK
If you want to test with local backend:
```bash
cd backend
npm run dev
```
Then rebuild the APK with your local IP address in the API URL.

### Option 3: Try Expo with Offline Mode
```bash
cd mobile
npx expo start --offline
```
This skips fetching from Expo's API.

### Option 4: Clear Expo Cache
```bash
cd mobile
npx expo start --clear
```

### Option 5: Check Network/Firewall
The error suggests a network connectivity issue:
- Check if you're behind a corporate firewall
- Try using a different network (mobile hotspot)
- Check if `https://api.expo.dev` is accessible

### Option 6: Use Different Port
The port conflict was resolved, but you can specify a port:
```bash
npx expo start --port 19000
```

## For Screen Recording
Since you want to record the screen, I recommend:

### Method 1: Use the APK (Easiest)
1. Install `D:\todo\releases\TodoFlow-v1.0.0.apk` on your phone
2. Connect to deployed backend: `https://internship-task-7bqo.onrender.com`
3. Record screen of the app in action
4. No development server needed

### Method 2: Run Backend Locally + Test APK
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Update mobile app API URL to use your local IP
# Rebuild APK
cd mobile/android
./gradlew.bat assembleRelease

# Install and test the new APK
```

### Method 3: Fix Expo Development Server
```bash
# Try these steps:
cd mobile
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --offline --clear
```

## Current Status
- ✅ Backend deployed on Render.com (working)
- ✅ APK built with network fixes
- ✅ Download/share functionality added
- ❌ Expo development server has network issues

## Recommendation
For screen recording purposes, **use the pre-built APK** - it's the most reliable method and already has all the fixes applied. The deployed backend at `https://internship-task-7bqo.onrender.com` is operational, so the app will work perfectly.

## Backend Testing
If you want to verify the backend is working:
```bash
# Test health endpoint
curl https://internship-task-7bqo.onrender.com/health

# Should return: {"status":"ok"}
```

Let me know which method you'd prefer to use for screen recording!
