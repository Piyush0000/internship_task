# Mobile App Network Troubleshooting

## Current Status
- ✅ Backend health endpoint works: https://internship-task-7bqo.onrender.com/health
- ❌ Registration failing with "check your network" error
- ⏳ Waiting for Render to redeploy with debug route

## Steps Taken

### 1. Backend Testing
- Health endpoint: ✅ Working
- API routes: ⏳ Testing after redeploy
- CORS configuration: ✅ Configured correctly

### 2. Mobile App Configuration
- API URL: https://internship-task-7bqo.onrender.com
- Error handling: Added console logging
- Network permissions: May need to be checked

## Possible Issues

### 1. Render Cold Start
Render free tier spins down services after inactivity. First request may timeout.
- **Solution**: Try multiple times, or upgrade to paid tier

### 2. Network Permissions
Android may be blocking network requests.
- **Solution**: Check Android Manifest for internet permissions

### 3. API Endpoint Issues
The specific API routes may not be working correctly.
- **Solution**: Testing after Render redeploy

### 4. Error Message Not Specific
"Check your network" is a generic error.
- **Solution**: Added console logging to get specific error details

## Immediate Actions

### For User:
1. **Wait 5-10 minutes** for Render to redeploy with debug route
2. **Try registration again** after redeploy
3. **Check internet connection** on phone
4. **Try different network** (WiFi vs mobile data)

### For Developer:
1. **Check Render logs** for any errors
2. **Test API endpoints** manually using curl/Postman
3. **Review mobile app logs** using React Native debugger
4. **Check Android Manifest** for internet permissions

## Testing API Endpoints

After Render redeploy, test these endpoints:

```bash
# Health check
curl https://internship-task-7bqo.onrender.com/health

# API routes check
curl https://internship-task-7bqo.onrender.com/api

# Registration test
curl -X POST https://internship-task-7bqo.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

## Android Manifest Check

Ensure these permissions are in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Network Security Config

If Android 9+ (API 28+), may need network security config:

```xml
<!-- In AndroidManifest.xml -->
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>

<!-- Create res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
    <domain-config>
        <domain includeSubdomains="true">internship-task-7bqo.onrender.com</domain>
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </domain-config>
</network-security-config>
```

## Next Steps

1. **Wait for Render redeploy** (5-10 minutes)
2. **Test API endpoints** manually
3. **Check mobile app logs** for specific error
4. **Add network security config** if needed
5. **Rebuild APK** with enhanced error handling

## Alternative: Use ngrok for Testing

If Render continues to have issues, use ngrok for local testing:

```bash
# Start backend locally
cd backend
npm run dev

# In another terminal
ngrok http 5000

# Update mobile app with ngrok URL
# Rebuild APK
```

---

**Status**: Investigating network connectivity issues with mobile app.
