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
  verified?: boolean;
}

export interface Product {
  id: number;
  shop_id: number;
  name: string;
  price: number; // in UGX
  original_price?: number; // for discount badges (e.g. was UGX 60,000)
  category: string;
  description?: string;
  image?: string;
  inStock: boolean;
  featured?: boolean;
  specifications?: string[];
}

export interface TemplateSection {
  id?: number;
  template_id?: number;
  section_name: string;
  label: string;
  icon?: string;
  position: number;
  active: boolean;
}

export interface TemplateTheme {
  primaryColor: string; // e.g. '#081426'
  secondaryColor: string; // e.g. '#0A3D91'
  accentColor: string; // e.g. '#F4B400'
  backgroundColor: string; // e.g. '#F8FAFC'
  layoutStyle: 'jumia_dense' | 'modern_grid' | 'boutique_showcase' | 'minimalist';
  bannerStyle: 'contained' | 'full_bleed' | 'split_bio';
  cardStyle: 'price_first' | 'standard' | 'showcase';
}

export interface ShopTemplate {
  id: number;
  name: string;
  category: string;
  custom_category?: string;
  description?: string;
  price: number; // in UGX
  logo?: string;
  cover_image?: string;
  preview_image?: string;
  premium: boolean;
  published: boolean;
  active: boolean;
  theme?: TemplateTheme;
  sections?: TemplateSection[];
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
  delivery_address?: string;
  payment_method?: 'momo' | 'airtel' | 'cash_on_delivery';
  items: { product_name: string; quantity: number; price: number }[];
  total_ugx: number;
  status: 'pending' | 'confirmed' | 'delivered';
  created_at: string;
}
