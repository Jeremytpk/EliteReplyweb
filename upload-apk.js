// Script to upload APK to Firebase Storage
// Run with: node upload-apk.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'elitereply-bd74d.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function uploadAPK() {
  const apkPath = './assets/files/EliteReply_Android.apk';
  const destination = 'downloads/EliteReply_Android.apk';

  try {
    console.log('Uploading APK to Firebase Storage...');
    
    const [file] = await bucket.upload(apkPath, {
      destination: destination,
      metadata: {
        contentType: 'application/vnd.android.package-archive',
        cacheControl: 'public, max-age=3600',
      },
      public: true, // Make the file publicly accessible
    });

    // Get the public URL
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media`;
    
    console.log('✅ APK uploaded successfully!');
    console.log('Public URL:', publicUrl);
    console.log('\nUpdate your download links to use this URL.');
    
    return publicUrl;
  } catch (error) {
    console.error('❌ Error uploading APK:', error);
    throw error;
  }
}

uploadAPK()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
