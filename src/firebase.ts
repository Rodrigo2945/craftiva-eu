import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import type { Analytics } from 'firebase/analytics';

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

// Loaded on demand: only the vendor dashboard uploads files, so this keeps the
// Storage SDK out of the initial bundle.
let storageInstance: FirebaseStorage | null = null;
export const getStorageLazy = async (): Promise<FirebaseStorage> => {
  if (!storageInstance) {
    const { getStorage } = await import('firebase/storage');
    storageInstance = getStorage(app);
  }
  return storageInstance;
};

// Analytics sets cookies, which under ePrivacy needs opt-in consent BEFORE it
// runs. It therefore stays off until something records consent, and no consent
// UI exists yet — so today this never initialises.
export const ANALYTICS_CONSENT_KEY = 'craftiva.analyticsConsent';

// null means the visitor has not decided yet, which is treated as refusal.
export const readAnalyticsConsent = (): 'granted' | 'denied' | null => {
  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return stored === 'granted' || stored === 'denied' ? stored : null;
  } catch {
    return null;
  }
};

export const hasAnalyticsConsent = (): boolean => readAnalyticsConsent() === 'granted';

let analyticsInstance: Analytics | null = null;
const getAnalyticsLazy = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return null;
  if (!analyticsInstance) {
    const { getAnalytics } = await import('firebase/analytics');
    analyticsInstance = getAnalytics(app);
  }
  return analyticsInstance;
};

export const trackEvent = async (eventName: string, params?: Record<string, unknown>) => {
  const analytics = await getAnalyticsLazy();
  if (!analytics) return;
  const { logEvent } = await import('firebase/analytics');
  logEvent(analytics, eventName, params);
};

export const trackPageView = (pageName: string) => trackEvent('page_view', { page_name: pageName });
