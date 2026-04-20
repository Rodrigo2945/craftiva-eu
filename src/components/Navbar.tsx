import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from './Auth';
import { ShoppingBag, User, LogIn, LogOut, LayoutDashboard, MessageSquare, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, profile, signIn, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo className="h-8 group-hover:scale-105 transition-transform" />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                to="/wishlist" 
                className="p-2 text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                title={t('common.wishlist')}
              >
                <Heart size={22} />
              </Link>

              <Link 
                to="/messages" 
                className="p-2 text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                title={t('common.messages')}
              >
                <MessageSquare size={22} />
              </Link>
              
              {profile?.role === 'seller' && (
                <Link 
                  to="/dashboard" 
                  className="p-2 text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                  title={t('common.dashboard')}
                >
                  <LayoutDashboard size={22} />
                </Link>
              )}

              <Link 
                to="/profile" 
                className="flex items-center gap-3 pl-4 border-l border-stone-100 group/profile"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-stone-900 group-hover/profile:text-orange-600 transition-colors">{profile?.displayName}</p>
                  <p className="text-xs text-stone-500 capitalize">{profile?.role === 'seller' ? t('common.seller') : t('common.buyer')}</p>
                </div>
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 overflow-hidden border border-orange-100 group-hover/profile:scale-105 transition-transform">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
              </Link>
              <button 
                onClick={logout}
                className="p-2 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title={t('common.logout')}
              >
                <LogOut size={22} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-stone-600 font-bold hover:text-orange-600 px-4 py-2 transition-colors"
              >
                {t('common.login')}
              </Link>
              <Link
                to="/register"
                className="bg-orange-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-orange-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                {t('common.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
