import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { useCatalog } from '../lib/useCatalog';
import { CATEGORY_SLUGS, isCategorySlug } from '../data/demoCatalog';

export const CategoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { products, loading, source, error } = useCatalog();
  const [search, setSearch] = useState('');
  const known = isCategorySlug(slug);

  const visible = useMemo(() => {
    if (!known || !slug) return [];
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      if (product.category?.toLowerCase() !== slug) return false;
      if (!term) return true;
      return [product.name, product.sellerName, product.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [products, slug, known, search]);

  if (!known) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl text-[#2A241E]">{t('catalog.unknownCategory')}</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORY_SLUGS.map((item) => (
            <Link key={item} to={`/category/${item}`} className="rounded-full bg-white px-4 py-2 text-sm">
              {t(`categories.${item}`)}
            </Link>
          ))}
        </div>
        <Link to="/" className="mt-8 inline-flex text-sm font-semibold text-[#C65D3B]">
          {t('catalog.backHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm text-[#8A7D72]">
        <Link to="/#colecoes" className="hover:text-[#C65D3B]">{t('nav.explore')}</Link>
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl text-[#2A241E]">{t(`categories.${slug}`)}</h1>
          <p className="mt-2 max-w-xl text-[#5C534C]">{t('catalog.categoryLede')}</p>
        </div>
        <label className="w-full sm:w-72">
          <span className="sr-only">{t('home.search')}</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('home.search')}
            className="w-full rounded-full border border-[#E4D9CC] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C65D3B]"
          />
        </label>
      </div>

      {!loading && source === 'demo' && (
        <p className="mt-4 text-sm text-[#6F655C]">{error ? t('catalog.demoError') : t('catalog.demoEmpty')}</p>
      )}

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl bg-white">
              <div className="aspect-[4/3] animate-pulse bg-[#E7DDD0]" />
            </div>
          ))}
        </div>
      ) : visible.length > 0 ? (
        <>
          <p className="mt-6 text-sm text-[#8A7D72]">{t('catalog.results', { count: visible.length })}</p>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-[#E4D9CC] bg-white px-6 py-16 text-center">
          <h2 className="font-serif text-2xl">{t('catalog.categoryEmpty')}</h2>
          <p className="mt-2 text-sm text-[#6F655C]">{t('catalog.emptyHint')}</p>
          {search && (
            <button type="button" onClick={() => setSearch('')} className="mt-4 text-sm font-semibold text-[#C65D3B]">
              {t('catalog.clear')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
