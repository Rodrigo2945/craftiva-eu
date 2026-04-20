import { Timestamp } from 'firebase/firestore';

export type UserRole = 'buyer' | 'seller' | 'admin' | '';

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  story?: string;
  craftType?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  shopName?: string;
  preferredLanguage?: string;
  createdAt: Timestamp;
}

export type ProductStatus = 'active' | 'sold' | 'inactive';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  status: ProductStatus;
  materials?: string[];
  productionTime?: string;
  isCustomizable?: boolean;
  location?: string;
  shippingInfo?: string;
  tags?: string[];
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  productId: string;
  text: string;
  createdAt: Timestamp;
}

export interface WishlistItem {
  userId: string;
  productId: string;
  createdAt: Timestamp;
}

export interface Review {
  id: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}
