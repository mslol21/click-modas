import { Product, ProductVariant } from "./database";

export interface CartItem {
  id: string; // Composite unique key: `${productId}-${variantId}`
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface WhatsAppOrderDetails {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: string;
  deliveryMethodLabel: string;
  customerNotes?: string;
  subtotal: number;
  items: CartItem[];
}
