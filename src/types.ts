/**
 * BizLink Uganda Data Models & Types
 * Derived from Flask models.py & SQLite bizlink.db
 */

export type UserRole = 'super_admin' | 'merchant' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  avatar?: string;
  approved?: boolean;
}

export interface Product {
  id: number;
  shop_id: number;
  name: string;
  price: number; // in UGX
  category: string;
  description?: string;
  image?: string;
  inStock: boolean;
  featured?: boolean;
}

export interface ShopTemplate {
  id: number;
  name: string;
  category: string;
  description?: string;
  price: number; // in UGX
  preview_image?: string;
  premium: boolean;
  published: boolean;
  active: boolean;
}

export interface Shop {
  id: number;
  name: string;
  merchant_id: number;
  merchant_name: string;
  template_id: number;
  category: string;
  description: string;
  location: string; // e.g. Kampala, Jinja, Entebbe
  phone: string;
  whatsapp: string;
  cover_image: string;
  logo_image?: string;
  active: boolean;
  verified: boolean;
  status: 'paid' | 'pending' | 'free';
  rating: number;
  reviewsCount: number;
}

export interface OrderInquiry {
  id: string;
  shop_id: number;
  shop_name: string;
  customer_name: string;
  customer_phone: string;
  items: { product_name: string; quantity: number; price: number }[];
  total_ugx: number;
  status: 'pending' | 'confirmed' | 'delivered';
  created_at: string;
}
