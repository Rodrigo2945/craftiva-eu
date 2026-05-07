import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { Tag, User, Clock, MessageSquare, Heart, Scissors } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pt, enGB, es } from 'date-fns/locale';
import { useAuth } from './Auth';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, onSnapshot, Timestamp } from 'firebase/firestore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const locales: { [key: string]: any } = { pt, en: enGB, es };
  const currentLocale = locales[i18n.language] || pt;

  React.useEffect(() => {
    if (!user) {
      setIsWishlisted(false);
      return;
    }

    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', product.id);
    const unsubscribe = onSnapshot(wishlistRef, (doc) => {
      setIsWishlisted(doc.exists());
    });

    return () => unsubscribe();
  }, [user, product.id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      signIn();
      return;
    }

    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', product.id);
    
    try {
      if (isWishlisted) {
        await deleteDoc(wishlistRef);
      } else {
        await setDoc(wishlistRef, {
          userId: user.uid,
          productId: product.id,
          createdAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      signIn();
      return;
    }
    navigate(`/messages?to=${product.sellerId}&product=${product.id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-stone-50">
          <img
            src={product.images[0] || `https://picsum.photos/seed/${product.id}/400/400`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-orange-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {new Intl.NumberFormat(i18n.language === 'pt' ? 'pt-PT' : i18n.language, { style: 'currency', currency: 'EUR' }).format(product.price)}
            </span>
            <button
              onClick={toggleWishlist}
              className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${
                isWishlisted 
                ? 'bg-orange-500 text-white scale-110' 
                : 'bg-white/90 text-stone-400 hover:text-orange-500'
              }`}
              title={isWishlisted ? t('wishlist.remove') : t('wishlist.add')}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
          {product.status === 'sold' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest transform -rotate-12">
                {t('product.sold')}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
              {t(`categories.${product.category.toLowerCase()}`)}
            </span>
            {product.isCustomizable && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1">
                <Scissors size={10} />
                {t('product.isCustomizable')}
              </span>
            )}
          </div>
          <h3 className="text-xl font-serif font-semibold text-stone-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-stone-500 line-clamp-2 mb-4 min-h-[40px]">
            {product.description}
          </p>
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-50">
            <div className="flex items-center gap-2 text-stone-600">
              <User size={14} />
              <span className="text-xs font-medium">{product.sellerName}</span>
            </div>
            <div className="flex items-center gap-1 text-stone-400">
              <Clock size={14} />
              <span className="text-[10px]">
                {formatDistanceToNow(product.createdAt.toDate(), { addSuffix: true, locale: currentLocale })}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="px-5 pb-5">
        <button
          onClick={handleContact}
          disabled={product.status === 'sold'}
          className="w-full flex items-center justify-center gap-2 bg-orange-50 text-orange-600 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          <MessageSquare size={16} />
          <span>{product.isCustomizable ? t('product.requestCustomization') : t('product.contactSeller')}</span>
        </button>
      </div>
    </motion.div>
  );
};
