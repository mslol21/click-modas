import {
  Product,
  Category,
  Banner,
  Order,
  OrderStatus,
  StoreSettingsGeneral,
  SizeGuideItem,
} from "@/types/database";
import { createClient } from "@supabase/supabase-js";

// Supabase client instance if configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      })
    : null;


function db() { if (!supabase) throw new Error("Supabase não configurado. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."); return supabase; }

export async function getCategories(): Promise<Category[]> { const {data,error}=await db().from("categories").select("*").eq("is_active",true).order("sort_order"); if(error) throw new Error(error.message); return (data??[]) as Category[]; }

export async function getBanners(): Promise<Banner[]> { const {data,error}=await db().from("banners").select("*").eq("is_active",true).order("sort_order"); if(error) throw new Error(error.message); return (data??[]) as Banner[]; }

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  size?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "name";
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> { let query=db().from("products").select("*, category:categories(*), variants:product_variants(*), images:product_images(*)").eq("is_published",true); if(filters.featured!==undefined) query=query.eq("is_featured",filters.featured); const {data,error}=await query; if(error) throw new Error(error.message);
        let list = (data ?? []) as Product[];

        if (filters.categorySlug) {
          list = list.filter((p) => p.category?.slug === filters.categorySlug);
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

        return list;
}

export async function getProductBySlug(slug:string): Promise<Product|null> { const {data,error}=await db().from("products").select("*, category:categories(*), variants:product_variants(*), images:product_images(*)").eq("slug",slug).eq("is_published",true).maybeSingle(); if(error) throw new Error(error.message); return data as Product|null; }

export async function getStoreSettings():Promise<StoreSettingsGeneral> { const {data,error}=await db().from("store_settings").select("value").eq("key","general").single(); if(error) throw new Error(error.message); return data.value as StoreSettingsGeneral; }

export async function getSizeGuide():Promise<SizeGuideItem[]> { const {data,error}=await db().from("store_settings").select("value").eq("key","size_guide").maybeSingle(); if(error) throw new Error(error.message); return (data?.value??[]) as SizeGuideItem[]; }

export async function getInstitutional():Promise<{about:string; privacy:string; terms:string}> { const {data,error}=await db().from("store_settings").select("value").eq("key","institutional").maybeSingle(); if(error) throw new Error(error.message); return (data?.value??{about:"",privacy:"",terms:""}) as {about:string;privacy:string;terms:string}; }

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

export async function createOrderIntention(_input: CreateOrderInput): Promise<Order> { throw new Error("Checkout temporariamente indisponível: a gravação transacional e segura de pedidos no Supabase ainda precisa ser implementada."); }

export async function getAdminStats() { const [orders,products]=await Promise.all([getAllOrdersAdmin(),getAllProductsAdmin()]); const confirmed=["confirmado","pago","em_separacao","enviado","entregue"]; const paid=["pago","em_separacao","enviado","entregue"]; const lowStockVariants=products.flatMap(p=>(p.variants??[]).filter(v=>v.stock<=5).map(v=>({...v,productName:p.name}))); return {totalOrders:orders.length,initiatedOrders:orders.filter(o=>o.status==="pedido_iniciado").length,confirmedOrders:orders.filter(o=>confirmed.includes(o.status)).length,completedOrders:orders.filter(o=>o.status==="entregue").length,confirmedRevenue:orders.filter(o=>paid.includes(o.status)).reduce((sum,o)=>sum+Number(o.total),0),activeProducts:products.filter(p=>p.is_published).length,lowStockCount:lowStockVariants.length,lowStockVariants,recentOrders:orders.slice(0,5)}; }

export async function getAllProductsAdmin():Promise<Product[]> { const {data,error}=await db().from("products").select("*, variants:product_variants(*), images:product_images(*), category:categories(*)").order("created_at",{ascending:false}); if(error) throw new Error(error.message); return (data??[]) as Product[]; }

export async function getAllOrdersAdmin():Promise<Order[]> { const {data,error}=await db().from("orders").select("*,items:order_items(*)").order("created_at",{ascending:false}); if(error) throw new Error(error.message); return (data??[]) as Order[]; }

export async function updateOrderStatus(orderId:string,status:OrderStatus,internalNotes?:string,deliveryFee?:number) { const client=await import("@/lib/supabase/client"); const auth=client.createClient(); if(!auth) throw new Error("Supabase não configurado"); const {data:session}=await auth.auth.getUser(); if(!session.user) throw new Error("Faça login como administrador"); const {data:order,error:fetchError}=await auth.from("orders").select("*").eq("id",orderId).single(); if(fetchError) throw new Error(fetchError.message); if(["confirmado","pago"].includes(status) && !["confirmado","pago","em_separacao","enviado","entregue"].includes(order.status)) throw new Error("Confirmação bloqueada até ativar baixa transacional do estoque."); const patch:Record<string,unknown>={status}; if(internalNotes!==undefined)patch.internal_notes=internalNotes; if(deliveryFee!==undefined){if(deliveryFee<0)throw new Error("Frete inválido");patch.delivery_fee=deliveryFee;patch.total=Number(order.subtotal)+deliveryFee;} const {data,error}=await auth.from("orders").update(patch).eq("id",orderId).select().single(); if(error)throw new Error(error.message);return data as Order; }

export async function updateVariantStock(variantId:string,newStock:number,reason:string) { if(!Number.isSafeInteger(newStock)||newStock<0)throw new Error("Estoque inválido"); const client=await import("@/lib/supabase/client"); const auth=client.createClient(); if(!auth)throw new Error("Supabase não configurado"); const {data:user}=await auth.auth.getUser(); if(!user.user)throw new Error("Faça login como administrador"); const {data:variant,error:readError}=await auth.from("product_variants").select("*").eq("id",variantId).single(); if(readError)throw new Error(readError.message); const {data,error}=await auth.from("product_variants").update({stock:newStock}).eq("id",variantId).eq("stock",variant.stock).select().single(); if(error)throw new Error(error.message); if(!data)throw new Error("Estoque alterado por outra operação. Atualize a página.");return {variant:data,prevStock:variant.stock,newStock,reason}; }
