import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { Analytics } from 'firebase/analytics';

const fallbackConfig = {
  apiKey: 'AIzaSyAMYDgSMGLSDBduh2WP11J9ngpLWbUA9jU',
  authDomain: 'craftiva-eu.firebaseapp.com',
  projectId: 'craftiva-eu',
  storageBucket: 'craftiva-eu.firebasestorage.app',
  messagingSenderId: '959426499872',
  appId: '1:959426499872:web:22dcc36f98f7999edcf345',
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

const CONSENT_KEY = 'craftiva-analytics-consent';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

let analytics: Analytics | null = null;

export function analyticsConsent(): 'granted' | 'denied' | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  if (value === 'granted' || value === 'denied') return value;
  return null;
}

async function startAnalytics() {
  if (analytics || !firebaseConfig.measurementId || typeof window === 'undefined') return;
  try {
    const { getAnalytics } = await import('firebase/analytics');
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics unavailable', error);
  }
}

export function setAnalyticsConsent(value: 'granted' | 'denied') {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONSENT_KEY, value);
  if (value === 'granted') {
    void startAnalytics();
  }
}

if (typeof window !== 'undefined' && analyticsConsent() === 'granted') {
  void startAnalytics();
}

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (!analytics) return;
  import('firebase/analytics').then(({ logEvent }) => {
    if (analytics) logEvent(analytics, eventName, params);
  });
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', { page_name: pageName });
};
