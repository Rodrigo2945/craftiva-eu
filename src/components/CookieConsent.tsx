import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie } from 'lucide-react';
import { ANALYTICS_CONSENT_KEY, readAnalyticsConsent } from '../firebase';

export const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Shown only while no decision is recorded. Ignoring it counts as refusal,
    // so nothing is set until the visitor actively accepts.
    setVisible(readAnalyticsConsent() === null);
  }, []);

  const decide = (value: 'granted' | 'denied') => {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
    } catch {
      // Storage blocked: the decision cannot persist, and without it analytics
      // stays off, which is the safe outcome.
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-0 left-0 right-0 z-[90] p-4 sm:p-6"
        >
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                <Cookie size={24} />
              </div>
              <div>
                <h2 className="font-black text-stone-900 mb-1">{t('cookies.title')}</h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {t('cookies.description')}{' '}
                  <Link to="/privacy" className="text-orange-600 font-bold hover:underline">
                    {t('cookies.readMore')}
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => decide('denied')}
                className="flex-1 px-6 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors active:scale-95"
              >
                {t('cookies.decline')}
              </button>
              <button
                onClick={() => decide('granted')}
                className="flex-1 px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors active:scale-95"
              >
                {t('cookies.accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
