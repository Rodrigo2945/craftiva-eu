import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, storage, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from './Auth';
import { Product, ProductStatus } from '../types';
import { Plus, Trash2, Edit3, Package, TrendingUp, DollarSign, CheckCircle2, Clock, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import imageCompression from 'browser-image-compression';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const VendorDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'ceramics',
    materials: '',
    productionTime: '',
    isCustomizable: false,
    location: '',
    shippingInfo: '',
    tags: '',
  });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    try {
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          const compressed = await (imageCompression as any)(file, options);
          return compressed as File;
        })
      );
      setImageFiles(prev => [...prev, ...compressedFiles]);
      
      const previews = compressedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews]);
    } catch (error) {
      console.error('Error compressing images:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setUploading(true);
    try {
      // Upload images to Storage
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const storageRef = ref(storage, `products/${user.uid}/${Date.now()}-${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          return await getDownloadURL(snapshot.ref);
        })
      );

      // If no images uploaded, use a placeholder
      const finalImages = imageUrls.length > 0 ? imageUrls : [`https://picsum.photos/seed/${Math.random()}/800/600`];

      await addDoc(collection(db, 'products'), {
        sellerId: user.uid,
        sellerName: profile.displayName,
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        materials: newProduct.materials.split(',').map(m => m.trim()).filter(m => m !== ''),
        productionTime: newProduct.productionTime,
        isCustomizable: newProduct.isCustomizable,
        location: newProduct.location,
        shippingInfo: newProduct.shippingInfo,
        tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        images: finalImages,
        status: 'active',
        createdAt: Timestamp.now(),
      });
      
      setIsAdding(false);
      setNewProduct({ 
        name: '', 
        description: '', 
        price: '', 
        category: 'ceramics', 
        materials: '',
        productionTime: '',
        isCustomizable: false,
        location: '', 
        shippingInfo: '', 
        tags: '' 
      });
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    } finally {
      setUploading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: ProductStatus) => {
    const newStatus = currentStatus === 'active' ? 'sold' : 'active';
    await updateDoc(doc(db, 'products', id), { status: newStatus });
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm(t('vendor.confirmDelete'))) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  const stats = [
    { label: t('vendor.stats.total'), value: products.length, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t('vendor.stats.active'), value: products.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t('vendor.stats.sold'), value: products.filter(p => p.status === 'sold').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t('vendor.stats.revenue'), value: `${products.filter(p => p.status === 'sold').reduce((acc, p) => acc + p.price, 0).toFixed(2)}€`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-stone-900 tracking-tight">{t('vendor.title')}</h1>
          <p className="text-stone-500 mt-1">{t('vendor.subtitle')}</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
        >
          <Plus size={20} />
          {t('vendor.newProduct')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">{t('vendor.addProduct.title')}</h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('vendor.addProduct.name')}</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('vendor.addProduct.description')}</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                      value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('vendor.addProduct.price')}</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('vendor.addProduct.category')}</label>
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newProduct.category}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                      >
                        <option value="ceramics">{t('categories.ceramics')}</option>
                        <option value="jewelry">{t('categories.jewelry')}</option>
                        <option value="textiles">{t('categories.textiles')}</option>
                        <option value="illustration">{t('categories.illustration')}</option>
                        <option value="wood">{t('categories.wood')}</option>
                        <option value="cosmetics">{t('categories.cosmetics')}</option>
                        <option value="others">{t('categories.others')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('vendor.addProduct.materials')}</label>
                      <input
                        type="text"
                        placeholder={t('vendor.addProduct.materialsPlaceholder')}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newProduct.materials}
                        onChange={e => setNewProduct({ ...newProduct, materials: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('vendor.addProduct.productionTime')}</label>
                      <input
                        type="text"
                        placeholder={t('vendor.addProduct.productionTimePlaceholder')}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newProduct.productionTime}
                        onChange={e => setNewProduct({ ...newProduct, productionTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl">
                      <input
                        type="checkbox"
                        id="isCustomizable"
                        className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        checked={newProduct.isCustomizable}
                        onChange={e => setNewProduct({ ...newProduct, isCustomizable: e.target.checked })}
                      />
                      <label htmlFor="isCustomizable" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                        {t('vendor.addProduct.isCustomizable')}
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('vendor.addProduct.location')}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newProduct.location}
                        onChange={e => setNewProduct({ ...newProduct, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('vendor.addProduct.shippingInfo')}</label>
                    <textarea
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                      value={newProduct.shippingInfo}
                      onChange={e => setNewProduct({ ...newProduct, shippingInfo: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('vendor.addProduct.tags')}</label>
                    <input
                      type="text"
                      placeholder={t('vendor.addProduct.tagsPlaceholder')}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newProduct.tags}
                      onChange={e => setNewProduct({ ...newProduct, tags: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('vendor.addProduct.images')}</label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {imagePreviews.map((preview, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img src={preview} className="w-full h-full object-cover" alt="" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {imagePreviews.length < 6 && (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 cursor-pointer transition-all">
                          <Upload size={20} className="mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{t('vendor.addProduct.upload')}</span>
                          <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">{t('vendor.addProduct.hint')}</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => setIsAdding(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="animate-spin" size={20} /> : t('vendor.addProduct.publish')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('vendor.table.product')}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('vendor.table.price')}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('vendor.table.productionTime')}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('vendor.table.location')}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('vendor.table.status')}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('vendor.table.date')}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">{t('vendor.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{t(`categories.${product.category.toLowerCase()}`)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {product.price.toFixed(2)}€
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg uppercase tracking-wider">
                      {product.productionTime || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-500">
                      {product.location || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(product.id, product.status)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                        product.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {product.status === 'active' ? t('product.active') : t('product.sold')}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.createdAt.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="py-20 text-center">
            <Package size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">{t('vendor.noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
