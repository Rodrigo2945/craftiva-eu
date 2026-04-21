import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - APENAS para backend (Auth, Database, Storage)
// Deploy é feito via GitHub Pages
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
