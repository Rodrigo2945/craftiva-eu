import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Product } from '../types';
import { cityOf } from '../data/demoCatalog';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const city = cityOf(product.location);
  const image = product.images?.[0] || '/demo/bowl.jpg';
  const price = Math.round(Number(product.price) || 0);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7DDD0] bg-white shadow-[0_1px_2px_rgba(42,36,30,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE6D8]">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {product.verified && (
          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#C65D3B] text-white shadow-sm" title={t('catalog.verified')}>
            <Check size={16} strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <p className="text-xs text-[#8A7D72]">
          {product.sellerName}
          {city ? ` · ${city}` : ''}
        </p>
        <h3 className="mt-1 text-[15px] font-semibold leading-snug text-[#2A241E] group-hover:text-[#C65D3B]">
          {product.name}
        </h3>
        <div className="mt-auto pt-3">
          <p className="text-sm font-semibold text-[#C65D3B]">
            {product.moq ? `MOQ ${product.moq}` : t('catalog.moqOnRequest')}
          </p>
          <p className="text-sm text-[#2A241E]">{t('catalog.fromPrice', { price })}</p>
        </div>
      </div>
    </Link>
  );
};
