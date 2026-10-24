import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { analyticsConsent, setAnalyticsConsent } from '../firebase';

export const CookieNotice: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => analyticsConsent() === null);

  if (!visible) return null;

  const choose = (value: 'granted' | 'denied') => {
    setAnalyticsConsent(value);
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-[#E7DDD0] bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[#3C342C]">{t('cookie.text')}</p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#5C534C]"
          >
            {t('cookie.decline')}
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="rounded-full bg-[#C65D3B] px-4 py-2 text-sm font-semibold text-white"
          >
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  );
};
