import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './Auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';

export const AuthForm: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn();
      navigate('/');
    } catch (err: any) {
      setError(err.message || t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-stone-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-100 overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-black text-stone-900 mb-2">
              {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
            </h1>
            <p className="text-stone-500">
              {mode === 'login' 
                ? t('auth.loginDesc') 
                : t('auth.registerDesc')}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <div className="mt-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-stone-200 rounded-xl font-bold text-stone-700 hover:bg-stone-50 hover:border-orange-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                  <span>{t('auth.continueWithGoogle', 'Continuar com Google')}</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-stone-500">
            {mode === 'login' ? (
              <p>
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="text-orange-600 font-bold hover:underline">{t('auth.registerHere')}</Link>
              </p>
            ) : (
              <p>
                {t('auth.haveAccount')}{' '}
                <Link to="/login" className="text-orange-600 font-bold hover:underline">{t('auth.loginHere')}</Link>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
