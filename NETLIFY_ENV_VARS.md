# Netlify Environment Variables Setup

## Required Environment Variables for Netlify

Add these environment variables in your Netlify dashboard under **Site settings > Environment variables**:

### Company Information
```
REACT_APP_PHONE_SN=+221776340064
REACT_APP_PHONE_CA=+18193198464
REACT_APP_EMAIL=manager@senharvest.com
REACT_APP_WHATSAPP=+221776340064
```

### Firebase Configuration
```
REACT_APP_FIREBASE_API_KEY=your-actual-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=xidma-harvest.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=xidma-harvest
REACT_APP_FIREBASE_STORAGE_BUCKET=xidma-harvest.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
```

### Cloud Function URL
```
REACT_APP_CF_SENDCONTACT_URL=https://us-central1-xidma-harvest.cloudfunctions.net/sendContact
```

### Optional Analytics
```
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
REACT_APP_FACEBOOK_PIXEL_ID=your-pixel-id
```

## How to Add Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site (senharvest)
3. Go to **Site settings**
4. Click **Environment variables**
5. Click **Add variable**
6. Add each variable with its value
7. Click **Save**

## Important Notes

- **Never commit actual API keys** to the repository
- Use placeholder values in `env.example`
- The actual values should only be in Netlify's environment variables
- After adding variables, trigger a new deploy to apply changes

## Verification

After deployment, you can verify the variables are working by:
1. Checking the contact form functionality
2. Verifying Firebase connection in browser console
3. Testing admin panel features
