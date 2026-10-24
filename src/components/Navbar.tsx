import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from './Auth';
import { Heart, LayoutDashboard, LogOut, Menu, MessageSquare, User, X } from 'lucide-react';
import { Logo } from './Logo';

const languages = ['pt', 'en', 'es'] as const;

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, profile, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/#colecoes', label: t('nav.explore') },
    { to: '/#artesaos', label: t('nav.artisans') },
    { to: '/#compradores', label: t('nav.buyers') },
    { to: '/register', label: t('nav.sell') },
  ];

  const active = (code: string) => i18n.resolvedLanguage?.startsWith(code) || i18n.language.startsWith(code);

  const languageSwitch = (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
      {languages.map((code, index) => (
        <React.Fragment key={code}>
          {index > 0 && <span className="text-[#D9CFC3]">|</span>}
          <button
            type="button"
            onClick={() => {
              i18n.changeLanguage(code);
              setOpen(false);
            }}
            className={active(code) ? 'text-[#C65D3B]' : 'text-[#8A7D72] hover:text-[#2A241E]'}
          >
            {code}
          </button>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7DDD0] bg-[#F6F0E6]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="Craftiva">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[#3C342C] lg:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-[#C65D3B]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {languageSwitch}
          {user ? (
            <AccountLinks />
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-[#3C342C] hover:text-[#C65D3B]">
                {t('common.login')}
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-[#C65D3B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A34A2C]"
              >
                {t('common.register')}
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-[#3C342C] lg:hidden"
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#E7DDD0] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-base font-medium text-[#3C342C]">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="py-1">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            {languageSwitch}
            {user ? (
              <AccountLinks compact onNavigate={() => setOpen(false)} />
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold">
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[#C65D3B] px-4 py-2 text-sm font-semibold text-white"
                >
                  {t('common.register')}
                </Link>
              </div>
            )}
          </div>
          {profile?.displayName && (
            <p className="mt-3 text-xs text-[#8A7D72]">{profile.displayName}</p>
          )}
        </div>
      )}
    </header>
  );
};

const AccountLinks: React.FC<{ compact?: boolean; onNavigate?: () => void }> = ({ compact, onNavigate }) => {
  const { t } = useTranslation();
  const { profile, logout } = useAuth();
  const className = compact
    ? 'p-2 text-[#3C342C]'
    : 'p-2 text-[#3C342C] hover:text-[#C65D3B]';

  return (
    <div className="flex items-center gap-1">
      <Link to="/wishlist" className={className} title={t('common.wishlist')} onClick={onNavigate}>
        <Heart size={20} />
      </Link>
      <Link to="/messages" className={className} title={t('common.messages')} onClick={onNavigate}>
        <MessageSquare size={20} />
      </Link>
      {profile?.role === 'seller' && (
        <Link to="/dashboard" className={className} title={t('common.dashboard')} onClick={onNavigate}>
          <LayoutDashboard size={20} />
        </Link>
      )}
      <Link to="/profile" className={className} title={t('userProfile.title')} onClick={onNavigate}>
        <User size={20} />
      </Link>
      <button
        type="button"
        className={className}
        title={t('common.logout')}
        onClick={() => {
          onNavigate?.();
          logout();
        }}
      >
        <LogOut size={20} />
      </button>
    </div>
  );
};
