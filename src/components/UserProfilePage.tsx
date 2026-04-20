import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './Auth';
import { motion } from 'motion/react';
import { User, Mail, Shield, Save, Loader2, CheckCircle2, Store, Phone, Palette, Instagram, Facebook, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, profile, updateProfileData } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'becomeSeller'>('profile');
  
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bio, setBio] = useState(profile?.bio || '');

  const [shopName, setShopName] = useState(profile?.shopName || '');
  const [shopBio, setShopBio] = useState(profile?.bio || '');
  const [craftType, setCraftType] = useState(profile?.craftType || '');
  const [instagram, setInstagram] = useState(profile?.socialLinks?.instagram || '');
  const [facebook, setFacebook] = useState(profile?.socialLinks?.facebook || '');
  const [website, setWebsite] = useState(profile?.socialLinks?.website || '');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfileData({ bio });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegisterSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsRegistering(true);
    try {
      await updateProfileData({ 
        role: 'seller',
        shopName,
        bio: shopBio,
        story: shopBio, // using bio as story for now to keep it simple
        craftType,
        socialLinks: {
          instagram,
          facebook,
          website
        }
      });
      setRegisterSuccess(true);
      setTimeout(() => {
        setRegisterSuccess(false);
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error registering as seller:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  if (!profile) return <div className="p-8 text-center">{t('userProfile.loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-semibold text-stone-900 tracking-tight mb-2">{t('userProfile.title')}</h1>
        <p className="text-stone-500">{t('userProfile.subtitle')}</p>
      </div>

      {profile.role === 'buyer' && (
        <div className="flex gap-4 mb-8 border-b border-gray-100 pb-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'profile' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t('userProfile.tabs.profile')}
          </button>
          <button
            onClick={() => setActiveTab('becomeSeller')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'becomeSeller' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
            }`}
          >
            <Store size={16} />
            {t('userProfile.tabs.becomeSeller')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-4 overflow-hidden shadow-inner">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={40} />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{profile.displayName}</h2>
            <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
              <Shield size={14} />
              {t(`common.${profile.role}`)}
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="md:col-span-2">
          {activeTab === 'profile' ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('userProfile.displayName')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      disabled 
                      value={profile.displayName}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">{t('userProfile.nameHint')}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('userProfile.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      disabled 
                      value={user?.email || ''}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('userProfile.bio')}</label>
                  <textarea 
                    rows={4}
                    placeholder={t('userProfile.bioPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none transition-all"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : success ? (
                      <>
                        <CheckCircle2 size={20} />
                        {t('userProfile.saved')}
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {t('userProfile.save')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
              
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2">{t('userProfile.becomeSeller.title')}</h2>
                <p className="text-gray-500 text-sm">{t('userProfile.becomeSeller.subtitle')}</p>
              </div>

              <form onSubmit={handleRegisterSeller} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('userProfile.becomeSeller.shopName')}</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder={t('userProfile.becomeSeller.shopNamePlaceholder')}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('userProfile.becomeSeller.craftType')}</label>
                  <div className="relative">
                    <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder={t('userProfile.becomeSeller.craftTypePlaceholder')}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      value={craftType}
                      onChange={(e) => setCraftType(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('userProfile.becomeSeller.bio')}</label>
                  <textarea 
                    rows={4}
                    placeholder={t('userProfile.becomeSeller.bioPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none transition-all"
                    value={shopBio}
                    onChange={(e) => setShopBio(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('userProfile.becomeSeller.instagram')}</label>
                    <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder={t('userProfile.becomeSeller.instagramPlaceholder')}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('userProfile.becomeSeller.facebook')}</label>
                    <div className="relative">
                      <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder={t('userProfile.becomeSeller.facebookPlaceholder')}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('userProfile.becomeSeller.website')}</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder={t('userProfile.becomeSeller.websitePlaceholder')}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isRegistering || registerSuccess}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50"
                  >
                    {isRegistering ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : registerSuccess ? (
                      <>
                        <CheckCircle2 size={20} />
                        {t('userProfile.becomeSeller.success')}
                      </>
                    ) : (
                      <>
                        <Store size={20} />
                        {t('userProfile.becomeSeller.submit')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

