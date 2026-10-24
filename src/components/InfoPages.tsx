import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Faq = { q: string; a: string };

function faqsOf(value: unknown): Faq[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Faq => Boolean(item && typeof item === 'object' && 'q' in item && 'a' in item));
}

const shell = 'mx-auto max-w-3xl px-4 py-12 sm:px-6';

export const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();
  const sections = [
    ['controllerTitle', 'controllerBody'],
    ['dataTitle', 'dataBody'],
    ['googleTitle', 'googleBody'],
    ['analyticsTitle', 'analyticsBody'],
    ['firestoreTitle', 'firestoreBody'],
    ['legalTitle', 'legalBody'],
    ['rightsTitle', 'rightsBody'],
    ['retentionTitle', 'retentionBody'],
    ['contactTitle', 'contactBody'],
  ] as const;

  return (
    <div className={shell}>
      <h1 className="font-serif text-4xl text-[#2A241E]">{t('privacy.title')}</h1>
      <p className="mt-2 text-sm text-[#8A7D72]">{t('privacy.updated')}</p>
      <p className="mt-5 text-lg leading-relaxed text-[#5C534C]">{t('privacy.lede')}</p>
      <div className="mt-8 space-y-8">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="font-serif text-2xl text-[#2A241E]">{t(`privacy.${title}`)}</h2>
            <p className="mt-2 leading-relaxed text-[#3C342C]">{t(`privacy.${body}`)}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export const HelpPage: React.FC = () => {
  const { t } = useTranslation();
  const items = faqsOf(t('help.items', { returnObjects: true }));

  return (
    <div className={shell}>
      <h1 className="font-serif text-4xl text-[#2A241E]">{t('help.title')}</h1>
      <p className="mt-4 text-lg text-[#5C534C]">{t('help.lede')}</p>
      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <details key={item.q} className="rounded-2xl border border-[#E7DDD0] bg-white px-5 py-4">
            <summary className="cursor-pointer font-semibold text-[#2A241E]">{item.q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-[#5C534C]">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('shop');
  const [message, setMessage] = useState('');

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const roleLabel = role === 'artisan' ? t('contact.artisan') : role === 'other' ? t('contact.other') : t('contact.shop');
    const body = `${t('contact.name')}: ${name}\n${t('contact.email')}: ${email}\n${t('contact.role')}: ${roleLabel}\n\n${message}`;
    const href = `mailto:hello@craftiva.eu?subject=${encodeURIComponent(t('contact.subject'))}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  const field = 'mt-1 w-full rounded-xl border border-[#E4D9CC] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#C65D3B]';

  return (
    <div className={shell}>
      <h1 className="font-serif text-4xl text-[#2A241E]">{t('contact.title')}</h1>
      <p className="mt-4 text-lg text-[#5C534C]">{t('contact.lede')}</p>
      <p className="mt-3">
        <a href="mailto:hello@craftiva.eu" className="font-semibold text-[#C65D3B]">
          hello@craftiva.eu
        </a>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-[#E7DDD0] bg-white p-6">
        <label className="block text-sm font-medium">
          {t('contact.name')}
          <input required value={name} onChange={(event) => setName(event.target.value)} className={field} />
        </label>
        <label className="block text-sm font-medium">
          {t('contact.email')}
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={field} />
        </label>
        <label className="block text-sm font-medium">
          {t('contact.role')}
          <select value={role} onChange={(event) => setRole(event.target.value)} className={field}>
            <option value="shop">{t('contact.shop')}</option>
            <option value="artisan">{t('contact.artisan')}</option>
            <option value="other">{t('contact.other')}</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          {t('contact.message')}
          <textarea required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} className={field} />
        </label>
        <button type="submit" className="rounded-lg bg-[#C65D3B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#A34A2C]">
          {t('contact.submit')}
        </button>
        <p className="text-xs leading-relaxed text-[#8A7D72]">{t('contact.note')}</p>
      </form>
    </div>
  );
};
