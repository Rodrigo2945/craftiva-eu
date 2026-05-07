import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { UserProfile, Product } from '../types';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { User, MapPin, Calendar, Package, Star, MessageSquare, ChevronRight, Palette, Instagram, Facebook, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { pt, es, enUS } from 'date-fns/locale';

function safeExternalUrl(url: string): string | null {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    return parsed.href;
  } catch {
    return null;
  }
}

export const SellerProfile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [seller, setSeller] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'pt': return pt;
      case 'es': return es;
      default: return enUS;
    }
  };

  useEffect(() => {
    if (!id) return;

    // Fetch Seller Profile
    const fetchSeller = async () => {
      const docSnap = await getDoc(doc(db, 'users', id));
      if (docSnap.exists()) {
        setSeller(docSnap.data() as UserProfile);
      }
    };

    // Fetch Seller Products
    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', id),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    });

    fetchSeller();
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!seller || !id) return;

    const originalTitle = document.title;
    const bio = (seller.story || seller.bio || '').slice(0, 160);
    const canonical = `https://craftiva.eu/seller/${id}`;

    document.title = `${seller.displayName} | Craftiva`;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(selector.includes('property') ? 'property' : 'name', selector.match(/["']([^"']+)["']/)?.[1] ?? '');
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    if (bio) setMeta('meta[name="description"]', 'content', bio);
    setMeta('meta[property="og:title"]', 'content', seller.displayName);
    if (bio) setMeta('meta[property="og:description"]', 'content', bio);
    if (seller.photoURL) setMeta('meta[property="og:image"]', 'content', seller.photoURL);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const createdCanonical = !canonicalEl;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonical;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: seller.displayName,
      ...(bio && { description: bio }),
      ...(seller.photoURL && { image: seller.photoURL }),
      url: canonical,
    };
    const scriptEl = document.createElement('script');
    scriptEl.type = 'application/ld+json';
    scriptEl.id = 'seller-schema';
    scriptEl.textContent = JSON.stringify(schema);
    document.querySelector('#seller-schema')?.remove();
    document.head.appendChild(scriptEl);

    return () => {
      document.title = originalTitle;
      document.querySelector('#seller-schema')?.remove();
      if (createdCanonical) canonicalEl?.remove();
    };
  }, [seller, id]);

  if (loading) return <div className="max-w-7xl mx-auto p-8 animate-pulse text-center">{t('seller.loading')}</div>;
  if (!seller) return <div className="max-w-7xl mx-auto p-8 text-center">{t('seller.notFound')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header / Cover Area */}
      <div className="relative mb-24">
        <div className="h-48 sm:h-64 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="absolute -bottom-16 left-8 flex flex-col sm:flex-row items-end sm:items-center gap-6">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white p-2 rounded-3xl shadow-xl">
            <div className="w-full h-full bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 overflow-hidden">
              {seller.photoURL ? (
                <img src={seller.photoURL} alt={seller.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={64} />
              )}
            </div>
          </div>
          <div className="mb-2 sm:mb-4">
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-900 tracking-tight flex items-center gap-3">
              {seller.displayName}
              {seller.role === 'admin' && <ShieldCheck size={24} className="text-emerald-600" />}
            </h1>
            {seller.craftType && (
              <div className="flex items-center gap-2 text-emerald-600 font-bold mt-2">
                <Palette size={18} />
                <span>{seller.craftType}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-500 mt-2">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{t('seller.memberSince')} {format(seller.createdAt.toDate(), 'MMMM yyyy', { locale: getDateLocale() })}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <Star size={16} fill="currentColor" />
                <span>4.8 (24 {t('seller.reviews')})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-12 right-8 hidden md:flex gap-3">
          <Link 
            to={`/messages?to=${seller.uid}`}
            className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold border border-emerald-100 hover:bg-emerald-50 transition-all shadow-md active:scale-95"
          >
            <MessageSquare size={20} />
            {t('seller.sendMessage')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Info */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-4">{t('seller.about')}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {seller.story || seller.bio || t('seller.noBio')}
            </p>
            
            {seller.socialLinks && (seller.socialLinks.instagram || seller.socialLinks.facebook || seller.socialLinks.website) && (
              <div className="mt-8 pt-8 border-t border-gray-50">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t('seller.socialLinks')}</h3>
                <div className="flex gap-4">
                  {seller.socialLinks.instagram && safeExternalUrl(`https://instagram.com/${seller.socialLinks.instagram.replace('@', '')}`) && (
                    <a href={safeExternalUrl(`https://instagram.com/${seller.socialLinks.instagram.replace('@', '')}`)!} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                      <Instagram size={20} />
                    </a>
                  )}
                  {seller.socialLinks.facebook && safeExternalUrl(seller.socialLinks.facebook) && (
                    <a href={safeExternalUrl(seller.socialLinks.facebook)!} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                      <Facebook size={20} />
                    </a>
                  )}
                  {seller.socialLinks.website && safeExternalUrl(seller.socialLinks.website) && (
                    <a href={safeExternalUrl(seller.socialLinks.website)!} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                      <Globe size={20} />
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">{t('seller.location')}</span>
                <span className="text-gray-900 font-bold">Lisboa, Portugal</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">{t('seller.response')}</span>
                <span className="text-gray-900 font-bold">~ 2 {t('common.hours')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">{t('seller.sales')}</span>
                <span className="text-gray-900 font-bold">142 {t('seller.completed')}</span>
              </div>
            </div>
          </section>

          <section className="bg-emerald-600 p-8 rounded-3xl shadow-lg shadow-emerald-100 text-white">
            <h3 className="text-lg font-black mb-2">{t('seller.verifiedTitle')}</h3>
            <p className="text-emerald-100 text-sm mb-6">{t('seller.verifiedDesc')}</p>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-emerald-600 bg-emerald-400 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-emerald-600 bg-white text-emerald-600 flex items-center justify-center text-[10px] font-black">
                +12
              </div>
            </div>
          </section>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <Package className="text-emerald-600" />
              {t('seller.productsForSale')}
              <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full ml-2">
                {products.length}
              </span>
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">{t('seller.noProductsTitle')}</h3>
              <p className="text-gray-500">{t('seller.noProductsDesc')}</p>
            </div>
          )}

          {/* Reviews Section (Mockup) */}
          <div className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Star className="text-emerald-600" />
              {t('seller.recentReviews')}
            </h2>
            <div className="space-y-6">
              {[
                { name: 'Maria Santos', rating: 5, text: 'Excelente vendedor! O produto chegou impecável e muito rápido.', date: 'Há 2 dias' },
                { name: 'Ricardo Pereira', rating: 4, text: 'Muito atencioso. Recomendo vivamente.', date: 'Há 1 semana' }
              ].map((review, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{review.name}</p>
                        <div className="flex text-emerald-400">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{review.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                </motion.div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 border-2 border-gray-100 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group">
              {t('seller.viewAllReviews')}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
