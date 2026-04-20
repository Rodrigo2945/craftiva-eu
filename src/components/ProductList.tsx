import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Product, UserProfile } from '../types';
import { ProductCard } from './ProductCard';
import { Search, Filter, SlidersHorizontal, ChevronDown, Check, User, ArrowRight, BookOpen, Palette, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredArtisans, setFeaturedArtisans] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sellerSearchTerm, setSellerSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Advanced Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [materialSearch, setMaterialSearch] = useState('');

  const categories = ['all', 'ceramics', 'jewelry', 'textiles', 'illustration', 'wood', 'cosmetics', 'others'];

  useEffect(() => {
    // Fetch Products
    const qProducts = query(
      collection(db, 'products'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    });

    // Fetch Featured Artisans
    const qArtisans = query(
      collection(db, 'users'),
      where('role', '==', 'seller'),
      limit(4)
    );

    const unsubscribeArtisans = onSnapshot(qArtisans, (snapshot) => {
      const artisans = snapshot.docs.map(doc => doc.data() as UserProfile);
      setFeaturedArtisans(artisans);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeArtisans();
    };
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeller = p.sellerName.toLowerCase().includes(sellerSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesCustomizable = customizableOnly ? p.isCustomizable === true : true;
    const matchesMaterial = materialSearch === '' || (p.materials && p.materials.some(m => m.toLowerCase().includes(materialSearch.toLowerCase())));
    
    return matchesSearch && matchesSeller && matchesCategory && matchesCustomizable && matchesMaterial;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-16 mt-8 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Logo className="h-16 sm:h-20" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 max-w-3xl leading-tight"
        >
          {t('product.heroTitle', 'Discover Unique Handmade Creations')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-stone-500 max-w-2xl mx-auto font-medium"
        >
          {t('product.heroDescription')}
        </motion.p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-12 sticky top-20 z-40 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-stone-100 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between w-full">
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto flex-1">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder={t('product.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full md:w-64 group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder={t('product.sellerSearchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                value={sellerSearchTerm}
                onChange={(e) => setSellerSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                showAdvancedFilters || customizableOnly || materialSearch 
                ? 'bg-orange-50 text-orange-600' 
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">{t('product.filters.title')}</span>
            </button>

            <div className="relative w-full md:w-64">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 border-none rounded-xl hover:bg-stone-100 transition-all outline-none group"
              >
                <div className="flex items-center gap-3">
                  <Filter size={18} className={selectedCategory !== 'all' ? 'text-orange-600' : 'text-stone-400'} />
                  <span className={`text-sm font-bold ${selectedCategory !== 'all' ? 'text-orange-600' : 'text-stone-600'}`}>
                    {selectedCategory === 'all' ? t('product.allCategories') : t(`categories.${selectedCategory.toLowerCase()}`)}
                  </span>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`text-stone-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-100 py-2 z-50 overflow-hidden"
                    >
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors ${
                            selectedCategory === cat 
                            ? 'bg-orange-50 text-orange-600' 
                            : 'text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <span>{cat === 'all' ? t('product.allCategories') : t(`categories.${cat.toLowerCase()}`)}</span>
                          {selectedCategory === cat && <Check size={16} className="text-orange-600" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-stone-100 pt-4 mt-2"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl flex-1 max-w-xs">
                  <input
                    type="checkbox"
                    id="customizableFilter"
                    className="w-5 h-5 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
                    checked={customizableOnly}
                    onChange={(e) => setCustomizableOnly(e.target.checked)}
                  />
                  <label htmlFor="customizableFilter" className="text-sm font-bold text-stone-700 cursor-pointer select-none">
                    {t('product.filters.customizableOnly')}
                  </label>
                </div>
                
                <div className="relative flex-1 max-w-xs group">
                  <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder={t('product.filters.material')}
                    className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all outline-none text-sm"
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Featured Artisans Section */}
      {featuredArtisans.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif text-stone-900">{t('product.featuredArtisans')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtisans.map((artisan) => (
              <Link 
                key={artisan.uid} 
                to={`/seller/${artisan.uid}`}
                className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-stone-100 mb-4 overflow-hidden border-4 border-white shadow-sm">
                  {artisan.photoURL ? (
                    <img src={artisan.photoURL} alt={artisan.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <User size={32} />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-stone-900 text-lg mb-1 group-hover:text-orange-600 transition-colors">
                  {artisan.displayName}
                </h3>
                {artisan.craftType && (
                  <p className="text-sm text-orange-600 font-medium mb-3">{artisan.craftType}</p>
                )}
                {artisan.story && (
                  <p className="text-sm text-stone-500 line-clamp-2 mb-4">{artisan.story}</p>
                )}
                <div className="mt-auto flex items-center text-sm font-medium text-stone-900 group-hover:text-orange-600 transition-colors">
                  <span>Ver Perfil</span>
                  <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-2xl mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{t('product.noProducts')}</h3>
          <p className="text-gray-500">{t('product.noProductsHint')}</p>
        </div>
      )}
    </div>
  );
};
