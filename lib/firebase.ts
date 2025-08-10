'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Make sure these values exist in Vercel (Production) and match Firebase Console → Project Settings → General → Your apps
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,               // e.g. AIzaSy...
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,       // e.g. clarity-ai-36028.firebaseapp.com
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,         // e.g. clarity-ai-36028
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!, // e.g. clarity-ai-36028.appspot.com
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth + Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
// Optional UX tweak: always show account picker
provider.setCustomParameters({ prompt: 'select_account' });

// Firestore
export const db = getFirestore(app);
