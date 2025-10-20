# 📤 File Sharing Feature - Documentation

## Overview

The file sharing feature allows users to securely share their uploaded files with other users who have Gmail accounts. All shared files are tracked in Firestore and remain accessible even after the app is closed and reopened.

## Features

### ✅ Share Files
- Click the "Share" button on any uploaded file
- Enter the recipient's Gmail address
- Files are instantly shared with the recipient

### ✅ Gmail Validation
- Only Gmail addresses (@gmail.com) are accepted
- Real-time email format validation
- Prevents sharing with yourself

### ✅ Shared Files Dashboard
- **Received Tab**: View files others have shared with you
- **Sent Tab**: View files you've shared with others
- Real-time updates when new files are shared
- Shows sender/recipient information

### ✅ Persistent Storage
- All files are permanently stored in Firebase
- Files remain available after closing/reopening the app
- Shared files are tracked in Firestore database
- User authentication ensures secure access

## How It Works

### Database Structure

#### `files` Collection
Stores uploaded files with the following fields:
```javascript
{
  id: "auto-generated",
  name: "document.pdf",
  url: "https://firebase-storage-url...",
  size: 1048576, // bytes
  type: "application/pdf",
  userId: "owner-user-id",
  userEmail: "owner@gmail.com",
  createdAt: Timestamp
}
```

#### `shares` Collection
Tracks file shares with the following fields:
```javascript
{
  id: "auto-generated",
  fileId: "reference-to-file-id",
  fileName: "document.pdf",
  fileUrl: "https://firebase-storage-url...",
  fileSize: 1048576,
  fileType: "application/pdf",
  ownerId: "owner-user-id",
  ownerEmail: "owner@gmail.com",
  recipientEmail: "recipient@gmail.com",
  sharedAt: Timestamp
}
```

### Security Rules

#### Firestore Rules
- Users can only read their own files
- Users can only create files with their own userId
- Users can read shares where they are owner OR recipient
- Users can only create shares for files they own
- Users can only delete their own shares

#### Storage Rules
- Files are stored at `/files/{userId}/{fileName}`
- Users can only access files in their own folder
- 50MB file size limit enforced
- Authentication required for all operations

## User Guide

### Sharing a File

1. **Navigate to Dashboard**
   - Sign in to your account
   - View your uploaded files in "My Files" section

2. **Click Share Button**
   - Find the file you want to share
   - Click the green "Share" button

3. **Enter Recipient Email**
   - Type the recipient's Gmail address
   - Must be a valid @gmail.com address
   - Cannot be your own email

4. **Confirm Sharing**
   - Click "Share File" button
   - Wait for confirmation message
   - Modal will close automatically

### Viewing Shared Files

1. **Scroll to Shared Files Section**
   - Located below "My Files" on dashboard
   - Shows two tabs: "Received" and "Sent"

2. **Received Tab**
   - Shows files others have shared with you
   - Displays sender's email
   - Download files directly

3. **Sent Tab**
   - Shows files you've shared with others
   - Displays recipient's email
   - Track your shared files

### Downloading Shared Files

1. **Open Shared Files**
   - Navigate to "Received" tab
   - Find the file you want to download

2. **Click Download**
   - Click the "Download" button
   - File will download to your device

## Technical Details

### Components

#### `ShareFile.jsx`
- Modal component for sharing files
- Gmail validation
- Creates share records in Firestore
- Prevents duplicate shares

#### `SharedFiles.jsx`
- Displays shared files dashboard
- Tab-based interface (Received/Sent)
- Real-time updates via Firestore listeners
- Filters files based on user email

#### `FileList.jsx` (Updated)
- Added "Share" button to each file
- Opens ShareFile modal
- Passes file data to modal

#### `App.jsx` (Updated)
- Includes SharedFiles component in dashboard
- Renders below FileList component

### Firestore Queries

#### Get Received Files
```javascript
query(
  collection(db, 'shares'),
  where('recipientEmail', '==', user.email.toLowerCase()),
  orderBy('sharedAt', 'desc')
)
```

#### Get Sent Files
```javascript
query(
  collection(db, 'shares'),
  where('ownerEmail', '==', user.email.toLowerCase()),
  orderBy('sharedAt', 'desc')
)
```

#### Get All Shares (Received + Sent)
```javascript
query(
  collection(db, 'shares'),
  or(
    where('recipientEmail', '==', user.email.toLowerCase()),
    where('ownerEmail', '==', user.email.toLowerCase())
  ),
  orderBy('sharedAt', 'desc')
)
```

### Real-Time Updates

All file lists use Firestore's `onSnapshot` listener for real-time updates:
- New files appear instantly when uploaded
- Shared files appear instantly when shared
- Deleted files disappear instantly
- No page refresh required

## Deployment Notes

### Required Firestore Indexes

The following composite indexes are required:

1. **Shares by recipientEmail + sharedAt**
   ```
   Collection: shares
   Fields: recipientEmail (Ascending), sharedAt (Descending)
   ```

2. **Shares by ownerEmail + sharedAt**
   ```
   Collection: shares
   Fields: ownerEmail (Ascending), sharedAt (Descending)
   ```

These are automatically created when you deploy with:
```bash
firebase deploy --only firestore:indexes
```

### Security Rules Deployment

Deploy updated Firestore rules:
```bash
firebase deploy --only firestore:rules
```

## Limitations

- ❌ Only Gmail accounts are supported for sharing
- ❌ Recipient doesn't receive email notification (would require Cloud Functions)
- ❌ Cannot unshare after sharing (delete functionality not implemented)
- ❌ No access control levels (view-only, download, edit)
- ✅ 50MB file size limit
- ✅ Unlimited shares per file

## Future Enhancements

### Possible Features
1. **Email Notifications**
   - Send email to recipient when file is shared
   - Requires Firebase Cloud Functions

2. **Unshare Functionality**
   - Allow users to revoke file shares
   - Add "Unshare" button to sent files

3. **Share with Multiple Users**
   - Share one file with multiple recipients at once
   - Bulk sharing interface

4. **Share Expiration**
   - Set expiration dates for shared files
   - Automatic cleanup of expired shares

5. **Access Levels**
   - View-only access
   - Download permission
   - Time-limited access

6. **Share Links**
   - Generate shareable links
   - No account required for recipient
   - Link expiration

7. **File Comments**
   - Add comments to shared files
   - Thread-based discussions

8. **Share Analytics**
   - Track file views
   - Download statistics
   - Activity logs

## Troubleshooting

### Files Not Appearing After Refresh

**Issue**: Files disappear after closing and reopening the app

**Solution**: This shouldn't happen as files are stored permanently in Firestore. If it does:
1. Check if user is signed in with the same account
2. Verify Firestore rules are deployed
3. Check browser console for errors
4. Ensure Firebase SDK is properly initialized

### Cannot Share Files

**Issue**: Share button doesn't work or shows errors

**Solutions**:
1. Verify recipient email is a valid Gmail address
2. Check Firestore rules allow creating shares
3. Ensure you're not sharing with yourself
4. Check for duplicate shares with same recipient
5. Verify internet connection

### Shared Files Not Showing

**Issue**: Shared files don't appear in "Received" tab

**Solutions**:
1. Verify you're signed in with the Gmail account that received the share
2. Check if sender used correct email address
3. Refresh the page
4. Check Firestore console to verify share record exists
5. Verify Firestore indexes are deployed

### Email Validation Failing

**Issue**: Valid Gmail addresses are rejected

**Solution**: 
- Email must be exactly in format: `user@gmail.com`
- No spaces before or after
- All lowercase is recommended
- No special characters except `.`, `_`, `+`, `-` before @

## API Reference

### ShareFile Component

**Props:**
- `file` (object): File object to share
- `user` (object): Current authenticated user
- `onClose` (function): Callback to close modal

**Methods:**
- `validateGmail(email)`: Validates Gmail format
- `handleShare(e)`: Creates share record in Firestore

### SharedFiles Component

**Props:**
- `user` (object): Current authenticated user

**State:**
- `sharedFiles` (array): List of all shares
- `activeTab` (string): Current tab ('received' or 'sent')

**Methods:**
- `formatFileSize(bytes)`: Converts bytes to readable format
- `formatDate(timestamp)`: Converts Firestore timestamp to string

## Support

For issues or questions about the file sharing feature:
1. Check this documentation
2. Review Firestore rules in Firebase Console
3. Check browser console for errors
4. Verify Firebase configuration in `src/firebase.js`
5. Open an issue on GitHub

---

**Last Updated**: October 2025  
**Version**: 1.0.0
