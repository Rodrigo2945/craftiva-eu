import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Auth';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/ProductList';
import { ProductDetails } from './components/ProductDetails';
import { VendorDashboard } from './components/VendorDashboard';
import { Chat } from './components/Chat';
import { AuthForm } from './components/AuthForm';
import { SellerProfile } from './components/SellerProfile';
import { UserProfilePage } from './components/UserProfilePage';
import { WishlistPage } from './components/WishlistPage';
import { BlogPage } from './components/BlogPage';
import { TermsPage } from './components/TermsPage';
import { Logo } from './components/Logo';
import { motion, AnimatePresence } from 'motion/react';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-gray-100 shadow-2xl flex flex-col gap-1 min-w-[160px]"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${
                  i18n.language === lang.code
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-100'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-orange-600 text-white p-4 rounded-full shadow-xl hover:bg-orange-700 transition-all active:scale-95 flex items-center justify-center group ${isOpen ? 'rotate-12' : ''}`}
      >
        <Globe size={24} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">{t('common.loading')}</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const SellerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">{t('common.loading')}</div>;
  return user && profile?.role === 'seller' ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  const { t } = useTranslation();
  const { profile, updateRole } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      <LanguageSwitcher />
      
      {/* Role Selection Overlay for new users (Google Login users who haven't picked a role) */}
      <AnimatePresence>
        {profile && profile.uid && !profile.role && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl text-center"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-2">{t('auth.welcome')}</h2>
              <p className="text-gray-500 mb-8">{t('auth.role')}</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => updateRole('buyer')}
                  className="p-6 rounded-2xl border-2 border-stone-100 hover:border-orange-600 hover:bg-orange-50 transition-all group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🛍️</div>
                  <p className="font-bold text-gray-900">{t('common.buyer')}</p>
                  <p className="text-xs text-gray-500">{t('auth.buy')}</p>
                </button>
                <button 
                  onClick={() => updateRole('seller')}
                  className="p-6 rounded-2xl border-2 border-stone-100 hover:border-orange-600 hover:bg-orange-50 transition-all group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏪</div>
                  <p className="font-bold text-gray-900">{t('common.seller')}</p>
                  <p className="text-xs text-gray-500">{t('auth.sell')}</p>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/seller/:id" element={<SellerProfile />} />
          <Route path="/login" element={<AuthForm mode="login" />} />
          <Route path="/register" element={<AuthForm mode="register" />} />
          <Route 
            path="/dashboard" 
            element={
              <SellerRoute>
                <VendorDashboard />
              </SellerRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <UserProfilePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <PrivateRoute>
                <WishlistPage />
              </PrivateRoute>
            } 
          />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Logo className="h-8" />
          </div>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            {t('footer.tagline')}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm font-bold text-gray-400">
            <Link to="/blog" className="hover:text-orange-600 transition-colors">{t('common.blog')}</Link>
            <Link to="/terms" className="hover:text-orange-600 transition-colors">{t('common.terms')}</Link>
            <a href="#" className="hover:text-orange-600 transition-colors">{t('common.privacy')}</a>
            <a href="#" className="hover:text-orange-600 transition-colors">{t('common.help')}</a>
            <a href="#" className="hover:text-orange-600 transition-colors">{t('common.contact')}</a>
          </div>
          <p className="text-gray-300 text-[10px] mt-12 uppercase tracking-widest font-black">
            © 2026 CRAFTIVA.EU Inc. {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
