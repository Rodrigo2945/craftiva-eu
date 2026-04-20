import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useAuth } from './Auth';
import { Product, WishlistItem } from '../types';
import { ProductCard } from './ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const wishlistRef = collection(db, 'users', user.uid, 'wishlist');
    const unsubscribe = onSnapshot(wishlistRef, async (snapshot) => {
      const productIds = snapshot.docs.map(doc => doc.id);
      
      if (productIds.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      // Fetch product details for each wishlist item
      const products = await Promise.all(
        productIds.map(async (id) => {
          const productDoc = await getDoc(doc(db, 'products', id));
          if (productDoc.exists()) {
            return { id: productDoc.id, ...productDoc.data() } as Product;
          }
          return null;
        })
      );

      setWishlistProducts(products.filter((p): p is Product => p !== null));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Heart size={48} className="mx-auto text-stone-300 mb-4" />
        <h2 className="text-3xl font-serif font-semibold text-stone-900 mb-2">{t('wishlist.title')}</h2>
        <p className="text-stone-500 mb-8 text-lg">{t('wishlist.loginPrompt')}</p>
        <Link to="/" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all">
          {t('wishlist.explore')}
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-12 w-48 bg-stone-100 rounded-xl mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[3/4] bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
          <Heart size={24} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-semibold text-stone-900 tracking-tight">{t('wishlist.title')}</h1>
          <p className="text-stone-500 font-medium">
            {t('wishlist.itemCount', { count: wishlistProducts.length })}
          </p>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {wishlistProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200"
          >
            <ShoppingBag size={48} className="mx-auto text-stone-300 mb-4" />
            <h3 className="text-xl font-bold text-stone-900 mb-2">{t('wishlist.emptyTitle')}</h3>
            <p className="text-stone-500 mb-8">{t('wishlist.emptySubtitle')}</p>
            <Link to="/" className="inline-block bg-white text-orange-600 border border-orange-100 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-sm">
              {t('wishlist.viewProducts')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
