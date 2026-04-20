import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Review } from '../types';
import { Star, User, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductReviewsProps {
  productId: string;
  sellerId: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, sellerId }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const currentUser = auth.currentUser;

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(revs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newReview.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        sellerId,
        buyerId: currentUser.uid,
        buyerName: currentUser.displayName || 'Anonymous',
        rating,
        comment: newReview.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setNewReview('');
      setRating(5);
      setSuccessMessage(t('product.reviews.success'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Error adding review:', err);
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-stone-200 pt-12">
      <h2 className="text-2xl font-serif text-stone-900 mb-8">{t('product.reviews.title')}</h2>

      {/* Review Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="bg-stone-50 rounded-2xl p-6 mb-10 border border-stone-100">
          <h3 className="font-bold text-stone-900 mb-4">{t('product.reviews.write')}</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-2">{t('product.reviews.rating')}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star 
                    size={24} 
                    className={`${star <= rating ? 'fill-orange-400 text-orange-400' : 'text-stone-300'} transition-colors`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-stone-700 mb-2">
              {t('product.reviews.comment')}
            </label>
            <textarea
              id="comment"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {successMessage && <p className="text-emerald-600 text-sm mb-4 font-medium">{successMessage}</p>}

          <button
            type="submit"
            disabled={submitting || !newReview.trim()}
            className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
            {t('product.reviews.submit')}
          </button>
        </form>
      ) : (
        <div className="bg-stone-50 rounded-2xl p-6 mb-10 border border-stone-100 text-center">
          <p className="text-stone-600">{t('product.reviews.loginToReview')}</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-stone-100 h-32 rounded-2xl" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{review.buyerName || 'Anonymous'}</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            size={14} 
                            className={star <= review.rating ? 'fill-orange-400 text-orange-400' : 'text-stone-200'} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.createdAt && (
                    <span className="text-sm text-stone-500">
                      {new Date(review.createdAt.toDate()).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-stone-700 whitespace-pre-wrap">{review.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-100">
            <Star size={32} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-500">{t('product.reviews.noReviews')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
