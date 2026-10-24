import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { useCatalog } from '../lib/useCatalog';
import { CATEGORY_SLUGS, cityOf } from '../data/demoCatalog';

type Step = { title: string; text: string };

function stepsOf(value: unknown): Step[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Step => Boolean(item && typeof item === 'object' && 'title' in item));
}

const VerifiedMark: React.FC<{ label: string }> = ({ label }) => (
  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-[#5C534C] shadow-sm">
    {label}
  </span>
);

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { products, loading, source, error } = useCatalog();
  const [search, setSearch] = useState('');
  const buyerSteps = stepsOf(t('home.buyerSteps', { returnObjects: true }));
  const artisanSteps = stepsOf(t('home.artisanSteps', { returnObjects: true }));

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matched = term
      ? products.filter((product) =>
          [product.name, product.sellerName, product.description, product.location]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(term)),
        )
      : products;
    return matched.slice(0, 8);
  }, [products, search]);

  const artisans = useMemo(() => {
    const map = new Map<string, { id: string; name: string; location?: string; craft?: string }>();
    for (const product of products) {
      if (!map.has(product.sellerId)) {
        map.set(product.sellerId, {
          id: product.sellerId,
          name: product.sellerName,
          location: product.location,
          craft: product.category,
        });
      }
    }
    return [...map.values()].slice(0, 8);
  }, [products]);

  return (
    <div>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div>
          <h1 className="max-w-xl font-serif text-4xl leading-[1.12] text-[#2A241E] sm:text-5xl">
            {t('home.heroTitle')}
            <span className="mt-2 block">{t('home.heroTitleLine2')}</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#5C534C] sm:text-lg">
            {t('home.heroSubtitle')}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#colecoes"
              className="inline-flex items-center rounded-lg bg-[#C65D3B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#A34A2C]"
            >
              {t('home.ctaCollections')}
            </a>
            <Link
              to="/register"
              className="inline-flex items-center rounded-lg border border-[#2A241E]/80 bg-transparent px-5 py-3 text-sm font-semibold text-[#2A241E] hover:bg-white"
            >
              {t('home.ctaArtisan')}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:grid-rows-2 sm:h-[430px]">
          <figure className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-3xl sm:col-span-3 sm:row-span-2 sm:aspect-auto">
            <img src="/demo/bowl.jpg" alt="" className="h-full w-full object-cover" />
            <VerifiedMark label={t('catalog.verified')} />
          </figure>
          <figure className="relative aspect-square overflow-hidden rounded-3xl sm:col-span-2 sm:aspect-auto">
            <img src="/demo/pendant.jpg" alt="" className="h-full w-full object-cover" />
            <VerifiedMark label={t('catalog.verified')} />
          </figure>
          <figure className="relative hidden overflow-hidden rounded-3xl sm:col-span-1 sm:row-span-2 sm:block">
            <img src="/demo/rug.jpg" alt="" className="h-full w-full object-cover" />
            <VerifiedMark label={t('catalog.verified')} />
          </figure>
          <figure className="relative aspect-square overflow-hidden rounded-3xl sm:col-span-2 sm:aspect-auto">
            <img src="/demo/stone.jpg" alt="" className="h-full w-full object-cover" />
          </figure>
        </div>
      </section>

      <p className="border-y border-[#E7DDD0] px-4 py-4 text-center text-sm text-[#6F655C]">
        {t('home.trust')}
      </p>

      <section id="colecoes" className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_SLUGS.map((slug) => (
            <Link
              key={slug}
              to={`/category/${slug}`}
              className="rounded-full border border-[#E4D9CC] bg-white px-4 py-2 text-sm text-[#3C342C] hover:border-[#C65D3B] hover:text-[#C65D3B]"
            >
              {t(`categories.${slug}`)}
            </Link>
          ))}
        </div>
      </section>

      <section id="destaque" className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-3xl text-[#2A241E]">{t('home.featured')}</h2>
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
          <p className="mb-5 text-sm text-[#6F655C]">
            {error ? t('catalog.demoError') : t('catalog.demoEmpty')}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-[#E7DDD0] bg-white">
                <div className="aspect-[4/3] animate-pulse bg-[#E7DDD0]" />
                <div className="space-y-2 p-4">
                  <div className="h-3 w-2/3 animate-pulse rounded bg-[#E7DDD0]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#E7DDD0]" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E4D9CC] bg-white px-6 py-16 text-center">
            <h3 className="font-serif text-2xl text-[#2A241E]">{t('catalog.emptyTitle')}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#6F655C]">{t('catalog.emptyHint')}</p>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="mt-5 text-sm font-semibold text-[#C65D3B]"
            >
              {t('catalog.clear')}
            </button>
          </div>
        )}
      </section>

      <section id="compradores" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-serif text-3xl text-[#2A241E]">{t('home.howTitle')}</h2>
        <p className="mt-3 max-w-2xl text-[#5C534C]">{t('home.howLede')}</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-[#E7DDD0] bg-white p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-[#2A241E]">{t('home.buyersTitle')}</h3>
            <ol className="mt-5 space-y-4">
              {buyerSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F6E4DC] text-sm font-semibold text-[#C65D3B]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[#2A241E]">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#5C534C]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>
          <article className="rounded-3xl border border-[#E7DDD0] bg-white p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-[#2A241E]">{t('home.artisansTitle')}</h3>
            <ol className="mt-5 space-y-4">
              {artisanSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F6E4DC] text-sm font-semibold text-[#C65D3B]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[#2A241E]">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#5C534C]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              to="/register"
              className="mt-6 inline-flex text-sm font-semibold text-[#C65D3B] hover:underline"
            >
              {t('home.ctaArtisan')}
            </Link>
          </article>
        </div>
      </section>

      <section id="artesaos" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="font-serif text-3xl text-[#2A241E]">{t('home.artisansHeading')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {artisans.map((artisan) => (
            <Link
              key={artisan.id}
              to={`/seller/${artisan.id}`}
              className="rounded-2xl border border-[#E7DDD0] bg-white p-4 hover:border-[#C65D3B]"
            >
              <p className="font-semibold text-[#2A241E]">{artisan.name}</p>
              <p className="mt-1 text-sm text-[#8A7D72]">
                {cityOf(artisan.location)}
                {artisan.craft ? ` · ${t(`categories.${artisan.craft}`, artisan.craft)}` : ''}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
