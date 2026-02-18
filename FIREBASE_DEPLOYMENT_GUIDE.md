# Firebase Rules Deployment Guide

## ⚠️ IMPORTANT: You MUST Deploy the Rules!

The updated Firebase rules in `database.rules.json` are currently only in your code. They need to be deployed to your Firebase project to work.

## Option 1: Deploy via Firebase Console (Easiest - No CLI needed)

### Steps:
1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `studio-6588365639-fa5e2`
3. **Navigate to**: Realtime Database → Rules (in the left sidebar)
4. **Copy the rules** from your `database.rules.json` file
5. **Paste them** into the Firebase Console editor
6. **Click "Publish"**

### What to Copy:
```json
{
  "rules": {
    "userRoles": {
      ".read": "root.child('userRoles').child(auth.uid).child('role').val() === 'admin'",
      "$uid": {
        ".read": "auth != null",
        ".write": "$uid === auth.uid"
      }
    },
    "studentData": {
      ".read": "root.child('userRoles').child(auth.uid).child('role').val() === 'admin'",
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "peerBuddies": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "conversations": {
      "$conversationId": {
        ".read": "auth != null && (data.child('studentId').val() == auth.uid || data.child('peerBuddyId').val() == auth.uid)",
        ".write": "auth != null && (!data.exists() || data.child('studentId').val() == auth.uid || data.child('peerBuddyId').val() == auth.uid)",
        ".indexOn": ["studentId", "peerBuddyId"]
      }
    },
    "messages": {
      "$conversationId": {
        ".read": "auth != null && (root.child('conversations').child($conversationId).child('studentId').val() == auth.uid || root.child('conversations').child($conversationId).child('peerBuddyId').val() == auth.uid)",
        ".write": "auth != null && (root.child('conversations').child($conversationId).child('studentId').val() == auth.uid || root.child('conversations').child($conversationId).child('peerBuddyId').val() == auth.uid)",
        "$messageId": {
          ".validate": "newData.hasChildren(['sender', 'senderId', 'text', 'timestamp', 'conversationId', 'createdAt'])"
        }
      }
    }
  }
}
```

## Option 2: Deploy via Firebase CLI (Recommended for production)

### Prerequisites:
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

### Deployment Steps:

1. **Create `firebase.json`** (if not exists):
   ```json
   {
     "database": {
       "rules": "database.rules.json"
     }
   }
   ```

2. **Deploy the rules**:
   ```bash
   firebase deploy --only database
   ```

3. **Verify deployment**:
   - Check Firebase Console → Realtime Database → Rules
   - You should see the updated rules

## 🔍 What These Rules Do:

### 1. **userRoles** (updated)
- **Admin access**: Admins can read all user roles (list-level access)
- **Individual access**: All authenticated users can read any user role
- **Write access**: Users can only write their own role

### 2. **studentData** (updated)
- **Admin access**: Admins can read all student data (list-level access)
- **Individual access**: Students can only read their own data
- **Write access**: Students can only write their own data

### 3. **peerBuddies** (NEW)
- **Read access**: Peer buddies can only read their own data
- **Write access**: Peer buddies can only write their own data

### 4. **conversations** (for peer messaging)
- Only conversation participants (student or peer buddy) can read the conversation
- Only participants can write to the conversation
- Indexed on `studentId` and `peerBuddyId` for fast queries

### 5. **messages** (for peer messaging)
- Only conversation participants can read messages
- Only conversation participants can send messages
- Validates message structure (must have: sender, senderId, text, timestamp, conversationId, createdAt)

## ⚠️ Security Note:

Without deploying these rules, the application might:
- ❌ Not work at all (if default rules deny access)
- ❌ Allow unauthorized access to data
- ❌ Have poor query performance (no indexes)

## ✅ After Deployment:

1. **Test the features**: 
   - Admin can view all user roles and student data
   - Peer buddies have their own data section
   - Student-peer buddy messaging works
   - Messages persist on refresh

2. **Verify in Firebase Console**:
   - Go to Realtime Database → Data
   - Check `/userRoles`, `/studentData`, `/peerBuddies`, `/conversations`, and `/messages` paths
   - Verify data is being written

3. **Monitor for errors**:
   - Check browser console
   - Check Firebase Console → Realtime Database → Usage

## 🆘 Troubleshooting:

**Error: "Permission denied"**
- Rules not deployed correctly
- Re-deploy and refresh your app

**Error: "PERMISSION_DENIED"**
- User not authenticated
- Check authentication is working
- Verify user has correct role for admin operations

**No data showing up**
- Check Firebase Console → Data tab
- Verify data is being written
- Check browser console for errors

---

## Quick Summary:

**YES, you MUST deploy the Firebase rules!**

**Fastest way**: Copy rules from `database.rules.json` → Paste in Firebase Console → Click Publish

**The application features will NOT work properly without these rules deployed!**
