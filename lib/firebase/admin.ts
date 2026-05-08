import * as admin from 'firebase-admin';

const isConfigured = 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  if (isConfigured) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // The private key might have escaped newlines if passed via environment variables
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error);
    }
  } else {
    console.warn("⚠️ FIREBASE ADMIN VARIABLES MISSING -> Check .env.local");
  }
}

// Proxy to prevent immediate crash, and throw cleanly when used
export const adminDb = new Proxy({}, {
  get: (target, prop) => {
    if (!admin.apps.length) throw new Error("Firebase Admin not configured. Missing ENV vars.");
    return (admin.firestore() as any)[prop];
  }
}) as FirebaseFirestore.Firestore;

export const adminAuth = new Proxy({}, {
  get: (target, prop) => {
    if (!admin.apps.length) throw new Error("Firebase Admin not configured. Missing ENV vars.");
    return (admin.auth() as any)[prop];
  }
}) as admin.auth.Auth;

export const adminStorage = new Proxy({}, {
  get: (target, prop) => {
    if (!admin.apps.length) throw new Error("Firebase Admin not configured. Missing ENV vars.");
    return (admin.storage() as any)[prop];
  }
}) as admin.storage.Storage;
