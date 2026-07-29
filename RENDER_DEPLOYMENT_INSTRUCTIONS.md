# Render.com Deployment Instructions

Your backend is now ready for deployment to Render.com. Follow these steps to deploy it:

## Step 1: Create Render.com Account

1. Go to https://render.com
2. Click "Sign Up" 
3. Sign up with GitHub (recommended)
4. Authorize Render to access your GitHub repositories

## Step 2: Create New Web Service

1. After logging in, click "New +" in the top right
2. Select "Web Service"

## Step 3: Connect Your Repository

1. Under "Connect Repository", search for `internship_task`
2. Click "Connect" next to your repository
3. Render will analyze your repository

## Step 4: Configure Build and Start Settings

Render should automatically detect most settings. Verify/adjust:

**Build Settings:**
- **Runtime**: Node
- **Build Command**: `npm install` (this will trigger `npm run build` via postinstall)
- **Start Command**: `npm start`

**Advanced Settings:**
- **Working Directory**: Leave blank (root of repo)

## Step 5: Configure Environment Variables

Scroll down to "Environment Variables" and add these:

1. **MONGODB_URI**:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string (get from MongoDB Atlas dashboard)

2. **JWT_SECRET**:
   - Key: `JWT_SECRET`
   - Value: Generate a secure random string (use: https://www.random.org/strings/)
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

3. **JWT_REFRESH_SECRET**:
   - Key: `JWT_REFRESH_SECRET`
   - Value: Generate another secure random string
   - Example: `z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4`

4. **PORT**:
   - Key: `PORT`
   - Value: `5000`

## Step 6: Deploy

1. Click "Create Web Service" at the bottom
2. Wait for the deployment to complete (usually 2-5 minutes)
3. You'll see logs showing the build process

## Step 7: Get Your API URL

Once deployment is complete:

1. Look for the URL at the top of the service page
2. It will look like: `https://todo-backend.onrender.com`
3. Copy this URL

## Step 8: Test Your Backend

1. Click the URL to open your deployed backend
2. Test the health endpoint: `https://your-url.onrender.com/health`
3. You should see: `{"status":"ok"}`

## Step 9: Update Mobile App

Now update your mobile app to use the new API URL:

### Option A: Use Environment Variable (Recommended)

1. Create/Edit `mobile/.env`:
   ```env
   EXPO_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

2. Rebuild the APK:
   ```bash
   cd mobile/android
   ./gradlew.bat assembleRelease
   ```

### Option B: Hardcode the URL

1. Edit `mobile/src/stores/authStore.ts`:
   ```typescript
   const API_URL = 'https://your-backend-url.onrender.com';
   ```

2. Edit `mobile/src/stores/taskStore.ts`:
   ```typescript
   const API_URL = 'https://your-backend-url.onrender.com';
   ```

3. Rebuild the APK

## Step 10: Update GitHub Release

1. Create a new GitHub release with the updated APK
2. Users can now download and use the app with a working backend

## Troubleshooting

### Build Fails
- Check the Render logs for specific errors
- Ensure all environment variables are set correctly
- Verify MongoDB connection string is valid

### Database Connection Issues
- Verify your MongoDB Atlas whitelist allows all IPs (0.0.0.0/0)
- Check that the MongoDB user has correct permissions
- Ensure the database name in the connection string matches

### App Still Not Working
- Test the API endpoints directly using curl or Postman
- Check Render logs for runtime errors
- Verify the mobile app is using the correct API URL

## Cost

Render.com free tier includes:
- 750 hours per month of web service usage
- 0.1 CPU
- 512MB RAM
- Automatic SSL certificates

This should be sufficient for your todo app!

## Next Steps After Deployment

1. Monitor your Render dashboard for any issues
2. Set up automatic deployments (Render does this by default on git push)
3. Consider upgrading to paid tier if you need more resources
4. Set up a custom domain if desired (Render provides instructions)

---

**Your backend is now deployment-ready!** Follow these steps and your APK will work with a live backend.
