import {
  initialCategories,
  initialBanners,
  initialProducts,
  initialStoreSettings,
  initialSizeGuide,
  initialInstitutional,
  sampleOrders,
} from "./mock-data";
import { Product, Category, Banner, Order, OrderStatus } from "@/types/database";

// In-memory state for development and fallback
let categoriesState = [...initialCategories];
let bannersState = [...initialBanners];
let productsState = [...initialProducts];
let ordersState = [...sampleOrders];
let settingsState = { ...initialStoreSettings };

export async function getCategories(): Promise<Category[]> {
  return categoriesState.filter((c) => c.is_active);
}

export async function getBanners(): Promise<Banner[]> {
  return bannersState.filter((b) => b.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  size?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "name";
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let list = productsState.filter((p) => p.is_published);

  if (filters.categorySlug) {
    const category = categoriesState.find((c) => c.slug === filters.categorySlug);
    if (category) {
      list = list.filter((p) => p.category_id === category.id);
    }
  }

  if (filters.search) {
    const term = filters.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.sku_base && p.sku_base.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        p.variants?.some((v) => v.sku.toLowerCase().includes(term))
    );
  }

  if (filters.size) {
    list = list.filter((p) => p.variants?.some((v) => v.size === filters.size && v.stock > 0));
  }

  if (filters.featured !== undefined) {
    list = list.filter((p) => p.is_featured === filters.featured);
  }

  if (filters.minPrice !== undefined) {
    list = list.filter((p) => (p.promotional_price ?? p.price) >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    list = list.filter((p) => (p.promotional_price ?? p.price) <= filters.maxPrice!);
  }

  // Sorting
  switch (filters.sort) {
    case "price-asc":
      list.sort((a, b) => (a.promotional_price ?? a.price) - (b.promotional_price ?? b.price));
      break;
    case "price-desc":
      list.sort((a, b) => (b.promotional_price ?? b.price) - (a.promotional_price ?? a.price));
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
    default:
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }

  // Populate category info
  return list.map((p) => ({
    ...p,
    category: categoriesState.find((c) => c.id === p.category_id),
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = productsState.find((p) => p.slug === slug);
  if (!product || !product.is_published) return null;

  return {
    ...product,
    category: categoriesState.find((c) => c.id === product.category_id),
  };
}

export async function getStoreSettings() {
  return settingsState;
}

export async function getSizeGuide() {
  return initialSizeGuide;
}

export async function getInstitutional() {
  return initialInstitutional;
}

// Order Intention Creation
export interface CreateOrderItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  deliveryMethod: string;
  customerNotes?: string;
  items: CreateOrderItemInput[];
}

export async function createOrderIntention(input: CreateOrderInput) {
  // 1. Re-validate each item and current prices/stock
  if (!input.items.length) throw new Error("O carrinho está vazio.");
  if (!["retirada_galeria_arco_iris", "motoboy"].includes(input.deliveryMethod)) throw new Error("Modalidade de entrega inválida.");
  const orderItems = [];
  let subtotal = 0;
  const requested = new Map<string, number>();

  for (const item of input.items) {
    if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) throw new Error("Quantidade inválida.");
    const accumulated = (requested.get(item.variantId) || 0) + item.quantity;
    requested.set(item.variantId, accumulated);
    const product = productsState.find((p) => p.id === item.productId);
    if (!product || !product.is_published) {
      throw new Error(`Produto não encontrado para o ID ${item.productId}`);
    }

    const variant = product.variants?.find((v) => v.id === item.variantId);
    if (!variant) {
      throw new Error(`Variante não encontrada para o produto ${product.name}`);
    }

    if (variant.stock < accumulated) {
      throw new Error(
        `Estoque insuficiente para ${product.name} (Tam: ${variant.size}). Disponível: ${variant.stock}`
      );
    }

    const unitPrice = product.promotional_price ?? product.price;
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;

    orderItems.push({
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order_id: "",
      product_id: product.id,
      variant_id: variant.id,
      product_name: product.name,
      variant_size: variant.size,
      variant_color: variant.color,
      sku: variant.sku,
      unit_price: unitPrice,
      quantity: item.quantity,
      total_price: totalPrice,
      created_at: new Date().toISOString(),
    });
  }

  // 2. Generate unique order number CMD-YYYYMMDD-XXXX
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `CMD-${today}-${randomSuffix}`;
  const orderId = `ord-${Date.now()}`;

  const newOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_id: null,
    customer_name: input.customerName,
    customer_phone: input.customerPhone,
    delivery_method: input.deliveryMethod,
    delivery_fee: 0,
    delivery_address: null,
    subtotal,
    total: subtotal,
    status: "pedido_iniciado",
    payment_method: null,
    customer_notes: input.customerNotes || null,
    internal_notes: null,
    whatsapp_message_sent: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: orderItems.map((item) => ({ ...item, order_id: orderId })),
  };

  ordersState.unshift(newOrder);

  return newOrder;
}

// Admin Operations
export async function getAdminStats() {
  const totalOrders = ordersState.length;
  const initiatedOrders = ordersState.filter((o) => o.status === "pedido_iniciado").length;
  const confirmedOrders = ordersState.filter(
    (o) => o.status === "confirmado" || o.status === "pago" || o.status === "em_separacao" || o.status === "enviado" || o.status === "entregue"
  ).length;
  const completedOrders = ordersState.filter((o) => o.status === "entregue").length;

  const confirmedRevenue = ordersState
    .filter((o) => o.status === "pago" || o.status === "entregue" || o.status === "em_separacao" || o.status === "enviado")
    .reduce((sum, o) => sum + o.total, 0);

  const activeProducts = productsState.filter((p) => p.is_published).length;
  
  // Low stock products (variant stock <= 3)
  const lowStockVariants = productsState.flatMap((p) =>
    (p.variants || [])
      .filter((v) => v.stock <= 5)
      .map((v) => ({ ...v, productName: p.name }))
  );

  return {
    totalOrders,
    initiatedOrders,
    confirmedOrders,
    completedOrders,
    confirmedRevenue,
    activeProducts,
    lowStockCount: lowStockVariants.length,
    lowStockVariants,
    recentOrders: ordersState.slice(0, 5),
  };
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  return productsState.map((p) => ({
    ...p,
    category: categoriesState.find((c) => c.id === p.category_id),
  }));
}

export async function getAllOrdersAdmin(): Promise<Order[]> {
  return [...ordersState];
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, internalNotes?: string, deliveryFee?: number) {
  const order = ordersState.find((o) => o.id === orderId);
  if (!order) throw new Error("Pedido não encontrado");

  const previousStatus = order.status;
  order.status = status;
  if (internalNotes !== undefined) order.internal_notes = internalNotes;
  if (deliveryFee !== undefined) {
    order.delivery_fee = deliveryFee;
    order.total = order.subtotal + deliveryFee;
  }
  order.updated_at = new Date().toISOString();

  // If order is confirmed or paid, reserve/adjust stock safely
  if ((status === "confirmado" || status === "pago") && !["confirmado", "pago", "em_separacao", "enviado", "entregue"].includes(previousStatus)) {
    for (const item of order.items || []) {
      for (const prod of productsState) {
        const variant = prod.variants?.find((v) => v.id === item.variant_id);
        if (!variant || variant.stock < item.quantity) throw new Error("Estoque insuficiente para confirmar o pedido.");
        variant.stock -= item.quantity;
      }
    }
  }

  return order;
}

export async function updateVariantStock(variantId: string, newStock: number, reason: string) {
  if (newStock < 0) throw new Error("O estoque não pode ser negativo");

  for (const product of productsState) {
    const variant = product.variants?.find((v) => v.id === variantId);
    if (variant) {
      const prevStock = variant.stock;
      variant.stock = newStock;
      variant.updated_at = new Date().toISOString();
      return { variant, prevStock, newStock, reason };
    }
  }
  throw new Error("Variante não encontrada");
}
