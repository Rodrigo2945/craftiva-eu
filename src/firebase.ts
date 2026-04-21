import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - APENAS para backend (Auth, Database, Storage)
// Deploy é feito via GitHub Pages
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAMYDgSMGLSDBduh2WP11J9ngpLWbUA9jU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "craftiva-eu.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "craftiva-eu",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "craftiva-eu.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "959426499872",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:959426499872:web:22dcc36f98f7999edcf345",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YZ3J21ZS38"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Helper functions for analytics tracking
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (analytics) {
    import('firebase/analytics').then(({ logEvent }) => {
      logEvent(analytics, eventName, params);
    });
  }
};

export const trackPageView = (pageName: string) => {
  if (analytics) {
    import('firebase/analytics').then(({ logEvent }) => {
      logEvent(analytics, 'page_view', { page_name: pageName });
    });
  }
};
