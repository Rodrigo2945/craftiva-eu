import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Auth';
import { Navbar } from './components/Navbar';
import { Logo } from './components/Logo';
import { motion, AnimatePresence } from 'motion/react';
import { CookieNotice } from './components/CookieNotice';

const HomePage = lazy(() => import('./components/HomePage').then(m => ({ default: m.HomePage })));
const CategoryPage = lazy(() => import('./components/CategoryPage').then(m => ({ default: m.CategoryPage })));
const ProductDetails = lazy(() => import('./components/ProductDetails').then(m => ({ default: m.ProductDetails })));
const VendorDashboard = lazy(() => import('./components/VendorDashboard').then(m => ({ default: m.VendorDashboard })));
const Chat = lazy(() => import('./components/Chat').then(m => ({ default: m.Chat })));
const AuthForm = lazy(() => import('./components/AuthForm').then(m => ({ default: m.AuthForm })));
const SellerProfile = lazy(() => import('./components/SellerProfile').then(m => ({ default: m.SellerProfile })));
const UserProfilePage = lazy(() => import('./components/UserProfilePage').then(m => ({ default: m.UserProfilePage })));
const WishlistPage = lazy(() => import('./components/WishlistPage').then(m => ({ default: m.WishlistPage })));
const BlogPage = lazy(() => import('./components/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./components/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const TermsPage = lazy(() => import('./components/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./components/InfoPages').then(m => ({ default: m.PrivacyPage })));
const HelpPage = lazy(() => import('./components/InfoPages').then(m => ({ default: m.HelpPage })));
const ContactPage = lazy(() => import('./components/InfoPages').then(m => ({ default: m.ContactPage })));

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
    <div className="min-h-screen bg-[#F6F0E6] font-sans text-[#2A241E] selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      
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
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-stone-400">{t('common.loading')}</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
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
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        </Suspense>
      </main>

      <footer className="mt-8 border-t border-[#E7DDD0] py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mb-4 flex items-center justify-center">
            <Logo />
          </div>
          <p className="mx-auto mb-6 max-w-md text-sm text-[#6F655C]">
            {t('footer.tagline')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-[#6F655C]">
            <Link to="/blog" className="hover:text-[#C65D3B]">{t('common.blog')}</Link>
            <Link to="/terms" className="hover:text-[#C65D3B]">{t('common.terms')}</Link>
            <Link to="/privacy" className="hover:text-[#C65D3B]">{t('common.privacy')}</Link>
            <Link to="/help" className="hover:text-[#C65D3B]">{t('common.help')}</Link>
            <Link to="/contact" className="hover:text-[#C65D3B]">{t('common.contact')}</Link>
          </div>
          <p className="mt-8 text-xs text-[#A3988C]">© 2026 Craftiva.eu</p>
        </div>
      </footer>
      <CookieNotice />
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
