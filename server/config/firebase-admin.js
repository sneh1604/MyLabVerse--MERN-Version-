const admin = require('firebase-admin');

function initializeFirebaseAdmin() {
  try {
    // If admin is already initialized, return existing instance
    if (admin.apps.length) return admin;

    // Try to get credentials from environment variable first
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (e) {
        console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', e);
      }
    }

    // If environment variable is not available, try local file in development
    if (!serviceAccount && process.env.NODE_ENV !== 'production') {
      try {
        serviceAccount = require('./firebase-service-account.json');
      } catch (e) {
        console.warn('Local firebase-service-account.json not found');
      }
    }

    if (!serviceAccount) {
      console.warn('Firebase credentials not found, some features may be disabled');
      return null;
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    return admin;
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    return null;
  }
}

module.exports = initializeFirebaseAdmin();
