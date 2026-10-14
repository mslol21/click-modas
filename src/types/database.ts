export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | "pedido_iniciado"
  | "aguardando_confirmacao"
  | "confirmado"
  | "aguardando_pagamento"
  | "pago"
  | "em_separacao"
  | "enviado"
  | "entregue"
  | "cancelado";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  color_hex: string | null;
  sku: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  promotional_price: number | null;
  sku_base: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  button_text: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_size: string;
  variant_color: string;
  sku: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  delivery_method: string;
  delivery_fee: number;
  delivery_address: string | null;
  subtotal: number;
  total: number;
  status: OrderStatus;
  payment_method: string | null;
  customer_notes: string | null;
  internal_notes: string | null;
  whatsapp_message_sent: boolean;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface InventoryMovement {
  id: string;
  variant_id: string;
  movement_type: "entry" | "sale" | "adjustment" | "return" | "cancellation";
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  performed_by: string | null;
  created_at: string;
  variant?: ProductVariant;
}

export interface StoreSettingsGeneral {
  name: string;
  tagline: string;
  whatsapp: string;
  whatsapp_formatted: string;
  instagram: string;
  instagram_url: string;
  reference_location: string;
  delivery_policy: string;
  pickup_info: string;
}

export interface SizeGuideItem {
  size: string;
  age: string;
  chest: string;
  waist: string;
  height: string;
}
