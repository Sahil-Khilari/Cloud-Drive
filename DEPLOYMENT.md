# 🚀 Firebase Deployment Guide

## Quick Deployment Steps

### 1. Install Firebase CLI (if not already installed)
```powershell
npm install -g firebase-tools
```

### 2. Login to Firebase
```powershell
firebase login
```

### 3. Configure Your Project
Edit `.firebaserc` and replace `"your-project-id"` with your Firebase project ID:
```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

### 4. Build the Project
```powershell
npm run build
```

### 5. Deploy Everything
```powershell
firebase deploy
```

## What Gets Deployed?

✅ **Hosting** (`dist` folder)
- Your compiled React application
- Optimized for production
- Includes routing configuration

✅ **Firestore Rules** (`firestore.rules`)
- Database security rules
- Ensures users can only access their own files

✅ **Storage Rules** (`storage.rules`)
- File storage security rules
- 50MB file size limit
- User-specific file access

## Selective Deployment

### Deploy Only Hosting
```powershell
firebase deploy --only hosting
```

### Deploy Only Rules
```powershell
firebase deploy --only firestore:rules,storage:rules
```

### Deploy Specific Services
```powershell
firebase deploy --only hosting,firestore:rules
```

## Testing Your Deployment

After deployment, Firebase will provide a URL like:
```
https://your-project-id.web.app
```

Visit this URL to test your deployed application!

## Troubleshooting

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run build`

### Deployment Errors
- Verify you're logged in: `firebase login`
- Check project ID in `.firebaserc` matches your Firebase Console
- Ensure you have proper permissions on the Firebase project

### Rules Not Working
- Check Firebase Console → Firestore → Rules
- Check Firebase Console → Storage → Rules
- Verify rules were deployed: `firebase deploy --only firestore:rules,storage:rules`

## File Structure for Firebase

```
file-share-app/
├── firebase.json              # Firebase configuration
├── .firebaserc               # Firebase project ID
├── firestore.rules           # Firestore security rules
├── storage.rules             # Storage security rules
├── firestore.indexes.json    # Firestore indexes
├── dist/                     # Build output (created by npm run build)
└── src/                      # Source code
```

## Commands Summary

| Command | Description |
|---------|-------------|
| `npm run build` | Build production bundle |
| `firebase login` | Authenticate with Firebase |
| `firebase deploy` | Deploy everything |
| `firebase deploy --only hosting` | Deploy only the website |
| `firebase deploy --only firestore:rules` | Deploy only Firestore rules |
| `firebase deploy --only storage:rules` | Deploy only Storage rules |
| `firebase hosting:channel:deploy preview` | Deploy to preview channel |

## Next Steps After Deployment

1. ✅ Test authentication (sign up/login)
2. ✅ Test file upload
3. ✅ Test file download
4. ✅ Test file deletion
5. ✅ Verify rules work (try accessing another user's files - should fail)
6. ✅ Test on mobile devices
7. ✅ Share the URL with others!

---

**Need help?** Check the [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
