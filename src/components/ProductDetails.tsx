import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Product } from '../types';
import { useAuth } from './Auth';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, MessageSquare, ShieldCheck, Truck, RotateCcw, User, Heart, Clock, Scissors, Palette } from 'lucide-react';
import { ProductReviews } from './ProductReviews';

export const ProductDetails: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!user || !id) {
      setIsWishlisted(false);
      return;
    }

    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', id);
    const unsubscribe = onSnapshot(wishlistRef, (doc) => {
      setIsWishlisted(doc.exists());
    });

    return () => unsubscribe();
  }, [user, id]);

  const toggleWishlist = async () => {
    if (!user) {
      signIn();
      return;
    }

    if (!id) return;

    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', id);
    
    try {
      if (isWishlisted) {
        await deleteDoc(wishlistRef);
      } else {
        await setDoc(wishlistRef, {
          userId: user.uid,
          productId: id,
          createdAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, 'products', id));
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto p-8 animate-pulse">{t('common.loading')}</div>;
  if (!product) return <div className="max-w-7xl mx-auto p-8">{t('product.notFound')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-500 hover:text-orange-600 transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">{t('product.back')}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 relative">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${activeImage === i ? 'border-orange-600 scale-95 shadow-lg' : 'border-stone-100 hover:border-orange-200'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              {t(`categories.${product.category.toLowerCase()}`)}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-4 tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-orange-600">
                {new Intl.NumberFormat(i18n.language === 'pt' ? 'pt-PT' : i18n.language, { style: 'currency', currency: 'EUR' }).format(product.price)}
              </span>
              {product.status === 'sold' && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-bold">
                  {t('product.sold')}
                </span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {product.materials && product.materials.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Palette size={12}/> {t('product.materials')}</p>
                  <p className="font-bold text-gray-900">{product.materials.join(', ')}</p>
                </div>
              )}
              {product.productionTime && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={12}/> {t('product.productionTime')}</p>
                  <p className="font-bold text-gray-900">{product.productionTime}</p>
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Scissors size={12}/> {t('product.isCustomizable')}</p>
                <p className="font-bold text-gray-900">{product.isCustomizable ? t('product.customizableYes') : t('product.customizableNo')}</p>
              </div>
              {product.location && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('vendor.table.location')}</p>
                  <p className="font-bold text-gray-900">{product.location}</p>
                </div>
              )}
            </div>

            {product.shippingInfo && (
              <div className="mb-8 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Truck size={14} />
                  {t('vendor.addProduct.shippingInfo')}
                </p>
                <p className="text-sm text-gray-600 italic">"{product.shippingInfo}"</p>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                <User size={24} />
              </div>
              <Link to={`/seller/${product.sellerId}`} className="group/seller">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('seller.title')}</p>
                <p className="text-lg font-bold text-stone-900 group-hover/seller:text-orange-600 transition-colors">{product.sellerName}</p>
              </Link>
              <button 
                onClick={() => user ? navigate(`/messages?to=${product.sellerId}&product=${product.id}`) : signIn()}
                className="ml-auto flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-xl font-bold border border-orange-100 hover:bg-orange-50 transition-all shadow-sm active:scale-95"
              >
                <MessageSquare size={18} />
                <span>{t('product.contact')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <ShieldCheck size={20} className="text-orange-500" />
                <span>{t('product.securePurchase')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <Truck size={20} className="text-orange-500" />
                <span>{t('product.localShipping')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <RotateCcw size={20} className="text-orange-500" />
                <span>{t('product.returnPolicy')}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex gap-4">
            <button 
              disabled={product.status === 'sold'}
              onClick={() => user ? navigate(`/messages?to=${product.sellerId}&product=${product.id}`) : signIn()}
              className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
            >
              <MessageSquare size={24} />
              <span>{product.isCustomizable ? t('product.requestCustomization') : t('product.contactSeller')}</span>
            </button>
            <button
              onClick={toggleWishlist}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all border-2 ${
                isWishlisted 
                ? 'bg-orange-50 border-orange-200 text-orange-500' 
                : 'bg-white border-stone-100 text-stone-400 hover:border-orange-200 hover:text-orange-500'
              }`}
              title={isWishlisted ? t('wishlist.remove') : t('wishlist.add')}
            >
              <Heart size={28} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
          <p className="text-center text-xs text-stone-400 mt-4">
            {t('product.contactHint')}
          </p>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} sellerId={product.sellerId} />
    </div>
  );
};
