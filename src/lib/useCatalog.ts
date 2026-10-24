import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { demoProductsAsProducts, productTime } from '../data/demoCatalog';

export type CatalogSource = 'live' | 'demo';

const FALLBACK_MS = 7000;

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<CatalogSource>('demo');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let received = false;
    let unsubscribe = () => {};

    const showDemo = (reason: string | null) => {
      setProducts(demoProductsAsProducts());
      setSource('demo');
      setError(reason);
      setLoading(false);
    };

    try {
      const productsQuery = query(
        collection(db, 'products'),
        where('status', '==', 'active'),
        limit(60),
      );

      unsubscribe = onSnapshot(
        productsQuery,
        (snapshot) => {
          received = true;
          const live = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Product);
          if (live.length === 0) {
            showDemo(null);
            return;
          }
          live.sort((a, b) => productTime(b.createdAt) - productTime(a.createdAt));
          setProducts(live);
          setSource('live');
          setError(null);
          setLoading(false);
        },
        (err: { code?: string }) => {
          received = true;
          console.error('Catalog read failed', err);
          showDemo(err.code || 'unavailable');
        },
      );
    } catch (err) {
      console.error('Catalog subscribe failed', err);
      showDemo('unavailable');
    }

    const timer = window.setTimeout(() => {
      if (!received) showDemo('timeout');
    }, FALLBACK_MS);

    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return { products, loading, source, error };
}
