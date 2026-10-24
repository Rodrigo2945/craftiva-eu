import { Timestamp } from 'firebase/firestore';
import catalog from '../../data/demo-products.json';
import { Product, UserProfile } from '../types';

export const CATEGORY_SLUGS = [
  'ceramics',
  'jewelry',
  'textiles',
  'illustration',
  'wood',
  'cosmetics',
  'others',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface DemoProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerStory: string;
  craftType: string;
  name: string;
  description: string;
  price: number;
  moq: number;
  verified: boolean;
  category: string;
  images: string[];
  status: 'active' | 'sold' | 'inactive';
  materials: string[];
  productionTime: string;
  isCustomizable: boolean;
  location: string;
  shippingInfo: string;
  tags: string[];
  createdAt: string;
}

export const DEMO_PRODUCTS = catalog.products as DemoProduct[];
export const DEMO_CATEGORIES = catalog.categories;

export function isCategorySlug(value: string | undefined): value is CategorySlug {
  return CATEGORY_SLUGS.includes(value as CategorySlug);
}

export function toProduct(item: DemoProduct): Product {
  return {
    id: item.id,
    sellerId: item.sellerId,
    sellerName: item.sellerName,
    name: item.name,
    description: item.description,
    price: item.price,
    moq: item.moq,
    verified: item.verified,
    category: item.category,
    images: item.images,
    status: item.status,
    materials: item.materials,
    productionTime: item.productionTime,
    isCustomizable: item.isCustomizable,
    location: item.location,
    shippingInfo: item.shippingInfo,
    tags: item.tags,
    createdAt: Timestamp.fromDate(new Date(item.createdAt)),
  };
}

export function demoProductsAsProducts(): Product[] {
  return DEMO_PRODUCTS.map(toProduct);
}

export function findDemoProduct(id: string): Product | null {
  const item = DEMO_PRODUCTS.find((product) => product.id === id);
  return item ? toProduct(item) : null;
}

export function getDemoSeller(id: string): UserProfile | null {
  const items = DEMO_PRODUCTS.filter((product) => product.sellerId === id);
  if (items.length === 0) return null;
  const first = items[0];
  return {
    uid: first.sellerId,
    displayName: first.sellerName,
    role: 'seller',
    bio: first.sellerStory,
    story: first.sellerStory,
    craftType: first.craftType,
    createdAt: Timestamp.fromDate(new Date(first.createdAt)),
  };
}

export function cityOf(location?: string): string {
  if (!location) return '';
  return location.split(',')[0].trim();
}

export function productTime(value: Product['createdAt'] | undefined): number {
  if (!value) return 0;
  if (typeof value.toDate === 'function') {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
  }
  return 0;
}
