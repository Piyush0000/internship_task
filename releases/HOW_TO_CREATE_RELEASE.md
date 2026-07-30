# How to Create a GitHub Release with APK

Since GitHub CLI (`gh`) is not installed, follow these manual steps to create a GitHub release:

## Step 1: Push Changes to GitHub

```bash
cd D:\todo
git push origin main
```

## Step 2: Create GitHub Release Manually

1. **Go to your GitHub repository**
   - Navigate to `https://github.com/yourusername/todo`

2. **Create a new release**
   - Click on "Releases" in the right sidebar
   - Click "Create a new release"

3. **Fill in release details**
   - **Tag version**: `v1.0.0`
   - **Release title**: `TodoFlow v1.0.0 - Initial Release`
   - **Description**: Copy the content from `releases/RELEASE_NOTES.md`

4. **Attach the APK**
   - Click "Attach binaries"
   - Select the file: `releases/TodoFlow-v1.0.0.apk`
   - The file is located at: `D:\todo\releases\TodoFlow-v1.0.0.apk`

5. **Publish the release**
   - Click "Publish release"

## Step 3: Verify the Release

1. Go to the Releases section of your repository
2. Confirm the APK is attached and downloadable
3. Test the download link to ensure it works

## Alternative: Install GitHub CLI

If you want to automate this in the future, install GitHub CLI:

1. **Download GitHub CLI**
   - Windows: https://cli.github.com/
   - Download and install the Windows installer

2. **Authenticate**
   ```bash
   gh auth login
   ```

3. **Create release with CLI**
   ```bash
   gh release create v1.0.0 \
     --title "TodoFlow v1.0.0 - Initial Release" \
     --notes-file releases/RELEASE_NOTES.md \
     releases/TodoFlow-v1.0.0.apk
   ```

## APK Location

The APK file is currently located at:
- **Source**: `D:\todo\mobile\android\app\build\outputs\apk\release\app-release.apk`
- **Release copy**: `D:\todo\releases\TodoFlow-v1.0.0.apk`

## Important Notes

- The APK is signed with a debug keystore. For production, you should:
  - Create a proper release keystore
  - Sign the APK with your production key
  - Consider using app signing by Google Play

- Users downloading the APK will need:
  - "Install from unknown sources" enabled (Android 8+)
  - At least Android 5.0 (Lollipop)

- The app requires a running backend server to function properly.
