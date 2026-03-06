# Firebase Deployment Guide

## Prerequisites

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or select existing project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Choose your region

### 2. Get Firebase Configuration

1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click on Web app icon (</>) or add new web app
4. Copy the configuration values

### 3. Configure Environment Variables

Create a `.env` file in the project root with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Initialize Firebase in Your Project

```bash
firebase init
```

Select:
- Hosting: Configure files for Firebase Hosting
- Firestore: Deploy Firestore security rules

When prompted:
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub automatic builds: `No` (optional)

### 5. Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### 6. Build and Deploy

```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

Or deploy everything at once:
```bash
npm run build && firebase deploy
```

## Post-Deployment

1. Visit your Firebase Hosting URL (shown in terminal after deployment)
2. Create your first user account
3. Test all features

## Updating the App

```bash
# Make your changes, then:
npm run build
firebase deploy
```

## Useful Commands

```bash
# Test hosting locally
firebase serve

# View deployment history
firebase hosting:channel:list

# Rollback to previous deployment
firebase hosting:rollback

# View logs
firebase functions:log
```

## Security Checklist

✅ Firebase security rules deployed
✅ Environment variables configured
✅ Authentication enabled
✅ HTTPS enabled (automatic with Firebase Hosting)
✅ API keys restricted (optional, in Google Cloud Console)

## Performance Tips

- Enable Firebase Performance Monitoring
- Use Firebase Analytics to track usage
- Monitor Firestore usage to avoid excessive reads
- Set up billing alerts

## Troubleshooting

**Issue:** Build fails
- Check all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Issue:** Firebase deploy fails
- Ensure you're logged in: `firebase login`
- Check firebase.json configuration
- Verify project ID matches: `firebase use --add`  

**Issue:** Database access denied
- Check Firestore security rules are deployed
- Ensure user is authenticated
- Verify userId matches in database

## Cost Optimization

- Use Firestore indexes efficiently
- Implement pagination for large datasets
- Cache frequently accessed data
- Monitor usage in Firebase Console

For more help, visit [Firebase Documentation](https://firebase.google.com/docs)
